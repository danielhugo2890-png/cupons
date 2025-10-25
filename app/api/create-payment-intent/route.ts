import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { createPaymentIntent, createPixPaymentIntent, STRIPE_PLANS, getOrCreateStripeCustomer } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { planSlug, paymentMethod } = await request.json()

    if (!planSlug || !paymentMethod) {
      return NextResponse.json({ error: "Plano e método de pagamento são obrigatórios" }, { status: 400 })
    }

    const plan = STRIPE_PLANS[planSlug as keyof typeof STRIPE_PLANS]
    if (!plan) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 })
    }

    if (plan.price === 0) {
      return NextResponse.json({ error: "Plano gratuito não requer pagamento" }, { status: 400 })
    }

    // Criar ou recuperar cliente Stripe
    const customer = await getOrCreateStripeCustomer(user.id.toString(), user.email, user.name)

    let paymentIntent

    if (paymentMethod === "pix") {
      // Criar Payment Intent para PIX
      paymentIntent = await createPixPaymentIntent(plan.price, user.email)
    } else {
      // Criar Payment Intent para cartão de crédito
      paymentIntent = await createPaymentIntent(plan.price)
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      customerId: customer.id,
      amount: plan.price,
    })
  } catch (error: any) {
    console.error("[v0] Erro ao criar payment intent:", error)
    return NextResponse.json({ error: error.message || "Erro ao processar pagamento" }, { status: 500 })
  }
}
