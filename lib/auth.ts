// Utilitários de autenticação
import { cookies } from "next/headers"
import { query } from "./db"
import bcrypt from "bcryptjs"

export interface User {
  id: number
  name: string
  email: string
  role: "usuario" | "admin"
  avatar_url?: string | null
  created_at: Date
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

// Criar sessão
export async function createSession(userId: number): Promise<string> {
  const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias

  await query("INSERT INTO sessoes (id, usuario_id, expira_em) VALUES (?, ?, ?)", [sessionId, userId, expiresAt])

  const cookieStore = await cookies()
  cookieStore.set("session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  })

  return sessionId
}

// Obter usuário da sessão
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session")?.value

  if (!sessionId) return null

  const sessions = await query(
    "SELECT s.*, u.id, u.nome, u.email, u.papel, u.avatar_url, u.criado_em FROM sessoes s JOIN usuarios u ON s.usuario_id = u.id WHERE s.id = ? AND s.expira_em > NOW()",
    [sessionId]
  )

  if (!sessions || sessions.length === 0) return null

  return {
    id: sessions[0].id,
    name: sessions[0].nome,
    email: sessions[0].email,
    role: sessions[0].papel,
    avatar_url: sessions[0].avatar_url,
    created_at: sessions[0].criado_em,
  }
}

// Destruir sessão
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session")?.value

  if (sessionId) {
    await query("DELETE FROM sessoes WHERE id = ?", [sessionId])
  }

  cookieStore.delete("session")
}

// Verificar se usuário é admin
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === "admin"
}

// Middleware de autorização admin (corrigido)
export async function requireAdmin(): Promise<User> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      throw new Error("Usuário não autenticado. Faça login para continuar.")
    }

    if (user.role !== "admin") {
      throw new Error("Acesso negado: apenas administradores podem acessar esta rota.")
    }

    return user
  } catch (error: any) {
    // Garante que nunca retorna undefined
    const message =
      error?.message || "Erro de autenticação ou permissão. Acesso negado."
    throw new Error(message)
  }
}
