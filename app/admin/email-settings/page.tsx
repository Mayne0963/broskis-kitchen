"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { checkUserRole } from "@/utils/roleCheck"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { sendTestEmailAction } from "@/app/actions/emailActions"

export default function EmailSettingsPage() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const [testEmail, setTestEmail] = useState("")
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

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

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!testEmail) {
      setError("Please enter an email address")
      return
    }

    try {
      setSending(true)
      setMessage("")
      setError("")

      const result = await sendTestEmailAction(testEmail)

      if (result.success) {
        setMessage(result.message)
        setTestEmail("")
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error("Error sending test email:", error)
      setError("An error occurred while sending the test email. Please try again.")
    } finally {
      setSending(false)
    }
  }

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
        <div className="max-w-4xl mx-auto py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Email Notification Settings</h1>
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

          {message && <div className="p-4 mb-6 bg-green-100 text-green-700 rounded-md">{message}</div>}
          {error && <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-md">{error}</div>}

          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Email Configuration</h2>
            <p className="text-gray-600 mb-4">
              Email notifications are configured using environment variables. To update these settings, you'll need to
              modify your environment variables in your hosting platform.
            </p>

            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h3 className="font-medium mb-2">Current Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">SMTP Host:</p>
                  <p className="text-sm text-gray-600">{process.env.EMAIL_HOST || "smtp.example.com"} (default)</p>
                </div>
                <div>
                  <p className="text-sm font-medium">SMTP Port:</p>
                  <p className="text-sm text-gray-600">{process.env.EMAIL_PORT || "587"} (default)</p>
                </div>
                <div>
                  <p className="text-sm font-medium">SMTP Secure:</p>
                  <p className="text-sm text-gray-600">
                    {process.env.EMAIL_SECURE === "true" ? "Yes" : "No"} (default: No)
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">From Address:</p>
                  <p className="text-sm text-gray-600">
                    {process.env.EMAIL_FROM || "Broski's Kitchen <orders@broskiskitchen.com>"} (default)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-md mb-4">
              <h3 className="font-medium mb-2">Required Environment Variables</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>EMAIL_HOST - SMTP server hostname</li>
                <li>EMAIL_PORT - SMTP server port</li>
                <li>EMAIL_SECURE - Whether to use TLS (true/false)</li>
                <li>EMAIL_USER - SMTP username</li>
                <li>EMAIL_PASSWORD - SMTP password</li>
                <li>EMAIL_FROM - From address for emails</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Test Email Notifications</h2>
            <p className="text-gray-600 mb-4">
              Send a test email to verify that your email configuration is working correctly.
            </p>

            <form onSubmit={handleSendTestEmail} className="max-w-md">
              <div className="mb-4">
                <label htmlFor="testEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  id="testEmail"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Test Email"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </ProtectedRoute>
  )
}
