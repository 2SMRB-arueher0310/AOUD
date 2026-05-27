
import React, { useEffect } from "react"

import { useState, useRef } from "react"
import { MapPin, Calendar, LinkIcon, Edit2, Camera, X, Check, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAppStore } from "@/lib/store"
import { useT, useRoleT } from "@/lib/i18n"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export function ProfileHeader() {
  const t = useT()
  const rt = useRoleT()
  const { userProfile, updateUserProfile, posts, followingUsers, userCollection } = useAppStore()
  const [isEditingCover, setIsEditingCover] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editForm, setEditForm] = useState({
    name: userProfile.name,
    bio: userProfile.bio,
    location: userProfile.location,
    website: userProfile.website,
  })
  const coverInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  // Actualizar editForm cuando userProfile cambia
  useEffect(() => {
    setEditForm({
      name: userProfile.name,
      bio: userProfile.bio,
      location: userProfile.location,
      website: userProfile.website,
    })
  }, [userProfile])

  const userPostCount = posts.filter((p) => p.author.username === userProfile.username).length
  const followingCount = followingUsers.length
  const followersCount = 0
  const perfumeCount = userCollection.length

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateUserProfile({ coverImage: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
    setIsEditingCover(false)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateUserProfile({ avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    updateUserProfile(editForm)
    setIsEditingProfile(false)
  }

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-48 md:h-64 lg:h-80 bg-gradient-to-br from-primary/30 via-secondary/20 to-muted relative overflow-hidden">
        <img
          src={userProfile.coverImage || "/luxury-perfume-shop-interior.jpg"}
          alt="Cover"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

        {/* Edit Cover Button */}
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 bg-background/50 backdrop-blur-sm border-border hover:bg-background/80"
          onClick={() => coverInputRef.current?.click()}
        >
          <Camera className="h-4 w-4 mr-2" />
          {t("profile.editCover")}
        </Button>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverChange}
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="relative pb-6 pt-6">
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />

          {/* Bio & Meta */}
          <div className="mt-6 max-w-2xl">
            <p className="text-foreground leading-relaxed mb-4">{userProfile.bio}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {userProfile.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full font-medium">
                  {rt(tag)}
                </span>
              ))}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{userProfile.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{t("profile.joinedIn")} {userProfile.joinedDate}</span>
              </div>
              {userProfile.website && (
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  <a href={`https://${userProfile.website}`} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    {userProfile.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-6 pt-6 border-t border-border">
            <a href="#" className="text-center hover:text-primary transition-colors">
              <span className="block font-serif text-2xl font-bold text-foreground">{userPostCount}</span>
              <span className="text-sm text-muted-foreground">{t("profile.publications")}</span>
            </a>
            <a href="#" className="text-center hover:text-primary transition-colors">
              <span className="block font-serif text-2xl font-bold text-foreground">{followersCount}</span>
              <span className="text-sm text-muted-foreground">{t("profile.followers")}</span>
            </a>
            <a href="#" className="text-center hover:text-primary transition-colors">
              <span className="block font-serif text-2xl font-bold text-foreground">{followingCount}</span>
              <span className="text-sm text-muted-foreground">{t("profile.following")}</span>
            </a>
            <a href="#" className="text-center hover:text-primary transition-colors">
              <span className="block font-serif text-2xl font-bold text-foreground">{perfumeCount}</span>
              <span className="text-sm text-muted-foreground">{t("profile.perfumes")}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("profile.editProfileTitle")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t("profile.name")}</label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder={t("profile.namePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t("profile.bio")}</label>
              <Textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder={t("profile.bioPlaceholder")}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t("profile.location")}</label>
              <Input
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                placeholder={t("profile.locationPlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t("profile.website")}</label>
              <Input
                value={editForm.website}
                onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                placeholder={t("profile.websitePlaceholder")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingProfile(false)} className="bg-transparent">
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSaveProfile}>
              {t("profile.saveChanges")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
