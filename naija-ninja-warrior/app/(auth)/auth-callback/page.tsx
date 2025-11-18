'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const [processing, setProcessing] = useState(true)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase automatically handles the hash fragment
        // Extract type from URL hash
        const hash = window.location.hash
        const params = new URLSearchParams(hash.substring(1))
        const type = params.get('type')

        // Get the current session (Supabase sets it from the URL)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !session) {
          toast.error('Authentication failed')
          setTimeout(() => {
            window.location.href = '/login'
          }, 2000)
          return
        }

        // Handle password recovery
        if (type === 'recovery') {
          toast.success('Email verified! Redirecting to password reset...')
          setTimeout(() => {
            window.location.href = '/auth/reset-password'
          }, 1500)
          return
        }

        // Handle email confirmation (signup)
        // Get user role
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (userError) {
          console.error('Failed to get user data:', userError)
          toast.error('Failed to load user data')
          setTimeout(() => {
            window.location.href = '/login'
          }, 2000)
          return
        }

        toast.success('Email confirmed! Logging you in...')

        // Redirect based on role
        setTimeout(() => {
          const redirectPath = userData?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'
          window.location.href = redirectPath
        }, 1500)
      } catch (err) {
        console.error('Auth callback error:', err)
        toast.error('Something went wrong')
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } finally {
        setProcessing(false)
      }
    }

    // Small delay to ensure Supabase has processed the session
    const timer = setTimeout(() => {
      handleAuthCallback()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-16 h-16 bg-naija-green-100 rounded-full items-center justify-center mb-4 animate-pulse">
          <span className="text-2xl">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-naija-green-900 mb-2">
          {processing ? 'Confirming your email...' : 'Redirecting...'}
        </h1>
        <p className="text-gray-600">Please wait while we process your request</p>
      </div>
    </main>
  )
}