'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT',
]

const STATE_TO_ZONE: Record<string, string> = {
  'Benue': 'North Central', 'Kogi': 'North Central', 'Kwara': 'North Central',
  'Nasarawa': 'North Central', 'Niger': 'North Central', 'Plateau': 'North Central', 'FCT': 'North Central',
  'Adamawa': 'North East', 'Bauchi': 'North East', 'Borno': 'North East',
  'Gombe': 'North East', 'Taraba': 'North East', 'Yobe': 'North East',
  'Jigawa': 'North West', 'Kaduna': 'North West', 'Kano': 'North West',
  'Katsina': 'North West', 'Kebbi': 'North West', 'Sokoto': 'North West', 'Zamfara': 'North West',
  'Abia': 'South East', 'Anambra': 'South East', 'Ebonyi': 'South East',
  'Enugu': 'South East', 'Imo': 'South East',
  'Akwa Ibom': 'South South', 'Bayelsa': 'South South', 'Cross River': 'South South',
  'Delta': 'South South', 'Edo': 'South South', 'Rivers': 'South South',
  'Ekiti': 'South West', 'Lagos': 'South West', 'Ogun': 'South West',
  'Ondo': 'South West', 'Osun': 'South West', 'Oyo': 'South West',
}

const validateNigerianPhone = (phone: string): { isValid: boolean; message: string } => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  if (!cleaned) return { isValid: false, message: 'Phone number is required' }
  const nigerianPhoneRegex = /^(\+?234|0)?([7-9][0-1])\d{8}$/
  if (!nigerianPhoneRegex.test(cleaned)) {
    return { isValid: false, message: 'Enter a valid Nigerian phone number (e.g., 08012345678)' }
  }
  return { isValid: true, message: '' }
}

// ── Inline field status types ─────────────────────────────────────────────────
type CheckStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid'

function StatusIcon({ status }: { status: CheckStatus }) {
  if (status === 'checking')   return <Loader2    size={16} className="animate-spin text-gray-400" />
  if (status === 'available')  return <CheckCircle size={16} className="text-naija-green-600" />
  if (status === 'taken')      return <XCircle     size={16} className="text-red-500" />
  return null
}

