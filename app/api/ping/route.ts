import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Check if Supabase is properly configured
    if (!supabaseAdmin) {
      return NextResponse.json(
        { 
          message: 'Ping successful (Demo mode - please configure Supabase)', 
          timestamp: new Date().toISOString()
        },
        { status: 200 }
      )
    }

    // Ping Supabase to keep it active
    const { data, error } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .limit(1)

    if (error) {
      console.error('Ping failed:', error)
      return NextResponse.json(
        { error: 'Ping failed', details: error.message },
        { status: 500 }
      )
    }

    // Log ping activity
    await supabaseAdmin
      .from('ping_logs')
      .insert([
        {
          pinged_at: new Date().toISOString(),
          status: 'success',
          response_data: data
        }
      ])

    return NextResponse.json(
      { 
        message: 'Ping successful', 
        timestamp: new Date().toISOString(),
        data 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Ping error:', error)
    
    const supabaseAdmin = getSupabaseAdmin()
    
    // Log failed ping (only if Supabase is configured)
    if (supabaseAdmin) {
      try {
        await supabaseAdmin
          .from('ping_logs')
          .insert([
            {
              pinged_at: new Date().toISOString(),
              status: 'failed',
              error_message: error instanceof Error ? error.message : 'Unknown error'
            }
          ])
      } catch (logError) {
        console.error('Failed to log ping error:', logError)
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Also support POST for flexibility
export async function POST(request: NextRequest) {
  return GET(request)
}