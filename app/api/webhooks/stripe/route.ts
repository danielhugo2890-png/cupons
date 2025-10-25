import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { query } from "@/lib/db"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        await query(
          `UPDATE pagamentos 
           SET status = 'completed', 
               atualizado_em = NOW() 
           WHERE stripe_payment_intent_id = ?`,
          [paymentIntent.id],
        )

        const [payment] = await query<any[]>(
          "SELECT assinatura_id FROM pagamentos WHERE stripe_payment_intent_id = ?",
          [paymentIntent.id],
        )

        if (payment) {
          await query(
            `UPDATE assinaturas 
             SET status = 'ativa', 
                 atualizado_em = NOW() 
             WHERE id = ?`,
            [payment.assinatura_id],
          )
        }

        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        await query(
          `UPDATE pagamentos 
           SET status = 'failed', 
               atualizado_em = NOW() 
           WHERE stripe_payment_intent_id = ?`,
          [paymentIntent.id],
        )

        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription

        await query(
          `UPDATE assinaturas 
           SET status = ?, 
               atualizado_em = NOW() 
           WHERE stripe_subscription_id = ?`,
          [subscription.status === "active" ? "ativa" : "inativa", subscription.id],
        )

        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        await query(
          `UPDATE assinaturas 
           SET status = 'cancelada', 
               cancelada_em = NOW(),
               atualizado_em = NOW() 
           WHERE stripe_subscription_id = ?`,
          [subscription.id],
        )

        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
