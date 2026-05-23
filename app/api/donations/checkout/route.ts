import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe not configured.' }, { status: 503 })
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2026-04-22.dahlia' })
  const { amount, recurring } = await req.json() as { amount: number; recurring: boolean }

  if (!amount || amount < 1 || amount > 10000) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://voadi.org'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: recurring ? 'subscription' : 'payment',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          ...(recurring
            ? {
                recurring: { interval: 'month' },
                product_data: {
                  name: 'Monthly Support — VOADI',
                  description: 'Monthly contribution to the African Diaspora Community in Ireland',
                },
              }
            : {
                product_data: {
                  name: 'Donation — VOADI',
                  description: 'One-off contribution to the African Diaspora Community in Ireland',
                },
              }),
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${base}/?donated=1`,
    cancel_url: `${base}/#donate`,
  })

  return NextResponse.json({ url: session.url })
}
