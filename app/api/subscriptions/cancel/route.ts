import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { cancelSubscription } from "@/lib/subscription"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { immediate } = await request.json()

    await cancelSubscription(user.id, immediate === true)

    return NextResponse.json({
      success: true,
      message: immediate ? "Assinatura cancelada imediatamente" : "Assinatura será cancelada ao fim do período",
    })
  } catch (error: any) {
    console.error("[v0] Erro ao cancelar assinatura:", error)
    return NextResponse.json({ error: error.message || "Erro ao cancelar assinatura" }, { status: 500 })
  }
}
