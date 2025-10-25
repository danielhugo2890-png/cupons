import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { query } from "@/lib/db"

// GET - Listar todas as assinaturas (admin)
export async function GET() {
  try {
    await requireAdmin()

    const subscriptions = await query(
      `SELECT a.*, u.nome as user_name, u.email as user_email, 
       p.nome as plan_name, p.slug as plan_slug, p.preco as plan_price
       FROM assinaturas a
       JOIN usuarios u ON a.usuario_id = u.id
       JOIN planos_assinatura p ON a.plano_id = p.id
       ORDER BY a.criado_em DESC`,
    )

    return NextResponse.json({ subscriptions })
  } catch (error: any) {
    console.error("[v0] Erro ao listar assinaturas:", error)
    return NextResponse.json({ error: error.message || "Erro ao listar assinaturas" }, { status: 500 })
  }
}
