
import React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { Save, Camera, X } from "lucide-react"

const availableTags = [
  "Amante del Oud",
  "Coleccionista",
  "Experto",
  "Reviewer",
  "Blogger",
  "YouTuber",
  "Principiante",
  "Entusiasta",
  "Vintage",
  "Influencer",
]

export function ProfileSettings() {
  const { userProfile, updateUserProfile } = useAppStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: userProfile.name,
    username: userProfile.username,
    bio: userProfile.bio,
    location: userProfile.location,
    website: userProfile.website,
    tags: userProfile.tags,
    avatar: userProfile.avatar,
  })
  const [saved, setSaved] = useState(false)

  // Actualizar formData cuando userProfile cambia (despues del login)
  useEffect(() => {
    setFormData({
      name: userProfile.name,
      username: userProfile.username,
      bio: userProfile.bio,
      location: userProfile.location,
      website: userProfile.website,
      tags: userProfile.tags,
      avatar: userProfile.avatar,
    })
  }, [userProfile])

  const handleSave = () => {
    updateUserProfile(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleTag = (tag: string) => {
    if (formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
    } else if (formData.tags.length < 4) {
      setFormData({ ...formData, tags: [...formData.tags, tag] })
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("La imagen debe ser menor a 2MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setFormData({ ...formData, avatar: base64 })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Editar Perfil</h2>

      <div className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-muted overflow-hidden flex items-center justify-center">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <Camera className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              Cambiar foto
            </Button>
            <p className="text-sm text-muted-foreground mt-1">JPG, PNG. Maximo 2MB.</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Nombre</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-muted border-border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Usuario</label>
            <Input
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="bg-muted border-border"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Biografía</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            maxLength={300}
            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">{formData.bio.length}/300 caracteres</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Ubicación</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ciudad, País"
              className="bg-muted border-border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Sitio web</label>
            <Input
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="tusitio.com"
              className="bg-muted border-border"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Etiquetas de perfil (máx. 4)
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full flex items-center gap-1"
              >
                {tag}
                <button onClick={() => toggleTag(tag)} className="ml-1 hover:text-primary-foreground/80">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTags
              .filter((tag) => !formData.tags.includes(tag))
              .map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  disabled={formData.tags.length >= 4}
                  className="px-3 py-1 border border-border text-muted-foreground text-sm rounded-full hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  + {tag}
                </button>
              ))}
          </div>
        </div>

        <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" />
          {saved ? "¡Guardado!" : "Guardar cambios"}
        </Button>
      </div>
    </div>
  )
}
