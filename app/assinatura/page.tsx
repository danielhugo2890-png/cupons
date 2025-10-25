import { Suspense } from "react"
import { SubscriptionManager } from "@/components/subscription-manager"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Gerenciar Assinatura</h1>
            <p className="text-muted-foreground mb-8">
              Visualize e gerencie sua assinatura, faça upgrade ou cancele quando quiser
            </p>

            <Suspense fallback={<div>Carregando...</div>}>
              <SubscriptionManager />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
