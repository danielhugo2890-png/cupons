"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Ticket, Clock, Sparkles, Heart, Loader2, Lock } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/lib/user-context"

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

export function FeaturedCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()

  useEffect(() => {
    fetchCoupons()
  }, [user])

  const fetchCoupons = async () => {
    try {
      const response = await fetch("/api/coupons?sort=newest")
      if (response.ok) {
        const data = await response.json()
        setCoupons(data.coupons.slice(0, 8))
      }
    } catch (error) {
      console.error("[v0] Error fetching coupons:", error)
    } finally {
      setLoading(false)
    }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(date.getTime() - now.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} ${diffDays === 1 ? "dia" : "dias"}`
  }

  if (loading) {
    return (
      <section id="cupons-destaque" className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    )
  }

  return (
    <section id="cupons-destaque" className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-5 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Ofertas Exclusivas</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-black text-balance">Cupons em Destaque</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto font-medium">
            Aproveite os melhores descontos das lojas mais populares do Brasil
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coupons.map((coupon, index) => (
            <Card
              key={coupon.id}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-scale-in border-2 hover:border-primary/20 relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {coupon.is_premium && !user && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Lock className="h-12 w-12 mx-auto text-primary" />
                    <p className="font-semibold">Cupom Premium</p>
                    <Link href="/cadastro">
                      <Button size="sm">Cadastre-se para desbloquear</Button>
                    </Link>
                  </div>
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-2xl font-display font-bold">{coupon.store}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-auto"
                        onClick={() => handleToggleFavorite(coupon.id, coupon.is_favorite)}
                      >
                        <Heart
                          className={`h-4 w-4 ${coupon.is_favorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                        />
                      </Button>
                    </div>
                    <CardDescription className="text-base">{coupon.description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="gap-1.5 font-semibold">
                    {coupon.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="text-4xl font-display font-black text-primary">{coupon.discount}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <Clock className="h-4 w-4" />
                  Expira em {formatDate(coupon.expires_at)}
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted rounded-xl border-2 border-dashed border-border group-hover:border-primary/30 transition-colors">
                  <Ticket className="h-5 w-5 text-primary" />
                  <code className="font-mono font-bold text-base">{coupon.code}</code>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full group-hover:bg-primary/90 font-semibold text-base py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={coupon.is_premium && !user}
                >
                  Usar Cupom
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/cupons">
            <Button
              size="lg"
              variant="outline"
              className="gap-3 bg-transparent font-semibold text-lg px-8 py-6 rounded-xl hover:bg-secondary/80 transition-all duration-300 hover:scale-105 border-2"
            >
              Ver Todos os Cupons
              <Ticket className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
