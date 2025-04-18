"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { checkUserRole } from "@/utils/roleCheck"
import type { Order, OrderStatus } from "@/utils/orderTypes"
import { updateOrderStatusAction, resendOrderNotificationAction } from "@/app/actions/orderActions"

interface OrderItem {
  name: string
  quantity: number
  price: number
}

export default function AdminOrderDetailsPage() {
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [emailSent, setEmailSent] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

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
      }
    }

    checkAdmin()
  }, [user, router])

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user || !isAdmin || !orderId) return

      try {
        const orderRef = doc(db, "orders", orderId)
        const orderDoc = await getDoc(orderRef)

        if (!orderDoc.exists()) {
          setError("Order not found")
          return
        }

        setOrder({ id: orderDoc.id, ...orderDoc.data() } as Order)
      } catch (error) {
        console.error("Error fetching order details:", error)
        setError("Failed to load order details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      fetchOrderDetails()
    }
  }, [user, isAdmin, orderId])

  const updateOrderStatus = async (status: OrderStatus) => {
    if (!order) return

    try {
      setStatusUpdating(true)
      setEmailSent(null)
      setError("")

      const result = await updateOrderStatusAction(order.id, status)

      if (result.success) {
        // Update local state
        setOrder({ ...order, status })
        setEmailSent(result.message)
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      setError("Failed to update order status. Please try again.")
    } finally {
      setStatusUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const resendNotification = async () => {
    if (!order) return

    try {
      setStatusUpdating(true)
      setEmailSent(null)
      setError("")

      const result = await resendOrderNotificationAction(order.id)

      if (result.success) {
        setEmailSent(result.message)
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error("Error resending notification:", error)
      setError("Failed to resend notification. Please try again.")
    } finally {
      setStatusUpdating(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-6">
          <Link href="/admin/orders" className="text-blue-600 hover:underline flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Order Details</h1>

        {error && <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-md">{error}</div>}

        {emailSent && <div className="p-4 mb-6 bg-green-100 text-green-700 rounded-md">{emailSent}</div>}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : order ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Order ID:</span>
                    <span className="text-gray-600">{order.id}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Customer:</span>
                    <span className="text-gray-600">{order.customer}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Date:</span>
                    <span className="text-gray-600">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Payment Status:</span>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Notification History */}
                {order.notifications && Object.keys(order.notifications).length > 0 && (
                  <div className="mt-4 mb-4">
                    <h3 className="font-semibold text-lg mb-2">Notification History</h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                      {order.notifications.confirmedSent && (
                        <div className="mb-1">
                          <span className="font-medium">Confirmed:</span>{" "}
                          {formatDate(order.notifications.confirmedSent)}
                        </div>
                      )}
                      {order.notifications.processingSent && (
                        <div className="mb-1">
                          <span className="font-medium">Processing:</span>{" "}
                          {formatDate(order.notifications.processingSent)}
                        </div>
                      )}
                      {order.notifications.completedSent && (
                        <div className="mb-1">
                          <span className="font-medium">Completed:</span>{" "}
                          {formatDate(order.notifications.completedSent)}
                        </div>
                      )}
                      {order.notifications.cancelledSent && (
                        <div className="mb-1">
                          <span className="font-medium">Cancelled:</span>{" "}
                          {formatDate(order.notifications.cancelledSent)}
                        </div>
                      )}
                      <button
                        onClick={resendNotification}
                        disabled={statusUpdating}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Resend Latest Notification
                      </button>
                    </div>
                  </div>
                )}

                <h3 className="font-semibold text-lg mt-6 mb-3">Items</h3>
                {order.items && order.items.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Item
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Quantity
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {order.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${(item.price / 100).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${((item.price * item.quantity) / 100).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No items available</p>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Update Order</h2>
                <div className="space-y-4">
                  <button
                    onClick={() => updateOrderStatus("processing")}
                    disabled={order.status === "processing" || statusUpdating}
                    className="w-full py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
                  >
                    {statusUpdating ? "Updating..." : "Mark as Processing"}
                  </button>
                  <button
                    onClick={() => updateOrderStatus("completed")}
                    disabled={order.status === "completed" || statusUpdating}
                    className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {statusUpdating ? "Updating..." : "Mark as Completed"}
                  </button>
                  <button
                    onClick={() => updateOrderStatus("cancelled")}
                    disabled={order.status === "cancelled" || statusUpdating}
                    className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {statusUpdating ? "Updating..." : "Cancel Order"}
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${((order.amount * 0.92) / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${((order.amount * 0.08) / 100).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 font-medium flex justify-between">
                    <span>Total</span>
                    <span>${(order.amount / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {order.deliveryInfo && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {order.deliveryInfo.method === "delivery" ? "Delivery" : "Pickup"} Information
                  </h2>

                  {order.deliveryInfo.method === "delivery" && order.deliveryInfo.address && (
                    <div className="mb-4">
                      <p className="text-gray-700">
                        {order.deliveryInfo.address.street}
                        {order.deliveryInfo.address.apt && `, ${order.deliveryInfo.address.apt}`}
                      </p>
                      <p className="text-gray-700">
                        {order.deliveryInfo.address.city}, {order.deliveryInfo.address.state}{" "}
                        {order.deliveryInfo.address.zipCode}
                      </p>
                      {order.deliveryInfo.address.instructions && (
                        <p className="text-gray-700 mt-1">
                          <span className="font-medium">Instructions:</span> {order.deliveryInfo.address.instructions}
                        </p>
                      )}
                    </div>
                  )}

                  {order.deliveryInfo.method === "pickup" && order.deliveryInfo.pickupLocation && (
                    <p className="text-gray-700 mb-2">
                      <span className="font-medium">Pickup Location:</span> {order.deliveryInfo.pickupLocation}
                    </p>
                  )}

                  <p className="text-gray-700">
                    <span className="font-medium">Contact Phone:</span> {order.deliveryInfo.contactPhone}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Estimated Time:</span> {order.deliveryInfo.estimatedTime}
                  </p>
                </div>
              )}

              {order.isScheduled && order.scheduledInfo && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h2 className="text-xl font-semibold mb-4">Scheduled Information</h2>
                  <p className="text-gray-700">
                    <span className="font-medium">Date:</span> {new Date(order.scheduledInfo.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Time Slot:</span> {order.scheduledInfo.timeSlot}
                  </p>
                  {order.specialEvent && (
                    <p className="text-gray-700">
                      <span className="font-medium">Special Event:</span> {order.specialEvent}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-xl mb-4">Order not found</p>
            <Link
              href="/admin/orders"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Orders
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
