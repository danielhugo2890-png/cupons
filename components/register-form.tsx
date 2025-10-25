"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { UserPlus, AlertCircle, Check, X } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/lib/user-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { validatePassword } from "@/lib/validation"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { register } = useUser()

  const passwordValidation = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  }

  const isPasswordValid = Object.values(passwordValidation).every(Boolean)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    const validation = validatePassword(password)
    if (!validation.valid) {
      setError(validation.message || "Senha inválida")
      return
    }

    setIsLoading(true)

    try {
      await register(name, email, password)
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-4 shadow-xl animate-slide-in">
      <CardHeader className="text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mx-auto mb-4">
          <UserPlus className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-3xl">Criar conta</CardTitle>
        <CardDescription>Cadastre-se grátis e comece a economizar hoje</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">Use um email válido (ex: usuario@gmail.com)</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            {password.length > 0 && (
              <div className="space-y-1 text-xs mt-2">
                <p className="font-medium text-muted-foreground mb-1">A senha deve conter:</p>
                <div className="space-y-1">
                  <div
                    className={`flex items-center gap-1 ${passwordValidation.minLength ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    {passwordValidation.minLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>Mínimo 8 caracteres</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${passwordValidation.hasUppercase ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    {passwordValidation.hasUppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>Uma letra maiúscula (A-Z)</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${passwordValidation.hasLowercase ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    {passwordValidation.hasLowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>Uma letra minúscula (a-z)</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${passwordValidation.hasNumber ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    {passwordValidation.hasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>Um número (0-9)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            {confirmPassword.length > 0 && (
              <div className={`flex items-center gap-1 text-xs ${passwordsMatch ? "text-green-600" : "text-red-600"}`}>
                {passwordsMatch ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                <span>{passwordsMatch ? "As senhas coincidem" : "As senhas não coincidem"}</span>
              </div>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || !isPasswordValid || !passwordsMatch}
          >
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>

          {(!isPasswordValid || !passwordsMatch) && (
            <p className="text-xs text-center text-muted-foreground">
              {!isPasswordValid && "Complete todos os requisitos da senha. "}
              {!passwordsMatch && "As senhas devem coincidir."}
            </p>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <div className="text-sm text-center text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/entrar" className="text-primary hover:underline font-semibold">
            Faça login
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
