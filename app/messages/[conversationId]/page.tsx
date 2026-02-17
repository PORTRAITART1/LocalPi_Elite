"use client"

import { ArrowLeft, Send } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { getMessages, addMessage, markConversationAsRead, type Message } from "@/lib/storage"

export default function ConversationPage() {
  const router = useRouter()
  const params = useParams()
  const { userData } = usePiAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const conversationId = params?.conversationId as string

  useEffect(() => {
    if (conversationId && userData?.id) {
      const conversationMessages = getMessages(conversationId)
      setMessages(conversationMessages)
      markConversationAsRead(userData.id, conversationId)
    }
  }, [conversationId, userData?.id])

  const handleSend = () => {
    if (!newMessage.trim() || !userData?.id || messages.length === 0) return

    const firstMessage = messages[0]
    
    const receiverId = firstMessage.senderId === userData.id ? firstMessage.receiverId : firstMessage.senderId
    const receiverName = firstMessage.senderId === userData.id ? firstMessage.receiverName : firstMessage.senderName

    const message: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: userData.id,
      senderName: userData.username,
      receiverId,
      receiverName,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    }

    addMessage(message)
    setMessages([...messages, message])
    setNewMessage("")
  }

  const otherUser = messages.length > 0
    ? messages[0].senderId === userData?.id
      ? messages[0].receiverName
      : messages[0].senderName
    : "Utilisateur"

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="hover:opacity-70 transition-opacity">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{otherUser}</h1>
            <p className="text-xs text-muted-foreground">En ligne</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {messages.map((message) => {
          const isOwn = message.senderId === userData?.id
          return (
            <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                  isOwn
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {new Date(message.timestamp).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-card border-t border-border p-4 safe-area-inset-bottom">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Votre message..."
            className="flex-1 px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-primary text-primary-foreground px-4 py-3 h-auto rounded-xl"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
