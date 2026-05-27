import { createFileRoute } from "@tanstack/react-router";

import { useSearchParams } from "@/lib/next-shim"
import { Suspense, useMemo } from "react"
import { Header } from "@/components/header"
import { MobileMenu } from "@/components/mobile-menu"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { useAppStore } from "@/lib/store"
import { Search, User, Star, Package, Tag, ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const filter = searchParams.get("filter") || "all"

  const { users, perfumes, posts, addToCart, toggleCart } = useAppStore()

  // Filter results based on query
  const filteredUsers = useMemo(() => {
    if (!query) return users
    const q = query.toLowerCase()
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(q) ||
        user.username.toLowerCase().includes(q) ||
        user.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        user.bio.toLowerCase().includes(q)
    )
  }, [users, query])

  const filteredPerfumes = useMemo(() => {
    if (!query) return perfumes
    const q = query.toLowerCase()
    return perfumes.filter(
      (perfume) =>
        perfume.name.toLowerCase().includes(q) ||
        perfume.brand.toLowerCase().includes(q) ||
        perfume.category.toLowerCase().includes(q) ||
        perfume.notes.some((note) => note.toLowerCase().includes(q))
    )
  }, [perfumes, query])

  // Get unique brands from perfumes
  const filteredBrands = useMemo(() => {
    if (!query) return []
    const q = query.toLowerCase()
    const brandSet = new Set(perfumes.map((p) => p.brand))
    return Array.from(brandSet)
      .filter((brand) => brand.toLowerCase().includes(q))
      .map((brand) => ({
        name: brand,
        perfumeCount: perfumes.filter((p) => p.brand === brand).length,
        image: perfumes.find((p) => p.brand === brand)?.image || "",
      }))
  }, [perfumes, query])

  // Get tags from posts
  const filteredTags = useMemo(() => {
    if (!query) return []
    const q = query.toLowerCase()
    const allTags = posts.flatMap((post) => post.author.tags)
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return Object.entries(tagCounts)
      .filter(([tag]) => tag.toLowerCase().includes(q))
      .map(([tag, count]) => ({ tag, count }))
  }, [posts, query])

  const showUsers = filter === "all" || filter === "users"
  const showPerfumes = filter === "all" || filter === "perfumes"
  const showBrands = filter === "all" || filter === "brands"
  const showTags = filter === "all" || filter === "tags"

  const hasResults =
    (showUsers && filteredUsers.length > 0) ||
    (showPerfumes && filteredPerfumes.length > 0) ||
    (showBrands && filteredBrands.length > 0) ||
    (showTags && filteredTags.length > 0)

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <Search className="h-6 w-6 text-primary" />
          <h1 className="font-serif text-2xl font-bold text-foreground">
            {query ? `Resultados para "${query}"` : "Buscar"}
          </h1>
        </div>
        <p className="text-muted-foreground">
          Filtro: {filter === "all" ? "Todos" : filter === "users" ? "Usuarios" : filter === "perfumes" ? "Perfumes" : "Etiquetas"}
        </p>
      </div>

      {!query && (
        <div className="bg-card rounded-xl p-12 border border-border shadow-sm text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-serif text-xl font-semibold text-foreground mb-2">Escribe algo para buscar</h2>
          <p className="text-muted-foreground">Puedes buscar usuarios, perfumes o etiquetas.</p>
        </div>
      )}

      {query && !hasResults && (
        <div className="bg-card rounded-xl p-12 border border-border shadow-sm text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-serif text-xl font-semibold text-foreground mb-2">No se encontraron resultados</h2>
          <p className="text-muted-foreground">Intenta con otros términos de búsqueda o cambia el filtro.</p>
        </div>
      )}

      {/* Users Results */}
      {showUsers && filteredUsers.length > 0 && (
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Usuarios ({filteredUsers.length})
          </h2>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <a
                key={user.id}
                href={`/user/${user.username.slice(1)}`}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted transition-colors"
              >
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/30"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.username} · {user.followers.toLocaleString()} seguidores</p>
                  <p className="text-sm text-muted-foreground truncate">{user.bio}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-foreground">{user.perfumeCount}</p>
                  <p className="text-xs text-muted-foreground">perfumes</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Perfumes Results */}
      {showPerfumes && filteredPerfumes.length > 0 && (
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Perfumes ({filteredPerfumes.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPerfumes.map((perfume) => (
              <div
                key={perfume.id}
                className="border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow hover:border-primary/50 flex flex-col"
              >
                <img
                  src={perfume.image || "/placeholder.svg"}
                  alt={perfume.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-sm text-primary font-medium">{perfume.brand}</p>
                  <h3 className="font-semibold text-foreground">{perfume.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{perfume.category} · {perfume.size}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="text-sm">{perfume.rating}</span>
                      <span className="text-xs text-muted-foreground">({perfume.reviews})</span>
                    </div>
                    <span className="font-bold text-foreground">€{perfume.price}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                      onClick={() => {
                        addToCart({
                          id: perfume.id,
                          name: perfume.name,
                          brand: perfume.brand,
                          price: perfume.price,
                          image: perfume.image,
                          size: perfume.size,
                        })
                        toggleCart()
                      }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Añadir al Carrito
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-border bg-transparent gap-2"
                      asChild
                    >
                      <a href={`/shop/${perfume.id}`}>
                        <Eye className="h-4 w-4" />
                        Ver Detalles
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Tags Results */}
      {showTags && filteredTags.length > 0 && (
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Etiquetas ({filteredTags.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {filteredTags.map(({ tag, count }) => (
              <a
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}&filter=users`}
                className="px-4 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors flex items-center gap-2"
              >
                <span>{tag}</span>
                <span className="text-xs bg-primary/20 px-2 py-0.5 rounded-full">{count}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MobileMenu />
      <CartSidebar />

      <main className="flex-1 container mx-auto px-4 py-6 pb-24 lg:pb-6 max-w-4xl">
        <Suspense fallback={<div className="text-center py-12">Cargando...</div>}>
          <SearchResults />
        </Suspense>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}


export const Route = createFileRoute("/search")({
  component: SearchPage,
});
