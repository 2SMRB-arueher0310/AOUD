import { createFileRoute } from "@tanstack/react-router";

import { useState } from "react"
import { useParams } from "@/lib/next-shim"
import { Header } from "@/components/header"
import { MobileMenu } from "@/components/mobile-menu"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { GuestRestrictionModal } from "@/components/guest-restriction-modal"
import { useAppStore } from "@/lib/store"
import { useT } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Bookmark, TrendingUp, Hash, Users } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample posts with hashtags
const hashtagPosts: Record<string, Array<{
  id: string
  author: { name: string; username: string; avatar: string; tags: string[] }
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  createdAt: string
}>> = {
  OudCollection: [
    {
      id: "h1",
      author: { name: "María García", username: "@mariaoud", avatar: "/elegant-woman-portrait.png", tags: ["Amante del Oud"] },
      content: "Mi #OudCollection sigue creciendo. Este mes añadí el Widian Black III, una absoluta obra maestra del oud árabe. Las notas de incienso y azafrán son hipnóticas.",
      image: "/luxury-perfume-collection-display-oud.jpg",
      likes: 342,
      comments: 45,
      shares: 23,
      createdAt: "2h",
    },
    {
      id: "h2",
      author: { name: "Carlos Mendez", username: "@carlosfragrance", avatar: "/man-portrait-sophisticated.jpg", tags: ["Experto"] },
      content: "Comparando ouds: Oud Wood vs Oud Satin Mood. Ambos excepcionales pero para ocasiones muy diferentes. #OudCollection #NicheFragrances",
      image: "/tom-ford-oud-wood-perfume.jpg",
      likes: 567,
      comments: 89,
      shares: 45,
      createdAt: "5h",
    },
    {
      id: "h3",
      author: { name: "Elena Martín", username: "@elena_oud", avatar: "/elegant-woman-avatar.jpg", tags: ["Experta en Oud"] },
      content: "El verdadero oud camboyano es algo especial. Esta muestra de Xerjoff Alexandria II me tiene obsesionada. #OudCollection",
      likes: 234,
      comments: 34,
      shares: 12,
      createdAt: "1d",
    },
  ],
  NicheFragrances: [
    {
      id: "n1",
      author: { name: "Ana Rodríguez", username: "@ana_scents", avatar: "/woman-portrait-elegant-style.jpg", tags: ["Blogger"] },
      content: "¿Por qué elegiría fragancias nicho sobre diseñador? La calidad de ingredientes, la creatividad y la exclusividad no tienen comparación. #NicheFragrances",
      likes: 456,
      comments: 78,
      shares: 56,
      createdAt: "3h",
    },
    {
      id: "n2",
      author: { name: "Luis Fernández", username: "@luisperfumes", avatar: "/man-sophisticated-portrait.jpg", tags: ["Coleccionista"] },
      content: "Primera compra nicho del año: Nasomatto Black Afgano. Intenso, misterioso, adictivo. #NicheFragrances #ScentOfTheDay",
      image: "/nasomatto-black-afgano.jpg",
      likes: 289,
      comments: 45,
      shares: 23,
      createdAt: "6h",
    },
  ],
  AmouageLove: [
    {
      id: "a1",
      author: { name: "Javier López", username: "@javierfragrances", avatar: "/man-sophisticated-portrait.jpg", tags: ["Experto"] },
      content: "El Interlude Man de Amouage es el epítome del caos controlado en la perfumería. Incienso, orégano, oud... una experiencia sensorial única. #AmouageLove",
      image: "/amouage-interlude-perfume-bottle-luxury.jpg",
      likes: 678,
      comments: 123,
      shares: 67,
      createdAt: "4h",
    },
    {
      id: "a2",
      author: { name: "Laura Torres", username: "@lauraperfume", avatar: "/woman-portrait-elegant-style.jpg", tags: ["Reviewer"] },
      content: "Jubilation XXV es poesía líquida. Cada vez que lo uso recibo cumplidos. #AmouageLove #LuxuryFragrance",
      likes: 345,
      comments: 56,
      shares: 34,
      createdAt: "8h",
    },
  ],
  TomFord: [
    {
      id: "t1",
      author: { name: "Pedro Sánchez", username: "@pedroscents", avatar: "/man-portrait-sophisticated.jpg", tags: ["Principiante"] },
      content: "Mi primer Tom Ford: Oud Wood. Entiendo todo el hype ahora. Elegante, sofisticado, versátil. #TomFord #FirstNiche",
      image: "/tom-ford-oud-wood-perfume.jpg",
      likes: 234,
      comments: 67,
      shares: 23,
      createdAt: "2h",
    },
    {
      id: "t2",
      author: { name: "Carlos Mendez", username: "@carlosfragrance", avatar: "/man-portrait-sophisticated.jpg", tags: ["Experto"] },
      content: "Tobacco Vanille sigue siendo mi firma de invierno después de 5 años. Cálido, dulce pero masculino. #TomFord #SignatureScent",
      image: "/perfume-making-process.jpg",
      likes: 567,
      comments: 89,
      shares: 45,
      createdAt: "1d",
    },
  ],
  ScentOfTheDay: [
    {
      id: "s1",
      author: { name: "María García", username: "@mariaoud", avatar: "/elegant-woman-portrait.png", tags: ["Amante del Oud"] },
      content: "SOTD: MFK Oud Satin Mood. Perfecto para esta tarde de invierno. Notas de violeta y vainilla sobre un corazón de oud. #ScentOfTheDay",
      image: "/mfk-oud-satin-mood.jpg",
      likes: 456,
      comments: 78,
      shares: 34,
      createdAt: "1h",
    },
    {
      id: "s2",
      author: { name: "Elena Martín", username: "@elena_oud", avatar: "/elegant-woman-avatar.jpg", tags: ["Experta en Oud"] },
      content: "Hoy llevé Creed Royal Oud a la oficina. Elegante, profesional, pero con carácter. #ScentOfTheDay #CorporateFragrance",
      image: "/luxury-oud-perfume-bottle-gold.jpg",
      likes: 345,
      comments: 56,
      shares: 23,
      createdAt: "5h",
    },
    {
      id: "s3",
      author: { name: "Ana Rodríguez", username: "@ana_scents", avatar: "/woman-portrait-elegant-style.jpg", tags: ["Blogger"] },
      content: "Probando Delina de Parfums de Marly. Romántico, femenino, con una estela increíble. #ScentOfTheDay #PDM",
      likes: 289,
      comments: 45,
      shares: 12,
      createdAt: "8h",
    },
  ],
}

