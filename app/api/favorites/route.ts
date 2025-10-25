import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { canAddFavorite } from "@/lib/subscription"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const sql = `
      SELECT c.id, c.titulo as title, c.descricao as description, c.codigo as code,
        c.desconto as discount, c.loja as store, c.categoria as category, 
        c.expira_em as expires_at, c.e_premium as is_premium, true as is_favorite
      FROM cupons c
      INNER JOIN favoritos f ON c.id = f.cupon_id
      WHERE f.usuario_id = ?
      ORDER BY f.criado_em DESC
    `

    const favorites = await query(sql, [user.id])

    return NextResponse.json({ favorites })
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error)
    return NextResponse.json({ error: "Erro ao buscar favoritos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { couponId } = await request.json()

    if (!couponId) {
      return NextResponse.json({ error: "ID do cupom é obrigatório" }, { status: 400 })
    }

    // Validar que couponId é um número
    const parsedCouponId = Number.parseInt(couponId)
    if (isNaN(parsedCouponId) || parsedCouponId <= 0) {
      return NextResponse.json({ error: "ID do cupom inválido" }, { status: 400 })
    }

    const canAdd = await canAddFavorite(user.id)
    if (!canAdd) {
      return NextResponse.json(
        {
          error: "Limite de favoritos atingido. Faça upgrade do seu plano para adicionar mais favoritos.",
        },
        { status: 403 },
      )
    }

    // Verificar se o cupom existe
    const couponCheck = await query("SELECT id FROM cupons WHERE id = ?", [parsedCouponId])
    if (couponCheck.length === 0) {
      return NextResponse.json({ error: "Cupom não encontrado" }, { status: 404 })
    }

    // Verificar se já está nos favoritos
    const existingFavorite = await query("SELECT id FROM favoritos WHERE usuario_id = ? AND cupon_id = ?", [
      user.id,
      parsedCouponId,
    ])

    if (existingFavorite.length > 0) {
      return NextResponse.json({ error: "Cupom já está nos favoritos" }, { status: 400 })
    }

    // Adicionar aos favoritos
    await query("INSERT INTO favoritos (usuario_id, cupon_id) VALUES (?, ?)", [user.id, parsedCouponId])

    return NextResponse.json({ message: "Cupom adicionado aos favoritos" })
  } catch (error) {
    console.error("Erro ao adicionar favorito:", error)
    return NextResponse.json({ error: "Erro ao adicionar favorito" }, { status: 500 })
  }
}
