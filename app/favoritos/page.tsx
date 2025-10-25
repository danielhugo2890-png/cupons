import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FavoritesPage } from "@/components/favorites-page"

export default function Favoritos() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <FavoritesPage />
      </main>
      <Footer />
    </div>
  )
}
