import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth"
import { validateEmail, validatePassword, sanitizeString } from "@/lib/validation"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    return NextResponse.json({
      id: user.id,
      nome: user.name,
      email: user.email,
      papel: user.role,
      avatar_url: user.avatar_url,
    })
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { name, email, currentPassword, newPassword } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: "Nome e email são obrigatórios" }, { status: 400 })
    }

    // Sanitizar inputs
    const sanitizedName = sanitizeString(name)
    const sanitizedEmail = sanitizeString(email).toLowerCase()

    // Validar email
    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    // Validar nome
    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return NextResponse.json({ error: "Nome deve ter entre 2 e 100 caracteres" }, { status: 400 })
    }

    // Verificar se o email já está em uso por outro usuário
    const emailCheck = await query("SELECT id FROM usuarios WHERE email = ? AND id != ?", [sanitizedEmail, user.id])

    if (emailCheck.length > 0) {
      return NextResponse.json({ error: "Email já está em uso" }, { status: 400 })
    }

    // Se está alterando a senha, verificar a senha atual
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Senha atual é obrigatória para alterar a senha" }, { status: 400 })
      }

      // Validar nova senha
      const passwordValidation = validatePassword(newPassword)
      if (!passwordValidation.valid) {
        return NextResponse.json({ error: passwordValidation.message }, { status: 400 })
      }

      const userWithPassword = await query("SELECT senha FROM usuarios WHERE id = ?", [user.id])

      const isPasswordValid = await verifyPassword(currentPassword, userWithPassword[0].senha)

      if (!isPasswordValid) {
        return NextResponse.json({ error: "Senha atual incorreta" }, { status: 400 })
      }

      const hashedPassword = await hashPassword(newPassword)
      await query("UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?", [
        sanitizedName,
        sanitizedEmail,
        hashedPassword,
        user.id,
      ])
    } else {
      await query("UPDATE usuarios SET nome = ?, email = ? WHERE id = ?", [sanitizedName, sanitizedEmail, user.id])
    }

    const updatedUser = await query("SELECT id, nome, email, papel, criado_em FROM usuarios WHERE id = ?", [user.id])

    return NextResponse.json({
      user: {
        id: updatedUser[0].id,
        name: updatedUser[0].nome,
        email: updatedUser[0].email,
        role: updatedUser[0].papel,
        created_at: updatedUser[0].criado_em,
      },
    })
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    if (user.role === "admin") {
      const adminCount = await query("SELECT COUNT(*) as count FROM usuarios WHERE papel = 'admin'")
      if (adminCount[0].count <= 1) {
        return NextResponse.json({ error: "Não é possível deletar o último administrador do sistema" }, { status: 400 })
      }
    }

    // Deletar favoritos do usuário
    await query("DELETE FROM favoritos WHERE usuario_id = ?", [user.id])

    // Deletar sessões do usuário
    await query("DELETE FROM sessoes WHERE usuario_id = ?", [user.id])

    // Deletar usuário
    await query("DELETE FROM usuarios WHERE id = ?", [user.id])

    // Limpar cookie de sessão
    const response = NextResponse.json({ message: "Conta deletada com sucesso" })
    response.cookies.set("session", "", { maxAge: 0 })

    return response
  } catch (error) {
    console.error("Erro ao deletar usuário:", error)
    return NextResponse.json({ error: "Erro ao deletar conta" }, { status: 500 })
  }
}
