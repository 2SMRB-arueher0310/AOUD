import { createFileRoute } from "@tanstack/react-router";

import { useState } from "react"
import Link from "@/lib/next-shim"
import { Header } from "@/components/header"
import { MobileMenu } from "@/components/mobile-menu"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { GuestRestrictionModal } from "@/components/guest-restriction-modal"
import { useAppStore } from "@/lib/store"
import { useT, useRoleT } from "@/lib/i18n"
import { Users, MessageSquare, Calendar, MapPin, Crown, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const communities = [
  { id: "1", nameKey: "community.popular.1.name", members: 12500, descKey: "community.popular.1.desc", image: "/oud-wood-chips-display.jpg", categoryKey: "community.cat.Fragancias Orientales" },
  { id: "2", nameKey: "community.popular.2.name", members: 8300, descKey: "community.popular.2.desc", image: "/luxury-perfume-collection-display-oud.jpg", categoryKey: "community.cat.Coleccionismo" },
  { id: "3", nameKey: "community.popular.3.name", members: 15200, descKey: "community.popular.3.desc", image: "/tom-ford-oud-wood-perfume.jpg", categoryKey: "community.cat.Marcas" },
  { id: "4", nameKey: "community.popular.4.name", members: 4500, descKey: "community.popular.4.desc", image: "/perfume-workshop-artisan.jpg", categoryKey: "community.cat.Educación" },
  { id: "5", nameKey: "community.popular.5.name", members: 9800, descKey: "community.popular.5.desc", image: "/dubai-perfume-souq.jpg", categoryKey: "community.cat.Regional" },
  { id: "6", nameKey: "community.popular.6.name", members: 22000, descKey: "community.popular.6.desc", image: "/luxury-perfume-display-banner.jpg", categoryKey: "community.cat.Reviews" },
]

const upcomingEvents = [
  { id: "1", titleKey: "community.event.1.title", date: "15 Feb 2026", time: "19:00", location: "Online", attendees: 156 },
  { id: "2", titleKey: "community.event.2.title", date: "22 Feb 2026", time: "18:00", location: "Madrid", attendees: 42 },
  { id: "3", titleKey: "community.event.3.title", date: "1 Mar 2026", time: "17:00", location: "Online", attendees: 89 },
]

const topMembers = [
  { name: "Elena Perfumes", username: "@elenaperfumes", avatar: "/elegant-woman-portrait.png", points: 12500, badge: "Experta" },
  { name: "Carlos Mendez", username: "@carlosfragrance", avatar: "/man-portrait-sophisticated.jpg", points: 11200, badge: "Reviewer" },
  { name: "Ana Rodríguez", username: "@ana_scents", avatar: "/woman-portrait-elegant-style.jpg", points: 9800, badge: "Coleccionista" },
]

function CommunityPage() {
  const t = useT()
  const rt = useRoleT()
  const { isGuest, joinedCommunities, joinCommunity, leaveCommunity } = useAppStore()
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [guestAction, setGuestAction] = useState("")
  const [replyThread, setReplyThread] = useState<{ titleKey: string } | null>(null)
  const [replyText, setReplyText] = useState("")

  const handleJoinCommunity = (communityId: string) => {
    if (isGuest) {
      setGuestAction("unirte a comunidades")
      setShowGuestModal(true)
      return
    }
    if (joinedCommunities.includes(communityId)) {
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

      <main className="flex-1 container mx-auto px-4 py-6 pb-24 lg:pb-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-dark-brown to-brown-intense rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-8 w-8 text-gold" />
            <h1 className="font-serif text-3xl font-bold">{t("community.title")}</h1>
          </div>
          <p className="text-beige/90 max-w-2xl">
            {t("community.heroDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Communities Grid */}
            <div className="bg-white rounded-xl p-6 border border-beige shadow-sm">
              <h2 className="font-serif text-xl font-semibold text-dark-brown mb-6">{t("community.popular")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {communities.map((community) => (
                  <div
                    key={community.id}
                    className="border border-beige rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <Link href={`/community/${community.id}`} className="block">
                      <div className="h-32 relative">
                        <img
                          src={community.image || "/placeholder.svg"}
                          alt={t(community.nameKey)}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 right-2 px-2 py-1 bg-dark-brown/80 text-white text-xs rounded-full">
                          {t(community.categoryKey)}
                        </span>
                      </div>
                      <div className="p-4 pb-2">
                        <h3 className="font-semibold text-dark-brown mb-1">{t(community.nameKey)}</h3>
                        <p className="text-sm text-brown-intense mb-3 line-clamp-2">{t(community.descKey)}</p>
                      </div>
                    </Link>
                    <div className="px-4 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {community.members.toLocaleString()} {t("community.members")}
                        </span>
                        <Button
                          variant={joinedCommunities.includes(community.id) ? "outline" : "default"}
                          size="sm"
                          className={joinedCommunities.includes(community.id) ? "border-gold text-gold hover:bg-gold/10 bg-transparent" : "bg-gold hover:bg-brown-intense"}
                          onClick={() => handleJoinCommunity(community.id)}
                        >
                          {joinedCommunities.includes(community.id) ? t("community.joined") : t("community.join")}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discussion Threads */}
            <div className="bg-white rounded-xl p-6 border border-beige shadow-sm">
              <h2 className="font-serif text-xl font-semibold text-dark-brown mb-6">{t("community.activeDiscussions")}</h2>
              <div className="space-y-4">
                {[
                  { titleKey: "community.discussion.1", replies: 234, catKey: "community.discussion.general" },
                  { titleKey: "community.discussion.2", replies: 156, catKey: "community.discussion.recommendations" },
                  { titleKey: "community.discussion.3", replies: 89, catKey: "community.discussion.reviews" },
                  { titleKey: "community.discussion.4", replies: 67, catKey: "community.discussion.tips" },
                ].map((thread, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      if (isGuest) {
                        setGuestAction(t("comment.reply"))
                        setShowGuestModal(true)
                        return
                      }
                      setReplyText("")
                      setReplyThread({ titleKey: thread.titleKey })
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-beige-light transition-colors text-left"
                  >
                    <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-gold" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-dark-brown">{t(thread.titleKey)}</h4>
                      <p className="text-sm text-muted-foreground">{thread.replies} {t("community.replies")} · {t(thread.catKey)}</p>
                    </div>
                    <span className="text-xs font-medium text-gold whitespace-nowrap">{t("community.discussion.openReply")}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white rounded-xl p-4 border border-beige shadow-sm">
              <h3 className="font-serif text-lg font-semibold text-dark-brown mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gold" />
                {t("community.upcomingEvents")}
              </h3>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 bg-beige-light rounded-lg">
                    <h4 className="font-medium text-dark-brown text-sm">{t(event.titleKey)}</h4>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{event.date} · {event.time}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                    <p className="text-xs text-gold mt-2">{event.attendees} {t("community.attendees")}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Members */}
            <div className="bg-white rounded-xl p-4 border border-beige shadow-sm">
              <h3 className="font-serif text-lg font-semibold text-dark-brown mb-4 flex items-center gap-2">
                <Crown className="h-5 w-5 text-gold" />
                {t("community.topMembers")}
              </h3>
              <div className="space-y-3">
                {topMembers.map((member, index) => (
                  <div key={member.username} className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gold w-6">{index + 1}</span>
                    <img
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark-brown text-sm truncate">{member.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-gold fill-gold" />
                        <span className="text-xs text-muted-foreground">{member.points.toLocaleString()} pts</span>
                      </div>
                    </div>
                    <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-full">{rt(member.badge)}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {replyThread && (
        <div
          className="fixed inset-0 bg-dark-brown/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setReplyThread(null)}
        >
          <div
            className="bg-white rounded-2xl border border-beige max-w-lg w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("community.discussion.replyTitle")}</p>
                <h3 className="font-serif text-lg font-semibold text-dark-brown">{t(replyThread.titleKey)}</h3>
              </div>
              <button
                onClick={() => setReplyThread(null)}
                className="text-muted-foreground hover:text-dark-brown"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={t("community.discussion.replyPlaceholder")}
              rows={5}
              className="border-beige"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setReplyThread(null)}>
                {t("comment.cancel")}
              </Button>
              <Button
                className="bg-gold hover:bg-brown-intense"
                disabled={!replyText.trim()}
                onClick={() => {
                  toast.success(t("community.discussion.send"))
                  setReplyThread(null)
                  setReplyText("")
                }}
              >
                {t("community.discussion.send")}
              </Button>
            </div>
          </div>
        </div>
      )}


      <Footer />
      <MobileBottomNav />
    </div>
  )
}


export const Route = createFileRoute("/community")({
  component: CommunityPage,
});
