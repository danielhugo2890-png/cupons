import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

// PUT - Atualizar role do usuário (admin)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    const { id } = await params

    // Não permitir que admin mude seu próprio role
    if (admin.id === Number.parseInt(id)) {
      return NextResponse.json({ error: "Você não pode alterar seu próprio role" }, { status: 400 })
    }

    const body = await request.json()
    const { role } = body

    if (!["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Role inválido" }, { status: 400 })
    }

    // Mapear inglês -> português para o banco
    const rolePtBr = role === "user" ? "usuario" : "admin"

    const result = await query("UPDATE usuarios SET papel = ? WHERE id = ?", [rolePtBr, id])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Role atualizado com sucesso" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message.includes("autenticado") ? 401 : 403 })
  }
}

// DELETE - Deletar usuário (admin)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin()
    const { id } = await params

    // Não permitir que admin delete a si mesmo
    if (admin.id === Number.parseInt(id)) {
      return NextResponse.json({ error: "Você não pode deletar sua própria conta" }, { status: 400 })
    }

    // Deletar favoritos do usuário
    await query("DELETE FROM favoritos WHERE usuario_id = ?", [id])

    // Deletar sessões do usuário
    await query("DELETE FROM sessoes WHERE usuario_id = ?", [id])

    // Deletar usuário
    const result = await query("DELETE FROM usuarios WHERE id = ?", [id])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Usuário deletado com sucesso" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message.includes("autenticado") ? 401 : 403 })
  }
}
