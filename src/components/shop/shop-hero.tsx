import { useT } from "@/lib/i18n"

export function ShopHero() {
  const t = useT()
  return (
    <div className="relative bg-gradient-to-br from-secondary via-card to-muted py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-25">
        <img src="/luxury-perfume-display-banner.jpg" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-primary/20 to-gold-dark/20 text-primary font-medium mb-4 tracking-wider uppercase text-sm rounded-full border border-primary/20">
            {t("shop.exclusive")}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
            {t("shop.title")}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {t("shop.description")}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-gold-dark text-primary-foreground rounded-full font-medium hover:from-primary/90 hover:to-gold-dark/90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              {t("shop.explore")}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
