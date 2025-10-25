import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

// GET - Buscar mensagens de um feedback específico
export async function GET(request: NextRequest, { params }: { params: { feedbackId: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.papel !== "admin") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 })
    }

    const feedbackId = params.feedbackId

    // Buscar mensagens do feedback ordenadas por data
    const mensagens = await query<
      Array<{
        id: number
        feedback_id: number
        remetente: "usuario" | "admin"
        mensagem: string
        data: string
        lida: boolean
      }>
    >(
      `SELECT id, feedback_id, remetente, mensagem, data, lida
       FROM mensagens_chat
       WHERE feedback_id = ?
       ORDER BY data ASC`,
      [feedbackId],
    )

    // Marcar mensagens do usuário como lidas pelo admin
    await query(
      `UPDATE mensagens_chat
       SET lida = TRUE
       WHERE feedback_id = ? AND remetente = 'usuario' AND lida = FALSE`,
      [feedbackId],
    )

    // Atualizar status do feedback para 'lido' se ainda estiver como 'novo'
    await query(
      `UPDATE feedback
       SET status = 'lido'
       WHERE id = ? AND status = 'novo'`,
      [feedbackId],
    )

    return NextResponse.json({ mensagens })
  } catch (error) {
    console.error("[v0] Erro ao buscar mensagens do feedback:", error)
    return NextResponse.json({ error: "Erro ao buscar mensagens" }, { status: 500 })
  }
}

// POST - Admin envia resposta para um feedback
export async function POST(request: NextRequest, { params }: { params: { feedbackId: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.papel !== "admin") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 })
    }

    const { mensagem } = await request.json()
    const feedbackId = params.feedbackId

    if (!mensagem || mensagem.trim() === "") {
      return NextResponse.json({ error: "Mensagem não pode estar vazia" }, { status: 400 })
    }

    // Verificar se o feedback existe
    const feedbackExists = await query<Array<{ id: number }>>(
      `SELECT id FROM feedback WHERE id = ?`,
      [feedbackId],
    )

    if (!feedbackExists || feedbackExists.length === 0) {
      return NextResponse.json({ error: "Feedback não encontrado" }, { status: 404 })
    }

    // Inserir nova mensagem do admin
    const result: any = await query(
      `INSERT INTO mensagens_chat (feedback_id, remetente, mensagem, data, lida)
       VALUES (?, 'admin', ?, NOW(), FALSE)`,
      [feedbackId, mensagem],
    )

    // Atualizar status do feedback para 'respondido'
    await query(`UPDATE feedback SET status = 'respondido' WHERE id = ?`, [feedbackId])

    // Buscar a mensagem criada
    const novaMensagem = await query<
      Array<{
        id: number
        feedback_id: number
        remetente: "usuario" | "admin"
        mensagem: string
        data: string
        lida: boolean
      }>
    >(
      `SELECT id, feedback_id, remetente, mensagem, data, lida
       FROM mensagens_chat
       WHERE id = ?`,
      [result.insertId],
    )

    console.log("[v0] Resposta do admin enviada com sucesso:", novaMensagem[0])

    return NextResponse.json(
      {
        success: true,
        message: "Resposta enviada com sucesso",
        mensagem: novaMensagem[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Erro ao enviar resposta:", error)
    return NextResponse.json({ error: "Erro ao enviar resposta" }, { status: 500 })
  }
}
