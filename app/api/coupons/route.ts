import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { hasAccessToPremiumCoupons } from "@/lib/subscription"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "newest"

    const user = await getCurrentUser()

    const hasPremiumAccess = user ? await hasAccessToPremiumCoupons(user.id) : false

    let sql = `
      SELECT c.id, c.titulo as title, c.descricao as description, 
        ${user && hasPremiumAccess ? "c.codigo as code" : "CASE WHEN c.e_premium = 1 THEN '****' ELSE c.codigo END as code"},
        c.desconto as discount, c.loja as store, c.categoria as category, c.expira_em as expires_at, c.e_premium as is_premium,
        ${user ? `EXISTS(SELECT 1 FROM favoritos WHERE usuario_id = ? AND cupon_id = c.id) as is_favorite` : "false as is_favorite"}
      FROM cupons c
      WHERE 1=1
    `
    const params: any[] = user ? [user.id] : []

    if (!hasPremiumAccess) {
      sql += " AND c.e_premium = 0"
    }

    if (category && category !== "all") {
      sql += " AND c.categoria = ?"
      params.push(category)
    }

    if (search) {
      sql += " AND (c.titulo LIKE ? OR c.descricao LIKE ? OR c.loja LIKE ?)"
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    // Ordenação
    switch (sort) {
      case "discount":
        sql += " ORDER BY c.desconto DESC"
        break
      case "expiring":
        sql += " ORDER BY c.expira_em ASC"
        break
      case "newest":
      default:
        sql += " ORDER BY c.criado_em DESC"
        break
    }

    const coupons = await query(sql, params)

    return NextResponse.json({ coupons })
  } catch (error) {
    console.error("Error fetching coupons:", error)
    return NextResponse.json({ error: "Erro ao buscar cupons" }, { status: 500 })
  }
}
