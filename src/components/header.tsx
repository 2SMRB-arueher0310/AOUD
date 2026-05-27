
import React from "react"

import { useState } from "react"
import { useRouter } from "@/lib/next-shim"
import Link from "@/lib/next-shim"
import { Search, ShoppingCart, Menu, X, Globe, ChevronDown, User, Bell, Heart, MessageCircle, UserPlus, AtSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useAppStore } from "@/lib/store"
import { useT, availableLanguages } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function Header() {
  const router = useRouter()
  const t = useT()
  const searchFilters = [
    { value: "all", label: t("search.all") },
    { value: "users", label: t("search.users") },
    { value: "perfumes", label: t("search.perfumes") },
    { value: "brands", label: t("search.brands") },
    { value: "tags", label: t("search.tags") },
  ]
  const languages = availableLanguages
  const {
    cartItems,
    toggleCart,
    language,
    setLanguage,
    menuOpen,
    toggleMenu,
    searchQuery,
    searchFilter,
    setSearchQuery,
    setSearchFilter,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    isGuest,
    isAuthenticated,
    authUser,
    logout,
  } = useAppStore()

  const unreadNotifications = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "comment":
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />
      case "mention":
        return <AtSign className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const [searchOpen, setSearchOpen] = useState(false)

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}&filter=${searchFilter}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#3d1f0d] via-[#4a2510] to-[#3d1f0d] border-b border-brown-intense/30 shadow-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-beige hover:text-gold hover:bg-brown-intense/30"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          {/* Logo */}
          <a href="/" className="flex items-center">
            <h1 className="font-serif text-2xl lg:text-3xl font-bold text-gold tracking-wider">AOUD</h1>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-beige hover:text-gold hover:bg-brown-intense/30 gap-1">
                  {t("nav.explore")} <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border shadow-lg">
                <DropdownMenuItem className="hover:bg-beige-light cursor-pointer text-dark-brown" asChild>
                  <a href="/feed" className="w-full">{t("nav.feed")}</a>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-beige-light cursor-pointer text-dark-brown" asChild>
                  <a href="/collections" className="w-full">{t("nav.collections")}</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <a href="/shop" className="text-beige hover:text-gold transition-colors">
              {t("nav.shop")}
            </a>

            <a href="/community" className="text-beige hover:text-gold transition-colors">
              {t("nav.community")}
            </a>

            <a href="/about" className="text-beige hover:text-gold transition-colors">
              {t("footer.aboutUs")}
            </a>
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-beige/60" />
              <Input
                type="search"
                placeholder={t("search.placeholder")}
                className="pl-10 bg-brown-intense/40 border-brown-intense/50 text-beige placeholder:text-beige/50 focus:bg-brown-intense/60 focus:border-gold rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-brown-intense/50 text-beige bg-brown-intense/40 hover:bg-brown-intense/60 hover:text-gold rounded-full"
                >
                  {searchFilters.find((f) => f.value === searchFilter)?.label}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border shadow-lg">
                {searchFilters.map((filter) => (
                  <DropdownMenuItem
                    key={filter.value}
                    onClick={() => setSearchFilter(filter.value)}
                    className={cn(
                      "cursor-pointer hover:bg-beige-light text-dark-brown",
                      searchFilter === filter.value && "bg-beige-light text-primary",
                    )}
                  >
                    {filter.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-beige hover:text-gold hover:bg-brown-intense/30"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex text-beige hover:text-gold hover:bg-brown-intense/30 gap-1"
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden md:inline">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border shadow-lg">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(
                      "cursor-pointer hover:bg-beige-light text-dark-brown",
                      language === lang.code && "bg-beige-light text-primary",
                    )}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications - Solo para usuarios autenticados */}
            {isAuthenticated && !isGuest && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-beige hover:text-gold hover:bg-brown-intense/30 relative"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-gold text-dark-brown text-xs rounded-full flex items-center justify-center font-semibold">
                        {unreadNotifications}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border w-80 shadow-lg max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                    <span className="font-semibold text-foreground">{t("menu.notifsTitle")}</span>
                    {unreadNotifications > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-primary hover:underline"
                      >
                        {t("menu.notifsMarkAll")}
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      {t("menu.notifsEmpty")}
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        asChild
                        className={cn(
                          "flex items-start gap-3 p-3 cursor-pointer",
                          !notification.read && "bg-primary/5"
                        )}
                      >
                        <Link
                          href={`/user/${notification.from.username.replace("@", "")}`}
                          onClick={() => markNotificationRead(notification.id)}
                        >
                          <img
                            src={notification.from.avatar || "/placeholder.svg"}
                            alt={notification.from.name}
                            className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {getNotificationIcon(notification.type)}
                              <span className="font-medium text-foreground text-sm">{notification.from.name}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{t(`notif.${notification.type}`)}</p>
                            <span className="text-xs text-muted-foreground">{notification.createdAt}</span>
                          </div>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="text-beige hover:text-gold hover:bg-brown-intense/30 relative"
              onClick={toggleCart}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-gold text-dark-brown text-xs rounded-full flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Profile / Login */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-beige hover:text-gold hover:bg-brown-intense/30">
                    {authUser?.avatar ? (
                      <img src={authUser.avatar || "/placeholder.svg"} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border w-48 shadow-lg">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="font-medium text-foreground text-sm truncate">{authUser?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{authUser?.username}</p>
                  </div>
                  <DropdownMenuItem className="hover:bg-beige-light cursor-pointer text-dark-brown" asChild>
                    <a href="/profile" className="w-full">{t("nav.profile")}</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-beige-light cursor-pointer text-dark-brown" asChild>
                    <a href="/messages" className="w-full">{t("nav.messages")}</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-beige-light cursor-pointer text-dark-brown" asChild>
                    <a href="/settings" className="w-full">{t("nav.settings")}</a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem 
                    className="hover:bg-beige-light cursor-pointer text-destructive"
                    onClick={() => {
                      logout()
                      router.push("/auth")
                    }}
                  >
                    {t("auth.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : isGuest ? (
              <Button
                variant="ghost"
                className="text-beige hover:text-gold hover:bg-brown-intense/30 gap-2"
                onClick={() => router.push("/auth")}
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">{t("auth.signUp")}</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="text-beige hover:text-gold hover:bg-brown-intense/30 gap-2"
                onClick={() => router.push("/auth")}
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">{t("auth.signIn")}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="lg:hidden py-3 border-t border-brown-intense/30 animate-in slide-in-from-top-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-beige/60" />
                <Input
                  type="search"
                  placeholder={t("search.placeholderShort")}
                  className="pl-10 bg-brown-intense/40 border-brown-intense/50 text-beige placeholder:text-beige/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="border-brown-intense/50 bg-brown-intense/40 hover:bg-brown-intense/60"
                  >
                    <ChevronDown className="h-4 w-4 text-beige" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border shadow-lg">
                  {searchFilters.map((filter) => (
                    <DropdownMenuItem
                      key={filter.value}
                      onClick={() => setSearchFilter(filter.value)}
                      className="cursor-pointer hover:bg-beige-light text-dark-brown"
                    >
                      {filter.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </form>
        )}
      </div>
    </header>
  )
}
