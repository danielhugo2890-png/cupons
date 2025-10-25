export function AboutHero() {
  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-muted/50 to-background overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-slide-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-sm font-medium text-primary">Sobre Nós</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance">
            Ajudando você a economizar desde 2020
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground text-pretty leading-relaxed">
            Somos a maior plataforma de cupons de desconto do Brasil, conectando milhões de pessoas às melhores ofertas
            do mercado.
          </p>
        </div>
      </div>
    </section>
  )
}
