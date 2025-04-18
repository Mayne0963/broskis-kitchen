import { NextResponse } from "next/server"
import Stripe from "stripe"
import type { Product } from "@/utils/productSetup"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(request: Request) {
  try {
    const { items, customerEmail, userId, deliveryInfo, deliveryFee, isScheduled, scheduledTime } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid items provided" }, { status: 400 })
    }

    const lineItems = items.map((item: { product: Product; quantity: number }) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          description: item.product.description,
        },
        unit_amount: item.product.price,
      },
      quantity: item.quantity,
    }))

    // Add delivery fee as a separate line item if applicable
    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Delivery Fee",
            description: `Delivery to ${deliveryInfo?.address?.zipCode || "your area"}`,
          },
          unit_amount: deliveryFee,
        },
        quantity: 1,
      })
    }

    const origin = request.headers.get("origin") || "http://localhost:3000"

    // Format delivery info for metadata
    let deliveryMetadata: Record<string, string> = {}

    if (deliveryInfo) {
      if (deliveryInfo.method === "delivery" && deliveryInfo.address) {
        deliveryMetadata = {
          deliveryMethod: "delivery",
          deliveryStreet: deliveryInfo.address.street,
          deliveryApt: deliveryInfo.address.apt || "",
          deliveryCity: deliveryInfo.address.city,
          deliveryState: deliveryInfo.address.state,
          deliveryZipCode: deliveryInfo.address.zipCode,
          deliveryInstructions: deliveryInfo.address.instructions || "",
          deliveryContactPhone: deliveryInfo.contactPhone,
          deliveryEstimatedTime: deliveryInfo.estimatedTime,
        }
      } else if (deliveryInfo.method === "pickup" && deliveryInfo.pickupLocation) {
        deliveryMetadata = {
          deliveryMethod: "pickup",
          pickupLocation: deliveryInfo.pickupLocation,
          pickupContactPhone: deliveryInfo.contactPhone,
          pickupEstimatedTime: deliveryInfo.estimatedTime,
        }
      }
    }

    // Add scheduling information to metadata if applicable
    let schedulingMetadata: Record<string, string> = {}
    if (isScheduled && scheduledTime) {
      schedulingMetadata = {
        isScheduled: "true",
        scheduledDate: scheduledTime.date.toISOString(),
        scheduledTimeSlot: scheduledTime.timeSlot,
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      customer_email: customerEmail,
      metadata: {
        userId: userId || "guest",
        orderId: `order_${Date.now()}`,
        ...deliveryMetadata,
        ...schedulingMetadata,
      },
    })

    return NextResponse.json({ id: session.id })
  } catch (error) {
    console.error("Stripe error:", error)
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 })
  }
}
