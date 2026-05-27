
import { Heart, MessageCircle, Bookmark } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useT } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function ProfileSaved() {
  const t = useT()
  const { posts, savedPosts, toggleSave, toggleLike } = useAppStore()

  const saved = posts.filter((post) => savedPosts.includes(post.id))

  if (saved.length === 0) {
    return (
      <div className="text-center py-12">
        <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-foreground mb-2">{t("profile.savedEmpty")}</h3>
        <p className="text-muted-foreground">{t("profile.savedEmptyDesc")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
        {t("profile.savedTitle")} ({saved.length})
      </h2>

      {saved.map((post) => (
        <article key={post.id} className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            {post.image && (
              <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0">
                <img src={post.image || "/placeholder.svg"} alt="Post" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 p-4">
              {/* Author */}
              <div className="flex items-center gap-2 mb-3">
                <a href={`/user/${post.author.username.slice(1)}`}>
                  <img
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={post.author.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </a>
                <a href={`/user/${post.author.username.slice(1)}`} className="font-medium text-foreground text-sm hover:text-primary">
                  {post.author.name}
                </a>
                <span className="text-muted-foreground text-xs">{post.author.username}</span>
                <span className="text-muted-foreground text-xs">· {post.createdAt}</span>
              </div>

              {/* Text */}
              <p className="text-foreground text-sm mb-4 line-clamp-2">{post.content}</p>

              {/* Stats */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={cn(
                    "flex items-center gap-1 text-sm transition-colors",
                    post.liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                  )}
                >
                  <Heart className={cn("h-4 w-4", post.liked && "fill-current")} />
                  <span>{post.likes}</span>
                </button>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments.length}</span>
                </div>
                <button
                  onClick={() => toggleSave(post.id)}
                  className="ml-auto text-primary hover:text-primary/80 transition-colors"
                >
                  <Bookmark className="h-5 w-5 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
