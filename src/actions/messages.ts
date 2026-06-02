"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { triggerMessage } from "@/lib/pusher/server"
import { sendNewMessageEmail } from "@/lib/email"

export async function sendMessage(conversationId: string, content: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId: session.user.id,
      },
    },
  })

  if (!participant) throw new Error("Not a participant")

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: session.user.id,
      content,
    },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      conversation: {
        include: {
          listing: { select: { id: true, title: true } },
          participants: {
            include: {
              user: { select: { id: true, email: true, name: true } },
            },
          },
        },
      },
    },
  })

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date() },
  })

  // Increment unread count for other participants
  await prisma.conversationParticipant.updateMany({
    where: {
      conversationId,
      userId: { not: session.user.id },
    },
    data: {
      unreadCount: { increment: 1 },
    },
  })

  // Trigger real-time event
  await triggerMessage(conversationId, message)

  // Send email notification to other participants
  const otherParticipants = message.conversation.participants.filter(
    (p: { user: { id: string; email?: string; name?: string } }) =>
      p.user.id !== session.user!.id
  )

  for (const participant of otherParticipants) {
    if (participant.user.email) {
      sendNewMessageEmail({
        to: participant.user.email,
        senderName: message.sender.name || "Someone",
        listingTitle: message.conversation.listing?.title || "a listing",
        messagePreview: content,
        conversationUrl: `${process.env.AUTH_URL}/inbox/${conversationId}`,
      }).catch((err) => {
        console.error("Failed to send email notification:", err)
      })
    }
  }

  revalidatePath(`/inbox/${conversationId}`)
  revalidatePath("/inbox")
  return message
}

export async function startConversation(listingId: string, initialMessage: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { listerId: true, title: true },
  })

  if (!listing) throw new Error("Listing not found")
  if (listing.listerId === session.user.id) throw new Error("Cannot message yourself")

  const existing = await prisma.conversation.findFirst({
    where: {
      listingId,
      participants: {
        every: {
          userId: { in: [session.user.id, listing.listerId] },
        },
      },
    },
  })

  if (existing) {
    const message = await sendMessage(existing.id, initialMessage)
    return { conversationId: existing.id, message }
  }

  const conversation = await prisma.conversation.create({
    data: {
      listingId,
      participants: {
        create: [
          { userId: session.user.id },
          { userId: listing.listerId },
        ],
      },
      messages: {
        create: {
          senderId: session.user.id,
          content: initialMessage,
        },
      },
    },
    include: {
      messages: {
        include: {
          sender: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      listing: { select: { id: true, title: true } },
      participants: {
        include: {
          user: { select: { id: true, email: true, name: true } },
        },
      },
    },
  })

  const message = conversation.messages[0]
  await triggerMessage(conversation.id, message)

  // Send email notification to lister
  const listerParticipant = conversation.participants.find(
    (p: { user: { id: string; email?: string; name?: string } }) =>
      p.user.id === listing.listerId
  )
  if (listerParticipant?.user.email) {
    sendNewMessageEmail({
      to: listerParticipant.user.email,
      senderName: session.user.name || "Someone",
      listingTitle: listing.title,
      messagePreview: initialMessage,
      conversationUrl: `${process.env.AUTH_URL}/inbox/${conversation.id}`,
    }).catch((err) => {
      console.error("Failed to send email notification:", err)
    })
  }

  revalidatePath("/inbox")
  return { conversationId: conversation.id, message }
}

export async function markAsRead(conversationId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.conversationParticipant.update({
    where: {
      conversationId_userId: {
        conversationId,
        userId: session.user.id,
      },
    },
    data: {
      lastReadAt: new Date(),
      unreadCount: 0,
    },
  })
}
