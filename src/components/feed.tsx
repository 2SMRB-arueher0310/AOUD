import { useAppStore } from "@/lib/store"
import { PostCard } from "./post-card"

export function Feed() {
  const { posts, toggleLike, toggleSave, addComment } = useAppStore()

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onToggleLike={() => toggleLike(post.id)}
          onToggleSave={() => toggleSave(post.id)}
          onAddComment={(c) => addComment(post.id, c)}
        />
      ))}
    </div>
  )
}
