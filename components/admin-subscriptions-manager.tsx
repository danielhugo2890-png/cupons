"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"

interface Subscription {
  id: number
  user_name: string
  user_email: string
  plan_name: string
  plan_slug: string
  plan_price: number
  status: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
}

export function AdminSubscriptionsManager() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch("/api/admin/subscriptions")
      if (!response.ok) throw new Error("Erro ao carregar assinaturas")

      const data = await response.json()
      setSubscriptions(data.subscriptions)
    } catch (error) {
      console.error("[v0] Erro:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const search = searchTerm.toLowerCase()
    return (
      sub.user_name.toLowerCase().includes(search) ||
      sub.user_email.toLowerCase().includes(search) ||
      sub.plan_name.toLowerCase().includes(search) ||
      sub.status.toLowerCase().includes(search) ||
      sub.id.toString().includes(search)
    )
  })

  if (loading) {
    return <div>Carregando...</div>
  }

  const displaySubs = searchTerm ? filteredSubscriptions : subscriptions
  const stats = {
    total: displaySubs.length,
    active: displaySubs.filter((s) => s.status === "active").length,
    cancelled: displaySubs.filter((s) => s.status === "cancelled").length,
    revenue: displaySubs.filter((s) => s.status === "active").reduce((sum, s) => sum + s.plan_price, 0),
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar por usuário, email, plano, status ou ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        {searchTerm && (
          <p className="text-sm text-muted-foreground mt-2">
            Encontradas {filteredSubscriptions.length} de {subscriptions.length} assinaturas
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Canceladas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.revenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas as Assinaturas</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "Nenhuma assinatura encontrada. Tente ajustar os termos de pesquisa."
                : "Nenhuma assinatura encontrada"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Período</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.user_name}</TableCell>
                    <TableCell>{sub.user_email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{sub.plan_name}</Badge>
                    </TableCell>
                    <TableCell>R$ {sub.plan_price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={sub.status === "active" ? "default" : "secondary"}>{sub.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(sub.current_period_end).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
