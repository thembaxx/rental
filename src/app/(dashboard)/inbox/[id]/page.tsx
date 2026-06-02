"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import { sendMessage } from "@/actions/messages"
import { usePusher } from "@/hooks/usePusher"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Message {
  id: string
  content: string
  senderId: string
  sender: { id: string; name: string | null; image: string | null }
  createdAt: string
  readAt: string | null
}

interface ConversationData {
  id: string
  listing: { id: string; title: string; images: string[] } | null
  participants: Array<{
    user: { id: string; name: string | null; image: string | null }
  }>
  messages: Message[]
}

export default function ChatThreadPage() {
  const params = useParams()
  const conversationId = params.id as string
  const [conversation, setConversation] = useState<ConversationData | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [shouldScroll, setShouldScroll] = useState(true)

  // Fetch conversation data
  useEffect(() => {
    const fetchConversation = async () => {
      const res = await fetch(`/api/conversations/${conversationId}`)
      const data = await res.json()
      setConversation(data)
      const sessionRes = await fetch("/api/auth/session")
      const session = await sessionRes.json()
      setCurrentUserId(session?.user?.id || "")
    }
    fetchConversation()
  }, [conversationId])

  // Pusher real-time subscription
  const { bind } = usePusher(`conversation-${conversationId}`)

  useEffect(() => {
    const unbind = bind("new-message", (data: Message) => {
      setConversation((prev) => {
        if (!prev) return prev
        // Prevent duplicate messages
        if (prev.messages.some((m) => m.id === data.id)) return prev
        return {
          ...prev,
          messages: [...prev.messages, data],
        }
      })
      setShouldScroll(true)
    })

    return () => {
      unbind()
    }
  }, [bind])

  // Auto-scroll to bottom
  useEffect(() => {
    if (shouldScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      setShouldScroll(false)
    }
  }, [shouldScroll, conversation?.messages])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Track if user is near bottom for auto-scroll
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return
    const isNearBottom = 
      container.scrollHeight - container.scrollTop - container.clientHeight < 100
    setShouldScroll(isNearBottom)
  }, [])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      const message = await sendMessage(conversationId, newMessage.trim())
      // Optimistically add message
      setConversation((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          messages: [...prev.messages, message],
        }
      })
      setNewMessage("")
      setShouldScroll(true)
    } catch (err) {
      console.error("Failed to send message:", err)
    } finally {
      setSending(false)
    }
  }

  const otherParticipant = conversation?.participants.find(
    (p) => p.user.id !== currentUserId
  )?.user

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-sm shadow-slate-200/20 md:mx-auto md:max-w-4xl lg:max-w-5xl">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/95 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-50 text-lg font-semibold text-sky-600">
            {otherParticipant?.name?.[0] || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-semibold text-slate-900">{otherParticipant?.name || "Unknown"}</h2>
            {conversation.listing && (
              <p className="text-sm text-slate-600 truncate">Re: {conversation.listing.title}</p>
            )}
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Online
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 space-y-4"
      >
        {conversation.messages.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-10 text-center text-slate-600 shadow-sm">
            <p className="text-lg font-semibold text-slate-900">No messages yet</p>
            <p className="mt-2 text-sm">Send a message to start the conversation.</p>
          </div>
        ) : (
          conversation.messages.map((msg, i) => {
            const isMe = msg.senderId === currentUserId
            const showDate = i === 0 || 
              new Date(msg.createdAt).toDateString() !== 
              new Date(conversation.messages[i - 1].createdAt).toDateString()

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="flex justify-center">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                )}
                <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] sm:max-w-[65%] ${isMe ? "items-end" : "items-start"}`}>
                    {!isMe && (
                      <p className="mb-1 ml-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                        {msg.sender.name || "Unknown"}
                      </p>
                    )}
                    <div
                      className={`rounded-3xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
                        isMe
                          ? "bg-sky-600 text-white rounded-br-[0.75rem]"
                          : "bg-white text-slate-900 rounded-bl-[0.75rem]"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      {isMe && (
                        <span className="ml-1">{msg.readAt ? "· Read" : "· Sent"}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-200/70 bg-white p-4 sm:p-5">
        <form onSubmit={handleSend} className="flex gap-3">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-3xl border-slate-200 bg-slate-50"
            disabled={sending}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={sending || !newMessage.trim()}
            className="shrink-0 rounded-full"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
