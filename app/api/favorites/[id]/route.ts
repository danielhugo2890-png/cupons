import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params

    const parsedId = Number.parseInt(id)
    if (isNaN(parsedId) || parsedId <= 0) {
      return NextResponse.json({ error: "ID do cupom inválido" }, { status: 400 })
    }

    const result = await query("DELETE FROM favoritos WHERE usuario_id = ? AND cupon_id = ?", [user.id, parsedId])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Favorito não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Cupom removido dos favoritos" })
  } catch (error) {
    console.error("Erro ao remover favorito:", error)
    return NextResponse.json({ error: "Erro ao remover favorito" }, { status: 500 })
  }
}
