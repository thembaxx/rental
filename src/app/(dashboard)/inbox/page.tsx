import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { MessageSquare } from "lucide-react"

type ConversationWithListing = {
  id: string
  participants: { user: { id: string; name: string; image: string | null } }[]
  messages: { createdAt: Date; sender: { id: string; name: string }; content: string }[]
  listing: { id: string; title: string; images: string[] } | null
}

async function getConversations(userId: string): Promise<ConversationWithListing[]> {
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
    <div className="max-w-5xl mx-auto space-y-8">
      <section className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-600">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Messages</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">Manage your inbox and stay on top of guest conversations.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
            <span className="font-semibold text-slate-900">{conversations.length}</span> conversation{conversations.length === 1 ? "" : "s"}
          </div>
        </div>
      </section>

      {conversations.length === 0 ? (
        <div className="rounded-[2rem] border border-slate-200/70 bg-slate-50 p-14 text-center text-slate-600 shadow-sm">
          <MessageSquare className="mx-auto mb-4 h-12 w-12 text-sky-500" />
          <p className="text-lg font-semibold">Nothing in your inbox yet.</p>
          <p className="mt-2 text-sm text-slate-600">Reach out to listers from a listing page to start a new conversation.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => {
            const otherParticipant = conv.participants.find(
              (p) => p.user.id !== session.user!.id
            )?.user
            const lastMessage = conv.messages[0]

            return (
              <Link
                key={conv.id}
                href={`/inbox/${conv.id}`}
                className="group block overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-50 text-lg font-semibold text-sky-600">
                    {otherParticipant?.name?.[0] || "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="truncate text-lg font-semibold text-slate-900">{otherParticipant?.name || "Unknown"}</h3>
                      <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        {lastMessage ? formatDate(lastMessage.createdAt) : ""}
                      </span>
                    </div>
                    {conv.listing && (
                      <p className="mt-2 text-sm text-slate-600 truncate">Re: {conv.listing.title}</p>
                    )}
                    {lastMessage && (
                      <p className="mt-3 line-clamp-2 text-sm text-slate-700">
                        <span className="font-medium text-slate-900">{lastMessage.sender.name}:</span> {lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
