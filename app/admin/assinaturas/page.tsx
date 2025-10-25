import { Suspense } from "react"
import { AdminSubscriptionsManager } from "@/components/admin-subscriptions-manager"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function AdminSubscriptionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Gerenciar Assinaturas</h1>
          <Suspense fallback={<div>Carregando...</div>}>
            <AdminSubscriptionsManager />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
