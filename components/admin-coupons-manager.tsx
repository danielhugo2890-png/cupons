"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, Crown, ArrowLeft, Ticket, Search } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Coupon {
  id: number
  title: string
  description: string
  code: string
  discount: string
  category: string
  store: string
  valid_until: string | null
  is_premium: boolean
  created_at: string
}

export function AdminCouponsManager() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    code: "",
    discount: "",
    category: "moda",
    store: "",
    valid_until: "",
    is_premium: false,
  })

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons")
      const data = await res.json()
      setCoupons(data.coupons || [])
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar cupons",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingCoupon ? `/api/admin/coupons/${editingCoupon.id}` : "/api/admin/coupons"
      const method = editingCoupon ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error()

      toast({
        title: "Sucesso",
        description: editingCoupon ? "Cupom atualizado com sucesso" : "Cupom criado com sucesso",
      })

      setDialogOpen(false)
      resetForm()
      loadCoupons()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar cupom",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este cupom?")) return

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()

      toast({
        title: "Sucesso",
        description: "Cupom deletado com sucesso",
      })

      loadCoupons()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao deletar cupom",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      title: coupon.title,
      description: coupon.description || "",
      code: coupon.code,
      discount: coupon.discount,
      category: coupon.category,
      store: coupon.store,
      valid_until: coupon.valid_until || "",
      is_premium: coupon.is_premium,
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingCoupon(null)
    setFormData({
      title: "",
      description: "",
      code: "",
      discount: "",
      category: "moda",
      store: "",
      valid_until: "",
      is_premium: false,
    })
  }

  const filteredCoupons = coupons.filter((coupon) => {
    const search = searchTerm.toLowerCase()
    return (
      coupon.title.toLowerCase().includes(search) ||
      coupon.code.toLowerCase().includes(search) ||
      coupon.store.toLowerCase().includes(search) ||
      coupon.category.toLowerCase().includes(search) ||
      coupon.discount.toLowerCase().includes(search) ||
      (coupon.description && coupon.description.toLowerCase().includes(search))
    )
  })

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin">
              <Button variant="ghost" className="gap-2 mb-4">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Dashboard
              </Button>
            </Link>
            <h1 className="text-4xl font-display font-black mb-2">Gerenciar Cupons</h1>
            <p className="text-muted-foreground">Criar, editar e deletar cupons do sistema</p>
          </div>

          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open)
              if (!open) resetForm()
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Cupom
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCoupon ? "Editar Cupom" : "Criar Novo Cupom"}</DialogTitle>
                <DialogDescription>
                  {editingCoupon ? "Atualize as informações do cupom" : "Preencha os dados do novo cupom"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Código *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount">Desconto *</Label>
                    <Input
                      id="discount"
                      placeholder="Ex: 50% OFF"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="moda">Moda</SelectItem>
                        <SelectItem value="tecnologia">Tecnologia</SelectItem>
                        <SelectItem value="alimentos">Alimentos</SelectItem>
                        <SelectItem value="viagem">Viagem</SelectItem>
                        <SelectItem value="beleza">Beleza</SelectItem>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="esportes">Esportes</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="store">Loja *</Label>
                    <Input
                      id="store"
                      value={formData.store}
                      onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valid_until">Válido até</Label>
                  <Input
                    id="valid_until"
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_premium"
                    checked={formData.is_premium}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
                  />
                  <Label htmlFor="is_premium" className="cursor-pointer">
                    Cupom Premium (requer cadastro)
                  </Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingCoupon ? "Atualizar" : "Criar"} Cupom
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por título, código, loja, categoria ou desconto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchTerm && (
            <p className="text-sm text-muted-foreground mt-2">
              Encontrados {filteredCoupons.length} de {coupons.length} cupons
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
            {filteredCoupons.map((coupon) => (
              <Card key={coupon.id} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg line-clamp-1">{coupon.title}</h3>
                      {coupon.is_premium && <Crown className="h-4 w-4 text-amber-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{coupon.store}</p>
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                      {coupon.discount}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Código:</span>
                    <span className="font-mono font-bold">{coupon.code}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Categoria:</span>
                    <span className="capitalize">{coupon.category}</span>
                  </div>
                  {coupon.valid_until && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Válido até:</span>
                      <span>{new Date(coupon.valid_until).toLocaleDateString("pt-BR")}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 bg-transparent"
                    onClick={() => handleEdit(coupon)}
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive bg-transparent"
                    onClick={() => handleDelete(coupon.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Deletar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredCoupons.length === 0 && (
          <Card className="p-12 text-center">
            <Ticket className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">
              {searchTerm ? "Nenhum cupom encontrado" : "Nenhum cupom cadastrado"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Tente ajustar os termos de pesquisa." : "Comece criando seu primeiro cupom"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Criar Primeiro Cupom
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
