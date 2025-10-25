// Utilitários de validação e sanitização

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: "A senha deve ter no mínimo 8 caracteres" }
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "A senha deve conter pelo menos uma letra maiúscula" }
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "A senha deve conter pelo menos uma letra minúscula" }
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "A senha deve conter pelo menos um número" }
  }

  return { valid: true }
}

export function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, "")
}

export function validateCouponCode(code: string): boolean {
  // Código deve ter entre 3 e 20 caracteres alfanuméricos
  return /^[A-Z0-9]{3,20}$/.test(code)
}

export function validateDiscount(discount: string): boolean {
  // Validar formatos como "50% OFF", "R$ 100 OFF", etc
  return discount.length > 0 && discount.length <= 50
}

export function validateCategory(category: string): boolean {
  const validCategories = ["moda", "tecnologia", "alimentos", "viagem", "beleza", "casa", "esportes", "outros"]
  return validCategories.includes(category.toLowerCase())
}

export function validateDate(dateString: string): boolean {
  if (!dateString) return true // Data é opcional
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime()) && date > new Date()
}

// Rate limiting simples (em produção, use Redis ou similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

// Limpar registros antigos periodicamente
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 60000)
