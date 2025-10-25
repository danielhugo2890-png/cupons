import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { hashPassword, createSession } from "@/lib/auth"
import { validateEmail, validatePassword, sanitizeString, checkRateLimit } from "@/lib/validation"
import { getClientIp } from "@/lib/security"

export async function POST(request: NextRequest) {
  try {
    const clientIp = await getClientIp()
    if (!checkRateLimit(`register:${clientIp}`, 5, 300000)) {
      return NextResponse.json({ error: "Muitas tentativas. Tente novamente em alguns minutos." }, { status: 429 })
    }

    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    const sanitizedName = sanitizeString(name)
    const sanitizedEmail = sanitizeString(email).toLowerCase()

    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.message }, { status: 400 })
    }

    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return NextResponse.json({ error: "Nome deve ter entre 2 e 100 caracteres" }, { status: 400 })
    }

    const existingUsers = await query("SELECT id FROM usuarios WHERE email = ?", [sanitizedEmail])

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ error: "Este email já está cadastrado" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const result = await query("INSERT INTO usuarios (nome, email, senha, papel) VALUES (?, ?, ?, ?)", [
      sanitizedName,
      sanitizedEmail,
      hashedPassword,
      "usuario",
    ])

    const userId = result.insertId

    await createSession(userId)

    return NextResponse.json({
      success: true,
      user: { id: userId, name: sanitizedName, email: sanitizedEmail, role: "usuario" },
    })
  } catch (error) {
    console.error("Erro no registro:", error)
    return NextResponse.json(
      { error: "Erro ao criar conta. Verifique se o banco de dados está configurado." },
      { status: 500 },
    )
  }
}
