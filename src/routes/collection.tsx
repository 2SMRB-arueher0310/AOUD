import { createFileRoute } from "@tanstack/react-router";

import { useState } from "react"
import { Header } from "@/components/header"
import { MobileMenu } from "@/components/mobile-menu"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { Plus, Star, Trash2, Grid3X3, List, Search, ShoppingCart, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "@/lib/next-shim"
import { Suspense } from "react"
import { useT } from "@/lib/i18n"

function CollectionPage() {
  const t = useT()
  const { perfumes, userCollection, addToCollection, removeFromCollection, addToCart, toggleCart } = useAppStore()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const searchParams = useSearchParams()

  const collectionPerfumes = perfumes.filter((p) => userCollection.includes(p.id))
  const availablePerfumes = perfumes.filter((p) => !userCollection.includes(p.id))

  const filteredCollection = collectionPerfumes.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredAvailable = availablePerfumes.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddToCart = (perfume: typeof perfumes[0]) => {
    addToCart({
      id: perfume.id,
      name: perfume.name,
      brand: perfume.brand,
      price: perfume.price,
      image: perfume.image,
      size: perfume.size,
    })
    toggleCart()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MobileMenu />
      <CartSidebar />

      <main className="flex-1 pb-24 lg:pb-0">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground">{t("collection.title")}</h1>
              <p className="text-muted-foreground">{collectionPerfumes.length} {t("collection.count")}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("collection.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted border-border w-64"
                />
              </div>
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded",
                    viewMode === "grid" ? "bg-background shadow" : "hover:bg-background/50"
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded",
                    viewMode === "list" ? "bg-background shadow" : "hover:bg-background/50"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              <Button onClick={() => setShowAddModal(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                {t("collection.addPerfume")}
              </Button>
            </div>
          </div>

          {/* Collection Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: t("collection.statsTotal"), value: collectionPerfumes.length },
              { label: t("collection.statsValue"), value: `€${collectionPerfumes.reduce((sum, p) => sum + p.price, 0).toLocaleString()}` },
              { label: t("collection.statsBrands"), value: new Set(collectionPerfumes.map((p) => p.brand)).size },
              { label: t("collection.statsFavCat"), value: collectionPerfumes.length > 0 ? "Oud" : "-" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card rounded-xl border border-border p-4 text-center">
                <p className="text-2xl font-serif font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Collection Grid/List */}
          {filteredCollection.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground mb-4">
                {searchQuery ? t("collection.noResults") : t("collection.emptyTitle")}
              </p>
              <Button onClick={() => setShowAddModal(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                {t("collection.firstAdd")}
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCollection.map((perfume) => (
                <div
                  key={perfume.id}
                  className="bg-card rounded-xl border border-border overflow-hidden group hover:border-primary/50 transition-all"
                >
                  <div className="relative aspect-square">
                    <img
                      src={perfume.image || "/placeholder.svg"}
                      alt={perfume.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFromCollection(perfume.id)}
                      className="absolute top-3 right-3 h-8 w-8 bg-destructive/90 text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">{perfume.brand}</p>
                    <h3 className="font-semibold text-foreground">{perfume.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3 w-3",
                              i < Math.floor(perfume.rating) ? "text-primary fill-primary" : "text-muted-foreground"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{perfume.size}</span>
                    </div>
                    <p className="font-serif text-base font-bold text-primary mt-2">€{perfume.price}</p>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                        onClick={() => handleAddToCart(perfume)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {t("collection.addToCart")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-border bg-transparent gap-2"
                        asChild
                      >
                        <a href={`/shop/${perfume.id}`}>
                          <Eye className="h-4 w-4" />
                          {t("collection.viewDetails")}
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCollection.map((perfume) => (
                <div
                  key={perfume.id}
                  className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:border-primary/50 transition-all"
                >
                  <img
                    src={perfume.image || "/placeholder.svg"}
                    alt={perfume.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{perfume.brand}</p>
                    <h3 className="font-semibold text-foreground">{perfume.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-primary fill-primary" />
                        <span className="text-sm">{perfume.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{perfume.size}</span>
                      <span className="text-sm text-muted-foreground">{perfume.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                      onClick={() => handleAddToCart(perfume)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {t("collection.addToCart")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border bg-transparent gap-2"
                      asChild
                    >
                      <a href={`/shop/${perfume.id}`}>
                        <Eye className="h-4 w-4" />
                        {t("collection.viewDetails")}
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => removeFromCollection(perfume.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-xl border border-border max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-serif text-xl font-semibold">{t("collection.modalTitle")}</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                  ×
                </Button>
              </div>
              <div className="p-4">
                <Input
                  placeholder={t("collection.searchPerfumes")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-muted border-border mb-4"
                />
              </div>
              <div className="px-4 pb-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {filteredAvailable.map((perfume) => (
                    <button
                      key={perfume.id}
                      onClick={() => {
                        addToCollection(perfume.id)
                      }}
                      className="w-full p-3 flex items-center gap-4 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <img
                        src={perfume.image || "/placeholder.svg"}
                        alt={perfume.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{perfume.name}</p>
                        <p className="text-sm text-muted-foreground">{perfume.brand}</p>
                      </div>
                      <Plus className="h-5 w-5 text-primary" />
                    </button>
                  ))}
                  {filteredAvailable.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      {searchQuery ? t("collection.noResults") : t("collection.allInCollection")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}

export function Loading() {
  return null
}


export const Route = createFileRoute("/collection")({
  component: CollectionPage,
});
