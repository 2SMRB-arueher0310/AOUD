import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/header"
import { MobileMenu } from "@/components/mobile-menu"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { Feed } from "@/components/feed"
import { Sidebar } from "@/components/sidebar"
import { CreatePost } from "@/components/create-post"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { CommunityPreview } from "@/components/community-preview"
import { GuestRestrictionModal } from "@/components/guest-restriction-modal"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useAppStore, useHasHydrated } from "@/lib/store"
import { useRouter } from "@/lib/next-shim"
import { useT } from "@/lib/i18n"

function HomePage() {
  const router = useRouter()
  const t = useT()
  const [activeTab, setActiveTab] = useState<"feed" | "community">("feed")
  const [showGuestModal, setShowGuestModal] = useState(false)
  const { followingUsers, toggleFollow, isGuest, isAuthenticated } = useAppStore()
  const hydrated = useHasHydrated((s) => s.hydrated)

  // Redirigir a auth solo despues de hidratar el estado persistido
  useEffect(() => {
    if (!hydrated) return
    if (!isAuthenticated && !isGuest) {
      router.push("/auth")
    }
  }, [hydrated, isAuthenticated, isGuest, router])

  const handleFollow = (username: string) => {
    if (isGuest) {
      setShowGuestModal(true)
      return
    }
    toggleFollow(username)
  }

  // Mientras hidrata, no renderizar contenido (evita flash y redirect prematuro)
  if (!hydrated) {
    return <div className="min-h-screen bg-cream" />
  }
  if (!isAuthenticated && !isGuest) {
    return <div className="min-h-screen bg-cream" />
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <GuestRestrictionModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        action={t("guest.followUsers")}
      />

      <Header />
      <MobileMenu />
      <CartSidebar />

      <main className="flex-1 container mx-auto px-4 py-6 pb-24 lg:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Desktop Only */}
          <aside className="hidden lg:block lg:col-span-3">
            <Sidebar />
          </aside>

          {/* Main Feed */}
          <div className="lg:col-span-6 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-xl border border-beige shadow-sm overflow-hidden">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("feed")}
                  className={cn(
                    "flex-1 py-4 px-6 font-medium text-center transition-colors relative",
                    activeTab === "feed"
                      ? "text-gold bg-gold/5"
                      : "text-brown-intense hover:text-dark-brown hover:bg-beige-light"
                  )}
                >
                  Feed
                  {activeTab === "feed" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("community")}
                  className={cn(
                    "flex-1 py-4 px-6 font-medium text-center transition-colors relative",
                    activeTab === "community"
                      ? "text-gold bg-gold/5"
                      : "text-brown-intense hover:text-dark-brown hover:bg-beige-light"
                  )}
                >
                  {t("nav.community")}
                  {activeTab === "community" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                  )}
                </button>

              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "feed" ? (
              <>
                <CreatePost />
                <Feed />
              </>
            ) : (
              <CommunityPreview />
            )}
          </div>

          {/* Right Sidebar - Desktop Only */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-gradient-to-br from-white to-beige-light/50 rounded-3xl p-5 border border-beige/50 shadow-lg">
                <h3 className="font-serif text-lg font-semibold text-dark-brown mb-4">{t("home.trends")}</h3>
                <div className="space-y-3">
                  {[
                    { tag: "#OudCollection", posts: "1.2K" },
                    { tag: "#NicheFragrances", posts: "2.3K" },
                    { tag: "#AmouageLove", posts: "876" },
                    { tag: "#TomFord", posts: "3.4K" },
                    { tag: "#ScentOfTheDay", posts: "5.6K" },
                  ].map((item) => (
                    <a
                      key={item.tag}
                      href={`/tag/${item.tag.slice(1)}`}
                      className="flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-gold/10 transition-colors group"
                    >
                      <span className="text-gold group-hover:text-brown-intense transition-colors font-medium">
                        {item.tag}
                      </span>
                      <span className="text-xs text-brown-intense bg-beige px-2 py-1 rounded-full">
                        {item.posts} {t("home.posts")}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-beige-light to-secondary/50 rounded-3xl p-5 border border-beige/50 shadow-lg">
                <h3 className="font-serif text-lg font-semibold text-dark-brown mb-4">{t("home.suggestions")}</h3>
                <div className="space-y-4">
                  {[
                    { name: "Elena Perfumes", username: "@elenaperfumes", avatar: "/elegant-woman-portrait.png" },
                    { name: "Oud Master", username: "@oudmaster", avatar: "/man-sophisticated-portrait.jpg" },
                    { name: "Scent Library", username: "@scentlibrary", avatar: "/perfume-store-logo.jpg" },
                  ].map((user) => {
                    const isFollowing = followingUsers.includes(user.username)
                    return (
                      <div key={user.username} className="flex items-center gap-3">
                        <a href={`/user/${user.username.slice(1)}`}>
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-white hover:ring-gold transition-all"
                          />
                        </a>
                        <div className="flex-1 min-w-0">
                          <a href={`/user/${user.username.slice(1)}`} className="font-medium text-dark-brown text-sm truncate block hover:text-gold transition-colors">{user.name}</a>
                          <p className="text-xs text-brown-intense truncate">{user.username}</p>
                        </div>
                        <button 
                          onClick={() => handleFollow(user.username)}
                          className={cn(
                            "text-xs px-4 py-1.5 rounded-full transition-all font-medium",
                            isFollowing 
                              ? "bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-white" 
                              : "bg-gradient-to-r from-gold to-gold-dark text-white hover:from-brown-intense hover:to-brown-medium"
                          )}
                        >
                          {isFollowing ? t("home.following") : t("home.follow")}
                        </button>
                      </div>
                    )
                  })}
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


export const Route = createFileRoute("/")({
  component: HomePage,
});
