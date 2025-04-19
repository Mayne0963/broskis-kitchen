"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"

interface UserProfile {
  name: string
  email: string
  phone?: string
  createdAt: string
  preferences?: {
    emailNotifications?: boolean
  }
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return

      try {
        const userRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile)
        } else {
          setError("Profile not found. Please complete your registration.")
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        setError("Failed to load your profile. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [user])

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

        {error && <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-md">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : profile ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">{profile.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">{profile.email}</div>
                  </div>
                  {profile.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded-md">{profile.phone}</div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Member Since</label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href="/profile/edit"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/profile/notifications"
                      className="block p-2 hover:bg-gray-50 rounded-md text-blue-600 hover:text-blue-800"
                    >
                      Notification Preferences
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile/password"
                      className="block p-2 hover:bg-gray-50 rounded-md text-blue-600 hover:text-blue-800"
                    >
                      Change Password
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile/addresses"
                      className="block p-2 hover:bg-gray-50 rounded-md text-blue-600 hover:text-blue-800"
                    >
                      Manage Addresses
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/orders"
                      className="block p-2 hover:bg-gray-50 rounded-md text-blue-600 hover:text-blue-800"
                    >
                      Order History
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/loyalty"
                      className="block p-2 hover:bg-gray-50 rounded-md text-blue-600 hover:text-blue-800"
                    >
                      Loyalty Program
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-xl mb-4">Profile not found</p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
