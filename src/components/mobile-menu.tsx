
import Link from "@/lib/next-shim"
import { useRouter } from "@/lib/next-shim"
import { Home, Store, Users, User, Settings, LogOut, Globe, MapPin, Bell, Heart, MessageCircle, UserPlus, AtSign, Bookmark, Award, LogIn } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useT, availableLanguages } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"
import { useState } from "react"

const locations = ["España", "México", "Argentina", "Colombia", "Estados Unidos", "Francia"]

export function MobileMenu() {
  const router = useRouter()
  const {
    menuOpen,
    toggleMenu,
    language,
    setLanguage,
    location,
    setLocation,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    isAuthenticated,
    isGuest,
    authUser,
    userProfile,
    logout,
  } = useAppStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const unreadNotifications = notifications.filter((n) => !n.read).length
  const t = useT()
  const languages = availableLanguages

  const menuItems = [
    { icon: Home, label: t("nav.home"), href: "/" },
    { icon: Store, label: t("nav.shop"), href: "/shop" },
    { icon: Users, label: t("nav.community"), href: "/community" },
    { icon: MessageCircle, label: t("nav.messages"), href: "/messages", requiresAuth: true },
    { icon: Bookmark, label: t("nav.saved"), href: "/profile?tab=saved", requiresAuth: true },
    { icon: Award, label: t("nav.myCollection"), href: "/collection", requiresAuth: true },
    { icon: User, label: t("nav.profile"), href: "/profile", requiresAuth: true },
    { icon: Settings, label: t("nav.settings"), href: "/settings", requiresAuth: true },
  ]

  const visibleMenuItems = isAuthenticated
    ? menuItems
    : menuItems.filter((item) => !item.requiresAuth)

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

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={toggleMenu}
      />

      {/* Menu Panel */}
      <div
        className={cn(
          "fixed top-16 left-0 bottom-0 w-72 bg-card border-r border-border z-40 lg:hidden transition-transform duration-300 ease-in-out",
          menuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      src={authUser?.avatar || userProfile.avatar}
                      alt="Avatar"
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-foreground">{authUser?.name || userProfile.name}</p>
                      <p className="text-sm text-muted-foreground">{authUser?.username || userProfile.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-full hover:bg-muted transition-colors"
                  >
                    <Bell className="h-5 w-5 text-foreground" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t("menu.guest")}</p>
                    <p className="text-sm text-muted-foreground">{t("menu.guestSub")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="border-b border-border bg-muted/50 max-h-64 overflow-y-auto">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <span className="font-semibold text-foreground text-sm">{t("menu.notifsTitle")}</span>
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
                <div className="py-6 text-center text-muted-foreground text-sm">
                  {t("menu.notifsEmpty")}
                </div>
              ) : (
                notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    href={`/user/${notification.from.username.replace("@", "")}`}
                    onClick={() => {
                      markNotificationRead(notification.id)
                      toggleMenu()
                    }}
                    className={cn(
                      "flex items-start gap-3 p-3 w-full text-left hover:bg-muted transition-colors",
                      !notification.read && "bg-primary/5"
                    )}
                  >
                    <img
                      src={notification.from.avatar || "/placeholder.svg"}
                      alt={notification.from.name}
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notification.type)}
                        <span className="font-medium text-foreground text-xs">{notification.from.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{t(`notif.${notification.type}`)}</p>
                      <span className="text-xs text-muted-foreground">{notification.createdAt}</span>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    )}
                  </Link>
                ))
              )}
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {visibleMenuItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={toggleMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted hover:text-primary transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-border space-y-3">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2 border-border bg-transparent">
                  <Globe className="h-4 w-4" />
                  <span>{t("menu.langLabel")}: {language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border w-full">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className="cursor-pointer hover:bg-muted"
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Location Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2 border-border bg-transparent">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{location}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border">
                {locations.map((loc) => (
                  <DropdownMenuItem
                    key={loc}
                    onClick={() => setLocation(loc)}
                    className="cursor-pointer hover:bg-muted"
                  >
                    {loc}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Logout / Login */}
            {isAuthenticated ? (
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => {
                  logout()
                  toggleMenu()
                  router.push("/auth")
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>{t("auth.logout")}</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-primary hover:text-primary hover:bg-primary/10"
                onClick={() => {
                  toggleMenu()
                  router.push("/auth")
                }}
              >
                <LogIn className="h-4 w-4" />
                <span>{isGuest ? t("auth.createAccount") : t("auth.signIn")}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
