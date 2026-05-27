
import { ChevronDown, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { useT } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { useState } from "react"

const brands = [
  "Acqua di Parma","Amouage","Byredo","Creed","Dior","Ex Nihilo","Floris London","Guerlain",
  "Histoires de Parfums","Initio","Jo Malone","Kilian","Le Labo","Maison Francis Kurkdjian",
  "Nasomatto","Ormonde Jayne","Parfums de Marly","Quelques Fleurs","Roja Parfums","Serge Lutens",
  "Tom Ford","Ulrich Lang","Van Cleef & Arpels","Widian","Xerjoff","Yves Saint Laurent","Zoologist",
]

const categoryKeys = [
  { value: "Oud", key: "cat.oud" },
  { value: "Oriental", key: "cat.oriental" },
  { value: "Floral", key: "cat.floral" },
  { value: "Amaderado", key: "cat.woody" },
  { value: "Fresco", key: "cat.fresh" },
  { value: "Especiado", key: "cat.spicy" },
  { value: "Animalístico", key: "cat.animalic" },
]

const priceRanges = [
  { labelKey: "filters.priceUnder", min: 0, max: 200 },
  { labelKey: "filters.priceRange1", min: 200, max: 300 },
  { labelKey: "filters.priceRange2", min: 300, max: 400 },
  { labelKey: "filters.priceOver", min: 400, max: 9999 },
]

export function ShopFilters() {
  const t = useT()
  const { shopFilters, setShopFilters, clearShopFilters } = useAppStore()
  const [openSections, setOpenSections] = useState({
    brands: true,
    categories: true,
    price: true,
  })

  const toggleBrand = (brand: string) => {
    const newBrands = shopFilters.brands.includes(brand)
      ? shopFilters.brands.filter((b) => b !== brand)
      : [...shopFilters.brands, brand]
    setShopFilters({ brands: newBrands })
  }

  const toggleCategory = (category: string) => {
    const newCategories = shopFilters.categories.includes(category)
      ? shopFilters.categories.filter((c) => c !== category)
      : [...shopFilters.categories, category]
    setShopFilters({ categories: newCategories })
  }

  const setPriceRange = (index: number) => {
    const range = priceRanges[index]
    if (shopFilters.priceRange?.min === range.min && shopFilters.priceRange?.max === range.max) {
      setShopFilters({ priceRange: null })
    } else {
      setShopFilters({ priceRange: { min: range.min, max: range.max } })
    }
  }

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const hasFilters = shopFilters.brands.length > 0 || shopFilters.categories.length > 0 || shopFilters.priceRange !== null

  const translateCategory = (val: string) => {
    const item = categoryKeys.find((c) => c.value === val)
    if (!item) return val
    const tr = t(item.key)
    return tr === item.key ? val : tr
  }

  return (
    <div className="bg-gradient-to-br from-card to-secondary/20 rounded-3xl border border-border/50 p-5 sticky top-24 shadow-lg max-h-[calc(100vh-7rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-lg font-semibold text-foreground">{t("filters.title")}</h2>
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={clearShopFilters}>
            {t("filters.clear")}
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-border">
          {shopFilters.brands.map((brand) => (
            <span
              key={brand}
              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1 cursor-pointer hover:bg-primary/20"
              onClick={() => toggleBrand(brand)}
            >
              {brand}
              <span className="ml-1">×</span>
            </span>
          ))}
          {shopFilters.categories.map((category) => (
            <span
              key={category}
              className="px-2 py-1 bg-secondary/50 text-secondary-foreground text-xs rounded-full flex items-center gap-1 cursor-pointer hover:bg-secondary/70"
              onClick={() => toggleCategory(category)}
            >
              {translateCategory(category)}
              <span className="ml-1">×</span>
            </span>
          ))}
          {shopFilters.priceRange && (
            <span
              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full flex items-center gap-1 cursor-pointer hover:bg-muted/80"
              onClick={() => setShopFilters({ priceRange: null })}
            >
              {t(priceRanges.find(r => r.min === shopFilters.priceRange?.min)?.labelKey || "")}
              <span className="ml-1">×</span>
            </span>
          )}
        </div>
      )}

      {/* Brands */}
      <div className="border-t border-border pt-4">
        <button
          className="flex items-center justify-between w-full text-left mb-3"
          onClick={() => toggleSection("brands")}
        >
          <span className="font-medium text-foreground">{t("filters.brands")}</span>
          <ChevronDown
            className={cn("h-4 w-4 text-muted-foreground transition-transform", openSections.brands && "rotate-180")}
          />
        </button>
        {openSections.brands && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={shopFilters.brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="rounded border-border text-primary focus:ring-primary bg-muted"
                />
                <span className={cn(
                  "text-sm transition-colors",
                  shopFilters.brands.includes(brand) ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {brand}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="border-t border-border pt-4 mt-4">
        <button
          className="flex items-center justify-between w-full text-left mb-3"
          onClick={() => toggleSection("categories")}
        >
          <span className="font-medium text-foreground">{t("filters.categories")}</span>
          <ChevronDown
            className={cn("h-4 w-4 text-muted-foreground transition-transform", openSections.categories && "rotate-180")}
          />
        </button>
        {openSections.categories && (
          <div className="flex flex-wrap gap-2">
            {categoryKeys.map((category) => (
              <button
                key={category.value}
                onClick={() => toggleCategory(category.value)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm border-2 transition-all",
                  shopFilters.categories.includes(category.value)
                    ? "bg-gradient-to-r from-primary to-gold-dark text-primary-foreground border-transparent shadow-md"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5",
                )}
              >
                {translateCategory(category.value)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="border-t border-border pt-4 mt-4">
        <button
          className="flex items-center justify-between w-full text-left mb-3"
          onClick={() => toggleSection("price")}
        >
          <span className="font-medium text-foreground">{t("filters.price")}</span>
          <ChevronDown
            className={cn("h-4 w-4 text-muted-foreground transition-transform", openSections.price && "rotate-180")}
          />
        </button>
        {openSections.price && (
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="price"
                  checked={shopFilters.priceRange?.min === range.min && shopFilters.priceRange?.max === range.max}
                  onChange={() => setPriceRange(index)}
                  className="rounded-full border-border text-primary focus:ring-primary bg-muted"
                />
                <span className={cn(
                  "text-sm transition-colors",
                  shopFilters.priceRange?.min === range.min ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {t(range.labelKey)}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
