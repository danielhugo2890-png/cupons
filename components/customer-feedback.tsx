"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const feedbacks = [
  {
    id: 1,
    name: "Maria Silva",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment:
      "Economizei mais de R$ 500 no último mês usando os cupons! O site é muito fácil de usar e os cupons realmente funcionam.",
    date: "Há 2 dias",
  },
  {
    id: 2,
    name: "João Santos",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment: "O plano Pro vale muito a pena! Os cupons exclusivos e o cashback fazem toda a diferença. Recomendo!",
    date: "Há 5 dias",
  },
  {
    id: 3,
    name: "Ana Costa",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    comment: "Ótima plataforma! Encontro cupons de todas as lojas que costumo comprar. O suporte é muito atencioso.",
    date: "Há 1 semana",
  },
  {
    id: 4,
    name: "Pedro Oliveira",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment: "Melhor site de cupons que já usei. As notificações em tempo real me ajudam a não perder nenhuma oferta!",
    date: "Há 1 semana",
  },
  {
    id: 5,
    name: "Carla Mendes",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    comment: "Simplesmente perfeito! Já indiquei para todos os meus amigos. A economia é real e significativa.",
    date: "Há 2 semanas",
  },
  {
    id: 6,
    name: "Lucas Ferreira",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    comment: "Interface moderna e intuitiva. Os filtros facilitam muito na busca pelos cupons que preciso.",
    date: "Há 2 semanas",
  },
]

export function CustomerFeedback() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-balance">O Que Nossos Clientes Dizem</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Veja os depoimentos de quem já está economizando com a gente
          </p>
        </div>

        {/* Feedback Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {feedbacks.map((feedback, index) => (
            <Card
              key={feedback.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6 space-y-4">
                {/* Rating */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < feedback.rating ? "fill-primary text-primary" : "text-muted"}`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-sm text-foreground leading-relaxed">{feedback.comment}</p>

                {/* User Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={feedback.avatar || "/placeholder.svg"} alt={feedback.name} />
                    <AvatarFallback>{feedback.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{feedback.name}</p>
                    <p className="text-xs text-muted-foreground">{feedback.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-primary">4.8</div>
            <div className="flex justify-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Avaliação média</p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-primary">10k+</div>
            <p className="text-sm text-muted-foreground">Clientes satisfeitos</p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold text-primary">R$ 2M+</div>
            <p className="text-sm text-muted-foreground">Economizados pelos usuários</p>
          </div>
        </div>
      </div>
    </section>
  )
}
