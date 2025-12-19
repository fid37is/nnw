'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'verifying' | 'verified' | 'error'>('verifying')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Give Supabase a moment to process the session
        await new Promise(resolve => setTimeout(resolve, 500))

        // Get the session that Supabase set from URL hash
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error || !session) {
          setStatus('error')
          setTimeout(() => router.push('/login?error=verification_failed'), 2000)
          return
        }

        // Check if this is password recovery
        const hash = window.location.hash
        const params = new URLSearchParams(hash.substring(1))
        if (params.get('type') === 'recovery') {
          setStatus('verified')
          setTimeout(() => router.push('/auth/reset-password'), 2000)
          return
        }

        // Get user role
        const { data: user } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()

        // Show verified status
        setStatus('verified')

        // Redirect to dashboard after showing success
        const dashboard = user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'
        setTimeout(() => router.push(dashboard), 2000)

      } catch (err) {
        console.error('Callback error:', err)
        setStatus('error')
        setTimeout(() => router.push('/login?error=callback_failed'), 2000)
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {status === 'verifying' && (
          <>
            <div className="w-20 h-20 border-4 border-naija-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-naija-green-900 mb-2">
              Verifying Your Email
            </h1>
            <p className="text-gray-600">
              Please wait while we confirm your email address...
            </p>
          </>
        )}

        {status === 'verified' && (
          <>
            <div className="w-20 h-20 bg-naija-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-naija-green-900 mb-2">
              Email Verified! ✓
            </h1>
            <p className="text-gray-600 mb-4">
              Your email has been successfully verified.
            </p>
            <div className="flex items-center justify-center gap-2 text-naija-green-600">
              <div className="w-2 h-2 bg-naija-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-naija-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-naija-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="ml-2 font-medium">Redirecting to your dashboard</span>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-900 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600">
              Something went wrong. Redirecting you to login...
            </p>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}