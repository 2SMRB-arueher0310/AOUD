
import { Heart, MessageCircle } from "lucide-react"

const userPosts = [
  {
    id: "1",
    image: "/amouage-interlude-perfume-bottle-luxury.jpg",
    likes: 234,
    comments: 45,
  },
  {
    id: "2",
    image: "/luxury-perfume-collection-display-oud.jpg",
    likes: 567,
    comments: 89,
  },
  {
    id: "3",
    image: "/oud-perfume-bottle-elegant.jpg",
    likes: 189,
    comments: 23,
  },
  {
    id: "4",
    image: "/perfume-making-process.jpg",
    likes: 342,
    comments: 56,
  },
  {
    id: "5",
    image: "/luxury-fragrance-store.jpg",
    likes: 456,
    comments: 78,
  },
  {
    id: "6",
    image: "/oud-wood-chips-display.jpg",
    likes: 123,
    comments: 34,
  },
]

export function ProfilePosts() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
      {userPosts.map((post) => (
        <a key={post.id} href={`/post/${post.id}`} className="relative aspect-square rounded-lg overflow-hidden group">
          <img
            src={post.image || "/placeholder.svg"}
            alt="Post"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1 text-foreground">
              <Heart className="h-5 w-5 fill-current" />
              <span className="font-semibold">{post.likes}</span>
            </div>
            <div className="flex items-center gap-1 text-foreground">
              <MessageCircle className="h-5 w-5 fill-current" />
              <span className="font-semibold">{post.comments}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}
