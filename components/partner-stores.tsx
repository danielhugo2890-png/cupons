"use client"

import { useEffect, useRef } from "react"
import { Store } from "lucide-react"

const stores = [
  "Amazon",
  "Magazine Luiza",
  "Netshoes",
  "Americanas",
  "Submarino",
  "Casas Bahia",
  "Shopee",
  "Mercado Livre",
  "Centauro",
  "Renner",
  "C&A",
  "Zara",
  "Shein",
  "AliExpress",
]

export function PartnerStores() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let scrollAmount = 0
    const scroll = () => {
      scrollAmount += 1
      if (scrollAmount >= scrollContainer.scrollWidth / 2) {
        scrollAmount = 0
      }
      scrollContainer.scrollLeft = scrollAmount
    }

    const interval = setInterval(scroll, 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center space-y-5 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10 mb-4">
            <Store className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Parceiros Confiáveis</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-black text-balance">Lojas Parceiras</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto font-medium">
            Trabalhamos com as melhores lojas do Brasil
          </p>
        </div>
      </div>

      <div className="relative">
        <div ref={scrollRef} className="flex gap-8 overflow-hidden" style={{ scrollBehavior: "auto" }}>
          {/* Duplicate stores for infinite scroll effect */}
          {[...stores, ...stores].map((store, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center justify-center h-28 w-56 bg-gradient-to-br from-card to-secondary border-2 border-border/40 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-primary/30"
            >
              <span className="text-2xl font-display font-bold text-foreground">{store}</span>
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none" />
      </div>
    </section>
  )
}
