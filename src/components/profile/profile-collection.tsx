
import { Star, Plus, Trash2, ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { useT } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function ProfileCollection() {
  const t = useT()
  const { perfumes, userCollection, addToCollection, removeFromCollection, addToCart, toggleCart } = useAppStore()
  const [showAddModal, setShowAddModal] = useState(false)

  const collectionPerfumes = perfumes.filter((p) => userCollection.includes(p.id))
  const availablePerfumes = perfumes.filter((p) => !userCollection.includes(p.id))

  const handleBuy = (perfume: typeof perfumes[0]) => {
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
    <div>
      {/* Collection Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground">{t("profile.collectionMyTitle")}</h2>
          <p className="text-sm text-muted-foreground">{collectionPerfumes.length} {t("profile.collectionPerfumes")}</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          {t("profile.collectionAdd")}
        </Button>
      </div>

      {collectionPerfumes.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground mb-4">{t("profile.collectionEmpty")}</p>
          <Button onClick={() => setShowAddModal(true)} variant="outline">
            {t("profile.collectionEmptyHint")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collectionPerfumes.map((perfume) => (
            <div
              key={perfume.id}
              className="bg-card rounded-xl border border-border overflow-hidden group hover:border-primary/50 transition-colors"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={perfume.image || "/placeholder.svg"}
                  alt={perfume.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-medium text-foreground">
                  {perfume.size}
                </div>
                <button
                  onClick={() => removeFromCollection(perfume.id)}
                  className="absolute top-2 left-2 h-8 w-8 bg-destructive/90 text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">{perfume.brand}</p>
                <h3 className="font-semibold text-foreground mb-1">{perfume.name}</h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(perfume.rating) ? "text-primary fill-primary" : "text-muted-foreground",
                      )}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">({perfume.reviews})</span>
                </div>

                {/* Notes */}
                <p className="text-xs text-muted-foreground mb-3">{perfume.notes.join(", ")}</p>

                {/* Price */}
                <p className="font-serif text-lg font-bold text-primary mb-2">€{perfume.price}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                    onClick={() => handleBuy(perfume)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {t("profile.collectionAddToCart")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-border bg-transparent gap-2"
                    asChild
                  >
                    <a href={`/shop/${perfume.id}`}>
                      <Eye className="h-4 w-4" />
                      {t("profile.collectionViewDetails")}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border max-w-lg w-full max-h-[70vh] overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold">{t("profile.addModalTitle")}</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                ×
              </Button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {availablePerfumes.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  {t("profile.addModalAlreadyAll")}
                </p>
              ) : (
                <div className="space-y-2">
                  {availablePerfumes.map((perfume) => (
                    <button
                      key={perfume.id}
                      onClick={() => addToCollection(perfume.id)}
                      className="w-full p-3 flex items-center gap-3 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <img
                        src={perfume.image || "/placeholder.svg"}
                        alt={perfume.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{perfume.name}</p>
                        <p className="text-sm text-muted-foreground">{perfume.brand}</p>
                      </div>
                      <Plus className="h-5 w-5 text-primary" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
