import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

// =====================
// 🔹 GET - Listar usuários (somente admin)
// =====================
export async function GET(request: NextRequest) {
  try {
    // 🔐 Verifica se o usuário logado é admin
    await requireAdmin()

    // Paginação opcional (mantida igual)
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    console.log("[v0] Buscando usuários no banco...")

    // ✅ Consulta SQL (corrigida: sem placeholders em LIMIT/OFFSET)
    const users = await query(`
      SELECT id, nome, email, papel, criado_em 
      FROM usuarios 
      ORDER BY criado_em DESC 
      LIMIT ${limit} OFFSET ${offset}
    `)

    const totalResult = await query("SELECT COUNT(*) as total FROM usuarios")
    const total = totalResult[0]?.total || 0

    // Mapeia os usuários pro formato esperado no front
    const mappedUsers = users.map((u: any) => ({
      id: u.id,
      name: u.nome,
      email: u.email,
      role: u.papel,
      created_at: u.criado_em,
    }))

    console.log(`[v0] ${mappedUsers.length} usuários retornados.`)

    // Retorna resposta normal
    return NextResponse.json({
      users: mappedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("[v0] Erro na API admin/users:", error)

    // ✅ Tratamento de erro 100% seguro e legível
    const message =
      error?.message ||
      "Erro desconhecido. Possível falha de autenticação ou acesso negado."

    const lower = message.toLowerCase()
    const status = lower.includes("autenticado")
      ? 401
      : lower.includes("negado")
      ? 403
      : 500

    return NextResponse.json({ error: message }, { status })
  }
}
