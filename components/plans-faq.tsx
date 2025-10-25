"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Como funciona o período de teste?",
    answer:
      "Todos os planos pagos incluem 7 dias de garantia. Se você não ficar satisfeito, devolvemos 100% do seu dinheiro, sem perguntas.",
  },
  {
    question: "Posso mudar de plano depois?",
    answer:
      "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor imediatamente e ajustamos o valor proporcionalmente.",
  },
  {
    question: "Como funciona o cashback?",
    answer:
      "O cashback é creditado automaticamente na sua conta após a confirmação da compra pela loja parceira. Você pode resgatar o valor acumulado via PIX ou usar para pagar sua assinatura.",
  },
  {
    question: "Os cupons realmente funcionam?",
    answer:
      "Sim! Verificamos todos os cupons regularmente e removemos os que não funcionam mais. Nossa taxa de sucesso é de 95%. Se um cupom não funcionar, você pode reportar e ganhar pontos.",
  },
  {
    question: "Posso cancelar minha assinatura?",
    answer:
      "Sim, você pode cancelar a qualquer momento sem multas ou taxas. Seu acesso continuará até o fim do período pago e não renovaremos automaticamente.",
  },
  {
    question: "Quantos cupons posso usar por mês?",
    answer:
      "Não há limite! Você pode usar quantos cupons quiser. Os planos pagos oferecem acesso a cupons exclusivos e notificações personalizadas para você não perder nenhuma oferta.",
  },
  {
    question: "Como recebo os cupons exclusivos?",
    answer:
      "Cupons exclusivos são enviados por email e notificação push para assinantes dos planos Médio e Pro. Você também pode vê-los na área de membros do site.",
  },
  {
    question: "Há desconto para pagamento anual?",
    answer:
      "Sim! Ao optar pelo pagamento anual, você ganha 2 meses grátis (economize 16%). Entre em contato com nosso suporte para ativar essa opção.",
  },
]

export function PlansFAQ() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-balance">Perguntas Frequentes</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Tire suas dúvidas sobre nossos planos e serviços
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="mt-12 text-center p-8 bg-card border border-border rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-foreground">Ainda tem dúvidas?</h3>
            <p className="text-muted-foreground mb-4">Nossa equipe está pronta para ajudar você</p>
            <a href="/contato">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6">
                Entre em Contato
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
