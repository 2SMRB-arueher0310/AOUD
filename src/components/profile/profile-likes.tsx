
import { Heart, MessageCircle, Bookmark } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useT } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function ProfileLikes() {
  const t = useT()
  const { posts, toggleLike, toggleSave } = useAppStore()

  const likedPosts = posts.filter((post) => post.liked)

  if (likedPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-foreground mb-2">{t("profile.likesNoneTitle")}</h3>
        <p className="text-muted-foreground">{t("profile.likesNoneDesc")}</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
        {t("profile.likesYourLiked")} ({likedPosts.length})
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {likedPosts.map((post) => (
          <div
            key={post.id}
            className="relative aspect-square rounded-xl overflow-hidden group bg-card border border-border"
          >
            {post.image ? (
              <img
                src={post.image || "/placeholder.svg"}
                alt="Post"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4 bg-muted">
                <p className="text-sm text-muted-foreground line-clamp-4 text-center">{post.content}</p>
              </div>
            )}
            <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-1 text-red-500"
                >
                  <Heart className="h-5 w-5 fill-current" />
                  <span className="font-semibold">{post.likes}</span>
                </button>
                <div className="flex items-center gap-1 text-foreground">
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-semibold">{post.comments.length}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {post.author.name}
              </p>
              <button
                onClick={() => toggleSave(post.id)}
                className={cn(
                  "mt-1",
                  post.saved ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                <Bookmark className={cn("h-4 w-4", post.saved && "fill-current")} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
