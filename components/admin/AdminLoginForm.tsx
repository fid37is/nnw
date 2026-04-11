// File: app/admin/login/AdminLoginForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'   // ← replaces supabase client import
import { toast } from 'sonner'
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react'
import Image from 'next/image'

// ── SSR-aware browser client — writes session to cookie, not localStorage ─────
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const logoUrl = 'https://res.cloudinary.com/lordefid/image/upload/v1765296838/NNW_hnchr8.png'

export default function AdminLoginForm() {
  const searchParams = useSearchParams()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)

  // Pre-fill email if redirected from main login — unchanged
  useEffect(() => {
    const email = searchParams.get('email')
    if (email) setForm(f => ({ ...f, email: decodeURIComponent(email) }))
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.email.includes('@')) { toast.error('Enter a valid email address'); return }
    if (form.password.length < 6)  { toast.error('Enter your password'); return }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email:    form.email,
        password: form.password,
      })

      if (error) {
        toast.error('Invalid email or password.')
        setLoading(false)
        return
      }

      if (!data.user) {
        toast.error('Login failed. Please try again.')
        setLoading(false)
        return
      }

      // Role check — unchanged
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (userError || !userData) {
        toast.error('Account not found.')
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      if (userData.role !== 'admin') {
        toast.error('This portal is for administrators only.')
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      toast.success('Welcome back!')

      // window.location.replace triggers a full navigation so the proxy
      // reads the fresh cookie before serving the dashboard — no flash
      window.location.replace('/admin/dashboard')
    } catch {
      toast.error('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-naija-green-900 flex items-center justify-center p-4">

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="w-full max-w-md relative">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 px-8 py-10 text-center">
            <Image src={logoUrl} alt="NNW" width={64} height={64} className="rounded-xl mx-auto mb-4 shadow-lg" />
            <div className="flex items-center justify-center gap-2 mb-1">
              <Shield size={18} className="text-naija-green-400" />
              <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            </div>
            <p className="text-gray-400 text-sm">Naija Ninja Warrior</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <p className="text-gray-500 text-sm text-center mb-6">
              Restricted access — authorised personnel only.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="admin@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500 focus:border-transparent"
                    autoComplete="email"
                    autoFocus={!form.email}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500 focus:border-transparent"
                    autoComplete="current-password"
                    autoFocus={!!form.email}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Shield size={16} />
                    Sign In
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <a
                href="https://naijaninja.net"
                className="text-xs text-gray-400 hover:text-gray-600 transition"
              >
                ← Back to main site
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          © {new Date().getFullYear()} Naija Ninja Warrior · NNW Entertainment Limited
        </p>
      </div>
    </main>
  )
}