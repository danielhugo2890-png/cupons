import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { AdminCouponsManager } from "@/components/admin-coupons-manager"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default async function AdminCouponsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/entrar?redirect=/admin/cupons")
  }

  if (user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AdminCouponsManager />
      </main>
      <Footer />
    </div>
  )
}
