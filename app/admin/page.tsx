import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/entrar?redirect=/admin")
  }

  if (user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AdminDashboard />
      </main>
      <Footer />
    </div>
  )
}
