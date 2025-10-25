import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, email, telefone, assunto, mensagem } = body

    console.log("[v0] Recebendo feedback:", { nome, email, telefone, assunto, mensagem })

    // Validate required fields
    if (!nome || !email || !mensagem) {
      return NextResponse.json({ error: "Nome, email e mensagem são obrigatórios" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    // Inserir feedback
    const result: any = await query(
      `INSERT INTO feedback (nome, email, telefone, assunto, mensagem, status, criado_em)
       VALUES (?, ?, ?, ?, ?, 'novo', NOW())`,
      [nome, email, telefone || null, assunto || "Outros", mensagem],
    )

    const feedbackId = result.insertId

    console.log("[v0] Feedback inserido com sucesso:", { feedbackId, ...result })

    // Inserir mensagem no chat automaticamente
    try {
      await query(
        `INSERT INTO mensagens_chat (feedback_id, remetente, mensagem, data, lida)
         VALUES (?, 'usuario', ?, NOW(), FALSE)`,
        [feedbackId, mensagem],
      )
      console.log("[v0] Mensagem do feedback adicionada ao chat com sucesso")
    } catch (chatError) {
      console.error("[v0] Erro ao inserir mensagem no chat:", chatError)
      // Não falha o feedback se o chat der erro, apenas loga
    }

    return NextResponse.json(
      {
        success: true,
        message: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
        feedbackId,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Erro ao processar feedback:", error)
    return NextResponse.json({ error: "Erro ao enviar mensagem. Tente novamente mais tarde." }, { status: 500 })
  }
}

export async function GET() {
  try {
    const results = await query<
      Array<{
        id: number
        nome: string
        email: string
        telefone: string | null
        assunto: string
        mensagem: string
        criado_em: string
        status: "novo" | "lido" | "respondido" | "resolvido"
      }>
    >(
      `SELECT id, nome, email, telefone, assunto, mensagem, criado_em as timestamp, status
       FROM feedback
       ORDER BY criado_em DESC`,
    )

    return NextResponse.json({ feedback: results }, { status: 200 })
  } catch (error) {
    console.error("[v0] Erro ao buscar feedback:", error)
    return NextResponse.json({ error: "Erro ao buscar mensagens" }, { status: 500 })
  }
}
