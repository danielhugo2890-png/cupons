import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { status } = body

    const validStatuses = ["novo", "lido", "respondido", "resolvido"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 })
    }

    const result = await query<any>(`UPDATE feedback SET status = ? WHERE id = ?`, [status, id])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Feedback não encontrado" }, { status: 404 })
    }

    // Buscar o feedback atualizado
    const [feedback] = await query<Array<any>>(
      `SELECT id, nome, email, telefone, assunto, mensagem, criado_em as timestamp, status
       FROM feedback WHERE id = ?`,
      [id],
    )

    return NextResponse.json({ success: true, feedback }, { status: 200 })
  } catch (error) {
    console.error("Erro ao atualizar feedback:", error)
    return NextResponse.json({ error: "Erro ao atualizar status" }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params

    const result = await query<any>(`DELETE FROM feedback WHERE id = ?`, [id])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Feedback não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Feedback deletado com sucesso" }, { status: 200 })
  } catch (error) {
    console.error("Erro ao deletar feedback:", error)
    return NextResponse.json({ error: "Erro ao deletar feedback" }, { status: 500 })
  }
}
