/**
 * Supabase Admin Client
 *
 * Uses the SERVICE ROLE key — bypasses Row Level Security and email verification.
 * ONLY use this in server-side contexts (API routes, Server Actions).
 * NEVER expose this on the client side.
 *
 * Add to your .env.local:
 *   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
 *
 * Find it in: Supabase Dashboard → Project Settings → API → service_role key
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing Supabase admin environment variables')
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession:   false,
  },
})