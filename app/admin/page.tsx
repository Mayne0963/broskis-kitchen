"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useRouter } from "next/navigation"
import { checkUserRole } from "@/utils/roleCheck"

export default function AdminPanel() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return

      try {
        const hasAdminRole = await checkUserRole(user, ["admin"])
        setIsAdmin(hasAdminRole)
        if (!hasAdminRole) {
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Error checking admin role:", error)
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [user, router])

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      {isAdmin ? (
        <div className="max-w-6xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Admin Control Panel</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AdminCard
              title="Manage Products"
              description="Add, edit, or remove products from your menu"
              link="/admin/products"
            />
            <AdminCard title="User Management" description="Manage user accounts and permissions" link="/admin/users" />
            <AdminCard title="Orders" description="View and process customer orders" link="/admin/orders" />
            <AdminCard
              title="Scheduled Orders"
              description="Manage orders scheduled for future delivery/pickup"
              link="/admin/scheduled-orders"
            />
            <AdminCard
              title="Special Events"
              description="Manage special events, holidays, and custom time slots"
              link="/admin/special-events"
            />
            <AdminCard title="Loyalty Program" description="Manage rewards and loyalty tiers" link="/admin/loyalty" />
            <AdminCard title="Delivery Zones" description="Manage delivery areas and fees" link="/admin/delivery" />
            <AdminCard title="Pickup Locations" description="Manage pickup locations" link="/admin/pickup" />
            <AdminCard
              title="Email Settings"
              description="Configure and test email notifications"
              link="/admin/email-settings"
            />
            <AdminCard
              title="Email Templates"
              description="Preview and customize email notification templates"
              link="/admin/email-templates"
            />
            <AdminCard title="Content" description="Update website content and promotions" link="/admin/content" />
            <AdminCard title="Analytics" description="View sales and user analytics" link="/admin/analytics" />
            <AdminCard title="Settings" description="Configure system settings" link="/admin/settings" />
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="col-span-full">
              <h2 className="text-xl font-semibold mb-4">Setup Tools</h2>
            </div>
            <AdminCard
              title="Setup Products"
              description="Initialize sample products in the database"
              link="/admin/setup-products"
            />
            <AdminCard
              title="Setup Loyalty Program"
              description="Initialize loyalty tiers and rewards"
              link="/admin/setup-loyalty"
            />
            <AdminCard
              title="Setup Delivery Options"
              description="Initialize delivery zones and pickup locations"
              link="/admin/setup-delivery"
            />
            <AdminCard
              title="Setup Special Events"
              description="Initialize sample special events and holidays"
              link="/admin/setup-special-events"
            />
          </div>
        </div>
      ) : null}
    </ProtectedRoute>
  )
}

function AdminCard({ title, description, link }: { title: string; description: string; link: string }) {
  return (
    <a href={link} className="block">
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </a>
  )
}
