"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import Link from "next/link"
import { updateEmailPreferencesAction, getUserEmailPreferencesAction } from "@/app/actions/profileActions"
import { sendTestEmailAction } from "@/app/actions/emailActions"

export default function NotificationPreferencesPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sendingTest, setSendingTest] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (!user) return

      try {
        const preferences = await getUserEmailPreferencesAction(user.uid)
        setEmailNotifications(preferences.emailNotifications)
      } catch (error) {
        console.error("Error fetching user preferences:", error)
        setError("Failed to load your notification preferences. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserPreferences()
  }, [user])

  const handleSavePreferences = async () => {
    if (!user) return

    try {
      setSaving(true)
      setMessage("")
      setError("")

      const result = await updateEmailPreferencesAction(user.uid, emailNotifications)

      if (result.success) {
        setMessage(result.message)
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error("Error saving notification preferences:", error)
      setError("An error occurred while saving your preferences. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleSendTestEmail = async () => {
    if (!user || !user.email) return

    try {
      setSendingTest(true)
      setMessage("")
      setError("")

      const result = await sendTestEmailAction(user.email)

      if (result.success) {
        setMessage(result.message)
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error("Error sending test email:", error)
      setError("An error occurred while sending the test email. Please try again.")
    } finally {
      setSendingTest(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-6">
          <Link href="/profile" className="text-blue-600 hover:underline flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Notification Preferences</h1>

        {message && <div className="p-4 mb-6 bg-green-100 text-green-700 rounded-md">{message}</div>}
        {error && <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-md">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Email Notifications</h2>
              <p className="text-gray-600 mb-4">
                Receive email notifications about your orders, including order confirmations, status updates, and
                delivery information.
              </p>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emailNotifications" className="ml-2 block text-gray-700">
                  Receive order status email notifications
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleSavePreferences}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Preferences"}
                </button>

                <button
                  onClick={handleSendTestEmail}
                  disabled={sendingTest || !emailNotifications}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-50"
                >
                  {sendingTest ? "Sending..." : "Send Test Email"}
                </button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Notification Types</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium">Order Confirmation</h3>
                  <p className="text-gray-600 text-sm">
                    Sent immediately after your order is placed and payment is confirmed.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium">Order Processing</h3>
                  <p className="text-gray-600 text-sm">Sent when your order is being prepared by our kitchen team.</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium">Order Ready</h3>
                  <p className="text-gray-600 text-sm">Sent when your order is ready for pickup or out for delivery.</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium">Order Cancelled</h3>
                  <p className="text-gray-600 text-sm">Sent if your order is cancelled for any reason.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
