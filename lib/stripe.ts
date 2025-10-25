import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY não está definida nas variáveis de ambiente")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
})

// Configuração dos planos no Stripe
export const STRIPE_PLANS = {
  free: {
    name: "Gratuito",
    price: 0,
    priceId: null, // Plano gratuito não precisa de priceId
  },
  medium: {
    name: "Médio",
    price: 1990, // em centavos (R$ 19,90)
    priceId: process.env.STRIPE_PRICE_ID_MEDIUM, // Você precisa criar isso no Stripe Dashboard
  },
  pro: {
    name: "Pro",
    price: 3990, // em centavos (R$ 39,90)
    priceId: process.env.STRIPE_PRICE_ID_PRO, // Você precisa criar isso no Stripe Dashboard
  },
}

// Criar Payment Intent para cartão de crédito
export async function createPaymentIntent(amount: number, currency = "brl") {
  return await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
  })
}

// Criar Payment Intent para PIX
export async function createPixPaymentIntent(amount: number, customerEmail: string) {
  return await stripe.paymentIntents.create({
    amount,
    currency: "brl",
    payment_method_types: ["pix"],
    metadata: {
      payment_method: "pix",
    },
  })
}

// Criar ou recuperar cliente Stripe
export async function getOrCreateStripeCustomer(userId: string, email: string, name?: string) {
  // Buscar se já existe um customer com esse metadata
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]
  }

  // Criar novo customer
  return await stripe.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  })
}

// Criar assinatura no Stripe
export async function createStripeSubscription(customerId: string, priceId: string) {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
  })
}

// Cancelar assinatura no Stripe
export async function cancelStripeSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId)
}

// Atualizar assinatura no Stripe (upgrade/downgrade)
export async function updateStripeSubscription(subscriptionId: string, newPriceId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: "create_prorations",
  })
}
