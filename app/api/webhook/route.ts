import { NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore"
import { db } from "@/lib/firebase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

// This is your Stripe webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: Request) {
  const body = await request.text()
  const sig = headers().get("stripe-signature") as string

  let event: Stripe.Event

  try {
    if (!endpointSecret) {
      // For testing without the webhook secret
      event = JSON.parse(body) as Stripe.Event
    } else {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    }
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session

      // Update order status in Firestore
      if (session.id) {
        try {
          // Extract delivery information from metadata
          const metadata = session.metadata || {}
          const deliveryMethod = metadata.deliveryMethod

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

          // Get the order from Firestore
          const orderRef = doc(db, "orders", session.id)
          const orderDoc = await getDoc(orderRef)

          if (orderDoc.exists()) {
            // Update the order status
            await updateDoc(orderRef, {
              paymentStatus: "paid",
              status: "processing",
              updatedAt: new Date().toISOString(),
              deliveryInfo,
              isScheduled,
              scheduledInfo,
            })

            // Update user loyalty points if userId exists
            const userId = orderDoc.data().userId
            if (userId) {
              const userRef = doc(db, "users", userId)
              const userDoc = await getDoc(userRef)

              if (userDoc.exists()) {
                const pointsToAdd = Math.floor((session.amount_total || 0) / 100)
                await updateDoc(userRef, {
                  loyaltyPoints: increment(pointsToAdd),
                  lastOrderDate: new Date().toISOString(),
                })
              }
            }
          } else {
            // Create a new order if it doesn't exist
            await setDoc(orderRef, {
              id: session.id,
              amount: session.amount_total,
              customer: session.customer_details?.email,
              userId: metadata.userId || null,
              status: "processing",
              paymentStatus: "paid",
              createdAt: new Date().toISOString(),
              deliveryInfo,
              isScheduled,
              scheduledInfo,
            })
          }
        } catch (error) {
          console.error("Error updating order:", error)
        }
      }
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
