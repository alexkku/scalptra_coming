import { createClient } from '@supabase/supabase-js'

// Lazy initialization to avoid build-time errors
export const getSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  
  if (!supabaseUrl || !supabasePublishableKey || supabaseUrl.includes('placeholder')) {
    return null // Return null if not configured
  }
  
  return createClient(supabaseUrl, supabasePublishableKey)
}

export const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('placeholder')) {
    return null // Return null if not configured
  }
  
  return createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}