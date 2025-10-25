import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Instagram, Linkedin, Mail, MessageCircle } from "lucide-react"

const socialLinks = [
  {
    name: "Instagram",
    icon: Instagram,
    handle: "@linuxcupons",
    description: "Siga para dicas diárias de economia e cupons exclusivos",
    url: "https://instagram.com/linuxcupons",
    color: "hover:bg-pink-500/10 hover:text-pink-500",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    handle: "Linux Cupons",
    description: "Conecte-se conosco e acompanhe nossas novidades corporativas",
    url: "https://linkedin.com/company/linuxcupons",
    color: "hover:bg-blue-500/10 hover:text-blue-500",
  },
]

export function AboutSocial() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-balance">Conecte-se Conosco</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Siga nossas redes sociais para não perder nenhuma oferta
            </p>
          </div>

          {/* Social Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-8 space-y-4">
                    <div
                      className={`inline-flex items-center justify-center h-16 w-16 rounded-lg bg-muted transition-all ${social.color}`}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1 text-foreground">{social.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{social.handle}</p>
                      <p className="text-muted-foreground leading-relaxed mb-4">{social.description}</p>
                      <a href={social.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full gap-2 bg-transparent">
                          <Icon className="h-4 w-4" />
                          Seguir no {social.name}
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
