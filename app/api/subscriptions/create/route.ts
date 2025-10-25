import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { createSubscription } from "@/lib/subscription"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { planSlug, paymentIntentId, stripeCustomerId, stripeSubscriptionId } = await request.json()

    if (!planSlug) {
      return NextResponse.json({ error: "Plano é obrigatório" }, { status: 400 })
    }

    const { subscriptionId, paymentId } = await createSubscription(
      user.id,
      planSlug,
      paymentIntentId ? "credit_card" : "pix",
    )

    // Atualizar com IDs do Stripe se fornecidos
    if (stripeCustomerId) {
      await query("UPDATE usuarios SET stripe_customer_id = ? WHERE id = ?", [stripeCustomerId, user.id])
    }

    if (stripeSubscriptionId) {
      await query("UPDATE assinaturas SET stripe_subscription_id = ? WHERE id = ?", [
        stripeSubscriptionId,
        subscriptionId,
      ])
    }

    if (paymentIntentId) {
      await query("UPDATE pagamentos SET stripe_payment_intent_id = ? WHERE id = ?", [paymentIntentId, paymentId])
    }

    return NextResponse.json({
      success: true,
      subscriptionId,
      paymentId,
      message: "Assinatura criada com sucesso",
    })
  } catch (error: any) {
    console.error("[v0] Erro ao criar assinatura:", error)
    return NextResponse.json({ error: error.message || "Erro ao criar assinatura" }, { status: 500 })
  }
}
