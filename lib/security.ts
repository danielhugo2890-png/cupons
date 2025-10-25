// Utilitários de segurança

import { headers } from "next/headers"

// Obter IP do cliente
export async function getClientIp(): Promise<string> {
  const headersList = await headers()
  return (
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("x-real-ip") ||
    headersList.get("cf-connecting-ip") ||
    "unknown"
  )
}

// Verificar se requisição é suspeita
export function isSuspiciousRequest(userAgent: string | null): boolean {
  if (!userAgent) return true

  const suspiciousPatterns = [/bot/i, /crawler/i, /spider/i, /scraper/i, /curl/i, /wget/i, /python/i, /java(?!script)/i]

  return suspiciousPatterns.some((pattern) => pattern.test(userAgent))
}

// Sanitizar entrada SQL (básico - em produção use prepared statements)
export function escapeSql(value: any): string {
  if (value === null || value === undefined) return "NULL"
  if (typeof value === "number") return value.toString()
  if (typeof value === "boolean") return value ? "1" : "0"

  return value.toString().replace(/[\0\x08\x09\x1a\n\r"'\\%]/g, (char: string) => {
    switch (char) {
      case "\0":
        return "\\0"
      case "\x08":
        return "\\b"
      case "\x09":
        return "\\t"
      case "\x1a":
        return "\\z"
      case "\n":
        return "\\n"
      case "\r":
        return "\\r"
      case '"':
      case "'":
      case "\\":
      case "%":
        return "\\" + char
      default:
        return char
    }
  })
}

// Gerar token CSRF
export function generateCsrfToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Headers de segurança
export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}
