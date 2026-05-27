
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useT } from "@/lib/i18n"

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "Youtube" },
]

export function Footer() {
  const t = useT()
  const footerLinks = {
    explore: [
      { label: t("nav.feed"), href: "/feed" },
      { label: t("nav.shop"), href: "/shop" },
      { label: t("nav.community"), href: "/community" },
    ],
    company: [
      { label: t("footer.aboutUs"), href: "/about" },
      { label: t("footer.blog"), href: "/blog" },
      { label: t("footer.careers"), href: "/careers" },
      { label: t("footer.press"), href: "/press" },
    ],
    support: [
      { label: t("footer.help"), href: "/help" },
      { label: t("footer.contact"), href: "/contact" },
      { label: t("footer.shipping"), href: "/shipping" },
      { label: t("footer.returns"), href: "/returns" },
    ],
    legal: [
      { label: t("footer.privacy"), href: "/privacy" },
      { label: t("footer.terms"), href: "/terms" },
      { label: t("footer.cookies"), href: "/cookies" },
    ],
  }

  return (
    <footer className="bg-gradient-to-br from-dark-brown via-[#3a1505] to-dark-brown border-t border-brown-intense/20 hidden lg:block">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-3xl font-bold text-gold mb-4">AOUD</h2>
            <p className="text-beige/80 mb-6 max-w-sm leading-relaxed">
              {t("footer.description")}
            </p>

            <div className="mb-6">
              <p className="text-sm text-gold mb-3 font-medium">{t("footer.newsletter")}</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  className="bg-white/10 border-beige/30 text-beige placeholder:text-beige/40 focus:border-gold focus:bg-white/15 rounded-full"
                />
                <Button className="bg-gradient-to-r from-gold to-gold-dark text-dark-brown hover:from-gold-light hover:to-gold font-semibold rounded-full px-6">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="h-12 w-12 rounded-2xl bg-gradient-to-br from-beige/15 to-beige/5 flex items-center justify-center text-beige hover:from-gold hover:to-gold-dark hover:text-dark-brown transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gold mb-4">{t("footer.explore")}</h3>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-beige/70 hover:text-beige transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gold mb-4">{t("footer.company")}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-beige/70 hover:text-beige transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gold mb-4">{t("footer.support")}</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-beige/70 hover:text-beige transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-2">
              <a href="mailto:hola@aoud.com" className="flex items-center gap-2 text-beige/70 hover:text-gold transition-colors text-sm">
                <Mail className="h-4 w-4" />
                hola@aoud.com
              </a>
              <a href="tel:+34900123456" className="flex items-center gap-2 text-beige/70 hover:text-gold transition-colors text-sm">
                <Phone className="h-4 w-4" />
                +34 900 123 456
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-beige/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-beige/50">© 2026 AOUD. {t("footer.rights")}</p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-beige/50 hover:text-gold transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
