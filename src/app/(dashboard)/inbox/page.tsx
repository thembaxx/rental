import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { MessageSquare } from "lucide-react"

async function getConversations(userId: string) {
  return prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId },
      },
    },
    include: {
      listing: { select: { id: true, title: true, images: true } },
      participants: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          sender: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { lastMessageAt: "desc" },
  })
}

export default async function InboxPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const conversations = await getConversations(session.user.id)

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-muted/30">
          <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No messages yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Start a conversation by contacting a lister from a listing page.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv: any) => {
            const otherParticipant = conv.participants.find(
              (p: any) => p.user.id !== session.user!.id
            )?.user
            const lastMessage = conv.messages[0]

            return (
              <Link
                key={conv.id}
                href={`/inbox/${conv.id}`}
                className="flex items-start gap-4 p-4 border rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-medium flex-shrink-0">
                  {otherParticipant?.name?.[0] || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold truncate">{otherParticipant?.name || "Unknown"}</h3>
                    <span className="text-xs text-muted-foreground">
                      {lastMessage ? formatDate(lastMessage.createdAt) : ""}
                    </span>
                  </div>
                  {conv.listing && (
                    <p className="text-xs text-muted-foreground mb-1 truncate">
                      Re: {conv.listing.title}
                    </p>
                  )}
                  {lastMessage && (
                    <p className="text-sm text-muted-foreground truncate">
                      <span className="font-medium">{lastMessage.sender.name}:</span>{" "}
                      {lastMessage.content}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
