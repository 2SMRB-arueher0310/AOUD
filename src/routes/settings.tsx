import { createFileRoute } from "@tanstack/react-router";

import { useRef, useState } from "react"
import { Header } from "@/components/header"
import { MobileMenu } from "@/components/mobile-menu"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { useT } from "@/lib/i18n"
import { User, Bell, Lock, Globe, Palette, Eye, Save, Camera, Sun, Moon, Monitor, Award, X } from "lucide-react"
import { cn } from "@/lib/utils"

const availableRoles = [
  "Amante del Oud",
  "Coleccionista",
  "Experto",
  "Reviewer",
  "Blogger",
  "YouTuber",
  "Principiante",
  "Entusiasta",
  "Vintage",
  "Influencer",
]

function SettingsPage() {
  const { userProfile, updateUserProfile, language, setLanguage, theme, setTheme } = useAppStore()
  const t = useT()
  const tabs = [
    { id: "profile", label: t("settings.profile"), icon: User },
    { id: "roles", label: "Roles", icon: Award },
    { id: "notifications", label: t("settings.notifications"), icon: Bell },
    { id: "privacy", label: t("settings.privacy"), icon: Lock },
    { id: "language", label: t("settings.language"), icon: Globe },
    { id: "appearance", label: t("settings.appearance"), icon: Palette },
  ]
  const [activeTab, setActiveTab] = useState("profile")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) return
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen debe pesar menos de 5MB")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === "string") {
        updateUserProfile({ avatar: result })
      }
    }
    reader.readAsDataURL(file)
  }
  const [formData, setFormData] = useState({
    name: userProfile.name,
    username: userProfile.username,
    bio: userProfile.bio,
    location: userProfile.location,
    website: userProfile.website,
  })
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    newProducts: false,
    newsletter: true,
  })
  const [privacy, setPrivacy] = useState({
    privateAccount: false,
    showCollection: true,
    showLikes: true,
    allowMessages: true,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateUserProfile(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MobileMenu />
      <CartSidebar />

      <main className="flex-1 pb-24 lg:pb-0">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-8">{t("settings.title")}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="bg-card rounded-xl border border-border p-2 sticky top-24">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-xl border border-border p-6">
                {/* Profile Settings */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-xl font-semibold text-foreground">{t("settings.profileInfo")}</h2>

                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="h-24 w-24 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                          {userProfile.avatar ? (
                            <img src={userProfile.avatar} alt="Avatar" className="h-full w-full object-cover" />
                          ) : (
                            <Camera className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          aria-label={t("settings.changePhoto")}
                          className="absolute bottom-0 right-0 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:opacity-90"
                        >
                          <Camera className="h-4 w-4" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </div>
                      <div>
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                          {t("settings.changePhoto")}
                        </Button>
                        {userProfile.avatar && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2"
                            onClick={() => updateUserProfile({ avatar: "" })}
                          >
                            {t("settings.removePhoto") || "Quitar foto"}
                          </Button>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">{t("settings.photoHint")}</p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">{t("settings.name")}</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-muted border-border"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">{t("settings.userField")}</label>
                        <Input
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="bg-muted border-border"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">{t("settings.bio")}</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">{t("settings.location")}</label>
                        <Input
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="bg-muted border-border"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">{t("settings.website")}</label>
                        <Input
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          className="bg-muted border-border"
                        />
                      </div>
                    </div>

                    <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Save className="h-4 w-4 mr-2" />
                      {saved ? t("settings.saved") : t("settings.save")}
                    </Button>
                  </div>
                )}

                {/* Roles Settings */}
                {activeTab === "roles" && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-xl font-semibold text-foreground">Roles del perfil</h2>
                    <p className="text-sm text-muted-foreground">
                      Selecciona hasta 4 roles. Aparecerán como etiquetas en tu perfil.
                    </p>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Roles seleccionados ({userProfile.tags.length}/4)
                      </label>
                      <div className="flex flex-wrap gap-2 mb-4 min-h-[2.5rem]">
                        {userProfile.tags.length === 0 && (
                          <span className="text-sm text-muted-foreground italic">Ningún rol asignado</span>
                        )}
                        {userProfile.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full flex items-center gap-1"
                          >
                            {tag}
                            <button
                              onClick={() =>
                                updateUserProfile({ tags: userProfile.tags.filter((t) => t !== tag) })
                              }
                              className="ml-1 hover:text-primary-foreground/80"
                              aria-label={`Quitar ${tag}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <label className="block text-sm font-medium text-foreground mb-2">Roles disponibles</label>
                      <div className="flex flex-wrap gap-2">
                        {availableRoles
                          .filter((r) => !userProfile.tags.includes(r))
                          .map((role) => (
                            <button
                              key={role}
                              onClick={() => {
                                if (userProfile.tags.length < 4) {
                                  updateUserProfile({ tags: [...userProfile.tags, role] })
                                }
                              }}
                              disabled={userProfile.tags.length >= 4}
                              className="px-3 py-1 border border-border text-muted-foreground text-sm rounded-full hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              + {role}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                )}


                {/* Notifications Settings */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-xl font-semibold text-foreground">{t("settings.notifications")}</h2>

                    <div className="space-y-4">
                      {[
                        { key: "likes", label: t("settings.notif.likes") },
                        { key: "comments", label: t("settings.notif.comments") },
                        { key: "follows", label: t("settings.notif.follows") },
                        { key: "mentions", label: t("settings.notif.mentions") },
                        { key: "newProducts", label: t("settings.notif.products") },
                        { key: "newsletter", label: t("settings.notif.newsletter") },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between p-4 bg-muted rounded-lg cursor-pointer">
                          <span className="text-foreground">{item.label}</span>
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof typeof notifications]}
                            onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                            className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Privacy Settings */}
                {activeTab === "privacy" && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-xl font-semibold text-foreground">{t("settings.privacy")}</h2>

                    <div className="space-y-4">
                      {[
                        { key: "privateAccount", label: t("settings.priv.private"), description: t("settings.priv.privateDesc") },
                        { key: "showCollection", label: t("settings.priv.collection"), description: t("settings.priv.collectionDesc") },
                        { key: "showLikes", label: t("settings.priv.likes"), description: t("settings.priv.likesDesc") },
                        { key: "allowMessages", label: t("settings.priv.messages"), description: t("settings.priv.messagesDesc") },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between p-4 bg-muted rounded-lg cursor-pointer">
                          <div>
                            <span className="text-foreground font-medium">{item.label}</span>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacy[item.key as keyof typeof privacy]}
                            onChange={(e) => setPrivacy({ ...privacy, [item.key]: e.target.checked })}
                            className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Language Settings */}
                {activeTab === "language" && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-xl font-semibold text-foreground">{t("settings.language")}</h2>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">{t("settings.languageField")}</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="ES">Español</option>
                        <option value="EN">English</option>
                        <option value="FR">Français</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">{t("settings.currency")}</label>
                      <select className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="GBP">British Pound (£)</option>
                        <option value="AED">UAE Dirham (AED)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeTab === "appearance" && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-xl font-semibold text-foreground">{t("settings.appearance")}</h2>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-4">{t("settings.theme")}</label>
                      <div className="grid grid-cols-3 gap-4">
                        {([
                          { value: "light", label: t("settings.themeLight"), icon: Sun },
                          { value: "dark", label: t("settings.themeDark"), icon: Moon },
                          { value: "system", label: t("settings.themeSystem"), icon: Monitor },
                        ] as const).map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setTheme(opt.value)}
                            className={cn(
                              "p-4 rounded-lg border-2 transition-colors text-center",
                              theme === opt.value
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <opt.icon className="h-6 w-6 mx-auto mb-2 text-foreground" />
                            <span className="text-sm font-medium text-foreground">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}


export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});
