
import Link from "@/lib/next-shim"
import { useAppStore } from "@/lib/store"
import { useT } from "@/lib/i18n"
import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const allCommunities = [
  {
    id: "1",
    name: "Amantes del Oud",
    members: 12500,
    description: "Comunidad dedicada a los amantes del oud y las fragancias orientales",
    image: "/oud-wood-chips-display.jpg",
    category: "Fragancias Orientales",
  },
  {
    id: "2",
    name: "Coleccionistas Niche",
    members: 8300,
    description: "Para los que aprecian las fragancias de nicho y exclusivas",
    image: "/luxury-perfume-collection-display-oud.jpg",
    category: "Coleccionismo",
  },
  {
    id: "3",
    name: "Tom Ford Enthusiasts",
    members: 15200,
    description: "Fans de la marca Tom Ford y todas sus creaciones olfativas",
    image: "/tom-ford-oud-wood-perfume.jpg",
    category: "Marcas",
  },
  {
    id: "4",
    name: "Perfumistas Artesanales",
    members: 4500,
    description: "Aprende sobre la creacion de perfumes y tecnicas artesanales",
    image: "/perfume-workshop-artisan.jpg",
    category: "Educacion",
  },
  {
    id: "5",
    name: "Fragancias del Medio Oriente",
    members: 9800,
    description: "Explora las tradiciones perfumisticas de Arabia y mas alla",
    image: "/dubai-perfume-souq.jpg",
    category: "Regional",
  },
  {
    id: "6",
    name: "Reviews & Recomendaciones",
    members: 22000,
    description: "Comparte tus opiniones y descubre nuevas fragancias",
    image: "/luxury-perfume-display-banner.jpg",
    category: "Reviews",
  },
]

export function ProfileCommunities() {
  const t = useT()
  const { joinedCommunities, leaveCommunity } = useAppStore()

  const myCommunities = allCommunities.filter((c) => joinedCommunities.includes(c.id))

  if (myCommunities.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{t("profile.communitiesNoneTitle")}</h3>
        <p className="text-muted-foreground mb-6">{t("profile.communitiesNoneDesc")}</p>
        <Button asChild className="bg-gold hover:bg-brown-intense">
          <Link href="/community">{t("profile.communitiesExplore")}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl font-semibold text-foreground">
          {t("profile.communitiesMyTitle")} ({myCommunities.length})
        </h2>
        <Button variant="outline" asChild className="border-gold text-gold hover:bg-gold/10 bg-transparent">
          <Link href="/community">{t("profile.communitiesViewAll")}</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myCommunities.map((community) => (
          <div
            key={community.id}
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
          >
            <Link href={`/community/${community.id}`} className="block">
              <div className="h-32 relative">
                <img
                  src={community.image || "/placeholder.svg"}
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 px-2 py-1 bg-dark-brown/80 text-white text-xs rounded-full">
                  {community.category}
                </span>
              </div>
              <div className="p-4 pb-2">
                <h3 className="font-semibold text-foreground mb-1">{community.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{community.description}</p>
              </div>
            </Link>
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {community.members.toLocaleString()} {t("profile.communitiesMembers")}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-500 hover:bg-red-50 bg-transparent"
                  onClick={() => leaveCommunity(community.id)}
                >
                  {t("profile.communitiesLeave")}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
