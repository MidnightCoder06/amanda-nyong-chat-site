import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { SignJWT } from 'jose'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'your-secret-key-at-least-32-characters'
)

export async function POST(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Create a session token that will be validated after payment
    const sessionId = crypto.randomUUID()
    
    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Chat Session with Amanda Nyong',
              description: 'One private chat session with Amanda - your AI friend',
              images: [],
            },
            unit_amount: 500, // $5.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/api/payment-success?session_id={CHECKOUT_SESSION_ID}&token=${sessionId}`,
      cancel_url: `${baseUrl}`,
      metadata: {
        sessionId,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

