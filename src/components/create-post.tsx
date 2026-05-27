
import type React from "react"

import { useState, useRef } from "react"
import { ImageIcon, Video, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { GuestRestrictionModal } from "@/components/guest-restriction-modal"
import { UserAvatar } from "@/components/user-avatar"
import { useT } from "@/lib/i18n"

export function CreatePost() {
  const [content, setContent] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showGuestModal, setShowGuestModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addPost, isGuest, isAuthenticated, authUser, userProfile } = useAppStore()
  const t = useT()

  // Si es invitado, no mostrar el componente de crear post
  if (isGuest) {
    return (
      <>
        <div 
          className="bg-card rounded-xl p-4 border border-border cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => setShowGuestModal(true)}
        >
          <div className="flex gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-lg">?</span>
            </div>
            <div className="flex-1">
              <div className="w-full bg-muted rounded-lg p-3 text-muted-foreground">
                {t("feed.guestPlaceholder")}
              </div>
            </div>
          </div>
        </div>
        <GuestRestrictionModal
          isOpen={showGuestModal}
          onClose={() => setShowGuestModal(false)}
          action="publicar contenido"
        />
      </>
    )
  }

  // Si no esta autenticado, no mostrar nada
  if (!isAuthenticated) {
    return null
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (content.trim() || selectedImage) {
      addPost({
        author: {
          name: authUser?.name || userProfile.name,
          username: authUser?.username || userProfile.username,
          avatar: authUser?.avatar || userProfile.avatar,
          tags: userProfile.tags,
        },
        content: content.trim(),
        image: selectedImage || undefined,
      })
      setContent("")
      setSelectedImage(null)
      setIsExpanded(false)
    }
  }

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/50">
          <UserAvatar src={authUser?.avatar || userProfile.avatar} alt="Avatar" className="h-full w-full" />
        </div>
        <div className="flex-1">
          <textarea
            placeholder={t("feed.createPlaceholder")}
            className="w-full bg-muted rounded-lg p-3 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[60px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            rows={isExpanded ? 3 : 1}
          />

          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="relative mt-3">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Selected"
                className="w-full max-h-64 object-cover rounded-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Actions */}
          {isExpanded && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Imagen
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Video className="h-5 w-5 mr-2" />
                  Video
                </Button>
              </div>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!content.trim() && !selectedImage}
                onClick={handleSubmit}
              >
                <Send className="h-4 w-4 mr-2" />
                Publicar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
