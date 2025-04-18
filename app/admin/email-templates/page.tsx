"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { checkUserRole } from "@/utils/roleCheck"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { emailTemplates } from "@/utils/emailTemplates"

export default function EmailTemplatesPage() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<"confirmed" | "processing" | "completed" | "cancelled">(
    "confirmed",
  )
  const [iframeHeight, setIframeHeight] = useState(600)

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

  // Sample order data for preview
  const sampleOrder = {
    id: "sample_order_123456789",
    createdAt: new Date().toISOString(),
    amount: 4297,
    status: selectedTemplate,
    customer: "customer@example.com",
    items: [
      { name: "Classic Burger", quantity: 1, price: 1699 },
      { name: "Loaded Nachos", quantity: 1, price: 1299 },
      { name: "Buffalo Wings", quantity: 1, price: 1499 },
    ],
    deliveryInfo: {
      method: "delivery",
      address: {
        street: "123 Sample Street",
        apt: "Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        instructions: "Please leave at the door",
      },
      contactPhone: "555-123-4567",
      estimatedTime: "30-45 minutes",
    },
    isScheduled: true,
    scheduledInfo: {
      date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      timeSlot: "12:00 PM - 1:00 PM",
    },
    specialEvent: "Weekend Special",
  }

  // Get the HTML for the selected template
  const getTemplateHtml = () => {
    return emailTemplates[selectedTemplate].body(sampleOrder)
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
        <div className="max-w-6xl mx-auto py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Email Templates</h1>
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

          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Email Template Preview</h2>
            <p className="text-gray-600 mb-4">
              Preview how email notifications will appear to customers for different order statuses.
            </p>

            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setSelectedTemplate("confirmed")}
                className={`px-4 py-2 rounded-md ${
                  selectedTemplate === "confirmed"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Order Confirmed
              </button>
              <button
                onClick={() => setSelectedTemplate("processing")}
                className={`px-4 py-2 rounded-md ${
                  selectedTemplate === "processing"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Order Processing
              </button>
              <button
                onClick={() => setSelectedTemplate("completed")}
                className={`px-4 py-2 rounded-md ${
                  selectedTemplate === "completed"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Order Ready
              </button>
              <button
                onClick={() => setSelectedTemplate("cancelled")}
                className={`px-4 py-2 rounded-md ${
                  selectedTemplate === "cancelled"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Order Cancelled
              </button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-3 border-b">
                <div className="flex items-center">
                  <span className="font-medium">Subject:</span>
                  <span className="ml-2">{emailTemplates[selectedTemplate].subject}</span>
                </div>
              </div>
              <iframe
                srcDoc={getTemplateHtml()}
                className="w-full"
                style={{ height: `${iframeHeight}px` }}
                title="Email Template Preview"
              ></iframe>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setIframeHeight(iframeHeight + 200)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2"
              >
                Increase Height
              </button>
              <button
                onClick={() => setIframeHeight(Math.max(400, iframeHeight - 200))}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Decrease Height
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Email Template Configuration</h2>
            <p className="text-gray-600 mb-4">
              Email templates are defined in the <code>utils/emailTemplates.ts</code> file. To modify the templates, you
              can edit this file directly.
            </p>

            <div className="bg-yellow-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Customization Tips</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Modify the HTML and CSS in the template files to match your brand</li>
                <li>Update the logo and colors to reflect your brand identity</li>
                <li>Add additional sections or information as needed</li>
                <li>Test your changes by sending test emails from the Email Settings page</li>
              </ul>
            </div>

            <div className="mt-6">
              <Link
                href="/admin/email-settings"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Go to Email Settings
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </ProtectedRoute>
  )
}
