import { useState } from "react"
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore, type Post, type Comment } from "@/lib/store"
import { useT, useRoleT } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { GuestRestrictionModal } from "@/components/guest-restriction-modal"
import { CommentItem } from "./comment-item"
import { UserAvatar } from "./user-avatar"

interface PostCardProps {
  post: Post
  onToggleLike: () => void
  onToggleSave: () => void
  onAddComment: (comment: Omit<Comment, "id" | "createdAt" | "likes">) => void
}

export function PostCard({ post, onToggleLike, onToggleSave, onAddComment }: PostCardProps) {
  const t = useT()
  const tRole = useRoleT()
  const { userProfile, isGuest } = useAppStore()
  const [expanded, setExpanded] = useState(false)
  const [active, setActive] = useState(false)
  const [value, setValue] = useState("")
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [guestAction, setGuestAction] = useState("")

  const guard = (action: string, cb: () => void) => {
    if (isGuest) {
      setGuestAction(action)
      setShowGuestModal(true)
      return
    }
    cb()
  }

  const submit = () => {
    const content = value.trim()
    if (!content) return
    onAddComment({
      author: { name: userProfile.name, username: userProfile.username, avatar: userProfile.avatar },
      content,
    })
    setValue("")
    setExpanded(true)
    setActive(false)
  }

  const toggleInput = () => {
    if (expanded) {
      setExpanded(false)
      setActive(false)
    } else {
      setExpanded(true)
      setActive(true)
    }
  }

  const replyTo = (username: string) => {
    setExpanded(true)
    setActive(true)
    const mention = `${username} `
    setValue((cur) => (cur.includes(mention) ? cur : `${mention}${cur}`))
  }

  return (
    <>
      <GuestRestrictionModal isOpen={showGuestModal} onClose={() => setShowGuestModal(false)} action={guestAction} />
      <article className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-start justify-between p-4">
          <div className="flex gap-3">
            <a href={`/user/${post.author.username.slice(1)}`} className="flex-shrink-0">
              <img src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/30 hover:ring-primary transition-all" />
            </a>
            <div>
              <div className="flex items-center gap-2">
                <a href={`/user/${post.author.username.slice(1)}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                  {post.author.name}
                </a>
                <span className="text-muted-foreground text-sm">{post.author.username}</span>
                <span className="text-muted-foreground text-sm">· {post.createdAt}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {post.author.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{tRole(tag)}</span>
                ))}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem className="cursor-pointer hover:bg-muted" onClick={onToggleSave}>
                {post.saved ? t("feed.unsave") : t("feed.save")}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-muted">{t("feed.copyLink")}</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-muted">{t("feed.report")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="px-4 pb-3">
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">{post.content}</p>
        </div>

        {post.image && (
          <div className="px-4 pb-4">
            <img src={post.image || "/placeholder.svg"} alt="Post image" className="w-full rounded-lg object-cover max-h-[500px]" />
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className={cn("gap-2 hover:text-red-500", post.liked && "text-red-500")} onClick={() => guard(t("guest.likePost"), onToggleLike)}>
              <Heart className={cn("h-5 w-5", post.liked && "fill-current")} />
              <span className="text-sm">{post.likes}</span>
            </Button>

            <Button variant="ghost" size="sm" className={cn("gap-2 hover:text-primary", active ? "text-primary" : "text-muted-foreground")} onClick={() => guard(t("guest.comment"), toggleInput)}>
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{post.comments.length}</span>
            </Button>

            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
              <Share2 className="h-5 w-5" />
              <span className="text-sm">{post.shares}</span>
            </Button>
          </div>

          <Button variant="ghost" size="icon" className={cn("hover:text-primary", post.saved ? "text-primary" : "text-muted-foreground")} onClick={() => guard(t("guest.savePosts"), onToggleSave)}>
            <Bookmark className={cn("h-5 w-5", post.saved && "fill-current")} />
          </Button>
        </div>

        {expanded && (
          <div className="border-t border-border">
            <div className="p-4 space-y-3">
              {post.comments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">{t("feed.noComments")}</p>
              ) : (
                post.comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} onReply={replyTo} />
                ))
              )}
            </div>
            {active && (
              <div className="px-4 pb-4">
                <div className="flex gap-3">
                  <UserAvatar src={userProfile.avatar} alt={t("feed.yourAvatar")} className="h-8 w-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder={t("feed.writeComment")}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          submit()
                        }
                      }}
                      className="bg-muted border-border"
                      autoFocus
                    />
                    <Button size="icon" onClick={submit} disabled={!value.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setActive(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </article>
    </>
  )
}