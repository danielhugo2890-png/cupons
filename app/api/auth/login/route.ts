import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyPassword, createSession } from "@/lib/auth"
import { validateEmail, sanitizeString, checkRateLimit } from "@/lib/validation"
import { getClientIp } from "@/lib/security"

export async function POST(request: NextRequest) {
  try {
    const clientIp = await getClientIp()
    if (!checkRateLimit(`login:${clientIp}`, 10, 300000)) {
      // 10 tentativas por 5 minutos
      return NextResponse.json({ error: "Muitas tentativas. Tente novamente em alguns minutos." }, { status: 429 })
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Sanitizar email
    const sanitizedEmail = sanitizeString(email).toLowerCase()

    // Validar email
    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    // Buscar usuário
    const users = await query("SELECT id, nome, email, senha, papel FROM usuarios WHERE email = ?", [sanitizedEmail])

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 })
    }

    const user = users[0]

    // Verificar senha
    const isValid = await verifyPassword(password, user.senha)

    if (!isValid) {
      return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 })
    }

    // Criar sessão
    await createSession(user.id)

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.nome, email: user.email, role: user.papel },
    })
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 })
  }
}
