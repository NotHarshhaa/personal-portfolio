import { NextResponse } from 'next/server'
import { getLocalAgentResponse } from '@/lib/agent-knowledge'

// In-memory rate limiting map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 20 // 20 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false
  }

  record.count++
  return true
}

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip') || 'unknown'
}

export async function POST(request: Request) {
  try {
    const clientIP = getClientIP(request)
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { message: 'Rate limit exceeded. Please wait a moment before sending another message.' },
        { status: 429 }
      )
    }

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
    }

    const { message } = body
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ message: 'Message cannot be empty' }, { status: 400 })
    }

    if (message.length > 500) {
      return NextResponse.json({ message: 'Message is too long (max 500 chars)' }, { status: 400 })
    }

    // Process with grounded knowledge engine
    const response = getLocalAgentResponse(message)

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Agent route error:', error)
    return NextResponse.json(
      { message: 'Internal error processing agent request' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
