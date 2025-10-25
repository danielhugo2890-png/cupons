"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { UserPlus } from "lucide-react"
import Link from "next/link"

export function SignupForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
  }

  return (
    <Card className="w-full max-w-md mx-4 shadow-xl animate-slide-in">
      <CardHeader className="text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mx-auto mb-4">
          <UserPlus className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-3xl">Crie sua conta</CardTitle>
        <CardDescription>Comece a economizar hoje mesmo, é grátis!</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Digite a senha novamente"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="terms" required />
            <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
              Aceito os{" "}
              <Link href="#" className="text-primary hover:underline">
                termos de uso
              </Link>{" "}
              e{" "}
              <Link href="#" className="text-primary hover:underline">
                política de privacidade
              </Link>
            </Label>
          </div>
          <Button type="submit" className="w-full" size="lg">
            Criar Conta
          </Button>
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
