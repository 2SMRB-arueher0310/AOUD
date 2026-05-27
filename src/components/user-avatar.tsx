import { User } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  src?: string | null
  alt?: string
  className?: string
  iconClassName?: string
}

export function UserAvatar({ src, alt = "Avatar", className, iconClassName }: UserAvatarProps) {
  if (src && src.trim() !== "") {
    return <img src={src} alt={alt} className={cn("object-cover", className)} />
  }
  return (
    <div className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}>
      <User className={cn("h-1/2 w-1/2", iconClassName)} />
    </div>
  )
}
