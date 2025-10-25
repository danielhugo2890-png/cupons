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

    const result = await query(
      `INSERT INTO feedback (nome, email, telefone, assunto, mensagem, status, criado_em) 
       VALUES (?, ?, ?, ?, ?, 'novo', NOW())`,
      [nome, email, telefone || null, assunto || "Outros", mensagem],
    )

    console.log("[v0] Feedback inserido com sucesso:", result)

    return NextResponse.json(
      {
        success: true,
        message: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
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
