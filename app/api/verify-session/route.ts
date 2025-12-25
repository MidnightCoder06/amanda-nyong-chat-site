import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SESSION_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'your-secret-key-at-least-32-characters'
)

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value

    if (!sessionToken) {
      return NextResponse.json({ valid: false, error: 'no_token' })
    }

    // Verify the JWT
    const { payload } = await jwtVerify(sessionToken, SESSION_SECRET)

    if (!payload.paid) {
      return NextResponse.json({ valid: false, error: 'not_paid' })
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json({ valid: false, error: 'invalid_token' })
  }
}

