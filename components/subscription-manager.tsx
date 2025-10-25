"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Calendar, CreditCard, TrendingUp, TrendingDown } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SubscriptionPlan {
  id: number
  name: string
  slug: string
  description: string
  price: number
  billing_period: string
  features: string[]
  max_favorites: number | null
  access_premium_coupons: boolean
  priority_support: boolean
}

interface Subscription {
  id: number
  status: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  cancelled_at: string | null
  plan: SubscriptionPlan
}

export function SubscriptionManager() {
  const { user, loading: userLoading } = useUser()
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!userLoading) {
      if (!user) {
        router.push("/entrar")
      } else {
        fetchSubscriptionData()
      }
    }
  }, [user, userLoading, router])

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch("/api/subscriptions")
      if (!response.ok) throw new Error("Erro ao carregar dados")

      const data = await response.json()
      setSubscription(data.subscription)
      setPlans(data.plans)
    } catch (err) {
      setError("Erro ao carregar assinatura")
    } finally {
      setLoading(false)
    }
  }

  const handleChangePlan = async (newPlanSlug: string) => {
    setActionLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/subscriptions/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPlanSlug }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro ao alterar plano")
      }

      setSuccess("Plano alterado com sucesso!")
      await fetchSubscriptionData()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancelSubscription = async (immediate: boolean) => {
    setActionLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ immediate }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro ao cancelar assinatura")
      }

      setSuccess(immediate ? "Assinatura cancelada" : "Assinatura será cancelada ao fim do período")
      await fetchSubscriptionData()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading || userLoading) {
    return <div className="text-center py-8">Carregando...</div>
  }

  if (!subscription) {
    return (
      <Alert>
        <AlertDescription>
          Você não possui uma assinatura ativa.{" "}
          <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/planos")}>
            Ver planos disponíveis
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const currentPlan = subscription.plan
  const isActive = subscription.status === "active"
  const isCancelled = subscription.cancel_at_period_end

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Assinatura Atual */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Plano {currentPlan.name}</CardTitle>
              <CardDescription>{currentPlan.description}</CardDescription>
            </div>
            <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Ativo" : subscription.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-3xl font-bold">
            <span>R$ {currentPlan.price.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground font-normal">
              /{currentPlan.billing_period === "monthly" ? "mês" : "ano"}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                Período atual: {new Date(subscription.current_period_start).toLocaleDateString()} até{" "}
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>Próxima cobrança: {new Date(subscription.current_period_end).toLocaleDateString()}</span>
            </div>
          </div>

          {isCancelled && (
            <Alert variant="destructive">
              <AlertDescription>
                Sua assinatura será cancelada em {new Date(subscription.current_period_end).toLocaleDateString()}
              </AlertDescription>
            </Alert>
          )}

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Recursos incluídos:</h4>
            <ul className="space-y-1">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          {!isCancelled && currentPlan.slug !== "free" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" disabled={actionLoading}>
                  Cancelar Assinatura
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancelar assinatura?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Você pode cancelar imediatamente ou manter o acesso até o fim do período pago.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Voltar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleCancelSubscription(false)}>
                    Cancelar ao fim do período
                  </AlertDialogAction>
                  <AlertDialogAction onClick={() => handleCancelSubscription(true)} className="bg-destructive">
                    Cancelar agora
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardFooter>
      </Card>

      {/* Outros Planos */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Alterar Plano</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {plans
            .filter((plan) => plan.slug !== currentPlan.slug)
            .map((plan) => {
              const isUpgrade = plan.price > currentPlan.price
              const isDowngrade = plan.price < currentPlan.price

              return (
                <Card key={plan.id} className={plan.slug === "pro" ? "border-primary" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {plan.name}
                      {isUpgrade && <TrendingUp className="h-5 w-5 text-green-600" />}
                      {isDowngrade && <TrendingDown className="h-5 w-5 text-orange-600" />}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-4">
                      R$ {plan.price.toFixed(2)}
                      <span className="text-sm text-muted-foreground font-normal">
                        /{plan.billing_period === "monthly" ? "mês" : "ano"}
                      </span>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="w-full" variant={isUpgrade ? "default" : "outline"} disabled={actionLoading}>
                          {isUpgrade ? "Fazer Upgrade" : "Fazer Downgrade"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {isUpgrade ? "Fazer upgrade" : "Fazer downgrade"} para {plan.name}?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {isUpgrade
                              ? `Você será cobrado R$ ${plan.price.toFixed(2)} a partir de agora.`
                              : `Seu plano será alterado e você terá acesso aos recursos do plano ${plan.name}.`}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleChangePlan(plan.slug)}>Confirmar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              )
            })}
        </div>
      </div>
    </div>
  )
}
