// File: hooks/useAuthGuard.ts

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface UseAuthGuardOptions {
  requiredRole:  string          // 'admin' | 'investor' | 'user'
  loginPath?:    string          // where to redirect on auth failure, default '/login'
  rolePath?:     string          // column to check in users table, default 'role'
}

interface UseAuthGuardResult {
  authChecked: boolean           // true once auth is confirmed — render dashboard when true
  userId:      string | null
}

export function useAuthGuard({
  requiredRole,
  loginPath = '/login',
}: UseAuthGuardOptions): UseAuthGuardResult {
  const [authChecked, setAuthChecked] = useState(false)
  const [userId,      setUserId]      = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const check = async () => {
      try {
        // Step 1: check if a session exists in the cookie
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          if (!cancelled) window.location.replace(loginPath)
          return
        }

        // Step 2: verify the role from the users table
        // This prevents a user from accessing admin/investor by having a valid
        // session but the wrong role
        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (cancelled) return

        if (error || !userData || userData.role !== requiredRole) {
          await supabase.auth.signOut()
          window.location.replace(loginPath)
          return
        }

        // Auth confirmed — safe to render the dashboard
        setUserId(session.user.id)
        setAuthChecked(true)

      } catch {
        if (!cancelled) window.location.replace(loginPath)
      }
    }

    check()
    return () => { cancelled = true }
  }, [requiredRole, loginPath])

  return { authChecked, userId }
}