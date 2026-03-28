'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react'
import Image from 'next/image'

const logoUrl = 'https://res.cloudinary.com/lordefid/image/upload/v1765296838/NNW_hnchr8.png'

export default function ChangePasswordPage() {
  const [form, setForm]       = useState({ password: '', confirm: '' })
  const [showPw, setShowPw]   = useState(false)
  const [showCf, setShowCf]   = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }

    setLoading(true)
    try {
      const { error: pwError } = await supabase.auth.updateUser({ password: form.password })
      if (pwError) throw pwError

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await supabase.from('users').update({ must_change_password: false }).eq('id', session.user.id)
      }

      toast.success('Password updated successfully!')
      window.location.href = '/investor/dashboard'
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const sc = (() => {
    let s = 0
    if (form.password.length >= 8)           s++
    if (form.password.length >= 12)          s++
    if (/[A-Z]/.test(form.password))         s++
    if (/[0-9]/.test(form.password))         s++
    if (/[^A-Za-z0-9]/.test(form.password)) s++
    return s
  })()

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][sc] || ''
  const strengthColor = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-naija-green-500', 'bg-naija-green-600'][sc] || 'bg-gray-200'

  return (
    <main className="min-h-screen bg-gradient-to-br from-naija-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-br from-naija-green-700 to-naija-green-800 p-8 text-center">
            <Image src={logoUrl} alt="NNW Logo" width={56} height={56} className="rounded-xl mx-auto mb-4" />
            <h1 className="text-xl font-bold text-white mb-1">Set Your Password</h1>
            <p className="text-naija-green-200 text-sm">
              Create a new password for your investor account. You only need to do this once.
            </p>
          </div>

          {/* Notice */}
          <div className="mx-6 mt-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <ShieldCheck size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              Your temporary password was assigned by the NNW admin team. Please create a strong personal password that only you know.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* New password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 8 characters"
                  className="w-full pl-9 pr-12 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= sc ? strengthColor : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${sc <= 1 ? 'text-red-500' : sc <= 2 ? 'text-orange-500' : sc <= 3 ? 'text-yellow-600' : 'text-naija-green-600'}`}>
                    {strengthLabel}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showCf ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Repeat your password"
                  className={`w-full pl-9 pr-12 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                    form.confirm && form.password !== form.confirm ? 'border-red-300 focus:ring-red-400' :
                    form.confirm && form.password === form.confirm ? 'border-naija-green-400 focus:ring-naija-green-500' :
                    'border-gray-300 focus:ring-naija-green-500'
                  }`}
                />
                <button type="button" onClick={() => setShowCf(!showCf)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showCf ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
              {form.confirm && form.password !== form.confirm && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
              {form.confirm && form.password === form.confirm && (
                <p className="text-xs text-naija-green-600 mt-1">✓ Passwords match</p>
              )}
            </div>

            {/* Tips */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-2">Strong password tips:</p>
              <ul className="space-y-1">
                {([
                  ['At least 8 characters',    form.password.length >= 8],
                  ['One uppercase letter',      /[A-Z]/.test(form.password)],
                  ['One number',                /[0-9]/.test(form.password)],
                  ['One special character',     /[^A-Za-z0-9]/.test(form.password)],
                ] as [string, boolean][]).map(([tip, met], i) => (
                  <li key={i} className={`text-xs flex items-center gap-1.5 ${met ? 'text-naija-green-600' : 'text-gray-400'}`}>
                    <span>{met ? '✓' : '○'}</span>{tip}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading || form.password.length < 8 || form.password !== form.confirm}
              className="w-full py-3 bg-naija-green-600 text-white font-bold rounded-lg hover:bg-naija-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Set Password & Continue'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">NNW Investor Portal · Naija Ninja Warrior</p>
      </div>
    </main>
  )
}