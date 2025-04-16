import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const createCheckoutSession = async (req: NextApiRequest, res: NextApiResponse) => {
  const { items, customerEmail } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
      customer_email: customerEmail,
    });
    res.status(200).json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
};