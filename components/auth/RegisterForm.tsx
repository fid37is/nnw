'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, CheckCircle, XCircle, Loader2, User, Mail, Lock, Phone, MapPin, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import styles from '@/components/sections/nnw/nnw.module.css'
import aStyles from '@/components/module/auth.module.css'
import { passwordStrength, STRENGTH_LABELS } from '@/components/sections/nnw/data'

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
  if (status === 'checking')   return <Loader2 size={16} className="animate-spin" color="rgba(var(--navy-rgb),0.4)" />
  if (status === 'available')  return <CheckCircle size={16} color="var(--green)" />
  if (status === 'taken')      return <XCircle size={16} color="var(--error)" />
  return null
}

// Returns the CSS module modifier class (available/taken/invalid) for the input-wrap
function fieldStatusClass(status: CheckStatus, touched = true): string {
  if (!touched) return ''
  if (status === 'available') return 'available'
  if (status === 'taken' || status === 'invalid') return 'taken'
  return ''
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
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div className={aStyles['success-icon']}><CheckCircle size={32} color="var(--green)" /></div>
        <h2 className={`${styles.display} ${aStyles['form-title']}`}>Registration successful!</h2>
        <p className={aStyles['form-sub']} style={{ margin: '0 auto 8px' }}>Check your email to verify your account before logging in.</p>
        <p style={{ fontSize: 13, color: 'rgba(var(--navy-rgb),0.5)', marginBottom: 22 }}>You should receive a confirmation email shortly.</p>
        <Link href="/login" className={`${styles.btn} ${styles['btn-gold']}`} style={{ width: '100%' }}>Go to Login</Link>
      </div>
    )
  }

  const checkboxRow = (checked: boolean, onClick: () => void, label: React.ReactNode) => (
    <div className={aStyles['check-row']}>
      <button type="button" onClick={onClick} className={`${aStyles['a-checkbox']} ${checked ? aStyles.checked : ''}`}>
        {checked && <Check size={12} color="var(--bone)" strokeWidth={3} />}
      </button>
      <span onClick={onClick} className={aStyles['check-label']} style={{ cursor: 'pointer' }}>{label}</span>
    </div>
  )

  return (
    <div>
      <div className={aStyles['form-badge']}>
        <span className={styles.dot} style={{ background: 'var(--green)' }} />
        <span className={aStyles['form-badge-text']}>Season 1 Registration</span>
      </div>
      <h2 className={`${styles.display} ${aStyles['form-title']}`}>Apply as a warrior.</h2>
      <p className={aStyles['form-sub']}>Three quick steps: your account, your details, then a next-of-kin contact.</p>

      <div className={aStyles['step-row']}>
        {[1, 2, 3].map(num => (
          <div key={num} className={`${aStyles['step-bar']} ${step >= num ? aStyles.done : ''}`} />
        ))}
      </div>

      {/* ── Step 1: Account Details ── */}
      {step === 1 && (
        <div>
          <div className={aStyles['step-heading']}>Create your account</div>

          <div className={aStyles['a-group']}>
            <label className={aStyles['a-label']}>Full Name</label>
            <div className={aStyles['input-wrap']}>
              <span className={aStyles['input-icon']}><User size={15} /></span>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" className={aStyles['a-input']} />
            </div>
          </div>

          <div className={aStyles['a-group']}>
            <label className={aStyles['a-label']}>Email</label>
            <div className={`${aStyles['input-wrap']} ${aStyles[fieldStatusClass(emailStatus, formData.email.length > 0)] || ''}`}>
              <span className={aStyles['input-icon']}><Mail size={15} /></span>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" className={aStyles['a-input']} />
              <span className={aStyles['status-icon']}><StatusIcon status={emailStatus} /></span>
            </div>
            {emailStatus === 'taken' && <div className={`${aStyles['field-hint']} ${aStyles.bad}`}><XCircle size={11} /> {emailMessage}</div>}
            {emailStatus === 'available' && <div className={`${aStyles['field-hint']} ${aStyles.ok}`}>Email is available</div>}
          </div>

          <div className={aStyles['a-group']}>
            <label className={aStyles['a-label']}>Password</label>
            <div className={aStyles['input-wrap']}>
              <span className={aStyles['input-icon']}><Lock size={15} /></span>
              <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="At least 8 characters" className={aStyles['a-input']} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={aStyles['input-suffix-btn']}>{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button>
            </div>
            {formData.password && (
              <div className={aStyles.strength}>
                <div className={aStyles['strength-bars']}>
                  {[0, 1, 2, 3].map(i => {
                    const s = passwordStrength(formData.password)
                    return <div key={i} className={`${aStyles['strength-bar']} ${i < s ? `${aStyles.filled} ${aStyles['s' + s]}` : ''}`} />
                  })}
                </div>
                <span className={aStyles['strength-label']}>{STRENGTH_LABELS[passwordStrength(formData.password)]}</span>
              </div>
            )}
          </div>

          <div className={aStyles['a-group']}>
            <label className={aStyles['a-label']}>Confirm Password</label>
            <div className={aStyles['input-wrap']}>
              <span className={aStyles['input-icon']}><Lock size={15} /></span>
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" className={aStyles['a-input']} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={aStyles['input-suffix-btn']}>{showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <div className={`${aStyles['field-hint']} ${aStyles.bad}`}>Passwords do not match</div>
            )}
          </div>
        </div>
      )}

      {/* ── Step 2: Personal Details ── */}
      {step === 2 && (
        <div>
          <div className={aStyles['step-heading']}>Personal information</div>

          <div className={aStyles['a-group']}>
            <label className={aStyles['a-label']}>Phone Number <span style={{ textTransform: 'none', fontWeight: 400 }}>(WhatsApp preferred)</span></label>
            <div className={`${aStyles['input-wrap']} ${aStyles[fieldStatusClass(phoneStatus, phoneTouched)] || ''}`}>
              <span className={aStyles['input-icon']}><Phone size={15} /></span>
              <input
                type="tel" name="phone" value={formData.phone} onChange={handleChange}
                onBlur={() => { setPhoneTouched(true); if (formData.phone) checkPhoneUniqueness(formData.phone) }}
                placeholder="08012345678" className={aStyles['a-input']}
              />
              <span className={aStyles['status-icon']}>{phoneTouched && <StatusIcon status={phoneStatus} />}</span>
            </div>
            {phoneTouched && phoneStatus === 'taken' && <div className={`${aStyles['field-hint']} ${aStyles.bad}`}><XCircle size={11} /> {phoneMessage}</div>}
            {phoneTouched && phoneStatus === 'invalid' && <div className={`${aStyles['field-hint']} ${aStyles.bad}`}>{phoneMessage}</div>}
            {phoneTouched && phoneStatus === 'available' && <div className={`${aStyles['field-hint']} ${aStyles.ok}`}>Phone number is available</div>}
            {!phoneTouched && <div className={aStyles['field-hint']}>Your personal WhatsApp number for competition updates</div>}
          </div>

          <div className={aStyles['a-group']}>
            <label className={aStyles['a-label']}>Birth Date</label>
            <div className={aStyles['input-wrap']}>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className={aStyles['a-input']} style={{ paddingLeft: 14 }} />
            </div>
            {formData.age && (
              <div className={`${aStyles['age-hint']} ${parseInt(formData.age) < 18 ? aStyles.bad : ''}`}>
                Age: {formData.age} years {parseInt(formData.age) < 18 ? '— must be 18 or older' : ''}
              </div>
            )}
          </div>

          <div className={aStyles['a-group']}>
            <label className={aStyles['a-label']}>State</label>
            <div className={aStyles['input-wrap']}>
              <span className={aStyles['input-icon']}><MapPin size={15} /></span>
              <select name="state" value={formData.state} onChange={handleChange} className={aStyles['a-input']} style={{ appearance: 'none' }}>
                <option value="">Select your state</option>
                {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className={aStyles['a-group']}>
            <label className={aStyles['a-label']}>Geo-Political Zone</label>
            <div className={aStyles['input-wrap']} style={{ background: 'rgba(var(--navy-rgb),0.03)' }}>
              <input type="text" value={formData.geoZone} disabled className={aStyles['a-input']} style={{ color: 'rgba(var(--navy-rgb),0.5)' }} />
            </div>
            <div className={aStyles['field-hint']}>Auto-populated based on your state</div>
          </div>

          {checkboxRow(formData.physicalFitness, () => setFormData(prev => ({ ...prev, physicalFitness: !prev.physicalFitness })), 'I am physically fit and ready for this competition')}
        </div>
      )}

      {/* ── Step 3: Emergency Contact & Waiver ── */}
      {step === 3 && (
        <div>
          <div className={aStyles['step-heading']}>Emergency contact & waiver</div>

          <div className={aStyles['a-group']}>
            <label className={aStyles['a-label']}>Emergency Contact Name</label>
            <div className={aStyles['input-wrap']}>
              <span className={aStyles['input-icon']}><User size={15} /></span>
              <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Full name" className={aStyles['a-input']} />
            </div>
          </div>

          <div className={aStyles['a-group']}>
            <label className={aStyles['a-label']}>Emergency Contact Phone <span style={{ textTransform: 'none', fontWeight: 400 }}>(next of kin)</span></label>
            <div className={`${aStyles['input-wrap']} ${emergencyPhoneTouched && emergencyPhoneError ? aStyles.taken : ''}`}>
              <span className={aStyles['input-icon']}><Phone size={15} /></span>
              <input
                type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange}
                onBlur={() => { setEmergencyPhoneTouched(true); const v = validateNigerianPhone(formData.emergencyPhone); setEmergencyPhoneError(v.isValid ? '' : v.message) }}
                placeholder="08012345678" className={aStyles['a-input']}
              />
            </div>
            {emergencyPhoneTouched && emergencyPhoneError && <div className={`${aStyles['field-hint']} ${aStyles.bad}`}>{emergencyPhoneError}</div>}
            <div className={aStyles['field-hint']}>Multiple contestants can share the same next-of-kin number</div>
          </div>

          <div className={aStyles['waiver-box']}>
            <div className={aStyles['waiver-title']}>Waiver &amp; Terms</div>
            <p className={aStyles['waiver-text']}>
              I understand that participation in Nigeria&apos;s Next Warrior involves physical exertion and inherent risks.
              I hereby assume all risks associated with participation and waive any claims against the organizers.
            </p>
            {checkboxRow(formData.waiver, () => setFormData(prev => ({ ...prev, waiver: !prev.waiver })), 'I accept the waiver and terms of participation')}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className={aStyles['step-btn-row']}>
        {step > 1 && (
          <button type="button" onClick={() => setStep(s => s - 1)} className={`${styles.btn} ${styles['btn-ghost-dark']}`} style={{ flex: 1 }}>
            Back
          </button>
        )}
        {step < 3 ? (
          <button
            type="button" onClick={handleNext}
            disabled={
              (step === 1 && emailStatus === 'taken') ||
              (step === 1 && emailStatus === 'checking') ||
              (step === 2 && phoneStatus === 'taken') ||
              (step === 2 && phoneStatus === 'checking')
            }
            className={`${styles.btn} ${styles['btn-gold']}`} style={{ flex: 1 }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.waiver || (emergencyPhoneTouched && !!emergencyPhoneError)}
            className={`${styles.btn} ${styles['btn-gold']}`} style={{ flex: 1 }}
          >
            {loading ? 'Registering…' : 'Register'}
          </button>
        )}
      </div>

      <div className={aStyles['switch-line']}>
        Already have an account?<Link href="/login">Login here</Link>
      </div>
    </div>
  )
}