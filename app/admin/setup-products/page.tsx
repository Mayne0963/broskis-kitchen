"use client"

import { useState } from "react"
import { setupProducts } from "@/utils/productSetup"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { checkUserRole } from "@/utils/roleCheck"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function SetupProductsPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const { user } = useAuth()
  const router = useRouter()

  const handleSetupProducts = async () => {
    if (!user) return

    try {
      setLoading(true)
      setMessage("")

      // Check if user is admin
      const isAdmin = await checkUserRole(user, ["admin"])
      if (!isAdmin) {
        setMessage("You don't have permission to perform this action")
        return
      }

      await setupProducts()
      setMessage("Products have been successfully set up in Firestore!")
    } catch (error) {
      console.error("Error setting up products:", error)
      setMessage("An error occurred while setting up products. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Setup Products</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="mb-4">
            This page allows you to initialize sample products in your Firestore database. This should only be done once
            when setting up your store.
          </p>

          {message && (
            <div
              className={`p-4 mb-4 rounded-md ${
                message.includes("success") ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {message}
            </div>
          )}

          <button
            onClick={handleSetupProducts}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Setting up products..." : "Initialize Sample Products"}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  )
}
