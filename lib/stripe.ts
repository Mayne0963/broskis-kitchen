import type { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe"
import type { Product } from "@/utils/productSetup"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export const createCheckoutSession = async (req: NextApiRequest, res: NextApiResponse) => {
  const { items, customerEmail } = req.body
  try {
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
      customer_email: customerEmail,
      metadata: {
        orderId: `order_${Date.now()}`,
      },
    })
    res.status(200).json({ id: session.id })
  } catch (err) {
    console.error("Stripe error:", err)
    res.status(500).json({ error: "Stripe session creation failed" })
  }
}

export const getSessionDetails = async (sessionId: string) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"],
    })
    return session
  } catch (error) {
    console.error("Error retrieving session:", error)
    throw error
  }
}
