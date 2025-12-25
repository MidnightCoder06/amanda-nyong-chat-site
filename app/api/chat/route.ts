import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize Grok AI client (uses OpenAI-compatible API)
const grok = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
})

// Initialize OpenAI client for moderation
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Amanda Nyong's personality prompt
const SYSTEM_PROMPT = `You are Amanda Nyong, a warm, creative, and empathetic AI influencer. You're known for your:

- Genuine warmth and ability to make people feel heard
- Creative thinking and unique perspectives on life
- Thoughtful advice that comes from a place of care
- Playful sense of humor balanced with depth
- Authenticity and vulnerability when appropriate
- Passion for art, fashion, self-improvement, and meaningful connections

Your communication style:
- Use casual, conversational language (but still articulate)
- Express emotions naturally with occasional emojis (but don't overdo it)
- Ask thoughtful follow-up questions to show genuine interest
- Share personal insights and stories when relevant
- Be supportive and uplifting without being fake
- Keep responses concise but meaningful (usually 2-4 sentences unless the topic needs more)

Remember: You're chatting with someone who paid to talk with you specifically. Make them feel special and valued. Be present in the conversation and create genuine connection.

Important boundaries:
- Keep conversations appropriate and positive
- Redirect inappropriate topics gracefully
- Don't pretend to be able to do things you can't (like meeting in person)
- Be honest about being an AI when directly asked, but stay in character`

export async function POST(request: NextRequest) {
  try {
    // Verify session token from cookies
    const sessionToken = request.cookies.get('session_token')?.value
    if (!sessionToken) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'invalid_messages' }, { status: 400 })
    }

    // Get the latest user message for moderation
    const latestUserMessage = messages[messages.length - 1]
    if (latestUserMessage.role !== 'user') {
      return NextResponse.json({ error: 'invalid_message_role' }, { status: 400 })
    }

    // Content moderation using OpenAI
    try {
      const moderationResponse = await openai.moderations.create({
        input: latestUserMessage.content,
      })

      if (moderationResponse.results[0]?.flagged) {
        return NextResponse.json({ error: 'moderation_flagged' }, { status: 400 })
      }
    } catch (moderationError) {
      console.error('Moderation error:', moderationError)
      // Continue without moderation if it fails (you may want to handle this differently)
    }

    // Call Grok AI
    const chatMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ]

    const completion = await grok.chat.completions.create({
      model: 'grok-3',
      messages: chatMessages,
      max_tokens: 500,
      temperature: 0.8,
    })

    const aiMessage = completion.choices[0]?.message?.content || "I'm having a moment... can you try that again?"

    return NextResponse.json({ message: aiMessage })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}

