"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/lib/user-context"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Loader2, ShoppingBag, Calendar, Percent, ExternalLink } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

export function FavoritesPage() {
  const { user, loading: userLoading } = useUser()
  const router = useRouter()
  const [favorites, setFavorites] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<number | null>(null)

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/entrar")
    }
  }, [user, userLoading, router])

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    try {
      const response = await fetch("/api/favorites")
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites)
      }
    } catch (error) {
      console.error("[v0] Error fetching favorites:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (couponId: number) => {
    setRemovingId(couponId)
    try {
      const response = await fetch(`/api/favorites/${couponId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setFavorites(favorites.filter((fav) => fav.id !== couponId))
      }
    } catch (error) {
      console.error("[v0] Error removing favorite:", error)
    } finally {
      setRemovingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  if (userLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-display font-bold flex items-center justify-center gap-3">
            <Heart className="h-10 w-10 text-red-500 fill-red-500" />
            Meus Favoritos
          </h1>
          <p className="text-muted-foreground">Seus cupons salvos em um só lugar</p>
        </div>

        {favorites.length === 0 ? (
          <Alert>
            <Heart className="h-4 w-4" />
            <AlertDescription>
              Você ainda não tem cupons favoritos. Explore nossos cupons e adicione seus favoritos!
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((coupon) => (
              <Card
                key={coupon.id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="secondary" className="font-semibold">
                      {coupon.category}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleRemoveFavorite(coupon.id)}
                      disabled={removingId === coupon.id}
                    >
                      {removingId === coupon.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart className="h-4 w-4 fill-red-500" />
                      )}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-xl line-clamp-2">{coupon.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{coupon.description}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{coupon.store}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Percent className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-display font-bold text-primary">{coupon.discount}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Válido até {formatDate(coupon.expires_at)}</span>
                  </div>

                  <div className="pt-2 space-y-2">
                    <div className="bg-secondary/50 rounded-lg p-3 border-2 border-dashed border-border">
                      <p className="text-xs text-muted-foreground mb-1">Código do cupom:</p>
                      <p className="font-mono font-bold text-lg tracking-wider">{coupon.code}</p>
                    </div>

                    <Button className="w-full gap-2" size="lg">
                      <ExternalLink className="h-4 w-4" />
                      Usar Cupom
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
