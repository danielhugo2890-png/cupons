import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

// GET - Listar todas as conversas (admin vê todas, usuário vê apenas as suas)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    let conversas

    if (user.papel === "admin") {
      // Admin vê todas as conversas
      conversas = await query(
        `SELECT c.*, f.nome, f.email, f.assunto,
         (SELECT COUNT(*) FROM mensagens_chat WHERE conversa_id = c.id AND lida = FALSE AND remetente_id != ?) as nao_lidas,
         (SELECT mensagem FROM mensagens_chat WHERE conversa_id = c.id ORDER BY criado_em DESC LIMIT 1) as ultima_mensagem
         FROM conversas c
         JOIN feedback f ON c.feedback_id = f.id
         ORDER BY c.atualizado_em DESC`,
        [user.id],
      )
    } else {
      // Usuário vê apenas suas conversas
      conversas = await query(
        `SELECT c.*, f.nome, f.email, f.assunto,
         (SELECT COUNT(*) FROM mensagens_chat WHERE conversa_id = c.id AND lida = FALSE AND remetente_id != ?) as nao_lidas,
         (SELECT mensagem FROM mensagens_chat WHERE conversa_id = c.id ORDER BY criado_em DESC LIMIT 1) as ultima_mensagem
         FROM conversas c
         JOIN feedback f ON c.feedback_id = f.id
         WHERE c.usuario_id = ?
         ORDER BY c.atualizado_em DESC`,
        [user.id, user.id],
      )
    }

    return NextResponse.json(conversas)
  } catch (error) {
    console.error("Erro ao buscar conversas:", error)
    return NextResponse.json({ error: "Erro ao buscar conversas" }, { status: 500 })
  }
}

// POST - Criar nova conversa a partir de um feedback
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.papel !== "admin") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { feedbackId } = await request.json()

    // Verificar se já existe conversa para este feedback
    const conversaExistente = await query(`SELECT id FROM conversas WHERE feedback_id = ?`, [feedbackId])

    if (conversaExistente.length > 0) {
      return NextResponse.json(conversaExistente[0])
    }

    // Criar nova conversa
    const result = await query(`INSERT INTO conversas (feedback_id, admin_id) VALUES (?, ?)`, [feedbackId, user.id])

    return NextResponse.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar conversa:", error)
    return NextResponse.json({ error: "Erro ao criar conversa" }, { status: 500 })
  }
}
