import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Bot detection patterns
const BOT_PATTERNS = [
  /bot|crawler|spider|scraper/i,
  /curl|wget|python|php|java/i,
  /postman|insomnia|httpie/i
]

// Suspicious email patterns
const SUSPICIOUS_EMAIL_PATTERNS = [
  /^[a-z0-9]{32}@/i, // Random 32-char emails
  /test\d+@/i, // test1@, test2@, etc.
  /temp|temporary|disposable/i,
  /10minutemail|guerrillamail|mailinator/i
]

// Simple rate limiting
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const key = `rate_limit_${ip}`
  const limit = rateLimitStore.get(key)
  
  if (!limit || now > limit.resetTime) {
    // Reset or create new limit (5 requests per 15 minutes)
    rateLimitStore.set(key, { count: 1, resetTime: now + 15 * 60 * 1000 })
    return true
  }
  
  if (limit.count >= 5) {
    return false // Rate limit exceeded
  }
  
  limit.count++
  return true
}

// Log security events
async function logSecurityEvent(
  supabaseAdmin: any,
  ip: string,
  userAgent: string,
  eventType: string,
  details: any,
  blocked: boolean = true
) {
  if (!supabaseAdmin) return
  
  try {
    await supabaseAdmin
      .from('security_logs')
      .insert([{
        ip_address: ip,
        user_agent: userAgent,
        event_type: eventType,
        details,
        blocked
      }])
  } catch (error) {
    console.log('Security logging not available yet - run migration first:', error)
  }
}

// Bot detection
function detectBot(request: NextRequest): { isBot: boolean; reason?: string } {
  const userAgent = request.headers.get('user-agent') || ''
  const referer = request.headers.get('referer') || ''
  
  // Check user agent patterns
  for (const pattern of BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return { isBot: true, reason: 'Suspicious user agent' }
    }
  }
  
  // Check for missing or suspicious headers
  if (!userAgent) {
    return { isBot: true, reason: 'Missing user agent' }
  }
  
  // Check for direct API calls (no referer from our domain)
  if (!referer.includes('localhost') && !referer.includes('vercel.app') && !referer.includes('scalptra.com') && referer !== 'direct') {
    return { isBot: true, reason: 'Direct API access' }
  }
  
  return { isBot: false }
}

// Email validation
function validateEmail(email: string): { isValid: boolean; reason?: string } {
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, reason: 'Invalid email format' }
  }
  
  // Check for suspicious patterns
  for (const pattern of SUSPICIOUS_EMAIL_PATTERNS) {
    if (pattern.test(email)) {
      return { isValid: false, reason: 'Suspicious email pattern' }
    }
  }
  
  // Check email length (reasonable limits)
  if (email.length > 254 || email.length < 5) {
    return { isValid: false, reason: 'Email length out of bounds' }
  }
  
  return { isValid: true }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP (Vercel headers when Cloudflare proxy is disabled)
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    // Rate limiting check
    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`)
      await logSecurityEvent(getSupabaseAdmin(), clientIP, request.headers.get('user-agent') || '', 'rate_limit', { attempts: 'exceeded' })
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Bot detection
    const botCheck = detectBot(request)
    if (botCheck.isBot) {
      console.log(`Bot detected: ${botCheck.reason} - IP: ${clientIP}`)
      await logSecurityEvent(getSupabaseAdmin(), clientIP, request.headers.get('user-agent') || '', 'bot_detected', { reason: botCheck.reason })
      return NextResponse.json(
        { error: 'Request blocked' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { email, honeypot } = body

    // Honeypot check (invisible field that bots might fill)
    if (honeypot) {
      console.log(`Honeypot triggered - IP: ${clientIP}`)
      await logSecurityEvent(getSupabaseAdmin(), clientIP, request.headers.get('user-agent') || '', 'honeypot', { honeypot_value: honeypot })
      return NextResponse.json(
        { error: 'Request blocked' },
        { status: 403 }
      )
    }

    // Email validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      console.log(`Invalid email: ${emailValidation.reason} - ${email} - IP: ${clientIP}`)
      await logSecurityEvent(getSupabaseAdmin(), clientIP, request.headers.get('user-agent') || '', 'suspicious_email', { 
        email: email.substring(0, 10) + '...', // Partial email for privacy
        reason: emailValidation.reason 
      })
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Check if Supabase is properly configured
    if (!supabaseAdmin) {
      console.log('Supabase not configured, simulating success for:', email)
      return NextResponse.json(
        { message: 'Successfully joined waitlist! (Demo mode - please configure Supabase)' },
        { status: 201 }
      )
    }

    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('waitlist')
      .select('email')
      .eq('email', email.toLowerCase())
      .single()

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered!' },
        { status: 200 }
      )
    }

    // Get additional request data (Vercel environment)
    const countryRaw = request.headers.get('x-vercel-ip-country') || 'XX'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || 'direct'

    // Debug logging for country detection
    console.log(`Country detection - Header: "${request.headers.get('x-vercel-ip-country')}", Final: "${countryRaw}"`)

    // Validate and sanitize country code (must be 2 characters for ISO standard)
    const country = countryRaw && countryRaw.length === 2 && countryRaw !== 'XX' ? countryRaw.toUpperCase() : null

    // Insert new email with security metadata (after migration)
    const { data, error } = await supabaseAdmin
      .from('waitlist')
      .insert([
        {
          email: email.toLowerCase(),
          created_at: new Date().toISOString(),
          ip_address: clientIP,
          user_agent: userAgent,
          referrer: referer,
          country: country,
          security_score: 100 // High score for passed validation
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save email' },
        { status: 500 }
      )
    }

    console.log(`New waitlist signup: ${email} - IP: ${clientIP} - Country: ${country}`)

    return NextResponse.json(
      { message: 'Successfully joined waitlist!', data },
      { status: 201 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}