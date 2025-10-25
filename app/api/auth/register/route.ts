import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { hashPassword, createSession } from "@/lib/auth"
import { validateEmail, validatePassword, sanitizeString, checkRateLimit } from "@/lib/validation"
import { getClientIp } from "@/lib/security"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Iniciando registro de usuário")

    const clientIp = await getClientIp()
    if (!checkRateLimit(`register:${clientIp}`, 5, 300000)) {
      console.log("[v0] Rate limit excedido para IP:", clientIp)
      return NextResponse.json({ error: "Muitas tentativas. Tente novamente em alguns minutos." }, { status: 429 })
    }

    const { name, email, password } = await request.json()
    console.log("[v0] Dados recebidos - Nome:", name, "Email:", email)

    if (!name || !email || !password) {
      console.log("[v0] Campos obrigatórios faltando")
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    // Sanitizar inputs
    const sanitizedName = sanitizeString(name)
    const sanitizedEmail = sanitizeString(email).toLowerCase()

    // Validar email
    if (!validateEmail(sanitizedEmail)) {
      console.log("[v0] Email inválido:", sanitizedEmail)
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    // Validar senha
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      console.log("[v0] Senha inválida:", passwordValidation.message)
      return NextResponse.json({ error: passwordValidation.message }, { status: 400 })
    }

    // Validar nome
    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      console.log("[v0] Nome com tamanho inválido:", sanitizedName.length)
      return NextResponse.json({ error: "Nome deve ter entre 2 e 100 caracteres" }, { status: 400 })
    }

    console.log("[v0] Verificando se email já existe...")
    // Verificar se email já existe
    const existingUsers = await query("SELECT id FROM usuarios WHERE email = ?", [sanitizedEmail])

    if (existingUsers && existingUsers.length > 0) {
      console.log("[v0] Email já cadastrado:", sanitizedEmail)
      return NextResponse.json({ error: "Este email já está cadastrado" }, { status: 400 })
    }

    console.log("[v0] Criando hash da senha...")
    // Criar usuário
    const hashedPassword = await hashPassword(password)

    console.log("[v0] Inserindo usuário no banco de dados...")
    // Inserindo usuário no banco de dados
    const result = await query("INSERT INTO usuarios (nome, email, senha, papel) VALUES (?, ?, ?, ?)", [
      sanitizedName,
      sanitizedEmail,
      hashedPassword,
      "usuario", // papel padrão
    ])

    const userId = result.insertId
    console.log("[v0] Usuário criado com ID:", userId)

    console.log("[v0] Criando sessão...")
    // Criar sessão
    await createSession(userId)

    console.log("[v0] Registro concluído com sucesso!")
    return NextResponse.json({
      success: true,
      user: { id: userId, name: sanitizedName, email: sanitizedEmail },
    })
  } catch (error) {
    console.error("[v0] Erro no registro:", error)
    return NextResponse.json(
      { error: "Erro ao criar conta. Verifique se o banco de dados está configurado." },
      { status: 500 },
    )
  }
}
