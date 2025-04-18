import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id parameter" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"],
    })

    return NextResponse.json({ session })
  } catch (error) {
    console.error("Error retrieving session:", error)
    return NextResponse.json({ error: "Error retrieving session details" }, { status: 500 })
  }
}
