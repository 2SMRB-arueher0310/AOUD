import { createFileRoute } from "@tanstack/react-router";

import { useEffect } from "react"
import { useRouter } from "@/lib/next-shim"
import { Header } from "@/components/header"
import { MobileMenu } from "@/components/mobile-menu"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileTabs } from "@/components/profile/profile-tabs"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { useAppStore, useHasHydrated } from "@/lib/store"
import { useT } from "@/lib/i18n"

function ProfilePage() {
  const router = useRouter()
  const { isGuest, isAuthenticated } = useAppStore()
  const hydrated = useHasHydrated((s) => s.hydrated)
  const t = useT()

  useEffect(() => {
    if (!hydrated) return
    if (isGuest || !isAuthenticated) {
      router.push("/auth")
    }
  }, [hydrated, isGuest, isAuthenticated, router])

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-pulse text-primary">{t("common.loading")}</div>
      </div>
    )
  }

  if (isGuest || !isAuthenticated) {
    return null
  }


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MobileMenu />
      <CartSidebar />

      <main className="flex-1 pb-24 lg:pb-0">
        <ProfileHeader />
        <ProfileTabs />
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}


export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});
