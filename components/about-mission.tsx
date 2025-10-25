import { Target, Eye, Award, Users, TrendingUp, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const values = [
  {
    icon: Target,
    title: "Nossa Missão",
    description:
      "Democratizar o acesso a descontos e promoções, tornando as compras online mais acessíveis para todos os brasileiros.",
  },
  {
    icon: Eye,
    title: "Nossa Visão",
    description:
      "Ser a plataforma de cupons mais confiável e completa da América Latina, reconhecida pela qualidade e variedade de ofertas.",
  },
  {
    icon: Award,
    title: "Nossos Valores",
    description:
      "Transparência, confiabilidade e compromisso com a economia real dos nossos usuários. Cada cupom é verificado manualmente.",
  },
]

const stats = [
  {
    icon: Users,
    value: "500K+",
    label: "Usuários ativos",
  },
  {
    icon: TrendingUp,
    value: "R$ 5M+",
    label: "Economizados em 2024",
  },
  {
    icon: Shield,
    value: "95%",
    label: "Taxa de sucesso",
  },
]

export function AboutMission() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="pt-8 space-y-4">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Stats */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Nosso Impacto</h2>
            <p className="text-lg text-muted-foreground text-pretty">Números que mostram nossa dedicação</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="text-center space-y-4 p-8 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-slide-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mx-auto">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-primary">{stat.value}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
