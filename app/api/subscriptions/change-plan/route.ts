import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { changePlan } from "@/lib/subscription"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { newPlanSlug } = await request.json()

    if (!newPlanSlug) {
      return NextResponse.json({ error: "Novo plano é obrigatório" }, { status: 400 })
    }

    await changePlan(user.id, newPlanSlug)

    return NextResponse.json({
      success: true,
      message: "Plano alterado com sucesso",
    })
  } catch (error: any) {
    console.error("[v0] Erro ao alterar plano:", error)
    return NextResponse.json({ error: error.message || "Erro ao alterar plano" }, { status: 500 })
  }
}
