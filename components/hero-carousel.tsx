"use client"

import { useState, useEffect } from "react"
import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    id: 1,
    title: "Economize até 70% nas suas compras",
    description: "Cupons exclusivos das melhores lojas do Brasil",
    image: "/shopping-discount-banner.jpg",
  },
  {
    id: 2,
    title: "Novos cupons toda semana",
    description: "Não perca as ofertas imperdíveis",
    image: "/weekly-deals-banner.jpg",
  },
  {
    id: 3,
    title: "Cashback em todas as compras",
    description: "Ganhe dinheiro de volta em cada compra",
    image: "/cashback-rewards-banner.png",
  },
  {
    id: 4,
    title: "Frete grátis em milhares de produtos",
    description: "Aproveite cupons de frete grátis",
    image: "/free-shipping-banner.png",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const scrollToCoupons = () => {
    const couponsSection = document.getElementById("cupons-destaque")
    if (couponsSection) {
      couponsSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section className="relative h-[550px] md:h-[650px] overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl space-y-6 animate-slide-in">
                <h1 className="text-5xl md:text-7xl font-display font-black text-white text-balance leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-3xl text-white/95 text-pretty font-medium">{slide.description}</p>
                <Button
                  size="lg"
                  onClick={scrollToCoupons}
                  className="mt-6 bg-white text-black hover:bg-gray-100 font-display font-bold text-lg px-8 py-6 rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 gap-3 group"
                >
                  Ver Cupons em Destaque
                  <ArrowDown className="h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Indicators - mantidos mas com estilo melhorado */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? "w-10 bg-white shadow-lg" : "w-2.5 bg-white/60 hover:bg-white/80"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
