import { createFileRoute, useParams } from "@tanstack/react-router"
import { Header } from "@/components/header"
import { MobileMenu } from "@/components/mobile-menu"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, Eye } from "lucide-react"
import { useT } from "@/lib/i18n"
import Link from "@/lib/next-shim"
import { useAppStore } from "@/lib/store"
import { collections } from "./collections"

function CollectionDetailPage() {
  const t = useT()
  const { id } = useParams({ from: "/collections_/$id" })
  const { perfumes, likedCollections, toggleLikeCollection } = useAppStore()
  const collection = collections.find((c) => c.id === id)
  const isLiked = collection ? likedCollections.includes(collection.id) : false

  if (!collection) {
    return (
      <div className="min-h-screen flex flex-col bg-cream">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="font-serif text-2xl font-bold text-dark-brown mb-4">{t("collections.notFound")}</h1>
          <Button asChild className="bg-gold hover:bg-brown-intense">
            <Link href="/collections">{t("collections.back")}</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  const items = perfumes.filter((p) => collection.perfumeIds.includes(p.id))

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      <MobileMenu />
      <CartSidebar />

      <main className="flex-1 pb-24 lg:pb-6">
        {/* Cover */}
        <div className="relative h-56 md:h-72">
          <img
            src={collection.images[0] || "/placeholder.svg"}
            alt={t(collection.titleKey)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-brown/90 via-dark-brown/40 to-transparent" />
          <Link
            href="/collections"
            className="absolute top-4 left-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg"
          >
            <ArrowLeft className="h-5 w-5 text-dark-brown" />
          </Link>
          <div className="absolute bottom-0 left-0 right-0 p-6 container mx-auto">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-white drop-shadow mb-2">
              {t(collection.titleKey)}
            </h1>
            <div className="flex items-center gap-3 text-white/90 text-sm flex-wrap">
              <img src={collection.author.avatar} alt={collection.author.name} className="h-8 w-8 rounded-full object-cover ring-2 ring-white" />
              <span>{t("collections.by")} <strong>{collection.author.name}</strong></span>
              <button
                onClick={() => toggleLikeCollection(collection.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${isLiked ? "bg-red-500 text-white" : "bg-white/20 hover:bg-white/30"}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                {collection.likes + (isLiked ? 1 : 0)}
                <span className="ml-1">{isLiked ? t("collections.liked") : t("collections.like")}</span>
              </button>
              <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {collection.views}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* About */}
          <section className="bg-white rounded-2xl border border-beige p-6 mb-8 shadow-sm">
            <h2 className="font-serif text-xl font-semibold text-dark-brown mb-2">{t("collections.about")}</h2>
            <p className="text-brown-intense">{t(collection.descKey)}</p>
          </section>

          {/* Perfumes */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-dark-brown mb-4">
              {t("collections.includedPerfumes")} ({items.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p) => (
                <Link
                  key={p.id}
                  href={`/shop/${p.id}`}
                  className="bg-white rounded-2xl border border-beige overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-square overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">{p.brand}</p>
                    <h3 className="font-semibold text-dark-brown">{p.name}</h3>
                    <p className="font-serif text-lg font-bold text-primary mt-1">€{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
            {items.length === 0 && (
              <p className="text-center text-muted-foreground py-8">{t("collections.emptyPerfumes")}</p>
            )}
          </section>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}

export const Route = createFileRoute("/collections_/$id")({
  component: CollectionDetailPage,
})