const trendingTags = [
  { tag: "OudCollection", posts: 1234, followers: 5678 },
  { tag: "NicheFragrances", posts: 2345, followers: 8901 },
  { tag: "AmouageLove", posts: 876, followers: 3456 },
  { tag: "TomFord", posts: 3456, followers: 12345 },
  { tag: "ScentOfTheDay", posts: 5678, followers: 23456 },
]

function TagPage() {
  const params = useParams()
  const t = useT()
  const tag = params.tag as string
  const { toggleLike, toggleSave, posts: storePosts, isGuest } = useAppStore()
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [guestAction, setGuestAction] = useState("")
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const [savedPosts, setSavedPosts] = useState<string[]>([])

  const handleLike = (postId: string) => {
    if (isGuest) {
      setGuestAction("dar me gusta a publicaciones")
      setShowGuestModal(true)
      return
    }
    setLikedPosts((prev) => prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId])
  }

  const handleSave = (postId: string) => {
    if (isGuest) {
      setGuestAction("guardar publicaciones")
      setShowGuestModal(true)
      return
    }
    setSavedPosts((prev) => prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId])
  }

  const handleFollow = () => {
    if (isGuest) {
      setGuestAction("seguir hashtags")
      setShowGuestModal(true)
      return
    }
  }

  const handleComment = () => {
    if (isGuest) {
      setGuestAction("comentar en publicaciones")
      setShowGuestModal(true)
      return
    }
  }

  const tagInfo = trendingTags.find((t) => t.tag.toLowerCase() === tag.toLowerCase()) || {
    tag,
    posts: Math.floor(Math.random() * 1000) + 100,
    followers: Math.floor(Math.random() * 5000) + 500,
  }

  // Get posts for this tag
  const tagPosts = hashtagPosts[tag] || hashtagPosts[Object.keys(hashtagPosts).find(k => k.toLowerCase() === tag.toLowerCase()) || ""] || []

  // Also search in store posts for content containing the hashtag
  const storePostsWithTag = storePosts.filter((p) => 
    p.content.toLowerCase().includes(`#${tag.toLowerCase()}`)
  )

  const allPosts = [...tagPosts]

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <GuestRestrictionModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        action={guestAction}
      />
      <Header />
      <MobileMenu />
      <CartSidebar />

      <main className="flex-1 container mx-auto px-4 py-6 pb-24 lg:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tag Header */}
            <div className="bg-gradient-to-br from-card to-secondary/20 rounded-3xl border border-border/50 p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-lg">
                  <Hash className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">#{tag}</h1>
                  <p className="text-muted-foreground">
                    {tagInfo.posts.toLocaleString()} {t("tag.publications")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-foreground font-medium">{tagInfo.posts.toLocaleString()}</span>
                  <span className="text-muted-foreground">{t("tag.publications")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-foreground font-medium">{tagInfo.followers.toLocaleString()}</span>
                  <span className="text-muted-foreground">{t("tag.followers")}</span>
                </div>
              </div>
              <Button 
                onClick={handleFollow}
                className="mt-4 bg-gradient-to-r from-primary to-gold-dark text-primary-foreground hover:from-primary/90 hover:to-gold-dark/90 rounded-full"
              >
                {t("tag.followHashtag")}
              </Button>
            </div>

            {/* Posts */}
            {allPosts.length === 0 ? (
              <div className="bg-card rounded-3xl border border-border/50 p-12 text-center">
                <Hash className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-serif text-xl font-bold text-foreground mb-2">{t("tag.noPosts")}</h2>
                <p className="text-muted-foreground">
                  {t("tag.bePostFirst")} #{tag}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {allPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-gradient-to-br from-card to-secondary/10 rounded-3xl border border-border/50 overflow-hidden shadow-lg"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <a href={`/user/${post.author.username.slice(1)}`}>
                          <img
                            src={post.author.avatar || "/placeholder.svg"}
                            alt={post.author.name}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-background hover:ring-primary transition-all"
                          />
                        </a>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <a href={`/user/${post.author.username.slice(1)}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                              {post.author.name}
                            </a>
                            {post.author.tags[0] && (
                              <span className="px-2 py-0.5 bg-gradient-to-r from-primary/20 to-gold-dark/20 text-primary text-xs rounded-full font-medium">
                                {post.author.tags[0]}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <a href={`/user/${post.author.username.slice(1)}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                              {post.author.username}
                            </a>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-sm text-muted-foreground">{post.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {post.content.split(/(#\w+)/g).map((part, i) => 
                          part.startsWith('#') ? (
                            <a
                              key={i}
                              href={`/tag/${part.slice(1)}`}
                              className="text-primary hover:underline font-medium"
                            >
                              {part}
                            </a>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    </div>
                    {post.image && (
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt="Post"
                        className="w-full max-h-96 object-cover"
                      />
                    )}
                    <div className="flex items-center justify-between p-4 border-t border-border/50">
                      <div className="flex items-center gap-6">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className={cn(
                            "flex items-center gap-2 transition-colors group",
                            likedPosts.includes(post.id) ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                          )}
                        >
                          <Heart className={cn("h-5 w-5 group-hover:scale-110 transition-transform", likedPosts.includes(post.id) && "fill-current")} />
                          <span className="text-sm font-medium">{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                        </button>
                        <button 
                          onClick={handleComment}
                          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                        >
                          <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium">{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                          <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium">{post.shares}</span>
                        </button>
                      </div>
                      <button 
                        onClick={() => handleSave(post.id)}
                        className={cn(
                          "transition-colors",
                          savedPosts.includes(post.id) ? "text-primary" : "text-muted-foreground hover:text-primary"
                        )}
                      >
                        <Bookmark className={cn("h-5 w-5", savedPosts.includes(post.id) && "fill-current")} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Related Tags */}
              <div className="bg-gradient-to-br from-card to-secondary/20 rounded-3xl border border-border/50 p-5 shadow-lg">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">{t("tag.relatedHashtags")}</h3>
                <div className="space-y-3">
                  {trendingTags
                    .filter((t) => t.tag.toLowerCase() !== tag.toLowerCase())
                    .slice(0, 4)
                    .map((t) => (
                      <a
                        key={t.tag}
                        href={`/tag/${t.tag}`}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-muted to-secondary/30 rounded-2xl hover:from-primary/10 hover:to-gold-dark/10 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-gold-dark/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-gold-dark/30 transition-colors">
                            <Hash className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground group-hover:text-primary transition-colors">#{t.tag}</p>
                            <p className="text-xs text-muted-foreground">{t.posts.toLocaleString()} posts</p>
                          </div>
                        </div>
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </a>
                    ))}
                </div>
              </div>

              {/* Top Contributors */}
              <div className="bg-gradient-to-br from-beige-light to-secondary/50 rounded-3xl border border-beige/50 p-5 shadow-lg">
                <h3 className="font-serif text-lg font-semibold text-dark-brown mb-4">{t("tag.topContributors")}</h3>
                <div className="space-y-3">
                  {[
                    { name: "María García", username: "@mariaoud", avatar: "/elegant-woman-portrait.png", posts: 45 },
                    { name: "Carlos Mendez", username: "@carlosfragrance", avatar: "/man-portrait-sophisticated.jpg", posts: 38 },
                    { name: "Elena Martín", username: "@elena_oud", avatar: "/elegant-woman-avatar.jpg", posts: 32 },
                  ].map((user) => (
                    <a
                      key={user.username}
                      href={`/user/${user.username.slice(1)}`}
                      className="flex items-center gap-3 p-2 hover:bg-white/50 rounded-xl transition-colors"
                    >
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-dark-brown text-sm truncate">{user.name}</p>
                        <p className="text-xs text-brown-intense truncate">{user.posts} publicaciones</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}


export const Route = createFileRoute("/tag/$tag")({
  component: TagPage,
});
