
import { Users, MessageSquare, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const quickCommunities = [
  {
    id: "1",
    name: "Amantes del Oud",
    members: 12500,
    image: "/oud-wood-chips-display.jpg",
    isJoined: true,
  },
  {
    id: "2",
    name: "Coleccionistas Niche",
    members: 8300,
    image: "/luxury-perfume-collection-display-oud.jpg",
    isJoined: false,
  },
  {
    id: "3",
    name: "Tom Ford Enthusiasts",
    members: 15200,
    image: "/tom-ford-oud-wood-perfume.jpg",
    isJoined: true,
  },
]

const recentDiscussions = [
  { title: "¿Cuál es tu fragancia signature?", replies: 234, category: "General" },
  { title: "Mejores ouds por menos de 200€", replies: 156, category: "Recomendaciones" },
  { title: "Comparativa: Oud Wood vs Royal Oud", replies: 89, category: "Reviews" },
]

const upcomingEvents = [
  { title: "Cata Virtual de Amouage", date: "15 Feb", attendees: 156 },
  { title: "Encuentro Coleccionistas Madrid", date: "22 Feb", attendees: 42 },
]

export function CommunityPreview() {
  return (
    <div className="space-y-6">
      {/* Communities to Join */}
      <div className="bg-white rounded-xl p-6 border border-beige shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-semibold text-dark-brown">Comunidades</h2>
          <a href="/community" className="text-gold text-sm font-medium flex items-center gap-1 hover:text-brown-intense">
            Ver todas <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="space-y-4">
          {quickCommunities.map((community) => (
            <div key={community.id} className="flex items-center gap-4">
              <img
                src={community.image || "/placeholder.svg"}
                alt={community.name}
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-dark-brown truncate">{community.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {community.members.toLocaleString()} miembros
                </p>
              </div>
              <Button
                variant={community.isJoined ? "outline" : "default"}
                size="sm"
                className={community.isJoined ? "border-gold text-gold hover:bg-gold/10 bg-transparent" : "bg-gold hover:bg-brown-intense"}
              >
                {community.isJoined ? "Unido" : "Unirse"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Discussions */}
      <div className="bg-white rounded-xl p-6 border border-beige shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-semibold text-dark-brown">Discusiones Recientes</h2>
          <a href="/community" className="text-gold text-sm font-medium flex items-center gap-1 hover:text-brown-intense">
            Ver más <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="space-y-3">
          {recentDiscussions.map((discussion, index) => (
            <a
              key={index}
              href="/community"
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-beige-light transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-5 w-5 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-dark-brown text-sm truncate">{discussion.title}</h4>
                <p className="text-xs text-muted-foreground">{discussion.replies} respuestas · {discussion.category}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl p-6 border border-beige shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-semibold text-dark-brown flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gold" />
            Próximos Eventos
          </h2>
          <a href="/community" className="text-gold text-sm font-medium flex items-center gap-1 hover:text-brown-intense">
            Ver todos <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="p-4 bg-beige-light rounded-lg">
              <h4 className="font-medium text-dark-brown">{event.title}</h4>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted-foreground">{event.date}</span>
                <span className="text-sm text-gold">{event.attendees} asistentes</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-dark-brown to-brown-intense rounded-xl p-6 text-white text-center">
        <h2 className="font-serif text-xl font-semibold mb-2">Únete a la comunidad</h2>
        <p className="text-beige/90 mb-4">Conecta con otros amantes de las fragancias y comparte tu pasión.</p>
        <a href="/community">
          <Button className="bg-gold hover:bg-white hover:text-dark-brown text-dark-brown">
            Explorar Comunidades
          </Button>
        </a>
      </div>
    </div>
  )
}