function fieldBorder(status: CheckStatus, touched = true) {
  if (!touched) return 'border-gray-300 focus:border-naija-green-600 focus:ring-naija-green-100'
  if (status === 'available') return 'border-naija-green-500 focus:border-naija-green-600 focus:ring-naija-green-100'
  if (status === 'taken' || status === 'invalid') return 'border-red-500 focus:border-red-500 focus:ring-red-100'
  return 'border-gray-300 focus:border-naija-green-600 focus:ring-naija-green-100'
}

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    phone: '', state: '', geoZone: '', birthDate: '', age: '',
    physicalFitness: false, emergencyContact: '', emergencyPhone: '', waiver: false,
  })

  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [step,     setStep]     = useState(1)
  const [showPassword,        setShowPassword]        = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // ── Email uniqueness state ────────────────────────────────────────────────
  const [emailStatus,  setEmailStatus]  = useState<CheckStatus>('idle')
  const [emailMessage, setEmailMessage] = useState('')
  const emailTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Phone uniqueness state ────────────────────────────────────────────────
  const [phoneStatus,      setPhoneStatus]      = useState<CheckStatus>('idle')
  const [phoneMessage,     setPhoneMessage]     = useState('')
  const [phoneTouched,     setPhoneTouched]     = useState(false)
  const phoneTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Emergency phone — format validation only, NO uniqueness check ─────────
  const [emergencyPhoneError,   setEmergencyPhoneError]   = useState('')
  const [emergencyPhoneTouched, setEmergencyPhoneTouched] = useState(false)

  // ── Check email against DB (debounced) ────────────────────────────────────
  const checkEmailUniqueness = (value: string) => {
    if (emailTimer.current) clearTimeout(emailTimer.current)

    if (!value.includes('@') || !value.includes('.')) {
      setEmailStatus('idle'); setEmailMessage(''); return
    }

    setEmailStatus('checking'); setEmailMessage('')

    emailTimer.current = setTimeout(async () => {
      try {
        const { count } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .eq('email', value.toLowerCase().trim())

        if ((count ?? 0) > 0) {
          setEmailStatus('taken')
          setEmailMessage('An account with this email already exists. Log in instead.')
        } else {
          setEmailStatus('available')
          setEmailMessage('')
        }
      } catch {
        // Network error — don't block, DB constraint is the safety net
        setEmailStatus('idle'); setEmailMessage('')
      }
    }, 700)
  }

  // ── Check phone against users table only (debounced) ──────────────────────
  // emergency_phone is intentionally NOT checked — multiple users can share a next-of-kin
  const checkPhoneUniqueness = (value: string) => {
    if (phoneTimer.current) clearTimeout(phoneTimer.current)

    const formatCheck = validateNigerianPhone(value)
    if (!formatCheck.isValid) {
      setPhoneStatus('invalid'); setPhoneMessage(formatCheck.message); return
    }

    setPhoneStatus('checking'); setPhoneMessage('')

    phoneTimer.current = setTimeout(async () => {
      try {
        // Normalise to both common formats so we catch duplicates regardless of how they were stored
        const withPlus = value.replace(/[\s\-\(\)]/g, '').replace(/^0/, '+234')
        const withZero = value.replace(/[\s\-\(\)]/g, '').replace(/^\+234/, '0')

        const [res1, res2] = await Promise.all([
          supabase.from('users').select('id', { count: 'exact', head: true }).eq('phone', withPlus),
          supabase.from('users').select('id', { count: 'exact', head: true }).eq('phone', withZero),
        ])

        const taken = (res1.count ?? 0) > 0 || (res2.count ?? 0) > 0
        if (taken) {
          setPhoneStatus('taken')
          setPhoneMessage('This phone number is already registered.')
        } else {
          setPhoneStatus('available')
          setPhoneMessage('')
        }
      } catch {
        setPhoneStatus('idle'); setPhoneMessage('')
      }
    }, 700)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))

    if (name === 'email') {
      setEmailStatus('idle'); setEmailMessage('')
      checkEmailUniqueness(value)
    }

    if (name === 'phone') {
      if (phoneTouched) checkPhoneUniqueness(value)
      else { setPhoneStatus('idle'); setPhoneMessage('') }
    }

    if (name === 'emergencyPhone' && emergencyPhoneTouched) {
      const v = validateNigerianPhone(value)
      setEmergencyPhoneError(v.isValid ? '' : v.message)
    }

    if (name === 'birthDate' && value) {
      const today = new Date(), birth = new Date(value)
      let age = today.getFullYear() - birth.getFullYear()
      const m = today.getMonth() - birth.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
      setFormData(prev => ({ ...prev, age: age.toString() }))
    }

    if (name === 'state' && value) {
      setFormData(prev => ({ ...prev, geoZone: STATE_TO_ZONE[value] || '' }))
    }
  }

  const validateStep = async (): Promise<boolean> => {
    // ── Step 1 ────────────────────────────────────────────────────────────────
    if (step === 1) {
      if (!formData.fullName.trim()) { toast.error('Full name is required'); return false }

      if (!formData.email.includes('@')) { toast.error('Valid email is required'); return false }

      // If still checking, wait for it to resolve
      if (emailStatus === 'checking') {
        toast.info('Checking email availability…'); return false
      }

      // Block if already known to be taken
      if (emailStatus === 'taken') {
        toast.error('This email is already registered. Please log in or use a different email.')
        return false
      }

      // If we haven't checked yet (user typed fast and didn't blur), check now
      if (emailStatus === 'idle' && formData.email.includes('@')) {
        setEmailStatus('checking')
        try {
          const { count } = await supabase
            .from('users')
            .select('id', { count: 'exact', head: true })
            .eq('email', formData.email.toLowerCase().trim())
          if ((count ?? 0) > 0) {
            setEmailStatus('taken')
            setEmailMessage('An account with this email already exists. Log in instead.')
            toast.error('This email is already registered.')
            return false
          }
          setEmailStatus('available')
        } catch {
          // Let it through — DB will catch it on submit
        }
      }

      if (formData.password.length < 8) { toast.error('Password must be at least 8 characters'); return false }
      if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return false }
    }

    // ── Step 2 ────────────────────────────────────────────────────────────────
    if (step === 2) {
      setPhoneTouched(true)

      const formatCheck = validateNigerianPhone(formData.phone)
      if (!formatCheck.isValid) {
        setPhoneStatus('invalid'); setPhoneMessage(formatCheck.message); return false
      }

      // If still checking, wait
      if (phoneStatus === 'checking') { toast.info('Checking phone number…'); return false }

      // Block if taken
      if (phoneStatus === 'taken') {
        toast.error('This phone number is already registered. Use your own unique number.')
        return false
      }

      // If idle (not yet checked), run check now synchronously
      if (phoneStatus === 'idle' || phoneStatus === 'invalid') {
        setPhoneStatus('checking')
        try {
          const withPlus = formData.phone.replace(/[\s\-\(\)]/g,'').replace(/^0/,'+234')
          const withZero = formData.phone.replace(/[\s\-\(\)]/g,'').replace(/^\+234/,'0')
          const [r1,r2] = await Promise.all([
            supabase.from('users').select('id',{count:'exact',head:true}).eq('phone',withPlus),
            supabase.from('users').select('id',{count:'exact',head:true}).eq('phone',withZero),
          ])
          if ((r1.count??0) > 0 || (r2.count??0) > 0) {
            setPhoneStatus('taken')
            setPhoneMessage('This phone number is already registered.')
            toast.error('This phone number is already registered. Use your own unique number.')
            return false
          }
          setPhoneStatus('available')
        } catch {
          // Let through — DB constraint is safety net
        }
      }

      if (!formData.state) { toast.error('State is required'); return false }
      if (!formData.birthDate) { toast.error('Birth date is required'); return false }
      if (parseInt(formData.age) < 18) { toast.error('You must be at least 18 years old'); return false }
    }

    // ── Step 3 ────────────────────────────────────────────────────────────────
    if (step === 3) {
      if (!formData.emergencyContact.trim()) { toast.error('Emergency contact name is required'); return false }
      setEmergencyPhoneTouched(true)
      const ev = validateNigerianPhone(formData.emergencyPhone)
      if (!ev.isValid) { setEmergencyPhoneError(ev.message); return false }
      if (!formData.waiver) { toast.error('You must accept the waiver to proceed'); return false }
    }

    return true
  }

  const handleNext = async () => {
    const ok = await validateStep()
    if (ok) setStep(s => s + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await validateStep()
    if (!ok) return

    setLoading(true)
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { emailRedirectTo: `${window.location.origin}/auth-callback` },
      })

      if (authError) {
        // Surface duplicate email clearly even if it slipped past our check
        if (authError.message.toLowerCase().includes('already registered') ||
            authError.message.toLowerCase().includes('already exists')) {
          toast.error('This email is already registered. Please log in instead.')
        } else {
          toast.error(authError.message)
        }
        setLoading(false); return
      }

      if (!authData.user) { toast.error('Registration failed'); setLoading(false); return }

      const { error: profileError } = await supabase.from('users').insert({
        id:                authData.user.id,
        email:             formData.email,
        full_name:         formData.fullName,
        phone:             formData.phone,
        birth_date:        formData.birthDate,
        age:               parseInt(formData.age),
        state:             formData.state,
        geo_zone:          formData.geoZone,
        physical_fitness:  formData.physicalFitness,
        emergency_contact: formData.emergencyContact,
        emergency_phone:   formData.emergencyPhone,
        role:              'user',
        profile_completed: true,
      })

      if (profileError) {
        // Catch duplicate phone at DB level (safety net)
        if (profileError.message.includes('users_phone_key') ||
            profileError.message.includes('duplicate') && profileError.message.includes('phone')) {
          toast.error('This phone number is already registered. Please use your own unique number.')
        } else {
          toast.error('Failed to save profile. Please try again.')
        }
        // Clean up the auth user so they can retry cleanly
        await supabase.auth.signOut()
        setLoading(false); return
      }

      toast.success('Registration successful! Check your email to verify your account.')
      setSuccess(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex w-16 h-16 bg-naija-green-100 rounded-full items-center justify-center mb-4">
          <CheckCircle size={32} className="text-naija-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-naija-green-900 mb-2">Registration Successful!</h2>
        <p className="text-gray-600 mb-4">Check your email to verify your account before logging in.</p>
        <p className="text-sm text-gray-500 mb-6">You should receive a confirmation email shortly.</p>
        <Link href="/login" className="text-naija-green-600 font-semibold hover:text-naija-green-700">
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(num => (
          <div key={num}
            className={`flex-1 h-2 rounded-full transition ${step >= num ? 'bg-naija-green-600' : 'bg-gray-300'}`}
          />
        ))}
      </div>

      {/* ── Step 1: Account Details ── */}
      {step === 1 && (
        <div className="space-y-4 animate-slide-up">
          <h2 className="text-xl font-bold text-naija-green-900 mb-6">Create Your Account</h2>

          {/* Full name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text" name="fullName" value={formData.fullName}
              onChange={handleChange} placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
            />
          </div>

          {/* Email — with live uniqueness indicator */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="your@email.com"
                className={`w-full px-4 py-3 pr-10 rounded-lg border focus:outline-none focus:ring-2 transition ${fieldBorder(emailStatus, formData.email.length > 0)}`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <StatusIcon status={emailStatus} />
              </div>
            </div>
            {emailStatus === 'taken' && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                <XCircle size={11} /> {emailMessage}{' '}
              </p>
            )}
            {emailStatus === 'available' && (
              <p className="text-xs text-naija-green-600 mt-1.5">Email is available</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} name="password"
                value={formData.password} onChange={handleChange}
                placeholder="At least 8 characters"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-naija-green-600 transition">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword"
                value={formData.confirmPassword} onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-naija-green-600 transition">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs text-red-600 mt-1.5">Passwords do not match</p>
            )}
          </div>
        </div>
      )}

      {/* ── Step 2: Personal Details ── */}
      {step === 2 && (
        <div className="space-y-4 animate-slide-up">
          <h2 className="text-xl font-bold text-naija-green-900 mb-6">Personal Information</h2>

          {/* Phone — with live uniqueness indicator */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number <span className="text-xs font-normal text-gray-500">(WhatsApp preferred)</span>
            </label>
            <div className="relative">
              <input
                type="tel" name="phone" value={formData.phone}
                onChange={handleChange}
                onBlur={() => {
                  setPhoneTouched(true)
                  if (formData.phone) checkPhoneUniqueness(formData.phone)
                }}
                placeholder="08012345678"
                className={`w-full px-4 py-3 pr-10 rounded-lg border focus:outline-none focus:ring-2 transition ${fieldBorder(phoneStatus, phoneTouched)}`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {phoneTouched && <StatusIcon status={phoneStatus} />}
              </div>
            </div>
            {phoneTouched && phoneStatus === 'taken' && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                <XCircle size={11} /> {phoneMessage}
              </p>
            )}
            {phoneTouched && phoneStatus === 'invalid' && (
              <p className="text-xs text-red-600 mt-1.5">{phoneMessage}</p>
            )}
            {phoneTouched && phoneStatus === 'available' && (
              <p className="text-xs text-naija-green-600 mt-1.5">Phone number is available</p>
            )}
            {!phoneTouched && (
              <p className="text-xs text-gray-500 mt-1.5">Your personal WhatsApp number for competition updates</p>
            )}
          </div>

          {/* Birth date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Date</label>
            <input
              type="date" name="birthDate" value={formData.birthDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
            />
            {formData.age && (
              <p className={`text-sm mt-2 ${parseInt(formData.age) < 18 ? 'text-red-600' : 'text-gray-600'}`}>
                Age: {formData.age} years {parseInt(formData.age) < 18 ? '— must be 18 or older' : ''}
              </p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
            <select
              name="state" value={formData.state} onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
            >
              <option value="">Select your state</option>
              {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Geo zone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Geo-Political Zone</label>
            <input
              type="text" value={formData.geoZone} disabled
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-populated based on your state</p>
          </div>

          {/* Fitness */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox" name="physicalFitness" id="fitness"
              checked={formData.physicalFitness} onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-naija-green-600"
            />
            <label htmlFor="fitness" className="text-sm text-gray-700">
              I am physically fit and ready for this competition
            </label>
          </div>
        </div>
      )}

      {/* ── Step 3: Emergency Contact & Waiver ── */}
      {step === 3 && (
        <div className="space-y-4 animate-slide-up">
          <h2 className="text-xl font-bold text-naija-green-900 mb-6">Emergency Contact & Waiver</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Name</label>
            <input
              type="text" name="emergencyContact" value={formData.emergencyContact}
              onChange={handleChange} placeholder="Full name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
            />
          </div>

          {/* Emergency phone — format validated only, NOT checked for uniqueness */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Emergency Contact Phone
              <span className="text-xs font-normal text-gray-400 ml-2">(next of kin)</span>
            </label>
            <input
              type="tel" name="emergencyPhone" value={formData.emergencyPhone}
              onChange={handleChange}
              onBlur={() => {
                setEmergencyPhoneTouched(true)
                const v = validateNigerianPhone(formData.emergencyPhone)
                setEmergencyPhoneError(v.isValid ? '' : v.message)
              }}
              placeholder="08012345678"
              className={`w-full px-4 py-3 rounded-lg border ${
                emergencyPhoneTouched && emergencyPhoneError
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                  : 'border-gray-300 focus:border-naija-green-600 focus:ring-naija-green-100'
              } focus:outline-none focus:ring-2`}
            />
            {emergencyPhoneTouched && emergencyPhoneError && (
              <p className="text-xs text-red-600 mt-1.5">{emergencyPhoneError}</p>
            )}
            <p className="text-xs text-gray-400 mt-1.5">
              Multiple contestants can share the same next-of-kin number
            </p>
          </div>

          {/* Waiver */}
          <div className="bg-naija-green-50 border border-naija-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-sm text-naija-green-900 mb-2">Waiver & Terms</h3>
            <p className="text-xs text-gray-700 leading-relaxed mb-4">
              I understand that participation in Naija Ninja Warrior involves physical exertion and inherent risks.
              I hereby assume all risks associated with participation and waive any claims against the organizers.
            </p>
            <div className="flex items-start gap-3">
              <input
                type="checkbox" name="waiver" id="waiver"
                checked={formData.waiver} onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-naija-green-600 mt-0.5"
              />
              <label htmlFor="waiver" className="text-xs text-gray-700">
                I accept the waiver and terms of participation
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-6">
        {step > 1 && (
          <button type="button" onClick={() => setStep(s => s - 1)}
            className="flex-1 px-4 py-3 rounded-lg border border-naija-green-600 text-naija-green-600 font-semibold hover:bg-naija-green-50 transition">
            Back
          </button>
        )}
        {step < 3 ? (
          <button type="button" onClick={handleNext}
            disabled={
              (step === 1 && emailStatus === 'taken') ||
              (step === 1 && emailStatus === 'checking') ||
              (step === 2 && phoneStatus === 'taken') ||
              (step === 2 && phoneStatus === 'checking')
            }
            className="flex-1 px-4 py-3 rounded-lg bg-naija-green-600 text-white font-semibold hover:bg-naija-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit}
            disabled={loading || !formData.waiver || (emergencyPhoneTouched && !!emergencyPhoneError)}
            className="flex-1 px-4 py-3 rounded-lg bg-naija-green-600 text-white font-semibold hover:bg-naija-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Registering...' : 'Register'}
          </button>
        )}
      </div>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-naija-green-600 font-semibold hover:text-naija-green-700">
          Login here
        </Link>
      </p>
    </div>
  )
}