"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { loadStripe } from "@stripe/stripe-js"
import DeliveryOptions from "@/components/DeliveryOptions"
import { useDelivery } from "@/contexts/DeliveryContext"
import { formatScheduledTime } from "@/utils/scheduleUtils"

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function Checkout() {
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } = useCart()
  const { user } = useAuth()
  const { deliveryInfo, isScheduled, selectedDate, selectedTimeSlot } = useDelivery()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [orderTotal, setOrderTotal] = useState(subtotal)

  useEffect(() => {
    if (user) {
      setEmail(user.email || "")
    }
  }, [user])

  // Calculate order total whenever subtotal or delivery fee changes
  useEffect(() => {
    const tax = Math.round(subtotal * 0.08)
    setOrderTotal(subtotal + tax + deliveryFee)
  }, [subtotal, deliveryFee])

  const handleDeliveryFeeChange = (fee: number) => {
    setDeliveryFee(fee)
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError("Your cart is empty")
      return
    }

    if (!email) {
      setError("Please enter your email")
      return
    }

    // Check if delivery method is selected and valid
    if (!deliveryInfo) {
      setError("Please select a delivery method")
      return
    }

    // For delivery, check if address is complete
    if (deliveryInfo.method === "delivery" && (!deliveryInfo.address?.street || !deliveryInfo.address?.zipCode)) {
      setError("Please enter a complete delivery address")
      return
    }

    // For pickup, check if location is selected
    if (deliveryInfo.method === "pickup" && !deliveryInfo.pickupLocation) {
      setError("Please select a pickup location")
      return
    }

    // Check if contact phone is provided
    if (!deliveryInfo.contactPhone) {
      setError("Please enter a contact phone number")
      return
    }

    // Check if scheduled order has date and time slot
    if (isScheduled && (!selectedDate || !selectedTimeSlot)) {
      setError("Please select a date and time slot for your scheduled order")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          customerEmail: email,
          userId: user?.uid,
          deliveryInfo,
          deliveryFee,
          isScheduled,
          scheduledTime:
            isScheduled && selectedDate && selectedTimeSlot
              ? {
                  date: selectedDate,
                  timeSlot: selectedTimeSlot,
                }
              : undefined,
        }),
      })

      const { id, error } = await response.json()

      if (error) {
        setError(error)
        setLoading(false)
        return
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId: id })
        if (error) {
          setError(error.message || "An error occurred during checkout")
        }
      }
    } catch (error) {
      console.error("Checkout error:", error)
      setError("An error occurred during checkout. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {items.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-xl mb-4">Your cart is empty</p>
          <Link href="/shop" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {items.map((item) => (
                <div key={item.product.id} className="flex items-center py-4 border-b">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="ml-4 flex-grow">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">${(item.product.price / 100).toFixed(2)}</p>
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>

                    <span className="mx-2 w-8 text-center">{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <DeliveryOptions subtotal={subtotal} onFeeChange={handleDeliveryFeeChange} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Payment Details</h2>

              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {isScheduled && selectedDate && selectedTimeSlot && (
                <div className="mb-4 p-3 bg-blue-50 rounded-md">
                  <p className="font-medium">Scheduled for:</p>
                  <p>{formatScheduledTime(selectedDate, selectedTimeSlot)}</p>
                </div>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${((subtotal * 0.08) / 100).toFixed(2)}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${(deliveryFee / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2 font-medium flex justify-between">
                  <span>Total</span>
                  <span>${(orderTotal / 100).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || items.length === 0}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
