'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!email.includes('@')) {
      toast.error('Please enter a valid email')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        toast.error(error.message)
        setLoading(false)
        return
      }

      setSent(true)
      toast.success('Password reset link sent to your email!')
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="inline-block w-16 h-16 bg-naija-green-100 rounded-full items-center justify-center mb-4">
          <span className="text-3xl">📧</span>
        </div>
        <h2 className="text-2xl font-bold text-naija-green-900 mb-2">Check Your Email</h2>
        <p className="text-gray-600 mb-4">We've sent a password reset link to:</p>
        <p className="font-semibold text-gray-900 mb-6">{email}</p>
        <p className="text-sm text-gray-500 mb-6">
          Click the link in the email to reset your password. The link expires in 24 hours.
        </p>
        <div className="space-y-3">
          <p className="text-xs text-gray-600">
            Didn't receive an email? Check your spam folder or{' '}
            <button
              onClick={() => setSent(false)}
              className="text-naija-green-600 hover:text-naija-green-700 font-semibold"
            >
              try again
            </button>
          </p>
          <Link href="/login" className="inline-block text-naija-green-600 font-semibold hover:text-naija-green-700">
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
        />
      </div>

      <p className="text-sm text-gray-600">
        We'll send you a link to reset your password. Check your email for further instructions.
      </p>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 rounded-lg bg-naija-green-600 text-white font-semibold hover:bg-naija-green-700 transition disabled:opacity-50 mt-8"
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>

      <Link href="/login" className="flex items-center justify-center gap-2 text-naija-green-600 font-semibold hover:text-naija-green-700 transition">
        <ArrowLeft size={16} />
        Back to Login
      </Link>
    </form>
  )
}