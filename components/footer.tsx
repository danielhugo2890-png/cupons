import Link from "next/link"
import { Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-black rounded-xl blur-sm opacity-60" />
                <div className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white px-4 py-2 rounded-xl font-display font-black text-2xl tracking-tight shadow-xl border border-white/10">
                  Linux
                </div>
              </div>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed font-medium">
              Os melhores cupons de desconto para você economizar nas suas compras online.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-display font-bold mb-5 text-foreground text-lg">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium hover:translate-x-1 inline-block transition-transform"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/cupons"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium hover:translate-x-1 inline-block transition-transform"
                >
                  Cupons
                </Link>
              </li>
              <li>
                <Link
                  href="/planos"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium hover:translate-x-1 inline-block transition-transform"
                >
                  Planos
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-display font-bold mb-5 text-foreground text-lg">Suporte</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contato"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium hover:translate-x-1 inline-block transition-transform"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium hover:translate-x-1 inline-block transition-transform"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  href="/planos#faq"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium hover:translate-x-1 inline-block transition-transform"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold mb-5 text-foreground text-lg">Redes Sociais</h3>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-secondary to-muted hover:from-accent hover:to-secondary transition-all duration-300 group shadow-lg hover:shadow-xl hover:scale-110"
              >
                <Instagram className="h-6 w-6 text-foreground group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-secondary to-muted hover:from-accent hover:to-secondary transition-all duration-300 group shadow-lg hover:shadow-xl hover:scale-110"
              >
                <Linkedin className="h-6 w-6 text-foreground group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 text-center">
          <p className="text-base text-muted-foreground font-medium">
            © {new Date().getFullYear()} Linux Cupons. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
