import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CouponsSearch } from "@/components/coupons-search"

export default function CuponsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <CouponsSearch />
      </main>
      <Footer />
    </div>
  )
}
