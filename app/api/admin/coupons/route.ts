import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { sanitizeString, validateCouponCode, validateDiscount, validateCategory, validateDate } from "@/lib/validation"

// GET - Listar todos os cupons (admin)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    const coupons = await query("SELECT * FROM cupons ORDER BY criado_em DESC LIMIT ? OFFSET ?", [limit, offset])

    const totalResult = await query("SELECT COUNT(*) as total FROM cupons")
    const total = totalResult[0].total

    // Mapear colunas para inglês no retorno
    const mappedCoupons = coupons.map((c: any) => ({
      id: c.id,
      title: c.titulo,
      description: c.descricao,
      code: c.codigo,
      discount: c.desconto,
      category: c.categoria,
      store: c.loja,
      expires_at: c.expira_em,
      is_premium: c.e_premium,
      created_at: c.criado_em,
      updated_at: c.atualizado_em,
    }))

    return NextResponse.json({
      coupons: mappedCoupons,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message.includes("autenticado") ? 401 : 403 })
  }
}

// POST - Criar novo cupom (admin)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

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

    // Verificar se código já existe
    const existingCoupons = await query("SELECT id FROM cupons WHERE codigo = ?", [sanitizedCode])
    if (existingCoupons && existingCoupons.length > 0) {
      return NextResponse.json({ error: "Este código de cupom já existe" }, { status: 400 })
    }

    const result = await query(
      "INSERT INTO cupons (titulo, descricao, codigo, desconto, categoria, loja, expira_em, e_premium) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        sanitizedTitle,
        sanitizedDescription,
        sanitizedCode,
        sanitizedDiscount,
        sanitizedCategory,
        sanitizedStore,
        valid_until || null,
        is_premium || false,
      ],
    )

    return NextResponse.json(
      {
        message: "Cupom criado com sucesso",
        id: result.insertId,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Erro ao criar cupom:", error)
    return NextResponse.json({ error: error.message }, { status: error.message.includes("autenticado") ? 401 : 403 })
  }
}
