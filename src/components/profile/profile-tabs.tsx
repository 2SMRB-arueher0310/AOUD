import { useEffect, useState } from "react"
import { Grid3X3, Bookmark, Award, Heart, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n"
import { ProfilePosts } from "@/components/profile/profile-posts"
import { ProfileCollection } from "@/components/profile/profile-collection"
import { ProfileSaved } from "@/components/profile/profile-saved"
import { ProfileLikes } from "@/components/profile/profile-likes"
import { ProfileCommunities } from "@/components/profile/profile-communities"

export function ProfileTabs() {
  const t = useT()
  const tabs = [
    { id: "posts", label: t("profile.posts"), icon: Grid3X3 },
    { id: "collection", label: t("profile.collection"), icon: Award },
    { id: "communities", label: t("profile.communities"), icon: Users },
    { id: "saved", label: t("profile.saved"), icon: Bookmark },
    { id: "likes", label: t("profile.likes"), icon: Heart },
  ]

  const [activeTab, setActiveTab] = useState("posts")

  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const tab = params.get("tab")
    if (tab && tabs.some((t) => t.id === tab)) {
      setActiveTab(tab)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex border-b border-border mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
            )}
          >
            {tab.icon && <tab.icon className="h-4 w-4" />}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div>
        {activeTab === "posts" && <ProfilePosts />}
        {activeTab === "collection" && <ProfileCollection />}
        {activeTab === "communities" && <ProfileCommunities />}
        {activeTab === "saved" && <ProfileSaved />}
        {activeTab === "likes" && <ProfileLikes />}
      </div>
    </div>
  )
}
