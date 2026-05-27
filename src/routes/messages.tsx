import { createFileRoute } from "@tanstack/react-router";

import React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "@/lib/next-shim"
import { Header } from "@/components/header"
import { MobileMenu } from "@/components/mobile-menu"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { GuestRestrictionModal } from "@/components/guest-restriction-modal"
import { useAppStore } from "@/lib/store"
import { useT } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, ArrowLeft, Search, MoreVertical, Phone, Video, Check, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"

function MessagesPage() {
  const router = useRouter()
  const t = useT()
  const { conversations, messages, sendMessage, userProfile, users, markMessageRead, isGuest, isAuthenticated } = useAppStore()

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mostrar modal para invitados
  const [showGuestModal, setShowGuestModal] = useState(true)

  const selectedUser = selectedConversation
    ? conversations.find((c) => c.participant.username === selectedConversation)?.participant
    : null

  const conversationMessages = selectedConversation
    ? messages.filter(
        (m) =>
          (m.from.username === selectedConversation && m.to.username === userProfile.username) ||
          (m.from.username === userProfile.username && m.to.username === selectedConversation)
      )
    : []

  const filteredConversations = conversations.filter(
    (c) =>
      c.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.participant.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversationMessages])

  useEffect(() => {
    if (selectedConversation) {
      conversationMessages.forEach((m) => {
        if (!m.read && m.to.username === userProfile.username) {
          markMessageRead(m.id)
        }
      })
    }
  }, [selectedConversation, conversationMessages, markMessageRead, userProfile.username])

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      sendMessage(selectedConversation, newMessage.trim())
      setNewMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Si es invitado, mostrar pagina con modal de restriccion
  if (isGuest) {
    return (
      <div className="min-h-screen flex flex-col bg-cream">
        <GuestRestrictionModal
          isOpen={showGuestModal}
          onClose={() => {
            setShowGuestModal(false)
            router.push("/")
          }}
          action={t("guest.sendMessages")}
        />
        <Header />
        <MobileMenu />
        <CartSidebar />
        <main className="flex-1 container mx-auto px-4 py-6 pb-24 lg:pb-6 flex items-center justify-center">
          <div className="text-center">
            <Send className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-serif text-2xl font-bold text-foreground mb-2">{t("messages.title")}</h1>
            <p className="text-muted-foreground mb-6">{t("messages.guestNote")}</p>
            <Button onClick={() => router.push("/auth")} className="bg-gradient-to-r from-primary to-gold-dark">
              {t("auth.createAccount")}
            </Button>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      <MobileMenu />
      <CartSidebar />

      <main className="flex-1 container mx-auto px-4 py-6 pb-24 lg:pb-6">
        <div className="bg-gradient-to-br from-card to-secondary/20 rounded-3xl border border-border/50 shadow-xl overflow-hidden h-[calc(100vh-200px)] min-h-[500px]">
          <div className="flex h-full">
            {/* Conversations List */}
            <div
              className={cn(
                "w-full md:w-80 lg:w-96 border-r border-border/50 flex flex-col",
                selectedConversation && "hidden md:flex"
              )}
            >
              {/* Header */}
              <div className="p-4 border-b border-border/50 bg-gradient-to-r from-card to-secondary/30">
                <h1 className="font-serif text-xl font-bold text-foreground mb-3">{t("messages.title")}</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("messages.searchConv")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-full bg-background/50"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>{t("messages.empty")}</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.participant.username)}
                      className={cn(
                        "w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors border-b border-border/30",
                        selectedConversation === conv.participant.username && "bg-primary/10"
                      )}
                    >
                      <div className="relative">
                        <img
                          src={conv.participant.avatar || "/placeholder.svg"}
                          alt={conv.participant.name}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-background"
                        />
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground truncate">{conv.participant.name}</p>
                          <span className="text-xs text-muted-foreground">{conv.createdAt}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div
              className={cn(
                "flex-1 flex flex-col",
                !selectedConversation && "hidden md:flex"
              )}
            >
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border/50 bg-gradient-to-r from-card to-secondary/30 flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden p-2 hover:bg-muted rounded-full transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <a
                      href={`/user/${selectedUser.username.slice(1)}`}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <img
                        src={selectedUser.avatar || "/placeholder.svg"}
                        alt={selectedUser.name}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-background"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{selectedUser.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedUser.username}</p>
                      </div>
                    </a>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Phone className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Video className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-muted/30 to-transparent">
                    {conversationMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <img
                          src={selectedUser.avatar || "/placeholder.svg"}
                          alt={selectedUser.name}
                          className="h-20 w-20 rounded-full object-cover mb-4 ring-4 ring-primary/20"
                        />
                        <p className="font-medium text-foreground">{selectedUser.name}</p>
                        <p className="text-sm text-muted-foreground mb-4">{selectedUser.username}</p>
                        <p className="text-muted-foreground">{t("messages.startConv")} {selectedUser.name}</p>
                      </div>
                    ) : (
                      conversationMessages.map((msg) => {
                        const isOwn = msg.from.username === userProfile.username
                        return (
                          <div
                            key={msg.id}
                            className={cn("flex", isOwn ? "justify-end" : "justify-start")}
                          >
                            <div
                              className={cn(
                                "max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
                                isOwn
                                  ? "bg-gradient-to-r from-primary to-gold-dark text-primary-foreground rounded-br-sm"
                                  : "bg-card border border-border/50 text-foreground rounded-bl-sm"
                              )}
                            >
                              <p className="text-sm leading-relaxed">{msg.content}</p>
                              <div className={cn("flex items-center gap-1 mt-1", isOwn ? "justify-end" : "justify-start")}>
                                <span className={cn("text-xs", isOwn ? "text-primary-foreground/70" : "text-muted-foreground")}>
                                  {msg.createdAt}
                                </span>
                                {isOwn && (
                                  msg.read ? (
                                    <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
                                  ) : (
                                    <Check className="h-3 w-3 text-primary-foreground/70" />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border/50 bg-card">
                    <div className="flex items-center gap-3">
                      <Input
                        placeholder={t("messages.writeMessage")}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 rounded-full"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="rounded-full h-10 w-10 bg-gradient-to-r from-primary to-gold-dark hover:from-primary/90 hover:to-gold-dark/90"
                        size="icon"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-muted/30 to-transparent">
                  <div className="text-center">
                    <div className="h-24 w-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="font-serif text-xl font-bold text-foreground mb-2">{t("messages.yourMessages")}</h2>
                    <p className="text-muted-foreground max-w-sm">
                      {t("messages.selectConv")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}


export const Route = createFileRoute("/messages")({
  component: MessagesPage,
});
