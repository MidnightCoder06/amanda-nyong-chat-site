import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { SignJWT } from 'jose'

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'your-secret-key-at-least-32-characters'
)

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  try {
    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured')
      return NextResponse.redirect(`${baseUrl}?error=stripe_not_configured`)
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    const token = searchParams.get('token')

    console.log('Payment verification - sessionId:', sessionId, 'token:', token)

    if (!sessionId || !token) {
      console.error('Missing sessionId or token')
      return NextResponse.redirect(`${baseUrl}?error=invalid_session`)
    }

    // Verify the Stripe session
    console.log('Retrieving Stripe checkout session...')
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)
    console.log('Checkout session payment_status:', checkoutSession.payment_status)
    console.log('Checkout session metadata:', checkoutSession.metadata)

    if (checkoutSession.payment_status !== 'paid') {
      console.error('Payment status is not paid:', checkoutSession.payment_status)
      return NextResponse.redirect(`${baseUrl}?error=payment_failed`)
    }

    // Verify the token matches
    if (checkoutSession.metadata?.sessionId !== token) {
      console.error('Token mismatch - expected:', checkoutSession.metadata?.sessionId, 'got:', token)
      return NextResponse.redirect(`${baseUrl}?error=invalid_token`)
    }

    // Create a JWT session token
    console.log('Creating JWT session token...')
    const jwt = await new SignJWT({ sessionId: token, paid: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h') // Session expires in 24 hours
      .sign(SESSION_SECRET)

    // Redirect to chat with session cookie
    console.log('Payment verified successfully, redirecting to chat...')
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
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.redirect(`${baseUrl}?error=verification_failed`)
  }
}

