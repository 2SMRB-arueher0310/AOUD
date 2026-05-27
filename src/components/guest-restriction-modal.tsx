
import { useRouter } from "@/lib/next-shim"
import { X, UserPlus, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GuestRestrictionModalProps {
  isOpen: boolean
  onClose: () => void
  action?: string
}

export function GuestRestrictionModal({ isOpen, onClose, action = "realizar esta accion" }: GuestRestrictionModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleRegister = () => {
    onClose()
    router.push("/auth")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-card to-secondary/30 rounded-3xl border border-border/50 p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-gold/20 flex items-center justify-center">
            <Lock className="h-10 w-10 text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
            Registrate para continuar
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Para <span className="text-foreground font-medium">{action}</span> necesitas tener una cuenta. 
            Registrate gratis y disfruta de todas las funciones de AOUD.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {[
            "Publica tus fragancias favoritas",
            "Conecta con otros amantes de perfumes",
            "Guarda y comenta publicaciones",
            "Enviar mensajes directos",
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-gold" />
              {feature}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleRegister}
            className="w-full bg-gradient-to-r from-primary to-gold-dark text-primary-foreground hover:from-primary/90 hover:to-gold-dark/90 h-12 rounded-2xl font-semibold shadow-lg"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Crear Cuenta Gratis
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full border-border bg-transparent hover:bg-muted h-12 rounded-2xl"
          >
            Continuar como Invitado
          </Button>
        </div>
      </div>
    </div>
  )
}
