import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutHero } from "@/components/about-hero"
import { AboutMission } from "@/components/about-mission"
import { AboutTeam } from "@/components/about-team"
import { AboutSocial } from "@/components/about-social"

export default function SobrePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AboutHero />
        <AboutMission />
        <AboutTeam />
        <AboutSocial />
      </main>
      <Footer />
    </div>
  )
}
