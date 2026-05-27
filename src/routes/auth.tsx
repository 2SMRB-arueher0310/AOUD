import { createFileRoute } from "@tanstack/react-router";

import React from "react"

import { useState } from "react"
import { useRouter } from "@/lib/next-shim"
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Globe, Sun, Moon, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { useT, availableLanguages } from "@/lib/i18n"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

function AuthPage() {
  const router = useRouter()
  const { login, loginAsGuest, register, language, setLanguage, theme, setTheme } = useAppStore()
  const t = useT()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Forgot password (mock flow)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotError, setForgotError] = useState("")
  const [forgotStatus, setForgotStatus] = useState<"idle" | "sending" | "sent">("idle")

  const openForgot = () => {
    setForgotEmail(formData.email)
    setForgotError("")
    setForgotStatus("idle")
    setForgotOpen(true)
  }

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotEmail.trim()) {
      setForgotError(t("auth.errEmailRequired"))
      return
    }
    if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
      setForgotError(t("auth.errEmailInvalid"))
      return
    }
    setForgotError("")
    setForgotStatus("sending")
    setTimeout(() => setForgotStatus("sent"), 1200)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = t("auth.errNameRequired")
    }

    if (!formData.email.trim()) {
      newErrors.email = t("auth.errEmailRequired")
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("auth.errEmailInvalid")
    }

    if (!formData.password) {
      newErrors.password = t("auth.errPasswordRequired")
    } else if (formData.password.length < 6) {
      newErrors.password = t("auth.errPasswordShort")
    }

    if (!isLogin) {
      if (!formData.username.trim()) {
        newErrors.username = t("auth.errUsernameRequired")
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username = t("auth.errUsernameInvalid")
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t("auth.errPasswordMatch")
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const user = {
      name: formData.name || formData.email.split("@")[0],
      username: `@${formData.username || formData.email.split("@")[0]}`,
      email: formData.email,
      avatar: "",
      bio: "",
    }

    if (isLogin) {
      login(user)
    } else {
      register(user)
    }

    router.push("/")
  }

  const handleGuestAccess = () => {
    loginAsGuest()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-brown via-brown-intense to-dark-brown flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/luxury-perfume-collection-display-oud.jpg')] bg-cover bg-center" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-dark-brown/95 via-dark-brown/90 to-brown-intense/95" />

      <div className="relative w-full max-w-md">
        {/* Top controls: theme + language */}
        <div className="flex justify-end gap-2 mb-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={t("settings.theme")}
            className="gap-2 bg-white/10 border-gold/30 text-beige hover:bg-white/20 hover:text-gold rounded-full"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{theme === "dark" ? t("settings.themeLight") : t("settings.themeDark")}</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-white/10 border-gold/30 text-beige hover:bg-white/20 hover:text-gold rounded-full"
              >
                <Globe className="h-4 w-4" />
                <span>{language}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border shadow-lg">
              {availableLanguages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={cn(
                    "cursor-pointer hover:bg-beige-light text-dark-brown",
                    language === lang.code && "bg-beige-light text-primary",
                  )}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>


        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-5xl font-bold text-gold mb-2">AOUD</h1>
          <p className="text-beige/80 text-sm">{t("auth.tagline")}</p>
        </div>

        <div className="bg-card backdrop-blur-xl rounded-3xl border border-gold/20 p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
                isLogin
                  ? "bg-gold text-dark-brown shadow-lg"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted"
              }`}
            >
              {t("auth.signIn")}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
                !isLogin
                  ? "bg-gold text-dark-brown shadow-lg"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted"
              }`}
            >
              {t("auth.signUp")}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={t("auth.fullName")}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-12 bg-muted border-border text-foreground placeholder:text-muted-foreground rounded-2xl h-14 focus:border-gold focus:ring-gold/30"
                    />
                  </div>
                  {errors.name && <p className="text-red-400 text-sm mt-1 ml-2">{errors.name}</p>}
                </div>

                <div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">@</span>
                    <Input
                      type="text"
                      placeholder={t("auth.username")}
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="pl-12 bg-muted border-border text-foreground placeholder:text-muted-foreground rounded-2xl h-14 focus:border-gold focus:ring-gold/30"
                    />
                  </div>
                  {errors.username && <p className="text-red-400 text-sm mt-1 ml-2">{errors.username}</p>}
                </div>
              </>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder={t("auth.email")}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-12 bg-muted border-border text-foreground placeholder:text-muted-foreground rounded-2xl h-14 focus:border-gold focus:ring-gold/30"
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm mt-1 ml-2">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.password")}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-12 pr-12 bg-muted border-border text-foreground placeholder:text-muted-foreground rounded-2xl h-14 focus:border-gold focus:ring-gold/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1 ml-2">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.confirmPassword")}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-12 bg-muted border-border text-foreground placeholder:text-muted-foreground rounded-2xl h-14 focus:border-gold focus:ring-gold/30"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1 ml-2">{errors.confirmPassword}</p>}
              </div>
            )}

            {isLogin && (
              <div className="text-right">
                <button type="button" onClick={openForgot} className="text-sm text-gold hover:text-gold-light transition-colors">
                  {t("auth.forgot")}
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gold text-dark-brown hover:bg-gold-dark font-semibold h-14 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all"
            >
              {isLogin ? t("auth.signIn") : t("auth.createAccount")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">{t("auth.or")}</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGuestAccess}
            className="w-full border-2 border-border bg-transparent text-foreground hover:bg-muted hover:border-gold/50 h-14 rounded-2xl text-lg transition-all"
          >
            {t("auth.guest")}
          </Button>

          <p className="text-center text-muted-foreground text-sm mt-4">
            {t("auth.guestNote")}
          </p>
        </div>

        <p className="text-center text-muted-foreground text-sm mt-8">
          {t("auth.terms")}
        </p>
      </div>

      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="bg-card border-gold/20 sm:max-w-md">
          {forgotStatus === "sent" ? (
            <>
              <DialogHeader>
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15">
                  <CheckCircle2 className="h-8 w-8 text-gold" />
                </div>
                <DialogTitle className="text-center font-serif text-2xl text-foreground">
                  Revisa tu correo
                </DialogTitle>
                <DialogDescription className="text-center text-muted-foreground">
                  Si existe una cuenta asociada a{" "}
                  <span className="text-gold font-medium">{forgotEmail}</span>, te hemos enviado un enlace para restablecer tu contraseña. Revisa también la carpeta de spam.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-center">
                <Button
                  type="button"
                  onClick={() => setForgotOpen(false)}
                  className="bg-gold text-dark-brown hover:bg-gold-dark rounded-xl h-11 px-8"
                >
                  Entendido
                </Button>
              </DialogFooter>
            </>
          ) : (
            <form onSubmit={handleForgotSubmit}>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl text-foreground">
                  Recupera tu contraseña
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Introduce tu correo y te enviaremos un enlace para crear una nueva contraseña.
                </DialogDescription>
              </DialogHeader>
              <div className="my-6">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    autoFocus
                    placeholder={t("auth.email")}
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    disabled={forgotStatus === "sending"}
                    className="pl-12 bg-muted border-border text-foreground placeholder:text-muted-foreground rounded-2xl h-14 focus:border-gold focus:ring-gold/30"
                  />
                </div>
                {forgotError && <p className="text-red-400 text-sm mt-2 ml-2">{forgotError}</p>}
              </div>
              <DialogFooter className="gap-2 sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForgotOpen(false)}
                  disabled={forgotStatus === "sending"}
                  className="rounded-xl h-11"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={forgotStatus === "sending"}
                  className="bg-gold text-dark-brown hover:bg-gold-dark rounded-xl h-11 px-6"
                >
                  {forgotStatus === "sending" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar enlace
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


export const Route = createFileRoute("/auth")({
  component: AuthPage,
});
