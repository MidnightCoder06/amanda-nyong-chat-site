import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { SignJWT } from 'jose'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'your-secret-key-at-least-32-characters'
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    const token = searchParams.get('token')
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    if (!sessionId || !token) {
      return NextResponse.redirect(`${baseUrl}?error=invalid_session`)
    }

    // Verify the Stripe session
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)

    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.redirect(`${baseUrl}?error=payment_failed`)
    }

    // Verify the token matches
    if (checkoutSession.metadata?.sessionId !== token) {
      return NextResponse.redirect(`${baseUrl}?error=invalid_token`)
    }

    // Create a JWT session token
    const jwt = await new SignJWT({ sessionId: token, paid: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h') // Session expires in 24 hours
      .sign(SESSION_SECRET)

    // Redirect to chat with session cookie
    const response = NextResponse.redirect(`${baseUrl}/chat`)
    response.cookies.set('session_token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Payment success error:', error)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    return NextResponse.redirect(`${baseUrl}?error=verification_failed`)
  }
}

