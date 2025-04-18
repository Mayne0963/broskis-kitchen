"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { doc, setDoc, collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/AuthContext"
import { calculatePointsForPurchase, awardLoyaltyPoints } from "@/utils/loyaltyUtils"
import { useCart } from "@/contexts/CartContext"

interface OrderDetails {
  id: string
  amount: number
  items: any[]
  created: number
  customer: string
  deliveryInfo?: {
    method: "delivery" | "pickup"
    address?: {
      street: string
      apt?: string
      city: string
      state: string
      zipCode: string
      instructions?: string
    }
    pickupLocation?: string
    contactPhone: string
    estimatedTime: string
  }
  isScheduled?: boolean
  scheduledInfo?: {
    date: string
    timeSlot: string
  }
}

export default function Success() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [pointsEarned, setPointsEarned] = useState(0)
  const { user } = useAuth()
  const { clearCart } = useCart()

  useEffect(() => {
    if (!sessionId) return

    const fetchOrderDetails = async () => {
      try {
        // Fetch session details from our API
        const response = await fetch(`/api/checkout/session?session_id=${sessionId}`)
        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        const { session } = data

        // Extract delivery info from metadata
        const metadata = session.metadata || {}
        const deliveryMethod = metadata.deliveryMethod as "delivery" | "pickup"

        const deliveryInfo: any = {
          method: deliveryMethod,
          contactPhone: metadata.deliveryContactPhone || metadata.pickupContactPhone || "",
          estimatedTime: metadata.deliveryEstimatedTime || metadata.pickupEstimatedTime || "",
        }

        if (deliveryMethod === "delivery") {
          deliveryInfo.address = {
            street: metadata.deliveryStreet || "",
            apt: metadata.deliveryApt || "",
            city: metadata.deliveryCity || "",
            state: metadata.deliveryState || "",
            zipCode: metadata.deliveryZipCode || "",
            instructions: metadata.deliveryInstructions || "",
          }
        } else if (deliveryMethod === "pickup") {
          deliveryInfo.pickupLocation = metadata.pickupLocation || ""
        }

        // Extract scheduling information if available
        const isScheduled = metadata.isScheduled === "true"
        let scheduledInfo = null

        if (isScheduled) {
          scheduledInfo = {
            date: metadata.scheduledDate || "",
            timeSlot: metadata.scheduledTimeSlot || "",
          }
        }

        // Format order details
        const orderDetails = {
          id: session.id,
          amount: session.amount_total,
          items: session.line_items?.data || [],
          created: session.created * 1000, // Convert to milliseconds
          customer: session.customer_details?.email || user?.email || "guest@example.com",
          deliveryInfo,
          isScheduled,
          scheduledInfo,
        }

        setOrderDetails(orderDetails)

        // Clear the cart after successful order
        clearCart()

        // Save order to Firestore if user is logged in
        if (user) {
          await setDoc(doc(db, "orders", sessionId), {
            ...orderDetails,
            userId: user.uid,
            status: "completed",
            paymentStatus: "paid",
            createdAt: new Date().toISOString(),
          })

          // Calculate and award loyalty points
          const pointsToAward = await calculatePointsForPurchase(user.uid, orderDetails.amount)
          if (pointsToAward > 0) {
            await awardLoyaltyPoints(user.uid, pointsToAward)
            setPointsEarned(pointsToAward)

            // Log the points transaction
            await addDoc(collection(db, "pointsTransactions"), {
              userId: user.uid,
              orderId: sessionId,
              points: pointsToAward,
              type: "earned",
              description: "Points earned from purchase",
              createdAt: new Date().toISOString(),
            })
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error)
        setError("Failed to load order details. Please contact support.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [sessionId, user, clearCart])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmation</h1>
            <p className="text-red-600">{error}</p>
          </div>
          <div className="text-center">
            <Link href="/shop" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">
            Thank you for your order. We've received your payment and are processing your order.
          </p>
        </div>

        {orderDetails && (
          <>
            <div className="border-t border-b py-4 my-6">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Order ID:</span>
                <span className="text-gray-600">{orderDetails.id.substring(0, 8)}...</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Date:</span>
                <span className="text-gray-600">{new Date(orderDetails.created).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Total Amount:</span>
                <span className="text-gray-600">${(orderDetails.amount / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Delivery Method:</span>
                <span className="text-gray-600 capitalize">{orderDetails.deliveryInfo?.method}</span>
              </div>
            </div>

            {orderDetails.isScheduled && orderDetails.scheduledInfo && (
              <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                <h2 className="font-semibold mb-2">Scheduled Order</h2>
                <p className="text-gray-700">
                  Your order is scheduled for{" "}
                  <span className="font-medium">
                    {new Date(orderDetails.scheduledInfo.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    at {orderDetails.scheduledInfo.timeSlot}
                  </span>
                </p>
              </div>
            )}

            {orderDetails.deliveryInfo && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h2 className="font-semibold mb-2">
                  {orderDetails.deliveryInfo.method === "delivery" ? "Delivery" : "Pickup"} Information
                </h2>

                {orderDetails.deliveryInfo.method === "delivery" && orderDetails.deliveryInfo.address && (
                  <div className="mb-2">
                    <p className="text-gray-700">
                      {orderDetails.deliveryInfo.address.street}
                      {orderDetails.deliveryInfo.address.apt && `, ${orderDetails.deliveryInfo.address.apt}`}
                    </p>
                    <p className="text-gray-700">
                      {orderDetails.deliveryInfo.address.city}, {orderDetails.deliveryInfo.address.state}{" "}
                      {orderDetails.deliveryInfo.address.zipCode}
                    </p>
                    {orderDetails.deliveryInfo.address.instructions && (
                      <p className="text-gray-700 mt-1">
                        <span className="font-medium">Instructions:</span>{" "}
                        {orderDetails.deliveryInfo.address.instructions}
                      </p>
                    )}
                  </div>
                )}

                {orderDetails.deliveryInfo.method === "pickup" && orderDetails.deliveryInfo.pickupLocation && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Pickup Location:</span> {orderDetails.deliveryInfo.pickupLocation}
                  </p>
                )}

                <p className="text-gray-700">
                  <span className="font-medium">Contact Phone:</span> {orderDetails.deliveryInfo.contactPhone}
                </p>

                {!orderDetails.isScheduled && (
                  <p className="text-gray-700">
                    <span className="font-medium">Estimated Time:</span> {orderDetails.deliveryInfo.estimatedTime}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        <div className="text-center space-y-4">
          {user && pointsEarned > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-blue-800 font-medium">
                Congratulations! You've earned {pointsEarned} loyalty points from this purchase!
              </p>
              <Link href="/loyalty" className="text-blue-600 hover:underline text-sm">
                View your loyalty rewards
              </Link>
            </div>
          )}

          <div className="space-x-4">
            <Link
              href="/dashboard"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Dashboard
            </Link>
            <Link href="/shop" className="inline-block px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
