// app/investor/update-password/UpdatePasswordForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Eye, EyeOff, Lock, ShieldCheck, CheckCircle2, Circle, KeyRound } from 'lucide-react'
import InvestorSidebar from '@/components/investor/InvestorSidebar'

export default function UpdatePasswordForm() {
  const router = useRouter()
  const [sessionChecked, setSessionChecked] = useState(false)
  const [form, setForm]       = useState({ current: '', password: '', confirm: '' })
  const [show, setShow]       = useState({ current: false, password: false, confirm: false })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let mounted = true
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return
      if (!session) router.replace('/investor/login')
      else setSessionChecked(true)
    }
    check()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      if (!session) router.replace('/investor/login')
    })
    return () => { mounted = false; subscription.unsubscribe() }
  }, [router])

  const toggle = (field: keyof typeof show) =>
    setShow(prev => ({ ...prev, [field]: !prev[field] }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.current)                  { toast.error('Enter your current password'); return }
    if (form.password.length < 8)       { toast.error('New password must be at least 8 characters'); return }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }

    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.email) throw new Error('Session expired. Please log in again.')

      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: form.current,
      })
      if (verifyError) { toast.error('Current password is incorrect.'); setLoading(false); return }

      const { error: pwError } = await supabase.auth.updateUser({ password: form.password })
      if (pwError) throw pwError

      setSuccess(true)
      toast.success('Password updated successfully!')
      setForm({ current: '', password: '', confirm: '' })
      setTimeout(() => setSuccess(false), 4000)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const rules = [
    { label: 'At least 8 characters', met: form.password.length >= 8 },
    { label: 'One uppercase letter',   met: /[A-Z]/.test(form.password) },
    { label: 'One number',             met: /[0-9]/.test(form.password) },
    { label: 'One special character',  met: /[^A-Za-z0-9]/.test(form.password) },
  ]

  const sc = [
    form.password.length >= 8,
    form.password.length >= 12,
    /[A-Z]/.test(form.password),
    /[0-9]/.test(form.password),
    /[^A-Za-z0-9]/.test(form.password),
  ].filter(Boolean).length

  const strengthMeta = [
    { label: '',            color: 'bg-gray-200',       text: '' },
    { label: 'Weak',        color: 'bg-red-400',         text: 'text-red-500' },
    { label: 'Fair',        color: 'bg-orange-400',      text: 'text-orange-500' },
    { label: 'Good',        color: 'bg-yellow-400',      text: 'text-yellow-600' },
    { label: 'Strong',      color: 'bg-naija-green-500', text: 'text-naija-green-600' },
    { label: 'Very Strong', color: 'bg-naija-green-600', text: 'text-naija-green-700' },
  ][sc]

  const Field = ({
    field, label, placeholder,
  }: {
    field: 'current' | 'password' | 'confirm'
    label: string
    placeholder: string
  }) => {
    const hasError = field === 'confirm' && !!form.confirm && form.password !== form.confirm
    const hasMatch = field === 'confirm' && !!form.confirm && form.password === form.confirm
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        <div className="relative">
          <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type={show[field] ? 'text' : 'password'}
            value={form[field]}
            onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
            placeholder={placeholder}
            className={`w-full pl-9 pr-11 py-2.5 bg-gray-50 border rounded-lg text-sm text-gray-800
              placeholder-gray-300 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
              hasError   ? 'border-red-300 focus:ring-red-200'
              : hasMatch ? 'border-naija-green-400 focus:ring-naija-green-100'
              : 'border-gray-200 focus:ring-naija-green-100 focus:border-naija-green-400'
            }`}
          />
          <button
            type="button"
            onClick={() => toggle(field)}
            tabIndex={-1}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
          >
            {show[field] ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {hasError && <p className="text-xs text-red-500">Passwords do not match</p>}
        {hasMatch && <p className="text-xs text-naija-green-600">✓ Passwords match</p>}
      </div>
    )
  }

  if (!sessionChecked) {
    return (
      <div className="flex min-h-screen">
        <InvestorSidebar />
        <main className="flex-1 lg:ml-64 bg-gray-50 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-naija-green-600 border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <InvestorSidebar />

      <main className="flex-1 min-w-0 lg:ml-64 min-h-screen bg-gray-50 flex flex-col">

        {/* ── Full-width page header ───────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex-shrink-0">
          <div className="flex items-center gap-2.5 mb-0.5">
            <KeyRound size={17} className="text-naija-green-600" />
            <h1 className="text-lg font-bold text-gray-900">Change Password</h1>
          </div>
          <p className="text-sm text-gray-400 pl-7">
            Update your account password. You'll need your current password to confirm.
          </p>
        </div>

        {/* ── Body: centers the grid in the available space ───────── */}
        <div className="flex-1 flex items-start justify-center p-8">
          <div className="w-full max-w-3xl space-y-6">

            {/* Success banner */}
            {success && (
              <div className="flex items-center gap-3 bg-naija-green-50 border border-naija-green-200
                text-naija-green-700 rounded-xl px-4 py-3 text-sm font-medium">
                <CheckCircle2 size={17} className="flex-shrink-0" />
                Password updated successfully.
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ── Form card (2/3) ─────────────────────────────── */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Verify identity */}
                <div className="px-6 py-5 border-b border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                    Verify identity
                  </p>
                  <Field
                    field="current"
                    label="Current Password"
                    placeholder="Enter your current password"
                  />
                </div>

                {/* New password */}
                <div className="px-6 py-5 border-b border-gray-100 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                    New password
                  </p>
                  <div className="space-y-2">
                    <Field
                      field="password"
                      label="New Password"
                      placeholder="At least 8 characters"
                    />
                    {form.password && (
                      <div className="space-y-1 pt-1">
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(i => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                i <= sc ? strengthMeta.color : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        {strengthMeta.label && (
                          <p className={`text-xs font-semibold ${strengthMeta.text}`}>
                            {strengthMeta.label}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <Field
                    field="confirm"
                    label="Confirm New Password"
                    placeholder="Repeat your new password"
                  />
                </div>

                {/* Submit */}
                <div className="px-6 py-4 bg-gray-50/60">
                  <button
                    type="button"
                    onClick={handleSubmit as any}
                    disabled={
                      loading ||
                      !form.current ||
                      form.password.length < 8 ||
                      form.password !== form.confirm
                    }
                    className="w-full py-2.5 bg-naija-green-600 text-white text-sm font-bold rounded-xl
                      hover:bg-naija-green-700 active:scale-[0.99] transition-all
                      disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Updating…
                      </span>
                    ) : 'Update Password'}
                  </button>
                </div>
              </div>

              {/* ── Right panels (1/3) ──────────────────────────── */}
              <div className="space-y-4">

                {/* Requirements */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck size={15} className="text-naija-green-600" />
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Requirements
                    </p>
                  </div>
                  <ul className="space-y-2.5">
                    {rules.map((rule, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        {rule.met
                          ? <CheckCircle2 size={15} className="text-naija-green-500 flex-shrink-0" />
                          : <Circle       size={15} className="text-gray-300 flex-shrink-0" />
                        }
                        <span className={`text-sm transition-colors ${
                          rule.met ? 'text-naija-green-700 font-medium' : 'text-gray-400'
                        }`}>
                          {rule.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tip */}
                <div className="bg-naija-green-50 border border-naija-green-100 rounded-2xl p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-naija-green-700 mb-2">
                    Tip
                  </p>
                  <p className="text-xs text-naija-green-600 leading-relaxed">
                    Use a passphrase — a short sentence or a mix of random words — for a password
                    that is both strong and easy to remember.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}