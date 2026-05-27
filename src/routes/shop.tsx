import { createFileRoute } from "@tanstack/react-router";

import { Header } from "@/components/header"
import { MobileMenu } from "@/components/mobile-menu"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { ShopHero } from "@/components/shop/shop-hero"
import { ShopFilters } from "@/components/shop/shop-filters"
import { ProductGrid } from "@/components/shop/product-grid"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { useT } from "@/lib/i18n"

function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MobileMenu />
      <CartSidebar />

      <main className="flex-1 pb-24 lg:pb-0">
        <ShopHero />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <MobileShopFilters />
            </div>
            <aside className="hidden lg:block lg:col-span-1">
              <ShopFilters />
            </aside>
            <div className="lg:col-span-3">
              <ProductGrid />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}

function MobileShopFilters() {
  const t = useT()
  return (
    <details className="bg-gradient-to-br from-card to-secondary/20 rounded-3xl border border-border/50 overflow-hidden shadow-lg">
      <summary className="p-5 cursor-pointer font-medium text-foreground flex items-center justify-between">
        <span className="flex items-center gap-2">
          <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {t("shop.filters")}
        </span>
        <svg className="h-5 w-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="p-5 pt-0">
        <ShopFilters />
      </div>
    </details>
  )
}


export const Route = createFileRoute("/shop")({
  component: ShopPage,
});
