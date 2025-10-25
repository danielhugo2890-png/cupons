import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { sanitizeString, validateCouponCode, validateDiscount, validateCategory, validateDate } from "@/lib/validation"

// PUT - Atualizar cupom (admin)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const { id } = params

    const parsedId = Number.parseInt(id)
    if (isNaN(parsedId) || parsedId <= 0) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()
    const { title, description, code, discount, category, store, valid_until, is_premium } = body

    if (!title || !code || !discount || !category || !store) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    // Sanitizar inputs
    const sanitizedTitle = sanitizeString(title)
    const sanitizedDescription = description ? sanitizeString(description) : null
    const sanitizedCode = sanitizeString(code).toUpperCase()
    const sanitizedDiscount = sanitizeString(discount)
    const sanitizedCategory = sanitizeString(category).toLowerCase()
    const sanitizedStore = sanitizeString(store)

    // Validar código do cupom
    if (!validateCouponCode(sanitizedCode)) {
      return NextResponse.json(
        { error: "Código inválido. Use apenas letras maiúsculas e números (3-20 caracteres)" },
        { status: 400 },
      )
    }

    // Validar desconto
    if (!validateDiscount(sanitizedDiscount)) {
      return NextResponse.json({ error: "Desconto inválido" }, { status: 400 })
    }

    // Validar categoria
    if (!validateCategory(sanitizedCategory)) {
      return NextResponse.json({ error: "Categoria inválida" }, { status: 400 })
    }

    // Validar data de validade
    if (valid_until && !validateDate(valid_until)) {
      return NextResponse.json({ error: "Data de validade inválida ou no passado" }, { status: 400 })
    }

    // Validar tamanhos
    if (sanitizedTitle.length < 3 || sanitizedTitle.length > 200) {
      return NextResponse.json({ error: "Título deve ter entre 3 e 200 caracteres" }, { status: 400 })
    }

    if (sanitizedStore.length < 2 || sanitizedStore.length > 100) {
      return NextResponse.json({ error: "Nome da loja deve ter entre 2 e 100 caracteres" }, { status: 400 })
    }

    // Verificar se código já existe em outro cupom
    const existingCoupons = await query("SELECT id FROM cupons WHERE codigo = ? AND id != ?", [sanitizedCode, parsedId])
    if (existingCoupons && existingCoupons.length > 0) {
      return NextResponse.json({ error: "Este código de cupom já existe em outro cupom" }, { status: 400 })
    }

    const result = await query(
      "UPDATE cupons SET titulo = ?, descricao = ?, codigo = ?, desconto = ?, categoria = ?, loja = ?, expira_em = ?, e_premium = ? WHERE id = ?",
      [
        sanitizedTitle,
        sanitizedDescription,
        sanitizedCode,
        sanitizedDiscount,
        sanitizedCategory,
        sanitizedStore,
        valid_until,
        is_premium,
        parsedId,
      ],
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Cupom não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Cupom atualizado com sucesso" })
  } catch (error: any) {
    console.error("Erro ao atualizar cupom:", error)
    return NextResponse.json({ error: error.message }, { status: error.message.includes("autenticado") ? 401 : 403 })
  }
}

// DELETE - Deletar cupom (admin)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    const { id } = params

    const parsedId = Number.parseInt(id)
    if (isNaN(parsedId) || parsedId <= 0) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    // Deletar favoritos relacionados primeiro
    await query("DELETE FROM favoritos WHERE cupon_id = ?", [parsedId])

    // Deletar cupom
    const result = await query("DELETE FROM cupons WHERE id = ?", [parsedId])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Cupom não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Cupom deletado com sucesso" })
  } catch (error: any) {
    console.error("Erro ao deletar cupom:", error)
    return NextResponse.json({ error: error.message }, { status: error.message.includes("autenticado") ? 401 : 403 })
  }
}
