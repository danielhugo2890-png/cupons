"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Users, Shield, Trash2, Crown, UserIcon, Search } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/lib/user-context"

interface User {
  id: number
  name: string
  email: string
  role: "user" | "admin"
  created_at: string
}

export function AdminUsersManager() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newRole, setNewRole] = useState<"user" | "admin">("user")
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const { user: currentUser } = useUser()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      console.log("[v0] Carregando usuários do painel admin...")
      const res = await fetch("/api/admin/users")
      console.log("[v0] Status da resposta:", res.status)

      if (!res.ok) {
        const errorData = await res.json()
        console.error("[v0] Erro na resposta:", errorData)
        throw new Error(errorData.error || "Erro ao carregar usuários")
      }

      const data = await res.json()
      console.log("[v0] Dados recebidos:", data)
      console.log("[v0] Número de usuários:", data.users?.length || 0)

      setUsers(data.users || [])
    } catch (error: any) {
      console.error("[v0] Erro ao carregar usuários:", error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao carregar usuários",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChangeRole = async () => {
    if (!selectedUser) return

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      toast({
        title: "Sucesso",
        description: "Role do usuário atualizado com sucesso",
      })

      setDialogOpen(false)
      setSelectedUser(null)
      loadUsers()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar role",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (user: User) => {
    if (!confirm(`Tem certeza que deseja deletar o usuário ${user.name}?`)) return

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      toast({
        title: "Sucesso",
        description: "Usuário deletado com sucesso",
      })

      loadUsers()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao deletar usuário",
        variant: "destructive",
      })
    }
  }

  const openRoleDialog = (user: User) => {
    setSelectedUser(user)
    setNewRole(user.role)
    setDialogOpen(true)
  }

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase()
    return (
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search) ||
      user.id.toString().includes(search)
    )
  })

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-display font-black mb-2">Gerenciar Usuários</h1>
          <p className="text-muted-foreground">Visualizar e gerenciar usuários do sistema</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome, email, role ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchTerm && (
            <p className="text-sm text-muted-foreground mt-2">
              Encontrados {filteredUsers.length} de {users.length} usuários
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-32 bg-muted rounded" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-full ${user.role === "admin" ? "bg-gradient-to-br from-amber-500 to-orange-500" : "bg-gradient-to-br from-blue-500 to-cyan-500"}`}
                    >
                      {user.role === "admin" ? (
                        <Crown className="h-5 w-5 text-white" />
                      ) : (
                        <UserIcon className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg line-clamp-1">{user.name}</h3>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"} className="mt-1">
                        {user.role === "admin" ? "Administrador" : "Usuário"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="text-xs truncate max-w-[180px]">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cadastrado em:</span>
                    <span className="text-xs">{new Date(user.created_at).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-mono text-xs">#{user.id}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 bg-transparent"
                    onClick={() => openRoleDialog(user)}
                    disabled={currentUser?.id === user.id}
                  >
                    <Shield className="h-4 w-4" />
                    Alterar Role
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive bg-transparent"
                    onClick={() => handleDelete(user)}
                    disabled={currentUser?.id === user.id}
                  >
                    <Trash2 className="h-4 w-4" />
                    Deletar
                  </Button>
                </div>

                {currentUser?.id === user.id && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Você não pode modificar sua própria conta
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredUsers.length === 0 && (
          <Card className="p-12 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">
              {searchTerm ? "Nenhum usuário encontrado" : "Nenhum usuário encontrado"}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Tente ajustar os termos de pesquisa." : "Não há usuários cadastrados no sistema"}
            </p>
          </Card>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alterar Role do Usuário</DialogTitle>
              <DialogDescription>
                Altere o nível de permissão de {selectedUser?.name}. Administradores têm acesso total ao sistema.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Novo Role</label>
                <Select value={newRole} onValueChange={(value: "user" | "admin") => setNewRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        <span>Usuário</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4" />
                        <span>Administrador</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {newRole === "admin"
                    ? "⚠️ Administradores podem gerenciar cupons, usuários e acessar todas as funcionalidades do sistema."
                    : "Usuários comuns podem visualizar cupons, adicionar favoritos e gerenciar sua própria conta."}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleChangeRole} className="flex-1">
                Confirmar Alteração
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
