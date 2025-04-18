"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { checkUserRole } from "@/utils/roleCheck"
import ProtectedRoute from "@/components/ProtectedRoute"
import { setupSpecialEvents } from "@/utils/eventSetup"
import Link from "next/link"

export default function SetupSpecialEventsPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const { user } = useAuth()
  const router = useRouter()

  const handleSetupSpecialEvents = async () => {
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

      // Setup special events
      await setupSpecialEvents()

      setMessage("Special events have been successfully set up in Firestore!")
    } catch (error) {
      console.error("Error setting up special events:", error)
      setMessage("An error occurred while setting up special events. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Setup Special Events</h1>
          <Link href="/admin" className="text-blue-600 hover:underline flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="mb-4">
            This page allows you to initialize sample special events and holidays in your Firestore database. This
            should only be done once when setting up your special events system.
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
            onClick={handleSetupSpecialEvents}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Setting up special events..." : "Initialize Special Events"}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  )
}
