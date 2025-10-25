"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, Zap, Crown } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const plans = [
  {
    name: "Gratuito",
    slug: "free",
    price: "R$ 0",
    period: "/mês",
    description: "Perfeito para começar a economizar",
    icon: Sparkles,
    popular: false,
    features: ["Acesso a cupons básicos", "Até 10 favoritos", "Suporte por email"],
  },
  {
    name: "Médio",
    slug: "medium",
    price: "R$ 19,90",
    period: "/mês",
    description: "Ideal para quem compra regularmente",
    icon: Zap,
    popular: true,
    features: ["Acesso a todos os cupons", "Favoritos ilimitados", "Suporte prioritário", "Alertas de novos cupons"],
  },
  {
    name: "Pro",
    slug: "pro",
    price: "R$ 39,90",
    period: "/mês",
    description: "Para quem quer economizar ao máximo",
    icon: Crown,
    popular: false,
    features: [
      "Tudo do plano Médio",
      "Cupons exclusivos",
      "API de acesso",
      "Relatórios personalizados",
      "Suporte 24/7",
    ],
  },
]

export function PricingPlans() {
  const { user, loading } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const [processingPlan, setProcessingPlan] = useState<string | null>(null)

  const handlePlanSelect = async (planSlug: string, planPrice: string) => {
    setProcessingPlan(planSlug)

    try {
      // Free plan logic
      if (planPrice === "R$ 0") {
        if (user) {
          toast({
            title: "Você já está no plano gratuito!",
            description: "Explore nossos cupons e comece a economizar.",
          })
          router.push("/cupons")
        } else {
          toast({
            title: "Crie sua conta grátis",
            description: "Cadastre-se para começar a economizar agora mesmo!",
          })
          router.push("/cadastro")
        }
        return
      }

      // Paid plans logic
      if (!user) {
        toast({
          title: "Faça login para continuar",
          description: "Você precisa estar logado para assinar um plano premium.",
        })
        router.push(`/entrar?redirect=/planos&plan=${planSlug}`)
        return
      }

      // Redirect to checkout page with plan slug
      router.push(`/checkout?plan=${planSlug}`)
    } finally {
      setProcessingPlan(null)
    }
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-balance">Escolha Seu Plano</h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Economize ainda mais com nossos planos premium. Cancele quando quiser.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <Card
                key={plan.slug}
                className={`relative group hover:shadow-2xl transition-all duration-300 animate-slide-in ${
                  plan.popular ? "border-primary border-2 scale-105 md:scale-110" : "hover:-translate-y-1"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold">
                      Mais Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm text-foreground leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    onClick={() => handlePlanSelect(plan.slug, plan.price)}
                    disabled={loading || processingPlan === plan.slug}
                  >
                    {processingPlan === plan.slug
                      ? "Processando..."
                      : plan.price === "R$ 0"
                        ? "Começar Grátis"
                        : "Assinar Agora"}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-muted-foreground">Todos os planos incluem garantia de 7 dias</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Sem taxas ocultas</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Cancele quando quiser</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Suporte em português</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
