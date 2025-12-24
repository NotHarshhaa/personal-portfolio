import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { ContactEmailTemplate } from '@/components/contact-email-template'
import { getFormSchema } from '@/lib/validation'

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key-for-build')

// Simple rate limiting (in-memory, for production use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5 // 5 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  record.count++
  return true
}

function getClientIP(request: Request): string {
  // Try to get IP from various headers (for Vercel/proxies)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  return 'unknown'
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate using Zod schema
    const schema = getFormSchema()
    const validationResult = schema.safeParse(body)

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message).join(', ')
      return NextResponse.json(
        { message: `Validation failed: ${errors}` },
        { status: 400 }
      )
    }

    const { firstName, lastName = '', email, message } = validationResult.data

    // Check if API key is available
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'dummy-key-for-build') {
      console.error('Resend API key not configured')
      return NextResponse.json(
        { message: 'Email service not configured' },
        { status: 503 }
      )
    }

    // Send email
    const fullName = lastName ? `${firstName} ${lastName}` : firstName
    const { data, error } = await resend.emails.send({
      from: 'Harshhaa Portfolio <noreply@notharshhaa.site>',
      to: 'harshhaa03@gmail.com',
      subject: `New message from ${fullName}`,
      react: ContactEmailTemplate({
        firstName,
        lastName: lastName || '',
        email,
        message
      })
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { message: 'Error sending email. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    // Log error but don't expose details to client
    console.error('Unexpected error in send route:', error)
    return NextResponse.json(
      { message: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}

// Add CORS headers for preflight requests
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
