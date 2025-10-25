import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { UserPanel } from "@/components/user-panel"

export default function PainelPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <UserPanel />
      </main>
      <Footer />
    </div>
  )
}
