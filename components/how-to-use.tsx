import { Sparkles, Copy, ShoppingBag, BadgeCheck } from "lucide-react"

const steps = [
  {
    icon: Sparkles,
    title: "Encontre o Cupom",
    description: "Navegue pelos cupons disponíveis ou use a busca para encontrar ofertas específicas",
  },
  {
    icon: Copy,
    title: "Copie o Código",
    description: "Clique no cupom desejado e copie o código de desconto automaticamente",
  },
  {
    icon: ShoppingBag,
    title: "Faça sua Compra",
    description: "Vá até a loja parceira e adicione os produtos ao carrinho",
  },
  {
    icon: BadgeCheck,
    title: "Aplique e Economize",
    description: "Cole o código no checkout e aproveite seu desconto exclusivo",
  },
]

export function HowToUse() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-5 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Processo Simples</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-black text-balance">Como Usar os Cupons</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto font-medium">
            É simples e rápido! Siga estes passos para economizar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className="relative group animate-scale-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-center space-y-5">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
                    <div className="relative flex items-center justify-center h-24 w-24 mx-auto bg-gradient-to-br from-primary via-gray-900 to-black text-white rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-2xl border border-white/10">
                      <Icon className="h-12 w-12" />
                    </div>
                    <div className="absolute -top-3 -right-3 flex items-center justify-center h-10 w-10 bg-gradient-to-br from-white to-gray-100 text-black rounded-full font-display font-black text-lg shadow-xl border-2 border-background">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-2xl font-display font-bold">{step.title}</h3>
                  <p className="text-muted-foreground text-pretty leading-relaxed text-base font-medium">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-1 bg-gradient-to-r from-border via-primary/20 to-border rounded-full" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
