// File: lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Single shared instance — createBrowserClient is safe to call multiple times,
// it returns the same instance via module-level caching.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Keep the createClient export for any file that imports it directly,
// but point it at createBrowserClient so behaviour is consistent.
export { createBrowserClient as createClient }