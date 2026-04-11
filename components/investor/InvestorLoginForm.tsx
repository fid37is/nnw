// File: app/investor/login/InvestorLoginForm.tsx
// Uses shared supabase client from lib/supabase/client.ts
// That client now uses createBrowserClient internally — writes cookies automatically.

'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Eye, EyeOff, Lock, Mail, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useLogoConfig } from '@/components/context/LogoContext'

export default function InvestorLoginForm() {
  const { logoUrl } = useLogoConfig()
  const searchParams = useSearchParams()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)

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

      if (error) { toast.error('Invalid email or password. Please check your credentials.'); setLoading(false); return }
      if (!data.user) { toast.error('Login failed. Please try again.'); setLoading(false); return }

      const { data: userData, error: userError } = await supabase
        .from('users').select('role, must_change_password').eq('id', data.user.id).single()

      if (userError || !userData) {
        toast.error('Account not found. Contact the NNW admin team.')
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      if (userData.role !== 'investor') {
        toast.error('This portal is for investors only.')
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      toast.success('Welcome back!')

      if (userData.must_change_password) {
        window.location.replace('/investor/change-password')
        return
      }

      window.location.replace('/investor/dashboard')
    } catch {
      toast.error('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-naija-green-900 via-naija-green-800 to-naija-green-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <div className="w-full max-w-md relative">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-naija-green-700 to-naija-green-800 px-8 py-10 text-center">
            {logoUrl ? (
              <Image src={logoUrl} alt="NNW" width={64} height={64} className="rounded-xl mx-auto mb-4 shadow-lg" />
            ) : (
              <div className="w-16 h-16 bg-naija-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-black text-xl">NNW</span>
              </div>
            )}
            <h1 className="text-2xl font-bold text-white mb-1">Investor Portal</h1>
            <p className="text-naija-green-200 text-sm">Naija Ninja Warrior</p>
          </div>
          <div className="px-8 py-8">
            <p className="text-gray-600 text-sm text-center mb-6">Sign in with the credentials provided by the NNW team.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com" autoComplete="email" autoFocus={!form.email}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500 focus:border-transparent"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input type={showPw ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Enter your password" autoComplete="current-password" autoFocus={!!form.email}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500 focus:border-transparent"/>
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-naija-green-600 text-white font-bold rounded-xl hover:bg-naija-green-700 transition disabled:opacity-50 shadow-sm">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Signing in...</>
                  : <><TrendingUp size={16}/>Sign In to Portal</>}
              </button>
            </form>
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500 leading-relaxed">
                Don't have access? Contact the NNW team at{' '}
                <a href="mailto:phyd3lis@gmail.com" className="text-naija-green-600 hover:underline font-medium">phyd3lis@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
        <div className="text-center mt-6">
          <p className="text-naija-green-300 text-xs">© {new Date().getFullYear()} Naija Ninja Warrior · NNW Entertainment Limited</p>
          <Link href="https://naijaninja.net" className="text-naija-green-400 text-xs hover:text-naija-green-300 transition mt-1 inline-block">
            ← Back to main site
          </Link>
        </div>
      </div>
    </main>
  )
}