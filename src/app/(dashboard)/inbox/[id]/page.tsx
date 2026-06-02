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
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b p-4 flex items-center gap-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg font-medium">
          {otherParticipant?.name?.[0] || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold truncate">{otherParticipant?.name || "Unknown"}</h2>
          {conversation.listing && (
            <p className="text-xs text-muted-foreground truncate">
              Re: {conversation.listing.title}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {conversation.messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No messages yet.</p>
            <p className="text-sm">Send a message to start the conversation.</p>
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
                  <div className="flex justify-center my-4">
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                )}
                <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] sm:max-w-[65%] ${isMe ? "items-end" : "items-start"}`}>
                    {!isMe && (
                      <p className="text-xs text-muted-foreground mb-1 ml-1">
                        {msg.sender.name || "Unknown"}
                      </p>
                    )}
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted rounded-bl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      {isMe && (
                        <span className="ml-1">
                          {msg.readAt ? "· Read" : "· Sent"}
                        </span>
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
      <div className="border-t p-4 bg-background">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={sending}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={sending || !newMessage.trim()}
            className="shrink-0"
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
