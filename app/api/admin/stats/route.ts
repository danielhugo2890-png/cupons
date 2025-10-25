import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

// GET - Estatísticas do sistema (admin)
export async function GET() {
  try {
    await requireAdmin()

    const [totalUsers] = await query("SELECT COUNT(*) as count FROM usuarios")
    const [totalCoupons] = await query("SELECT COUNT(*) as count FROM cupons")
    const [totalFavorites] = await query("SELECT COUNT(*) as count FROM favoritos")
    const [premiumCoupons] = await query("SELECT COUNT(*) as count FROM cupons WHERE e_premium = true")

    return NextResponse.json({
      totalUsers: totalUsers.count,
      totalCoupons: totalCoupons.count,
      totalFavorites: totalFavorites.count,
      premiumCoupons: premiumCoupons.count,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message.includes("autenticado") ? 401 : 403 })
  }
}
