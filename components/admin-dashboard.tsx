"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Ticket, Users, Heart, Crown, ArrowRight, MessageSquare } from "lucide-react"

interface Stats {
  totalUsers: number
  totalCoupons: number
  totalFavorites: number
  premiumCoupons: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const statCards = [
    {
      title: "Total de Usuários",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      href: "/admin/usuarios",
    },
    {
      title: "Total de Cupons",
      value: stats?.totalCoupons || 0,
      icon: Ticket,
      color: "from-purple-500 to-pink-500",
      href: "/admin/cupons",
    },
    {
      title: "Cupons Premium",
      value: stats?.premiumCoupons || 0,
      icon: Crown,
      color: "from-amber-500 to-orange-500",
      href: "/admin/cupons",
    },
    {
      title: "Total de Favoritos",
      value: stats?.totalFavorites || 0,
      icon: Heart,
      color: "from-rose-500 to-red-500",
      href: "/admin/cupons",
    },
  ]

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-black mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Painel Administrativo
          </h1>
          <p className="text-lg text-muted-foreground">Gerencie cupons, usuários e visualize estatísticas do sistema</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-24 bg-muted rounded" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statCards.map((stat) => {
              const Icon = stat.icon
              return (
                <Link key={stat.title} href={stat.href}>
                  <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group border-2 hover:border-primary/50">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-display font-black">{stat.value}</p>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                <Ticket className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">Gerenciar Cupons</h2>
                <p className="text-muted-foreground">Criar, editar e deletar cupons</p>
              </div>
            </div>
            <Link href="/admin/cupons">
              <Button className="w-full mt-4 gap-2 group">
                Acessar Gerenciamento
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">Gerenciar Usuários</h2>
                <p className="text-muted-foreground">Visualizar e gerenciar usuários</p>
              </div>
            </div>
            <Link href="/admin/usuarios">
              <Button className="w-full mt-4 gap-2 group">
                Acessar Gerenciamento
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">Mensagens</h2>
                <p className="text-muted-foreground">Ver mensagens de contato</p>
              </div>
            </div>
            <Link href="/admin/feedback">
              <Button className="w-full mt-4 gap-2 group">
                Acessar Mensagens
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
