import { createFileRoute } from "@tanstack/react-router"
import { Header } from "@/components/header"
import { MobileMenu } from "@/components/mobile-menu"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Sparkles, Heart, Users } from "lucide-react"
import { useT } from "@/lib/i18n"

function AboutPage() {
  const t = useT()
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <MobileMenu />
      <CartSidebar />

      <main className="flex-1 pb-24 lg:pb-0">
        {/* Hero */}
        <section className="relative h-[55vh] min-h-[400px] overflow-hidden">
          <img
            src="/luxury-perfume-display-banner.jpg"
            alt="AOUD"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-brown/70 via-dark-brown/50 to-background" />
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            <h1 className="font-serif text-5xl lg:text-7xl font-bold text-gold mb-4 drop-shadow-lg">
              {t("about.title")}
            </h1>
            <p className="text-xl lg:text-2xl text-beige max-w-2xl">{t("about.tagline")}</p>
          </div>
        </section>

        {/* Mission / Vision */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <img
              src="/luxury-perfume-shop-interior.jpg"
              alt="Mission"
              className="rounded-3xl shadow-2xl w-full h-[420px] object-cover"
            />
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-3">
                  {t("about.missionTitle")}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{t("about.mission")}</p>
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-3">
                  {t("about.visionTitle")}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{t("about.vision")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-card py-16 border-y border-border">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-4xl font-bold text-foreground text-center mb-12">
              {t("about.valuesTitle")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Sparkles, k: "value1" },
                { icon: Heart, k: "value2" },
                { icon: Users, k: "value3" },
              ].map(({ icon: Icon, k }) => (
                <div
                  key={k}
                  className="bg-background rounded-3xl p-8 text-center border border-border hover:shadow-xl transition-shadow"
                >
                  <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                    {t(`about.${k}`)}
                  </h3>
                  <p className="text-muted-foreground">{t(`about.${k}Desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
                {t("about.storyTitle")}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{t("about.story")}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/perfume-workshop-artisan.jpg"
                alt="Workshop"
                className="rounded-2xl h-64 w-full object-cover shadow-lg"
              />
              <img
                src="/oud-wood-chips-display.jpg"
                alt="Oud"
                className="rounded-2xl h-64 w-full object-cover shadow-lg mt-8"
              />
              <img
                src="/perfume-making-process.jpg"
                alt="Process"
                className="rounded-2xl h-64 w-full object-cover shadow-lg"
              />
              <img
                src="/dubai-perfume-souq.jpg"
                alt="Souq"
                className="rounded-2xl h-64 w-full object-cover shadow-lg mt-8"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Sobre Nosotros — AOUD" },
      { name: "description", content: "Conoce la misión, visión y valores de AOUD, la red social de los amantes del perfume." },
    ],
  }),
  component: AboutPage,
})
