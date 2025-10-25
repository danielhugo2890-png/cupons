"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Tag, Clock, SlidersHorizontal, X, Heart, Loader2, Lock } from "lucide-react"
import { useUser } from "@/lib/user-context"
import Link from "next/link"

interface Coupon {
  id: number
  title: string
  description: string
  code: string
  discount: string
  store: string
  category: string
  expires_at: string
  is_premium: boolean
  is_favorite: boolean
}

const categories = ["all", "Eletrônicos", "Moda", "Esportes", "Casa", "Alimentos", "Viagens"]
const sortOptions = [
  { value: "newest", label: "Mais Recentes" },
  { value: "expiring", label: "Expirando em Breve" },
  { value: "discount", label: "Maior Desconto" },
]

export function CouponsSearch() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)
  const { user } = useUser()

  useEffect(() => {
    fetchCoupons()
  }, [selectedCategory, sortBy, user])

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== "all") params.append("category", selectedCategory)
      if (sortBy) params.append("sort", sortBy)
      if (searchTerm) params.append("search", searchTerm)

      const response = await fetch(`/api/coupons?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setCoupons(data.coupons)
      }
    } catch (error) {
      console.error("[v0] Error fetching coupons:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchCoupons()
  }

  const handleToggleFavorite = async (couponId: number, isFavorite: boolean) => {
    if (!user) {
      window.location.href = "/entrar"
      return
    }

    try {
      if (isFavorite) {
        await fetch(`/api/favorites/${couponId}`, { method: "DELETE" })
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ couponId }),
        })
      }
      fetchCoupons()
    } catch (error) {
      console.error("[v0] Error toggling favorite:", error)
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSortBy("newest")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(date.getTime() - now.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} ${diffDays === 1 ? "dia" : "dias"}`
  }

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-balance">Todos os Cupons</h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Encontre os melhores cupons de desconto para economizar nas suas compras
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por loja, produto ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-12 pr-4 h-14 text-lg"
              />
            </div>
            <Button onClick={handleSearch} size="lg" className="h-14 px-8">
              Buscar
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </Button>
            {(searchTerm || selectedCategory !== "all" || sortBy !== "newest") && (
              <Button variant="ghost" onClick={clearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Limpar Filtros
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-muted/30 rounded-lg border border-border animate-slide-in">
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === "all" ? "Todos" : category}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ordenar por</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto mb-6">
          <p className="text-muted-foreground">
            {loading ? (
              "Carregando..."
            ) : (
              <>
                Mostrando <span className="font-semibold text-foreground">{coupons.length}</span> cupons
              </>
            )}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : coupons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon, index) => (
              <Card
                key={coupon.id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-in relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {coupon.is_premium && !user && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-2 p-4">
                      <Lock className="h-10 w-10 mx-auto text-primary" />
                      <p className="font-semibold text-sm">Cupom Premium</p>
                      <Link href="/cadastro">
                        <Button size="sm">Cadastre-se</Button>
                      </Link>
                    </div>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{coupon.store}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-auto"
                          onClick={() => handleToggleFavorite(coupon.id, coupon.is_favorite)}
                        >
                          <Heart
                            className={`h-4 w-4 ${coupon.is_favorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                          />
                        </Button>
                      </div>
                      <CardDescription>{coupon.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{coupon.category}</Badge>
                  </div>
                  <div className="text-3xl font-bold text-primary">{coupon.discount}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Expira em {formatDate(coupon.expires_at)}
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border-2 border-dashed border-border">
                    <Tag className="h-4 w-4" />
                    <code className="font-mono font-semibold">{coupon.code}</code>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full group-hover:bg-primary/90" disabled={coupon.is_premium && !user}>
                    Usar Cupom
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-muted mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Nenhum cupom encontrado</h3>
            <p className="text-muted-foreground mb-6">Tente ajustar seus filtros ou buscar por outros termos</p>
            <Button onClick={clearFilters}>Limpar Filtros</Button>
          </div>
        )}
      </div>
    </section>
  )
}
