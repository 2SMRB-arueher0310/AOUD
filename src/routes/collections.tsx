import { createFileRoute } from "@tanstack/react-router"
import { Header } from "@/components/header"
import { MobileMenu } from "@/components/mobile-menu"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Heart, Eye, User } from "lucide-react"
import { useT } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import Link from "@/lib/next-shim"

export const collections = [
  {
    id: "1",
    titleKey: "collections.1.title",
    descKey: "collections.1.desc",
    author: { name: "María García", avatar: "/elegant-woman-portrait.png" },
    images: ["/luxury-oud-perfume-bottle-gold.jpg", "/tom-ford-oud-wood-perfume.jpg", "/amouage-interlude-perfume-bottle-luxury.jpg"],
    perfumeIds: ["p1", "p2", "p3", "p4"],
    perfumeCount: 12,
    likes: 234,
    views: 1456,
  },
  {
    id: "2",
    titleKey: "collections.2.title",
    descKey: "collections.2.desc",
    author: { name: "Carlos Mendez", avatar: "/man-portrait-sophisticated.jpg" },
    images: ["/mfk-oud-satin-mood.jpg", "/nasomatto-black-afgano.jpg", "/xerjoff-perfume-bottle-luxury.jpg"],
    perfumeIds: ["p2", "p5", "p6", "p7"],
    perfumeCount: 8,
    likes: 189,
    views: 987,
  },
  {
    id: "3",
    titleKey: "collections.3.title",
    descKey: "collections.3.desc",
    author: { name: "Ana Rodríguez", avatar: "/woman-portrait-elegant-style.jpg" },
    images: ["/luxury-perfume-collection-display-oud.jpg", "/oud-perfume-bottle-elegant.jpg", "/luxury-perfume-display-banner.jpg"],
    perfumeIds: ["p1", "p3", "p5", "p8", "p11"],
    perfumeCount: 15,
    likes: 456,
    views: 2345,
  },
  {
    id: "4",
    titleKey: "collections.4.title",
    descKey: "collections.4.desc",
    author: { name: "Ahmed Hassan", avatar: "/man-sophisticated-portrait.jpg" },
    images: ["/dubai-perfume-souq.jpg", "/oud-wood-chips-display.jpg", "/oud-distillation-process.jpg"],
    perfumeIds: ["p1", "p2", "p4", "p13", "p14"],
    perfumeCount: 20,
    likes: 567,
    views: 3210,
  },
  {
    id: "5",
    titleKey: "collections.5.title",
    descKey: "collections.5.desc",
    author: { name: "Elena Perfumes", avatar: "/elegant-woman-avatar.jpg" },
    images: ["/tom-ford-oud-wood-perfume.jpg", "/luxury-oud-perfume-bottle-gold.jpg", "/mfk-oud-satin-mood.jpg"],
    perfumeIds: ["p2", "p3", "p5"],
    perfumeCount: 6,
    likes: 123,
    views: 654,
  },
  {
    id: "6",
    titleKey: "collections.6.title",
    descKey: "collections.6.desc",
    author: { name: "Oud Master", avatar: "/perfume-store-logo.jpg" },
    images: ["/perfume-workshop-artisan.jpg", "/perfume-making-process.jpg", "/luxury-perfume-packaging.jpg"],
    perfumeIds: ["p1", "p4", "p6", "p15", "p17"],
    perfumeCount: 18,
    likes: 345,
    views: 1789,
  },
]

function CollectionsPage() {
  const t = useT()
  const { likedCollections, toggleLikeCollection } = useAppStore()

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      <MobileMenu />
      <CartSidebar />

      <main className="flex-1 container mx-auto px-4 py-6 pb-24 lg:pb-6">
        <div className="bg-gradient-to-r from-dark-brown to-brown-intense rounded-2xl p-8 mb-8 text-white">
          <h1 className="font-serif text-3xl font-bold mb-4">{t("collections.title")}</h1>
          <p className="text-beige/90 max-w-2xl">{t("collections.heroDesc")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => {
            const isLiked = likedCollections.includes(collection.id)
            const likesCount = collection.likes + (isLiked ? 1 : 0)
            return (
              <div
                key={collection.id}
                className="bg-white rounded-xl border border-beige overflow-hidden hover:shadow-xl transition-shadow group flex flex-col relative"
              >
                <Link href={`/collections/${collection.id}`} className="block">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={collection.images[0] || "/placeholder.svg"}
                      alt={t(collection.titleKey)}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-brown/90 via-dark-brown/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-serif text-xl font-bold text-white drop-shadow-lg leading-tight">
                        {t(collection.titleKey)}
                      </h3>
                    </div>
                    <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-md text-dark-brown text-xs font-semibold rounded-full shadow">
                      {collection.perfumeCount} {t("collections.perfumes")}
                    </span>
                  </div>
                </Link>

                <div className="p-4 flex-1 flex flex-col">
                  <Link href={`/collections/${collection.id}`}>
                    <p className="text-sm text-brown-intense mb-4 line-clamp-2 flex-1">{t(collection.descKey)}</p>
                  </Link>

                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={collection.author.avatar || "/placeholder.svg"}
                      alt={collection.author.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-muted-foreground">{collection.author.name}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button
                      onClick={(e) => { e.preventDefault(); toggleLikeCollection(collection.id) }}
                      className={cn(
                        "flex items-center gap-1 transition-colors",
                        isLiked ? "text-red-500" : "hover:text-red-500"
                      )}
                      aria-label={t("collections.like")}
                    >
                      <Heart className={cn("h-4 w-4", isLiked && "fill-current")} /> {likesCount}
                    </button>
                    <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {collection.views}</span>
                    <span className="flex items-center gap-1"><User className="h-4 w-4" /> {collection.perfumeCount}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}

export const Route = createFileRoute("/collections")({
  component: CollectionsPage,
})
