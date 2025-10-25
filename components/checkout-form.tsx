"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useUser } from "@/lib/user-context"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Lock, Check, ArrowLeft, Zap, Crown, QrCode, Loader2 } from "lucide-react"

const planDetails = {
  medium: {
    name: "Médio",
    price: 19.9,
    icon: Zap,
    features: ["Acesso a todos os cupons", "Favoritos ilimitados", "Suporte prioritário", "Alertas de novos cupons"],
  },
  pro: {
    name: "Pro",
    price: 39.9,
    icon: Crown,
    features: [
      "Tudo do plano Médio",
      "Cupons exclusivos",
      "API de acesso",
      "Relatórios personalizados",
      "Suporte 24/7",
    ],
  },
}

export function CheckoutForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading } = useUser()
  const { toast } = useToast()
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "pix">("credit_card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [pixQrCode, setPixQrCode] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)

  const planParam = searchParams.get("plan") as keyof typeof planDetails
  const selectedPlan = planDetails[planParam]

  useEffect(() => {
    if (!loading && !user) {
      router.push("/entrar?redirect=/checkout")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!selectedPlan) {
      router.push("/planos")
    }
  }, [selectedPlan, router])

  if (loading || !user || !selectedPlan) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    try {
      const paymentResponse = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planSlug: planParam,
          paymentMethod,
        }),
      })

      if (!paymentResponse.ok) {
        const data = await paymentResponse.json()
        throw new Error(data.error || "Erro ao criar pagamento")
      }

      const { clientSecret, paymentIntentId: piId, customerId } = await paymentResponse.json()
      setPaymentIntentId(piId)

      if (paymentMethod === "pix") {
        setPixQrCode(clientSecret)

        toast({
          title: "QR Code PIX gerado!",
          description: "Escaneie o código para completar o pagamento. Aguardando confirmação...",
        })

        setTimeout(async () => {
          await createSubscription(piId, customerId)
        }, 5000)
      } else {
        await createSubscription(piId, customerId)
      }
    } catch (error: any) {
      toast({
        title: "Erro ao processar pagamento",
        description: error.message,
        variant: "destructive",
      })
      setProcessing(false)
    }
  }

  const createSubscription = async (piId: string, customerId: string) => {
    try {
      const response = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planSlug: planParam,
          paymentIntentId: piId,
          stripeCustomerId: customerId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro ao criar assinatura")
      }

      toast({
        title: "Pagamento confirmado!",
        description: `Bem-vindo ao plano ${selectedPlan.name}. Você já pode aproveitar todos os benefícios.`,
      })

      router.push("/assinatura?success=true")
    } catch (error: any) {
      toast({
        title: "Erro ao criar assinatura",
        description: error.message,
        variant: "destructive",
      })
      throw error
    } finally {
      setProcessing(false)
    }
  }

  const Icon = selectedPlan.icon

  if (pixQrCode) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <QrCode className="h-6 w-6" />
                  Pagamento via PIX
                </CardTitle>
                <CardDescription>Escaneie o QR Code para completar o pagamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white p-8 rounded-lg flex items-center justify-center">
                  <div className="h-64 w-64 bg-muted flex items-center justify-center rounded-lg">
                    <QrCode className="h-32 w-32 text-muted-foreground" />
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Valor a pagar</p>
                  <p className="text-3xl font-bold">R$ {selectedPlan.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm text-muted-foreground">Aguardando confirmação do pagamento...</p>
                </div>

                <Button variant="outline" onClick={() => router.push("/planos")} className="w-full">
                  Cancelar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => router.push("/planos")} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para planos
            </Button>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">Finalizar Assinatura</h1>
            <p className="text-muted-foreground">Complete seu pagamento para ativar o plano premium</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Informações de Pagamento
                  </CardTitle>
                  <CardDescription>Pagamento processado com segurança pelo Stripe</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <Label>Método de Pagamento</Label>
                      <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                          <RadioGroupItem value="credit_card" id="credit_card" />
                          <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer flex-1">
                            <CreditCard className="h-4 w-4" />
                            Cartão de Crédito
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                          <RadioGroupItem value="pix" id="pix" />
                          <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer flex-1">
                            <QrCode className="h-4 w-4" />
                            PIX (Aprovação instantânea)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {paymentMethod === "credit_card" ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Número do Cartão</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            maxLength={19}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardName">Nome no Cartão</Label>
                          <Input
                            id="cardName"
                            placeholder="NOME COMPLETO"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value.toUpperCase())}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry">Validade</Label>
                            <Input
                              id="cardExpiry"
                              placeholder="MM/AA"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              maxLength={5}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardCvv">CVV</Label>
                            <Input
                              id="cardCvv"
                              placeholder="123"
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              maxLength={4}
                              required
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-muted/50 p-6 rounded-lg text-center space-y-4">
                        <QrCode className="h-24 w-24 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Após confirmar, você receberá um QR Code PIX para realizar o pagamento instantaneamente
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                      <Lock className="h-4 w-4 flex-shrink-0" />
                      <p>Pagamento seguro processado pelo Stripe com criptografia SSL</p>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={processing}>
                      {processing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        `Pagar R$ ${selectedPlan.price.toFixed(2)}/mês`
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{selectedPlan.name}</h3>
                      <p className="text-sm text-muted-foreground">Assinatura mensal</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <p className="text-sm font-semibold">Incluído no plano:</p>
                    <ul className="space-y-2">
                      {selectedPlan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>R$ {selectedPlan.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Desconto</span>
                      <span className="text-green-600">R$ 0,00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>R$ {selectedPlan.price.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Cobrado mensalmente</p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <Badge variant="secondary" className="mb-2">
                      Garantia de 7 dias
                    </Badge>
                    <p className="text-xs text-muted-foreground">Não satisfeito? Devolvemos 100% do seu dinheiro</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
