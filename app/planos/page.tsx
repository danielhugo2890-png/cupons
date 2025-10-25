import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PricingPlans } from "@/components/pricing-plans"
import { PlansFAQ } from "@/components/plans-faq"

export default function PlanosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <PricingPlans />
        <PlansFAQ />
      </main>
      <Footer />
    </div>
  )
}
