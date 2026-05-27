
import { DialogTitle } from "@/components/ui/dialog"
import { DialogHeader } from "@/components/ui/dialog"
import { DialogContent } from "@/components/ui/dialog"
import { Dialog } from "@/components/ui/dialog"
import { useMemo, useState } from "react"
import Link from "@/lib/next-shim"
import { Star, ShoppingCart, Heart, ChevronDown, Eye, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { useT } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { GuestRestrictionModal } from "@/components/guest-restriction-modal"
import { toast } from "sonner"

const sortOptions = [
  { value: "featured", labelKey: "sort.featured" },
  { value: "newest", labelKey: "sort.newest" },
  { value: "price-asc", labelKey: "sort.priceAsc" },
  { value: "price-desc", labelKey: "sort.priceDesc" },
  { value: "rating", labelKey: "sort.rating" },
]

export function ProductGrid() {
  const t = useT()
  const { perfumes, shopFilters, setShopFilters, addToCart, toggleCart, isGuest, addToCollection } = useAppStore()
  const [wishlist, setWishlist] = useState<string[]>([])
  const [selectedProduct, setSelectedProduct] = useState<typeof perfumes[0] | null>(null)
  const [showGuestModal, setShowGuestModal] = useState(false)

  const toggleWishlist = (id: string) => {
    if (isGuest) {
      setShowGuestModal(true)
      return
    }
    setWishlist((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleAddToCart = (product: typeof perfumes[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      size: product.size,
    })
    toggleCart()
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...perfumes]

    // Filter by brands
    if (shopFilters.brands.length > 0) {
      result = result.filter((p) => shopFilters.brands.includes(p.brand))
    }

    // Filter by categories
    if (shopFilters.categories.length > 0) {
      result = result.filter((p) => shopFilters.categories.includes(p.category))
    }

    // Filter by price range
    if (shopFilters.priceRange) {
      result = result.filter(
        (p) => p.price >= shopFilters.priceRange!.min && p.price <= shopFilters.priceRange!.max
      )
    }

    // Sort
    switch (shopFilters.sortBy) {
      case "newest":
        result = result.filter((p) => p.new).concat(result.filter((p) => !p.new))
        break
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "featured":
      default:
        result = result.filter((p) => p.bestseller).concat(result.filter((p) => !p.bestseller))
        break
    }

    return result
  }, [perfumes, shopFilters])

  return (
    <>
      <GuestRestrictionModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        action="guardar en tu lista de deseos"
      />
      <div id="products">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground">{t("shop.allProducts")}</h2>
            <p className="text-sm text-muted-foreground">{filteredProducts.length} {t("shop.products")}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border bg-gradient-to-r from-card to-secondary/30 gap-2 rounded-full px-5 hover:from-muted hover:to-secondary/50">
                {t("sort.label")}: {t(sortOptions.find((o) => o.value === shopFilters.sortBy)?.labelKey || "sort.featured")}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-border">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setShopFilters({ sortBy: option.value })}
                  className={cn(
                    "cursor-pointer hover:bg-muted",
                    shopFilters.sortBy === option.value && "bg-muted text-primary"
                  )}
                >
                  {t(option.labelKey)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* No results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">{t("shop.noResults")}</p>
            <Button variant="outline" onClick={() => useAppStore.getState().clearShopFilters()}>
              {t("shop.clearFilters")}
            </Button>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gradient-to-br from-card to-secondary/20 rounded-3xl border border-border/50 overflow-hidden group hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.bestseller && (
                    <span className="px-3 py-1.5 bg-gradient-to-r from-primary to-gold-dark text-primary-foreground text-xs font-medium rounded-full shadow-md">
                      {t("shop.bestseller")}
                    </span>
                  )}
                  {product.new && (
                    <span className="px-3 py-1.5 bg-gradient-to-r from-secondary to-beige text-secondary-foreground text-xs font-medium rounded-full shadow-md">
                      {t("shop.newBadge")}
                    </span>
                  )}
                  {product.exclusive && (
                    <span className="px-3 py-1.5 bg-gradient-to-r from-foreground to-brown-medium text-background text-xs font-medium rounded-full shadow-md">{t("shop.exclusiveBadge")}</span>
                  )}
                  {product.originalPrice && (
                    <span className="px-3 py-1.5 bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground text-xs font-medium rounded-full shadow-md">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={cn(
                    "absolute top-3 right-3 h-10 w-10 rounded-full bg-background/90 backdrop-blur-md flex items-center justify-center transition-all shadow-lg hover:scale-110",
                    wishlist.includes(product.id) ? "text-red-500" : "text-muted-foreground hover:text-red-500",
                  )}
                >
                  <Heart className={cn("h-5 w-5", wishlist.includes(product.id) && "fill-current")} />
                </button>

                {/* Quick Add - Desktop (hover) */}
                <div className="hidden md:flex absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex-col gap-2">
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-gold-dark text-primary-foreground hover:from-primary/90 hover:to-gold-dark/90 gap-2 rounded-2xl shadow-lg"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {t("shop.addToCartLong")}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-border bg-background/95 backdrop-blur-md hover:bg-background gap-2 rounded-2xl"
                      asChild
                    >
                      <Link href={`/shop/${product.id}`}>
                        <Eye className="h-4 w-4" />
                        {t("shop.viewDetails")}
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-border bg-background/95 backdrop-blur-md hover:bg-background gap-2 rounded-2xl"
                      onClick={() => {
                        if (isGuest) { setShowGuestModal(true); return }
                        addToCollection(product.id)
                        toast.success(t("shop.addedToCollection"))
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      {t("shop.addToCollection")}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                {/* Mobile Action Buttons */}
                <div className="flex md:hidden gap-2 mb-3">
                  <Button
                    className="flex-1 bg-gradient-to-r from-primary to-gold-dark text-primary-foreground hover:from-primary/90 hover:to-gold-dark/90 gap-2 rounded-2xl shadow-lg text-sm py-2"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {t("shop.addToCartShort")}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-border bg-transparent gap-2 rounded-2xl text-sm py-2"
                    asChild
                  >
                    <Link href={`/shop/${product.id}`}>
                      <Eye className="h-4 w-4" />
                      {t("shop.viewDetails")}
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{product.brand}</p>
                <h3 className="font-semibold text-foreground mb-1">{product.name}</h3>

                {/* Category tag */}
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-muted to-secondary/50 text-muted-foreground text-xs rounded-full mb-2">
                  {product.category}
                </span>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3.5 w-3.5",
                          i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-muted-foreground",
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-serif text-xl font-bold text-primary">€{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">€{product.originalPrice}</span>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">{product.size}</span>
                </div>

                {/* Notes */}
                <div className="flex flex-wrap gap-1.5">
                  {product.notes.slice(0, 3).map((note, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gradient-to-r from-primary/10 to-primary/5 text-primary text-xs rounded-full border border-primary/20"
                    >
                      {note}
                    </span>
                  ))}
                  {product.notes.length > 3 && (
                    <span className="px-2 py-1 text-muted-foreground text-xs">
                      +{product.notes.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {filteredProducts.length > 0 && (
          <div className="flex justify-center mt-10">
            <Button variant="outline" className="border-2 border-border bg-transparent hover:bg-gradient-to-r hover:from-muted hover:to-secondary/50 rounded-full px-8 py-6 text-lg font-medium transition-all hover:scale-105 hover:border-primary/50">
              {t("shop.loadMore")}
            </Button>
          </div>
        )}

        {/* Product Detail Modal */}
        <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
          <DialogContent className="max-w-3xl bg-gradient-to-br from-card to-secondary/20 border-border/50 p-0 overflow-hidden rounded-3xl shadow-2xl">
            {selectedProduct && (
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="relative w-full md:w-1/2 aspect-square">
                  <img
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {selectedProduct.bestseller && (
                      <span className="px-4 py-1.5 bg-gradient-to-r from-primary to-gold-dark text-primary-foreground text-sm font-medium rounded-full shadow-lg">
                        Bestseller
                      </span>
                    )}
                    {selectedProduct.new && (
                      <span className="px-4 py-1.5 bg-gradient-to-r from-secondary to-beige text-secondary-foreground text-sm font-medium rounded-full shadow-lg">
                        Nuevo
                      </span>
                    )}
                    {selectedProduct.exclusive && (
                      <span className="px-4 py-1.5 bg-gradient-to-r from-foreground to-brown-medium text-background text-sm font-medium rounded-full shadow-lg">
                        Exclusivo
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="w-full md:w-1/2 p-6 flex flex-col">
                  <DialogHeader className="text-left mb-4">
                    <p className="text-sm text-muted-foreground uppercase tracking-wider">{selectedProduct.brand}</p>
                    <DialogTitle className="font-serif text-2xl font-semibold text-foreground">
                      {selectedProduct.name}
                    </DialogTitle>
                  </DialogHeader>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < Math.floor(selectedProduct.rating) ? "text-primary fill-primary" : "text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {selectedProduct.rating} ({selectedProduct.reviews} reseñas)
                    </span>
                  </div>

                  {/* Category */}
                  <div className="mb-4">
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-muted to-secondary/50 text-muted-foreground text-sm rounded-full">
                      {selectedProduct.category}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4 flex-grow">{selectedProduct.description}</p>

                  {/* Notes */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Notas Olfativas</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.notes.map((note, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/20 text-primary text-sm rounded-full border border-primary/20"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Tamaño</h4>
                    <span className="px-5 py-2.5 border-2 border-primary bg-primary/10 rounded-2xl text-primary font-medium inline-block">
                      {selectedProduct.size}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-serif text-3xl font-bold bg-gradient-to-r from-primary to-gold-dark bg-clip-text text-transparent">€{selectedProduct.price}</span>
                    {selectedProduct.originalPrice && (
                      <>
                        <span className="text-lg text-muted-foreground line-through">€{selectedProduct.originalPrice}</span>
                        <span className="px-3 py-1.5 bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground text-sm font-medium rounded-full shadow-md">
                          -{Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}%
                        </span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-gradient-to-r from-primary to-gold-dark text-primary-foreground hover:from-primary/90 hover:to-gold-dark/90 gap-2 rounded-2xl shadow-lg"
                      onClick={() => {
                        handleAddToCart(selectedProduct)
                        setSelectedProduct(null)
                      }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Añadir al Carrito
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "border-border bg-transparent rounded-2xl h-12 w-12",
                        wishlist.includes(selectedProduct.id) ? "text-red-500 border-red-500" : "text-muted-foreground hover:text-red-500 hover:border-red-500"
                      )}
                      onClick={() => toggleWishlist(selectedProduct.id)}
                    >
                      <Heart className={cn("h-5 w-5", wishlist.includes(selectedProduct.id) && "fill-current")} />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
