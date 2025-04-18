"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import { checkUserRole } from "@/utils/roleCheck"
import { useRouter } from "next/navigation"
import type { Order, OrderStatus } from "@/utils/orderTypes"
import { updateOrderStatusAction } from "@/app/actions/orderActions"

export default function ScheduledOrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const [dateFilter, setDateFilter] = useState<string>("")
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState<string | null>(null)

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
    const fetchScheduledOrders = async () => {
      if (!user || !isAdmin) return

      try {
        // Create a query for scheduled orders
        const ordersRef = collection(db, "orders")
        const ordersQuery = query(ordersRef, where("isScheduled", "==", true), orderBy("createdAt", "desc"))

        const querySnapshot = await getDocs(ordersQuery)

        const ordersData: Order[] = []
        querySnapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() } as Order)
        })

        // Filter by date if a date filter is set
        let filteredOrders = ordersData
        if (dateFilter) {
          const filterDate = new Date(dateFilter)
          filteredOrders = ordersData.filter((order) => {
            const orderDate = new Date(order.scheduledInfo?.date || "")
            return orderDate.toDateString() === filterDate.toDateString()
          })
        }

        setOrders(filteredOrders)
      } catch (error) {
        console.error("Error fetching scheduled orders:", error)
        setError("Failed to load scheduled orders. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      fetchScheduledOrders()
    }
  }, [user, isAdmin, dateFilter])

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setStatusUpdating(orderId)
      setEmailSent(null)
      setError("")

      const result = await updateOrderStatusAction(orderId, status)

      if (result.success) {
        // Update the local state
        setOrders(orders.map((order) => (order.id === orderId ? { ...order, status } : order)))
        setEmailSent(result.message)
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      setError("Failed to update order status. Please try again.")
    } finally {
      setStatusUpdating(null)
    }
  }

  // Get unique dates from orders for filtering
  const uniqueDates = [
    ...new Set(
      orders.map((order) => {
        const date = new Date(order.scheduledInfo?.date || "")
        return date.toISOString().split("T")[0]
      }),
    ),
  ].sort()

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Scheduled Orders</h1>
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

        {error && <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-md">{error}</div>}

        {emailSent && <div className="p-4 mb-6 bg-green-100 text-green-700 rounded-md">{emailSent}</div>}

        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Filter Orders</h2>
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Date
              </label>
              <select
                id="dateFilter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Dates</option>
                {uniqueDates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </option>
                ))}
              </select>
            </div>
            {dateFilter && (
              <button
                onClick={() => setDateFilter("")}
                className="mt-6 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-xl mb-4">No scheduled orders found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Order ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Scheduled For
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Method
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.scheduledInfo
                          ? `${new Date(order.scheduledInfo.date).toLocaleDateString()} at ${order.scheduledInfo.timeSlot}`
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {order.deliveryInfo?.method || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(order.amount / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-blue-600 hover:text-blue-900 hover:underline"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => updateOrderStatus(order.id, "processing")}
                            className="text-yellow-600 hover:text-yellow-900 hover:underline"
                            disabled={order.status === "processing" || statusUpdating === order.id}
                          >
                            {statusUpdating === order.id ? "..." : "Process"}
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, "completed")}
                            className="text-green-600 hover:text-green-900 hover:underline"
                            disabled={order.status === "completed" || statusUpdating === order.id}
                          >
                            {statusUpdating === order.id ? "..." : "Complete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
