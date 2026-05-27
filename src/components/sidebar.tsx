
import { Home, Store, Users, Bookmark, Award, MessageCircle, LogIn, User, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { useT, useRoleT } from "@/lib/i18n"
import { UserAvatar } from "@/components/user-avatar"

export function Sidebar() {
  const { isGuest, isAuthenticated, authUser, userProfile, posts, followingUsers } = useAppStore()
  const t = useT()
  const rt = useRoleT()

  const menuItems = [
    { icon: Home, label: t("nav.home"), href: "/", active: true },
    { icon: Store, label: t("nav.shop"), href: "/shop" },
    { icon: Users, label: t("nav.community"), href: "/community" },
    { icon: MessageCircle, label: t("nav.messages"), href: "/messages", requiresAuth: true },
    { icon: Bookmark, label: t("nav.saved"), href: "/profile?tab=saved", requiresAuth: true },
    { icon: Award, label: t("nav.myCollection"), href: "/collection", requiresAuth: true },
    { icon: User, label: t("nav.profile"), href: "/profile", requiresAuth: true },
    { icon: Settings, label: t("nav.settings"), href: "/settings", requiresAuth: true },
  ]

  const userPostCount = posts.filter((p) => p.author.username === (authUser?.username || userProfile.username)).length
  const followingCount = followingUsers.length
  const followersCount = 0

  // Filtrar items que requieren autenticacion si es invitado
  const visibleMenuItems = isGuest 
    ? menuItems.filter(item => !item.requiresAuth)
    : menuItems

  return (
    <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">

      {/* Mostrar perfil solo si esta autenticado */}
      {isAuthenticated && (
        <div className="bg-gradient-to-br from-beige-light to-secondary/50 rounded-3xl p-5 border border-beige/50 mb-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-full overflow-hidden ring-2 ring-gold ring-offset-2 ring-offset-beige-light">
              <UserAvatar src={authUser?.avatar || userProfile.avatar} alt="Avatar" className="h-full w-full" />
            </div>
            <div>
              <p className="font-semibold text-dark-brown">{authUser?.name || userProfile.name}</p>
              <p className="text-sm text-brown-intense">{authUser?.username || userProfile.username}</p>
            </div>
          </div>

          {/* User Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {userProfile.tags.map((tag) => (
              <span key={tag} className="px-3 py-1.5 bg-gradient-to-r from-gold to-gold-dark text-white text-xs rounded-full font-medium shadow-sm">
                {rt(tag)}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gradient-to-br from-white/80 to-white/40 rounded-2xl py-3">
              <p className="font-semibold text-dark-brown">{userPostCount}</p>
              <p className="text-xs text-brown-intense">{t("side.posts")}</p>
            </div>
            <div className="bg-gradient-to-br from-white/80 to-white/40 rounded-2xl py-3">
              <p className="font-semibold text-dark-brown">{followersCount}</p>
              <p className="text-xs text-brown-intense">{t("side.followers")}</p>
            </div>
            <div className="bg-gradient-to-br from-white/80 to-white/40 rounded-2xl py-3">
              <p className="font-semibold text-dark-brown">{followingCount}</p>
              <p className="text-xs text-brown-intense">{t("side.following")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mostrar boton de registro si es invitado */}
      {isGuest && (
        <div className="bg-gradient-to-br from-beige-light to-secondary/50 rounded-3xl p-5 border border-beige/50 mb-6 shadow-lg">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center mx-auto mb-3">
              <LogIn className="h-8 w-8 text-gold" />
            </div>
            <h3 className="font-semibold text-dark-brown mb-2">{t("menu.guest")}</h3>
            <p className="text-sm text-brown-intense mb-4">{t("menu.guestSidebar")}</p>
            <a
              href="/auth"
              className="block w-full py-2.5 bg-gradient-to-r from-gold to-gold-dark text-white rounded-2xl font-medium text-sm hover:from-gold-light hover:to-gold transition-all"
            >
              {t("auth.createAccount")}
            </a>
          </div>
        </div>
      )}

      <nav className="bg-gradient-to-br from-white to-beige-light/50 rounded-3xl border border-beige/50 overflow-hidden shadow-lg">
        <ul>
          {visibleMenuItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-dark-brown hover:bg-beige-light hover:text-brown-intense transition-colors",
                  item.active && "bg-gold/10 text-gold border-l-3 border-gold font-medium",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
