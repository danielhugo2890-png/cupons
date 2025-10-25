import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

// GET - Buscar mensagens de uma conversa
export async function GET(request: NextRequest, { params }: { params: { conversaId: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const conversaId = params.conversaId

    // Buscar mensagens da conversa
    const mensagens = await query(
      `SELECT m.*, u.nome as remetente_nome, u.avatar_url as remetente_avatar
       FROM mensagens_chat m
       JOIN usuarios u ON m.remetente_id = u.id
       WHERE m.conversa_id = ?
       ORDER BY m.criado_em ASC`,
      [conversaId],
    )

    // Marcar mensagens como lidas se não for o remetente
    await query(
      `UPDATE mensagens_chat 
       SET lida = TRUE 
       WHERE conversa_id = ? AND remetente_id != ? AND lida = FALSE`,
      [conversaId, user.id],
    )

    return NextResponse.json(mensagens)
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error)
    return NextResponse.json({ error: "Erro ao buscar mensagens" }, { status: 500 })
  }
}

// POST - Enviar nova mensagem
export async function POST(request: NextRequest, { params }: { params: { conversaId: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { mensagem } = await request.json()
    const conversaId = params.conversaId

    if (!mensagem || mensagem.trim() === "") {
      return NextResponse.json({ error: "Mensagem não pode estar vazia" }, { status: 400 })
    }

    // Inserir nova mensagem
    const result = await query(
      `INSERT INTO mensagens_chat (conversa_id, remetente_id, mensagem) 
       VALUES (?, ?, ?)`,
      [conversaId, user.id, mensagem],
    )

    // Atualizar timestamp da conversa
    await query(`UPDATE conversas SET atualizado_em = CURRENT_TIMESTAMP WHERE id = ?`, [conversaId])

    // Buscar a mensagem criada com dados do remetente
    const novaMensagem = await query(
      `SELECT m.*, u.nome as remetente_nome, u.avatar_url as remetente_avatar
       FROM mensagens_chat m
       JOIN usuarios u ON m.remetente_id = u.id
       WHERE m.id = ?`,
      [result.insertId],
    )

    return NextResponse.json(novaMensagem[0], { status: 201 })
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error)
    return NextResponse.json({ error: "Erro ao enviar mensagem" }, { status: 500 })
  }
}
