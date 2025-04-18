"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { checkUserRole } from "@/utils/roleCheck"
import ProtectedRoute from "@/components/ProtectedRoute"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"

export default function SetupLoyaltyPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const { user } = useAuth()
  const router = useRouter()

  const handleSetupLoyalty = async () => {
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

      // Sample loyalty tiers
      const loyaltyTiers = [
        {
          name: "Bronze",
          minimumPoints: 0,
          benefits: ["Earn 1 point per $1 spent", "Birthday reward", "Access to member-only events"],
          multiplier: 1,
        },
        {
          name: "Silver",
          minimumPoints: 500,
          benefits: [
            "Earn 1.25 points per $1 spent",
            "Birthday reward",
            "Access to member-only events",
            "Free item on every 5th order",
          ],
          multiplier: 1.25,
        },
        {
          name: "Gold",
          minimumPoints: 1000,
          benefits: [
            "Earn 1.5 points per $1 spent",
            "Birthday reward",
            "Access to member-only events",
            "Free item on every 5th order",
            "Priority service",
            "Exclusive gold member promotions",
          ],
          multiplier: 1.5,
        },
        {
          name: "Platinum",
          minimumPoints: 2500,
          benefits: [
            "Earn 2 points per $1 spent",
            "Birthday reward",
            "Access to member-only events",
            "Free item on every 3rd order",
            "Priority service",
            "Exclusive platinum member promotions",
            "Free delivery on all orders",
          ],
          multiplier: 2,
        },
      ]

      // Sample rewards
      const rewards = [
        {
          name: "10% Off Your Next Order",
          description: "Get 10% off your next purchase",
          pointsCost: 100,
          type: "discount",
          value: 10,
          active: true,
          createdAt: new Date().toISOString(),
        },
        {
          name: "Free Appetizer",
          description: "Enjoy a free appetizer with your next meal",
          pointsCost: 200,
          type: "freeItem",
          value: 0,
          active: true,
          createdAt: new Date().toISOString(),
        },
        {
          name: "25% Off Your Next Order",
          description: "Get 25% off your next purchase",
          pointsCost: 300,
          type: "discount",
          value: 25,
          active: true,
          createdAt: new Date().toISOString(),
        },
        {
          name: "Free Delivery",
          description: "Get free delivery on your next order",
          pointsCost: 150,
          type: "special",
          value: 0,
          active: true,
          createdAt: new Date().toISOString(),
        },
        {
          name: "Buy One Get One Free",
          description: "Buy one item and get another of equal or lesser value for free",
          pointsCost: 500,
          type: "special",
          value: 0,
          active: true,
          createdAt: new Date().toISOString(),
        },
      ]

      // Add loyalty tiers to Firestore
      for (const tier of loyaltyTiers) {
        await addDoc(collection(db, "loyaltyTiers"), tier)
      }

      // Add rewards to Firestore
      for (const reward of rewards) {
        await addDoc(collection(db, "rewards"), reward)
      }

      setMessage("Loyalty program has been successfully set up in Firestore!")
    } catch (error) {
      console.error("Error setting up loyalty program:", error)
      setMessage("An error occurred while setting up the loyalty program. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Setup Loyalty Program</h1>
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
            This page allows you to initialize sample loyalty tiers and rewards in your Firestore database. This should
            only be done once when setting up your loyalty program.
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
            onClick={handleSetupLoyalty}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Setting up loyalty program..." : "Initialize Loyalty Program"}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  )
}
