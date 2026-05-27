
import React from "react"

import { Home, Plus, ShoppingBag, User } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useT } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { GuestRestrictionModal } from "@/components/guest-restriction-modal"

export function MobileBottomNav() {
  const { toggleCart, cartItems, isGuest, isAuthenticated } = useAppStore()
  const t = useT()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [guestAction, setGuestAction] = useState("")

  const navItems = [
    { icon: Home, label: t("nav.home"), href: "/", key: "home" },
    { icon: ShoppingBag, label: t("nav.shop"), href: "/shop", key: "shop" },
    { icon: Plus, label: t("nav.create"), href: "#", isCreate: true, key: "create" },
    { icon: User, label: t("nav.shortProfile"), href: "/profile", key: "profile" },
  ]

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleCreateClick = () => {
    if (isGuest) {
      setGuestAction("crear publicaciones")
      setShowGuestModal(true)
      return
    }
    setShowCreateModal(true)
  }

  const handleProfileClick = (e: React.MouseEvent) => {
    if (isGuest) {
      e.preventDefault()
      setGuestAction("acceder a tu perfil")
      setShowGuestModal(true)
    }
  }

  return (
    <>
      <GuestRestrictionModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        action={guestAction}
      />
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-card via-card to-card/95 border-t border-border/50 z-40 lg:hidden safe-area-pb backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-around h-18 py-2">
          {navItems.map((item) => {
            const isProfile = item.key === "profile"
            return (
              <a
                key={item.key}
                href={item.isCreate ? undefined : item.href}
                onClick={
                  item.isCreate
                    ? handleCreateClick
                    : isProfile
                      ? handleProfileClick
                      : undefined
                }
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full text-muted-foreground hover:text-primary transition-all",
                  item.isCreate && "relative",
                )}
              >
                {item.isCreate ? (
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center -mt-8 shadow-xl border-4 border-card">
                    <item.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                ) : (
                  <>
                    <item.icon className="h-6 w-6" />
                    <span className="text-xs mt-1 font-medium">{item.label}</span>
                  </>
                )}
              </a>
            )
          })}
        </div>
      </nav>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden flex items-end">
          <div className="absolute inset-0" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full bg-card rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-6" />
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4 text-center">{t("menu.createPost")}</h2>
            <div className="space-y-3">
              <a
                href="/"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-muted to-secondary/30 rounded-2xl hover:from-muted/80 hover:to-secondary/20 transition-all"
              >
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <Plus className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t("menu.newPost")}</p>
                  <p className="text-sm text-muted-foreground">{t("menu.newPostSub")}</p>
                </div>
              </a>
              <a
                href="/shop"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-muted to-secondary/30 rounded-2xl hover:from-muted/80 hover:to-secondary/20 transition-all"
              >
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center">
                  <ShoppingBag className="h-7 w-7 text-secondary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t("menu.addCollection")}</p>
                  <p className="text-sm text-muted-foreground">{t("menu.addCollectionSub")}</p>
                </div>
              </a>
            </div>
            <button
              onClick={() => setShowCreateModal(false)}
              className="w-full mt-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("menu.cancel")}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
