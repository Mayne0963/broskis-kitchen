"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"

interface UserProfile {
  name: string
  email: string
  loyaltyPoints: number
  role: string
  createdAt: string
}

interface Order {
  id: string
  amount: number
  status: string
  createdAt: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      try {
        // Fetch user profile
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile)
        }

        // Fetch recent orders
        const ordersRef = collection(db, "orders")
        const q = query(ordersRef, where("userId", "==", user.uid), orderBy("createdAt", "desc"), limit(3))
        const querySnapshot = await getDocs(q)

        const ordersData: Order[] = []
        querySnapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() } as Order)
        })

        setRecentOrders(ordersData)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : profile ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Profile</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Name:</span> {profile.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {profile.email}
                </p>
                <p>
                  <span className="font-medium">Member Since:</span> {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Loyalty Status</h2>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{profile.loyaltyPoints}</div>
                <p className="text-gray-600">Loyalty Points</p>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${Math.min(100, (profile.loyaltyPoints / 100) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {profile.loyaltyPoints >= 100
                    ? "You've earned a reward!"
                    : `${100 - profile.loyaltyPoints} more points until your next reward`}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
              <ul className="space-y-2">
                <li>
                  <Link href="/orders" className="text-blue-600 hover:underline">
                    Order History
                  </Link>
                </li>
                <li>
                  <Link href="/profile/edit" className="text-blue-600 hover:underline">
                    Edit Profile
                  </Link>
                </li>
                <li>
                  <Link href="/loyalty" className="text-blue-600 hover:underline">
                    Loyalty Program
                  </Link>
                </li>
                {profile.role === "admin" && (
                  <li>
                    <Link href="/admin" className="text-blue-600 hover:underline">
                      Admin Panel
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <Link href="/orders" className="text-blue-600 hover:underline text-sm">
                  View All Orders
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <p className="text-gray-500">You haven't placed any orders yet.</p>
              ) : (
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
                          Date
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
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.id.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
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
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Link
                              href={`/orders/${order.id}`}
                              className="text-blue-600 hover:text-blue-900 hover:underline"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-100 p-4 rounded-lg">
            <p>Profile not found. Please complete your registration.</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
