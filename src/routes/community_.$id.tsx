import { createFileRoute } from "@tanstack/react-router";

import { useParams, useRouter } from "@/lib/next-shim"
import { useState } from "react"
import Link from "@/lib/next-shim"
import { Header } from "@/components/header"
import { MobileMenu } from "@/components/mobile-menu"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { GuestRestrictionModal } from "@/components/guest-restriction-modal"
import { PostCard } from "@/components/post-card"
import { useAppStore } from "@/lib/store"
import { useT } from "@/lib/i18n"
import { Users, MessageSquare, ArrowLeft, Share2, Bell, Shield, Clock, TrendingUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const communities = [
  {
    id: "1",
    nameKey: "community.popular.1.name",
    members: 12500,
    descKey: "community.popular.1.desc",
    longDescKey: "community.1.longDesc",
    image: "/oud-wood-chips-display.jpg",
    coverImage: "/dubai-perfume-souq.jpg",
    categoryKey: "community.cat.Fragancias Orientales",
    createdAtKey: "community.1.createdAt",
    rulesKeys: ["community.1.rule.1", "community.1.rule.2", "community.1.rule.3", "community.1.rule.4", "community.1.rule.5"],
    creators: [
      { name: "Elena Perfumes", username: "@elenaperfumes", avatar: "/elegant-woman-portrait.png" },
    ],
    moderators: [
      { name: "Carlos Mendez", username: "@carlosfragrance", avatar: "/man-portrait-sophisticated.jpg" },
    ],
    stats: { postsToday: 24, postsWeek: 156, activeMembers: 3200 },
  },
  {
    id: "2",
    nameKey: "community.popular.2.name",
    members: 8300,
    descKey: "community.popular.2.desc",
    longDescKey: "community.2.longDesc",
    image: "/luxury-perfume-collection-display-oud.jpg",
    coverImage: "/luxury-perfume-packaging.jpg",
    categoryKey: "community.cat.Coleccionismo",
    createdAtKey: "community.2.createdAt",
    rulesKeys: ["community.2.rule.1", "community.2.rule.2", "community.2.rule.3"],
    creators: [
      { name: "Luis Fernández", username: "@luisperfumes", avatar: "/man-sophisticated-portrait.jpg" },
    ],
    moderators: [],
    stats: { postsToday: 12, postsWeek: 89, activeMembers: 1800 },
  },
  {
    id: "3",
    nameKey: "community.popular.3.name",
    members: 15200,
    descKey: "community.popular.3.desc",
    longDescKey: "community.3.longDesc",
    image: "/tom-ford-oud-wood-perfume.jpg",
    coverImage: "/luxury-perfume-shop-interior.jpg",
    categoryKey: "community.cat.Marcas",
    createdAtKey: "community.3.createdAt",
    rulesKeys: ["community.3.rule.1", "community.3.rule.2", "community.3.rule.3"],
    creators: [
      { name: "Ana Rodríguez", username: "@ana_scents", avatar: "/woman-portrait-elegant-style.jpg" },
    ],
    moderators: [
      { name: "Pedro Sánchez", username: "@pedroscents", avatar: "/man-portrait-sophisticated.jpg" },
    ],
    stats: { postsToday: 34, postsWeek: 245, activeMembers: 5400 },
  },
  {
    id: "4",
    nameKey: "community.popular.4.name",
    members: 4500,
    descKey: "community.popular.4.desc",
    longDescKey: "community.4.longDesc",
    image: "/perfume-workshop-artisan.jpg",
    coverImage: "/perfume-making-process.jpg",
    categoryKey: "community.cat.Educacion",
    createdAtKey: "community.4.createdAt",
    rulesKeys: ["community.4.rule.1", "community.4.rule.2", "community.4.rule.3"],
    creators: [
      { name: "Laura Torres", username: "@lauraperfume", avatar: "/woman-portrait-elegant-style.jpg" },
    ],
    moderators: [],
    stats: { postsToday: 8, postsWeek: 45, activeMembers: 890 },
  },
  {
    id: "5",
    nameKey: "community.popular.5.name",
    members: 9800,
    descKey: "community.popular.5.desc",
    longDescKey: "community.5.longDesc",
    image: "/dubai-perfume-souq.jpg",
    coverImage: "/oud-distillation-process.jpg",
    categoryKey: "community.cat.Regional",
    createdAtKey: "community.5.createdAt",
    rulesKeys: ["community.5.rule.1", "community.5.rule.2", "community.5.rule.3"],
    creators: [
      { name: "Javier López", username: "@javierfragrances", avatar: "/man-sophisticated-portrait.jpg" },
    ],
    moderators: [
      { name: "Elena Martín", username: "@elena_oud", avatar: "/elegant-woman-avatar.jpg" },
    ],
    stats: { postsToday: 18, postsWeek: 134, activeMembers: 2100 },
  },
  {
    id: "6",
    nameKey: "community.popular.6.name",
    members: 22000,
    descKey: "community.popular.6.desc",
    longDescKey: "community.6.longDesc",
    image: "/luxury-perfume-display-banner.jpg",
    coverImage: "/luxury-fragrance-store.jpg",
    categoryKey: "community.cat.Reviews",
    createdAtKey: "community.6.createdAt",
    rulesKeys: ["community.6.rule.1", "community.6.rule.2", "community.6.rule.3", "community.6.rule.4"],
    creators: [
      { name: "Carlos Mendez", username: "@carlosfragrance", avatar: "/man-portrait-sophisticated.jpg" },
    ],
    moderators: [
      { name: "María García", username: "@mariaoud", avatar: "/elegant-woman-portrait.png" },
      { name: "Ana Rodríguez", username: "@ana_scents", avatar: "/woman-portrait-elegant-style.jpg" },
    ],
    stats: { postsToday: 67, postsWeek: 423, activeMembers: 8900 },
  },
]

function CommunityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const t = useT()
  const communityId = params.id as string
  const {
    isGuest,
    joinedCommunities,
    joinCommunity,
    leaveCommunity,
    communityPosts,
    toggleCommunityLike,
    toggleCommunitySave,
    addCommunityComment,
  } = useAppStore()
  const posts = communityPosts[communityId] || []
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [guestAction, setGuestAction] = useState("")

  const community = communities.find((c) => c.id === communityId)

  if (!community) {
    return (
      <div className="min-h-screen flex flex-col bg-cream">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="font-serif text-2xl font-bold text-dark-brown mb-4">{t("community.notFound")}</h1>
          <Button onClick={() => router.push("/community")} className="bg-gold hover:bg-brown-intense">
            {t("community.backToCommunities")}
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  const isJoined = joinedCommunities.includes(communityId)

  const handleJoin = () => {
    if (isGuest) {
      setGuestAction("unirte a comunidades")
      setShowGuestModal(true)
      return
    }
    if (isJoined) {
      leaveCommunity(communityId)
    } else {
      joinCommunity(communityId)
    }
  }

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

      <main className="flex-1 pb-24 lg:pb-6">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 lg:h-80">
          <img
            src={community.coverImage || community.image}
            alt={t(community.nameKey)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-brown/80 to-transparent" />
          
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-dark-brown" />
          </button>

          {/* Share Button */}
          <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-white transition-colors">
            <Share2 className="h-5 w-5 text-dark-brown" />
          </button>
        </div>

        {/* Community Info */}
        <div className="container mx-auto px-4 -mt-16 relative z-10">
          <div className="bg-white rounded-2xl border border-beige shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-beige">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <img
                  src={community.image || "/placeholder.svg"}
                  alt={t(community.nameKey)}
                  className="h-20 w-20 rounded-xl object-cover border-4 border-white shadow-md"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-1 bg-gold/20 text-gold text-xs font-medium rounded-full">
                      {t(community.categoryKey)}
                    </span>
                  </div>
                  <h1 className="font-serif text-2xl font-bold text-dark-brown">{t(community.nameKey)}</h1>
                  <p className="text-muted-foreground text-sm mt-1">{t(community.descKey)}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={isJoined ? "outline" : "default"}
                    className={isJoined ? "border-gold text-gold hover:bg-gold/10 bg-transparent" : "bg-gold hover:bg-brown-intense"}
                    onClick={handleJoin}
                  >
                    {isJoined ? t("community.joined") : t("community.join")}
                  </Button>
                  {isJoined && (
                    <Button variant="outline" size="icon" className="border-border bg-transparent">
                      <Bell className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-beige">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gold" />
                  <div>
                    <p className="font-semibold text-dark-brown">{community.members.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{t("community.members")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-gold" />
                  <div>
                    <p className="font-semibold text-dark-brown">{community.stats.activeMembers.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{t("community.activeMembers")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-gold" />
                  <div>
                    <p className="font-semibold text-dark-brown">{community.stats.postsWeek}</p>
                    <p className="text-xs text-muted-foreground">{t("community.postsWeek")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gold" />
                  <div>
                    <p className="font-semibold text-dark-brown">{t(community.createdAtKey)}</p>
                    <p className="text-xs text-muted-foreground">{t("community.created")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <div className="bg-beige-light rounded-xl p-4">
                  <h3 className="font-semibold text-dark-brown mb-2">{t("community.aboutThis")}</h3>
                  <p className="text-brown-intense text-sm leading-relaxed">{t(community.longDescKey)}</p>
                </div>

                {/* Recent Posts */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-dark-brown">{t("community.recentPosts")}</h3>
                  </div>
                  <div className="space-y-6">
                    {posts.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">{t("community.noPosts")}</p>
                    ) : (
                      posts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onToggleLike={() => toggleCommunityLike(communityId, post.id)}
                          onToggleSave={() => toggleCommunitySave(communityId, post.id)}
                          onAddComment={(c) => addCommunityComment(communityId, post.id, c)}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Rules */}
                <div className="bg-white border border-beige rounded-xl p-4">
                  <h3 className="font-semibold text-dark-brown mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-gold" />
                    {t("community.rulesTitle")}
                  </h3>
                  <ul className="space-y-2">
                    {community.rulesKeys.map((ruleKey, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-brown-intense">
                        <span className="font-semibold text-gold min-w-[20px]">{index + 1}.</span>
                        {t(ruleKey)}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Creators */}
                <div className="bg-white border border-beige rounded-xl p-4">
                  <h3 className="font-semibold text-dark-brown mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-gold" />
                    {t("community.creatorsTitle")}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">{t("community.creatorsHint")}</p>
                  <div className="space-y-3">
                    {community.creators.map((c) => (
                      <Link
                        key={c.username}
                        href={`/user/${c.username.replace("@", "")}`}
                        className="flex items-center gap-3 hover:bg-beige-light rounded-lg p-2 -mx-2 transition-colors"
                      >
                        <img src={c.avatar || "/placeholder.svg"} alt={c.name} className="h-10 w-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <p className="font-medium text-dark-brown text-sm">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.username}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 bg-gold/20 text-gold rounded-full font-medium">
                          {t("community.creatorBadge")}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Moderators */}
                {community.moderators.length > 0 && (
                <div className="bg-white border border-beige rounded-xl p-4">
                  <h3 className="font-semibold text-dark-brown mb-3">{t("community.moderatorsTitle")}</h3>
                  <div className="space-y-3">
                    {community.moderators.map((mod) => (
                      <Link
                        key={mod.username}
                        href={`/user/${mod.username.replace("@", "")}`}
                        className="flex items-center gap-3 hover:bg-beige-light rounded-lg p-2 -mx-2 transition-colors"
                      >
                        <img
                          src={mod.avatar || "/placeholder.svg"}
                          alt={mod.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-dark-brown text-sm">{mod.name}</p>
                          <p className="text-xs text-muted-foreground">{mod.username}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                )}

                {/* Activity */}
                <div className="bg-gold/10 border border-gold/30 rounded-xl p-4">
                  <h3 className="font-semibold text-dark-brown mb-3">{t("community.todayActivity")}</h3>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gold">{community.stats.postsToday}</p>
                    <p className="text-sm text-brown-intense">{t("community.newPosts")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}


export const Route = createFileRoute("/community_/$id")({
  component: CommunityDetailPage,
});
