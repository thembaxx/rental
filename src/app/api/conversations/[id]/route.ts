import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { prisma } = await import("@/lib/prisma")
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: (await context.params).id },
    include: {
      listing: { select: { id: true, title: true, images: true } },
      participants: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: { select: { id: true, name: true, image: true } },
        },
      },
    },
  })

  if (!conversation) {
    return Response.json({ error: "Conversation not found" }, { status: 404 })
  }

  const isParticipant = conversation.participants.some(
    (p: any) => p.user.id === session.user!.id
  )
  if (!isParticipant) {
    return Response.json({ error: "Not authorized" }, { status: 403 })
  }

  await prisma.message.updateMany({
    where: {
      conversationId: (await context.params).id,
      senderId: { not: session.user!.id },
      readAt: null,
    },
    data: { readAt: new Date() },
  })

  await prisma.conversationParticipant.update({
    where: {
      conversationId_userId: {
        conversationId: (await context.params).id,
        userId: session.user!.id,
      },
    },
    data: { lastReadAt: new Date(), unreadCount: 0 },
  })

  return Response.json(conversation)
}
