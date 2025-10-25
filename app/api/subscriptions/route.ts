import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getUserSubscription, getAllPlans } from "@/lib/subscription"

// GET - Obter assinatura do usuário e planos disponíveis
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      // Retornar apenas planos públicos
      const plans = await getAllPlans()
      return NextResponse.json({ plans, subscription: null })
    }

    const [subscription, plans] = await Promise.all([getUserSubscription(user.id), getAllPlans()])

    return NextResponse.json({ subscription, plans })
  } catch (error) {
    console.error("[v0] Erro ao buscar assinaturas:", error)
    return NextResponse.json({ error: "Erro ao buscar assinaturas" }, { status: 500 })
  }
}
