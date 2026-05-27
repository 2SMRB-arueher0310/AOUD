
import { useState } from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { useT } from "@/lib/i18n"
import { GuestRestrictionModal } from "@/components/guest-restriction-modal"

interface CommentItemProps {
  comment: {
    id: string
    author: {
      name: string
      username: string
      avatar: string
    }
    content: string
    createdAt: string
    likes: number
  }
  onReply?: (username: string) => void
}

export function CommentItem({ comment, onReply }: CommentItemProps) {
  const { isGuest } = useAppStore()
  const t = useT()
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(comment.likes)
  const [showGuestModal, setShowGuestModal] = useState(false)

  const toggleLike = () => {
    if (isGuest) {
      setShowGuestModal(true)
      return
    }
    setLiked(!liked)
    setLikes(liked ? likes - 1 : likes + 1)
  }

  const handleReply = () => {
    if (isGuest) {
      setShowGuestModal(true)
      return
    }
    onReply?.(comment.author.username)
  }

  return (
    <>
      <GuestRestrictionModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        action={t("comment.reply")}
      />
      <div className="flex gap-3">
        <a href={`/user/${comment.author.username.slice(1)}`}>
          <img
            src={comment.author.avatar || "/placeholder.svg"}
            alt={comment.author.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        </a>
        <div className="flex-1">
          <div className="bg-muted rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <a
                href={`/user/${comment.author.username.slice(1)}`}
                className="font-semibold text-sm text-foreground hover:text-primary"
              >
                {comment.author.name}
              </a>
              <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
            </div>
            <p className="text-sm text-foreground mt-1">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-1 ml-3">
            <button
              onClick={toggleLike}
              className={cn(
                "text-xs flex items-center gap-1 transition-colors",
                liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
              )}
            >
              <Heart className={cn("h-3 w-3", liked && "fill-current")} />
              {likes > 0 && likes}
            </button>
            <button
              onClick={handleReply}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {t("comment.reply")}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
