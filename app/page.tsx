import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroCarousel } from "@/components/hero-carousel"
import { FeaturedCoupons } from "@/components/featured-coupons"
import { HowToUse } from "@/components/how-to-use"
import { PartnerStores } from "@/components/partner-stores"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroCarousel />
        <FeaturedCoupons />
        <HowToUse />
        <PartnerStores />
      </main>
      <Footer />
    </div>
  )
}
