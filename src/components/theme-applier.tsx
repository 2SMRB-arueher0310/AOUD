import { useEffect } from "react"
import { useAppStore } from "@/lib/store"

export function ThemeApplier() {
  const theme = useAppStore((s) => s.theme)
  const language = useAppStore((s) => s.language)

  useEffect(() => {
    if (typeof document === "undefined") return
    const root = document.documentElement
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches)
    root.classList.toggle("dark", isDark)
  }, [theme])

  useEffect(() => {
    if (typeof document === "undefined") return
    const root = document.documentElement
    const map: Record<string, string> = { ES: "es", EN: "en", FR: "fr" }
    // Migrate any persisted "AR" value
    if (language === "AR") {
      useAppStore.getState().setLanguage("ES")
      return
    }
    root.lang = map[language] ?? "es"
    root.dir = "ltr"
  }, [language])

  return null
}
