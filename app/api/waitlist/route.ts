import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
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

    // Insert new email
    const { data, error } = await supabaseAdmin
      .from('waitlist')
      .insert([
        {
          email: email.toLowerCase(),
          created_at: new Date().toISOString(),
          ip_address: request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
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