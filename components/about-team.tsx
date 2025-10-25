import { Card, CardContent } from "@/components/ui/card"
import { Rocket, Heart, Zap, Globe } from "lucide-react"

const goals = [
  {
    icon: Rocket,
    title: "Expansão Nacional",
    description: "Alcançar todas as regiões do Brasil com parcerias locais e cupons regionais exclusivos.",
    year: "2025",
  },
  {
    icon: Heart,
    title: "Programa Social",
    description:
      "Lançar iniciativa para ajudar famílias de baixa renda a economizar ainda mais em produtos essenciais.",
    year: "2025",
  },
  {
    icon: Zap,
    title: "App Mobile",
    description: "Desenvolver aplicativo nativo para iOS e Android com notificações push inteligentes.",
    year: "2026",
  },
  {
    icon: Globe,
    title: "Expansão Internacional",
    description: "Levar nossa plataforma para outros países da América Latina, começando pela Argentina.",
    year: "2027",
  },
]

export function AboutTeam() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-balance">Nossas Metas e Objetivos</h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Estamos constantemente evoluindo para oferecer a melhor experiência aos nossos usuários
            </p>
          </div>

          {/* Goals Timeline */}
          <div className="space-y-6">
            {goals.map((goal, index) => {
              const Icon = goal.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="h-7 w-7 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-foreground">{goal.title}</h3>
                          <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                            {goal.year}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{goal.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Company Story */}
          <div className="mt-16 p-8 md:p-12 bg-card rounded-lg border border-border">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Nossa História</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                A Linux Cupons nasceu em 2020, durante a pandemia, quando percebemos que muitas pessoas estavam buscando
                formas de economizar nas compras online. O que começou como um projeto pequeno, rapidamente se tornou a
                plataforma de cupons mais confiável do Brasil.
              </p>
              <p>
                Nossa equipe é formada por profissionais apaixonados por tecnologia e comprometidos em oferecer a melhor
                experiência aos usuários. Trabalhamos diariamente para verificar cada cupom, negociar ofertas exclusivas
                e garantir que você sempre encontre as melhores oportunidades de economia.
              </p>
              <p>
                Hoje, somos mais de 50 colaboradores dedicados a uma única missão: fazer você economizar de verdade.
                Cada feedback, cada sugestão e cada história de economia nos motiva a continuar melhorando.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
