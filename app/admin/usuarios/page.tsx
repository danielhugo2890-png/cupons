import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { AdminUsersManager } from "@/components/admin-users-manager"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default async function AdminUsersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/entrar?redirect=/admin/usuarios")
  }

  if (user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AdminUsersManager />
      </main>
      <Footer />
    </div>
  )
}
