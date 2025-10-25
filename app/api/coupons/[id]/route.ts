import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    const sql = `
      SELECT c.id, c.titulo as title, c.descricao as description,
        ${user ? "c.codigo as code" : "CASE WHEN c.e_premium = 1 THEN '****' ELSE c.codigo END as code"},
        c.desconto as discount, c.loja as store, c.categoria as category, c.expira_em as expires_at, c.e_premium as is_premium,
        ${user ? `EXISTS(SELECT 1 FROM favoritos WHERE usuario_id = ? AND cupon_id = c.id) as is_favorite` : "false as is_favorite"}
      FROM cupons c
      WHERE c.id = ?
    `
    const queryParams = user ? [user.id, params.id] : [params.id]

    const results = await query(sql, queryParams)

    if (results.length === 0) {
      return NextResponse.json({ error: "Cupom não encontrado" }, { status: 404 })
    }

    const coupon = results[0]

    if (coupon.is_premium && !user) {
      return NextResponse.json(
        { error: "Este cupom é premium. Faça login ou cadastre-se para acessar." },
        { status: 403 },
      )
    }

    return NextResponse.json({ coupon })
  } catch (error) {
    console.error("Error fetching coupon:", error)
    return NextResponse.json({ error: "Erro ao buscar cupom" }, { status: 500 })
  }
}
