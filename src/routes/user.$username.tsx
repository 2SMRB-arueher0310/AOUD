import { createFileRoute } from "@tanstack/react-router";

import { useParams, useRouter } from "@/lib/next-shim"
import { Header } from "@/components/header"
import { MobileMenu } from "@/components/mobile-menu"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { GuestRestrictionModal } from "@/components/guest-restriction-modal"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Calendar, LinkIcon, MessageCircle, Heart, Star, Send, X, ShoppingCart, Eye } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string
  const { users, posts, perfumes, toggleLike, sendMessage, userProfile, isGuest, addToCart, toggleCart } = useAppStore()
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [messageContent, setMessageContent] = useState("")
  const [messageSent, setMessageSent] = useState(false)
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [guestAction, setGuestAction] = useState("")

  const handleFollowClick = () => {
    if (isGuest) {
      setGuestAction("seguir usuarios")
      setShowGuestModal(true)
      return
    }
    setIsFollowing(!isFollowing)
  }

  const handleMessageClick = () => {
    if (isGuest) {
      setGuestAction("enviar mensajes directos")
      setShowGuestModal(true)
      return
    }
    setMessageDialogOpen(true)
  }

  const handleLikeClick = (postId: string) => {
    if (isGuest) {
      setGuestAction("dar me gusta a publicaciones")
      setShowGuestModal(true)
      return
    }
    toggleLike(postId)
  }

  const user = users.find((u) => u.username === `@${username}`)
  const userPosts = posts.filter((p) => p.author.username === `@${username}`)

  // Si es el perfil del usuario actual, redirigir a /profile
  if (`@${username}` === userProfile.username) {
    router.push("/profile")
    return null
  }

  const handleSendMessage = () => {
    if (messageContent.trim() && user) {
      sendMessage(user.username, messageContent.trim())
      setMessageContent("")
      setMessageSent(true)
      setTimeout(() => {
        setMessageDialogOpen(false)
        setMessageSent(false)
      }, 1500)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <MobileMenu />
        <CartSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Usuario no encontrado</h1>
            <p className="text-muted-foreground">El usuario @{username} no existe.</p>
            <Button asChild className="mt-4">
              <a href="/">Volver al inicio</a>
            </Button>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <GuestRestrictionModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        action={guestAction}
      />
      <Header />
      <MobileMenu />
      <CartSidebar />

      <main className="flex-1 pb-24 lg:pb-0">
        {/* Cover */}
        <div className="h-48 md:h-64 bg-gradient-to-br from-primary/30 via-secondary/20 to-muted relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4">
          <div className="relative -mt-16 md:-mt-20 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
              {/* Avatar */}
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background overflow-hidden bg-card shadow-xl flex-shrink-0">
                <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-full w-full object-cover" />
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">{user.name}</h1>
                    <p className="text-muted-foreground">{user.username}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant={isFollowing ? "outline" : "default"}
                      className={
                        isFollowing
                          ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent rounded-full"
                          : "bg-gradient-to-r from-primary to-gold-dark text-primary-foreground hover:from-primary/90 hover:to-gold-dark/90 rounded-full"
                      }
                      onClick={handleFollowClick}
                    >
                      {isFollowing ? "Siguiendo" : "Seguir"}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-border bg-transparent rounded-full"
                      onClick={handleMessageClick}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Mensaje
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio & Meta */}
            <div className="mt-6 max-w-2xl">
              <p className="text-foreground leading-relaxed mb-4">{user.bio}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {user.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
                {user.website && (
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-4 w-4" />
                    <a
                      href={`https://${user.website}`}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {user.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <span className="block font-serif text-2xl font-bold text-foreground">{userPosts.length}</span>
                <span className="text-sm text-muted-foreground">Publicaciones</span>
              </div>
              <div className="text-center">
                <span className="block font-serif text-2xl font-bold text-foreground">
                  {user.followers.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">Seguidores</span>
              </div>
              <div className="text-center">
                <span className="block font-serif text-2xl font-bold text-foreground">{user.following}</span>
                <span className="text-sm text-muted-foreground">Siguiendo</span>
              </div>
              <div className="text-center">
                <span className="block font-serif text-2xl font-bold text-foreground">{user.perfumeCount}</span>
                <span className="text-sm text-muted-foreground">Perfumes</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border mb-6">
            {["posts", "collection"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {tab === "posts" ? "Publicaciones" : "Colección"}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === "posts" && (
            <div className="space-y-6 pb-8">
              {userPosts.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground">Este usuario no tiene publicaciones todavía.</p>
                </div>
              ) : (
                userPosts.map((post) => (
                  <article key={post.id} className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={post.author.avatar || "/placeholder.svg"}
                          alt={post.author.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-foreground">{post.author.name}</p>
                          <p className="text-sm text-muted-foreground">{post.createdAt}</p>
                        </div>
                      </div>
                      <p className="text-foreground">{post.content}</p>
                    </div>
                    {post.image && (
                      <img src={post.image || "/placeholder.svg"} alt="Post" className="w-full max-h-96 object-cover" />
                    )}
                    <div className="flex items-center gap-4 p-4 border-t border-border">
                      <button
                        onClick={() => handleLikeClick(post.id)}
                        className={cn(
                          "flex items-center gap-1",
                          post.liked ? "text-red-500" : "text-muted-foreground hover:text-red-500",
                        )}
                      >
                        <Heart className={cn("h-5 w-5", post.liked && "fill-current")} />
                        <span>{post.likes}</span>
                      </button>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MessageCircle className="h-5 w-5" />
                        {post.comments.length}
                      </span>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}

          {activeTab === "collection" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
              {perfumes.slice(0, user.perfumeCount > 8 ? 8 : user.perfumeCount).map((perfume) => (
                <div key={perfume.id} className="bg-card rounded-xl border border-border overflow-hidden flex flex-col">
                  <img
                    src={perfume.image || "/placeholder.svg"}
                    alt={perfume.name}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-3 flex-1 flex flex-col">
                    <p className="text-xs text-muted-foreground">{perfume.brand}</p>
                    <h3 className="font-medium text-foreground text-sm truncate">{perfume.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-primary fill-primary" />
                      <span className="text-xs">{perfume.rating}</span>
                    </div>
                    <div className="flex flex-col gap-2 mt-3">
                      <Button
                        size="sm"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-xs"
                        onClick={() => {
                          addToCart({
                            id: perfume.id,
                            name: perfume.name,
                            brand: perfume.brand,
                            price: perfume.price,
                            image: perfume.image,
                            size: perfume.size,
                          })
                          toggleCart()
                        }}
                      >
                        <ShoppingCart className="h-3 w-3" />
                        Añadir al Carrito
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-border bg-transparent gap-2 text-xs"
                        asChild
                      >
                        <a href={`/shop/${perfume.id}`}>
                          <Eye className="h-3 w-3" />
                          Ver Detalles
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground font-normal">{user.username}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {messageSent ? (
            <div className="py-8 text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-foreground font-medium">Mensaje enviado</p>
              <p className="text-sm text-muted-foreground mb-4">Tu mensaje ha sido enviado a {user.name}</p>
              <a
                href="/messages"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                <MessageCircle className="h-4 w-4" />
                Ir a la conversación
              </a>
            </div>
          ) : (
            <>
              <div className="py-4">
                <Input
                  placeholder={`Escribe un mensaje a ${user.name}...`}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="w-full"
                  autoFocus
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setMessageDialogOpen(false)}
                  className="bg-transparent"
                >
                  Cancelar
                </Button>
                <Button onClick={handleSendMessage} disabled={!messageContent.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}


export const Route = createFileRoute("/user/$username")({
  component: UserProfilePage,
});
