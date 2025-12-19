'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
]

// Nigerian phone number validation
const validateNigerianPhone = (phone: string): { isValid: boolean; message: string } => {
  // Remove all spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')

  // Check for valid Nigerian formats:
  // +2347012345678, +2348012345678, 07012345678, 08012345678, 2347012345678, 2348012345678
  const nigerianPhoneRegex = /^(\+?234|0)?([7-9][0-1])\d{8}$/

  if (!cleaned) {
    return { isValid: false, message: 'Phone number is required' }
  }

  if (!nigerianPhoneRegex.test(cleaned)) {
    return {
      isValid: false,
      message: 'Enter a valid Nigerian phone number (e.g., 08012345678 or +2348012345678)'
    }
  }

  return { isValid: true, message: '' }
}

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    state: '',
    geoZone: '',
    birthDate: '',
    age: '',
    physicalFitness: false,
    emergencyContact: '',
    emergencyPhone: '',
    waiver: false,
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [emergencyPhoneError, setEmergencyPhoneError] = useState('')
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [emergencyPhoneTouched, setEmergencyPhoneTouched] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Only validate phone if user has touched the field
    if (name === 'phone' && phoneTouched) {
      const validation = validateNigerianPhone(value)
      setPhoneError(validation.isValid ? '' : validation.message)
    }

    // Only validate emergency phone if user has touched the field
    if (name === 'emergencyPhone' && emergencyPhoneTouched) {
      const validation = validateNigerianPhone(value)
      setEmergencyPhoneError(validation.isValid ? '' : validation.message)
    }

    // Auto-calculate age from birth date
    if (name === 'birthDate' && value) {
      const today = new Date()
      const birth = new Date(value)
      let calculatedAge = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        calculatedAge--
      }
      setFormData(prev => ({ ...prev, age: calculatedAge.toString() }))
    }

    // Auto-set geo zone based on state
    if (name === 'state' && value) {
      const stateToZone: { [key: string]: string } = {
        'Benue': 'North Central', 'Kogi': 'North Central', 'Kwara': 'North Central', 'Nasarawa': 'North Central', 'Niger': 'North Central', 'Plateau': 'North Central', 'FCT': 'North Central',
        'Adamawa': 'North East', 'Bauchi': 'North East', 'Borno': 'North East', 'Gombe': 'North East', 'Taraba': 'North East', 'Yobe': 'North East',
        'Jigawa': 'North West', 'Kaduna': 'North West', 'Kano': 'North West', 'Katsina': 'North West', 'Kebbi': 'North West', 'Sokoto': 'North West', 'Zamfara': 'North West',
        'Abia': 'South East', 'Anambra': 'South East', 'Ebonyi': 'South East', 'Enugu': 'South East', 'Imo': 'South East',
        'Akwa Ibom': 'South South', 'Bayelsa': 'South South', 'Cross River': 'South South', 'Delta': 'South South', 'Edo': 'South South', 'Rivers': 'South South',
        'Ekiti': 'South West', 'Lagos': 'South West', 'Ogun': 'South West', 'Ondo': 'South West', 'Osun': 'South West', 'Oyo': 'South West',
      }
      setFormData(prev => ({ ...prev, geoZone: stateToZone[value] || '' }))
    }
  }

  const validateStep = () => {
    if (step === 1) {
      if (!formData.fullName.trim()) {
        toast.error('Full name is required')
        return false
      }
      if (!formData.email.includes('@')) {
        toast.error('Valid email is required')
        return false
      }
      if (formData.password.length < 8) {
        toast.error('Password must be at least 8 characters')
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        return false
      }
    }

    if (step === 2) {
      // Validate phone number and mark as touched
      setPhoneTouched(true)
      const phoneValidation = validateNigerianPhone(formData.phone)
      if (!phoneValidation.isValid) {
        setPhoneError(phoneValidation.message)
        return false
      }

      if (!formData.state) {
        toast.error('State is required')
        return false
      }
      if (!formData.birthDate) {
        toast.error('Birth date is required')
        return false
      }
      const age = parseInt(formData.age)
      if (age < 18) {
        toast.error('You must be at least 18 years old')
        return false
      }
    }

    if (step === 3) {
      if (!formData.emergencyContact.trim()) {
        toast.error('Emergency contact name is required')
        return false
      }

      // Validate emergency phone and mark as touched
      setEmergencyPhoneTouched(true)
      const emergencyPhoneValidation = validateNigerianPhone(formData.emergencyPhone)
      if (!emergencyPhoneValidation.isValid) {
        setEmergencyPhoneError(emergencyPhoneValidation.message)
        return false
      }

      if (!formData.waiver) {
        toast.error('You must accept the waiver to proceed')
        return false
      }
    }

    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep()) return

    setLoading(true)

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth-callback`,
        }
      })

      if (authError) {
        toast.error(authError.message)
        setLoading(false)
        return
      }

      if (!authData.user) {
        toast.error('Registration failed')
        setLoading(false)
        return
      }

      // Create user profile with ALL collected data
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: formData.email,
          full_name: formData.fullName,
          phone: formData.phone,
          birth_date: formData.birthDate,
          age: parseInt(formData.age),
          state: formData.state,
          geo_zone: formData.geoZone,
          physical_fitness: formData.physicalFitness,
          emergency_contact: formData.emergencyContact,
          emergency_phone: formData.emergencyPhone,
          role: 'user',
          profile_completed: true,
        })

      if (profileError) {
        toast.error('Failed to create user profile')
        setLoading(false)
        return
      }

      toast.success('Registration successful! Check your email to verify your account.')
      setSuccess(true)
      setLoading(false)
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex w-16 h-16 bg-naija-green-100 rounded-full items-center justify-center mb-4">
          <span className="text-3xl">✓</span>
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
      {/* Progress Indicator */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(num => (
          <div
            key={num}
            className={`flex-1 h-2 rounded-full transition ${step >= num ? 'bg-naija-green-600' : 'bg-gray-300'
              }`}
          />
        ))}
      </div>

      {/* Step 1: Account Details */}
      {step === 1 && (
        <div className="space-y-4 animate-slide-up">
          <h2 className="text-xl font-bold text-naija-green-900 mb-6">Create Your Account</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-naija-green-600 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-naija-green-600 transition"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Personal Details */}
      {step === 2 && (
        <div className="space-y-4 animate-slide-up">
          <h2 className="text-xl font-bold text-naija-green-900 mb-6">Personal Information</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number <span className="text-xs font-normal text-gray-500">(WhatsApp preferred)</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={() => setPhoneTouched(true)}
              placeholder="08012345678"
              className={`w-full px-4 py-3 rounded-lg border ${phoneTouched && phoneError ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-naija-green-600 focus:ring-naija-green-100'
                } focus:outline-none focus:ring-2`}
            />
            {phoneTouched && phoneError ? (
              <p className="text-xs text-red-600 mt-1.5">{phoneError}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1.5">WhatsApp number for updates</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
            />
            {formData.age && (
              <p className="text-sm text-gray-600 mt-2">Age: {formData.age} years</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
            >
              <option value="">Select your state</option>
              {NIGERIAN_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Geo-Political Zone</label>
            <input
              type="text"
              value={formData.geoZone}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-populated based on your state</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="physicalFitness"
              id="fitness"
              checked={formData.physicalFitness}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-naija-green-600"
            />
            <label htmlFor="fitness" className="text-sm text-gray-700">
              I am physically fit and ready for this competition
            </label>
          </div>
        </div>
      )}

      {/* Step 3: Emergency & Waiver */}
      {step === 3 && (
        <div className="space-y-4 animate-slide-up">
          <h2 className="text-xl font-bold text-naija-green-900 mb-6">Emergency Contact & Waiver</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Name</label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Phone</label>
            <input
              type="tel"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleChange}
              onBlur={() => setEmergencyPhoneTouched(true)}
              placeholder="08012345678"
              className={`w-full px-4 py-3 rounded-lg border ${emergencyPhoneTouched && emergencyPhoneError ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-naija-green-600 focus:ring-naija-green-100'
                } focus:outline-none focus:ring-2`}
            />
            {emergencyPhoneTouched && emergencyPhoneError && (
              <p className="text-xs text-red-600 mt-1.5">{emergencyPhoneError}</p>
            )}
          </div>

          <div className="bg-naija-green-50 border border-naija-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-sm text-naija-green-900 mb-2">Waiver & Terms</h3>
            <p className="text-xs text-gray-700 leading-relaxed mb-4">
              I understand that participation in Naija Ninja Warrior involves physical exertion and inherent risks. I hereby assume all risks associated with participation and waive any claims against the organizers.
            </p>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="waiver"
                id="waiver"
                checked={formData.waiver}
                onChange={handleChange}
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
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="flex-1 px-4 py-3 rounded-lg border border-naija-green-600 text-naija-green-600 font-semibold hover:bg-naija-green-50 transition"
          >
            Back
          </button>
        )}
        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={step === 2 && phoneTouched && !!phoneError}
            className="flex-1 px-4 py-3 rounded-lg bg-naija-green-600 text-white font-semibold hover:bg-naija-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.waiver || (emergencyPhoneTouched && !!emergencyPhoneError)}
            className="flex-1 px-4 py-3 rounded-lg bg-naija-green-600 text-white font-semibold hover:bg-naija-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        )}
      </div>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-naija-green-600 font-semibold hover:text-naija-green-700">
          Login here
        </Link>
      </p>
    </div>
  )
}