import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/header"
import { MobileMenu } from "@/components/mobile-menu"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { Feed } from "@/components/feed"
import { Sidebar } from "@/components/sidebar"
import { CreatePost } from "@/components/create-post"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { useT } from "@/lib/i18n"

function FeedPage() {
  const t = useT()
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      <MobileMenu />
      <CartSidebar />

      <main className="flex-1 container mx-auto px-4 py-6 pb-24 lg:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="hidden lg:block lg:col-span-3">
            <Sidebar />
          </aside>

          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-xl p-4 border border-beige shadow-sm">
              <h1 className="font-serif text-2xl font-bold text-dark-brown mb-2">{t("feed.title")}</h1>
              <p className="text-brown-intense">{t("feed.subtitle")}</p>
            </div>
            <CreatePost />
            <Feed />
          </div>

          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-xl p-4 border border-beige shadow-sm">
                <h3 className="font-serif text-lg font-semibold text-dark-brown mb-4">{t("feed.trends")}</h3>
                <div className="space-y-3">
                  {["#OudCollection", "#NicheFragrances", "#AmouageLove", "#TomFord", "#ScentOfTheDay"].map((tag) => (
                    <a
                      key={tag}
                      href={`/tag/${tag.slice(1)}`}
                      className="block text-gold hover:text-brown-intense transition-colors font-medium"
                    >
                      {tag}
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


export const Route = createFileRoute("/feed")({
  component: FeedPage,
});
