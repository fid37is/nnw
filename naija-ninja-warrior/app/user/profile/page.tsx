'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Save, User, Phone, Mail, MapPin, Calendar, AlertCircle, Shield, Camera } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthConfig } from "../../../components/context/AuthContext"

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
]

interface UserData {
  id: string
  email: string
  full_name: string
  phone: string
  birth_date: string
  age: number
  state: string
  geo_zone: string
  physical_fitness: boolean
  emergency_contact: string
  emergency_phone: string
}

interface ApplicationData {
  id: string
  photo_url: string | null
}

interface Season {
  id: string
  application_end_date: string
}

const validateNigerianPhone = (phone: string): { isValid: boolean; message: string } => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
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

export default function UserProfile() {
  const [user, setUser] = useState<UserData | null>(null)
  const [application, setApplication] = useState<ApplicationData | null>(null)
  const [season, setSeason] = useState<Season | null>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    birth_date: '',
    age: '',
    state: '',
    geo_zone: '',
    physical_fitness: false,
    emergency_contact: '',
    emergency_phone: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [emergencyPhoneError, setEmergencyPhoneError] = useState('')
  const { logoUrl } = useAuthConfig()

  const isApplicationClosed = season ? new Date().toISOString().split('T')[0] > season.application_end_date : false

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        window.location.href = '/login'
        return
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (userError) throw userError
      setUser(userData)

      const { data: seasonData } = await supabase
        .from('seasons')
        .select('id, application_end_date')
        .eq('status', 'active')
        .limit(1)
        .single()

      if (seasonData) {
        setSeason(seasonData)
      }

      const { data: appData } = await supabase
        .from('applications')
        .select('id, photo_url')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (appData) {
        setApplication(appData)
      }

      setFormData({
        full_name: userData.full_name || '',
        phone: userData.phone || '',
        birth_date: userData.birth_date || '',
        age: userData.age?.toString() || '',
        state: userData.state || '',
        geo_zone: userData.geo_zone || '',
        physical_fitness: userData.physical_fitness || false,
        emergency_contact: userData.emergency_contact || '',
        emergency_phone: userData.emergency_phone || '',
      })
    } catch (err) {
      toast.error('Failed to load profile')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Photo must be less than 10MB')
      return
    }

    if (isApplicationClosed) {
      toast.error('Cannot update photo after application deadline')
      return
    }

    setUploadingPhoto(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || !user || !application) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `photos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('applications')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('applications')
        .getPublicUrl(filePath)

      const photoUrl = publicUrlData.publicUrl

      if (!photoUrl) {
        throw new Error('Failed to get photo URL')
      }

      const { error: updateError } = await supabase
        .from('applications')
        .update({ photo_url: photoUrl })
        .eq('id', application.id)

      if (updateError) throw updateError

      setApplication({ ...application, photo_url: photoUrl })
      toast.success('Photo updated successfully')
    } catch (err) {
      console.error('Error uploading photo:', err)
      toast.error('Failed to upload photo. Please try again.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    if (name === 'phone') {
      const validation = validateNigerianPhone(value)
      setPhoneError(validation.isValid ? '' : validation.message)
    }

    if (name === 'emergency_phone') {
      const validation = validateNigerianPhone(value)
      setEmergencyPhoneError(validation.isValid ? '' : validation.message)
    }

    if (name === 'birth_date' && value) {
      const today = new Date()
      const birth = new Date(value)
      let calculatedAge = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        calculatedAge--
      }
      setFormData(prev => ({ ...prev, age: calculatedAge.toString() }))
    }

    if (name === 'state' && value) {
      const stateToZone: { [key: string]: string } = {
        'Benue': 'North Central', 'Kogi': 'North Central', 'Kwara': 'North Central', 'Nasarawa': 'North Central', 'Niger': 'North Central', 'Plateau': 'North Central', 'FCT': 'North Central',
        'Adamawa': 'North East', 'Bauchi': 'North East', 'Borno': 'North East', 'Gombe': 'North East', 'Taraba': 'North East', 'Yobe': 'North East',
        'Jigawa': 'North West', 'Kaduna': 'North West', 'Kano': 'North West', 'Katsina': 'North West', 'Kebbi': 'North West', 'Sokoto': 'North West', 'Zamfara': 'North West',
        'Abia': 'South East', 'Anambra': 'South East', 'Ebonyi': 'South East', 'Enugu': 'South East', 'Imo': 'South East',
        'Akwa Ibom': 'South South', 'Bayelsa': 'South South', 'Cross River': 'South South', 'Delta': 'South South', 'Edo': 'South South', 'Rivers': 'South South',
        'Ekiti': 'South West', 'Lagos': 'South West', 'Ogun': 'South West', 'Ondo': 'South West', 'Osun': 'South West', 'Oyo': 'South West',
      }
      setFormData(prev => ({ ...prev, geo_zone: stateToZone[value] || '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (!user) {
        toast.error('User not found')
        return
      }

      if (!formData.full_name.trim()) {
        toast.error('Full name is required')
        return
      }

      const phoneValidation = validateNigerianPhone(formData.phone)
      if (!phoneValidation.isValid) {
        toast.error(phoneValidation.message)
        setPhoneError(phoneValidation.message)
        return
      }

      if (!formData.state) {
        toast.error('State is required')
        return
      }

      if (formData.emergency_phone.trim()) {
        const emergencyPhoneValidation = validateNigerianPhone(formData.emergency_phone)
        if (!emergencyPhoneValidation.isValid) {
          toast.error(emergencyPhoneValidation.message)
          setEmergencyPhoneError(emergencyPhoneValidation.message)
          return
        }
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          birth_date: formData.birth_date,
          age: parseInt(formData.age),
          state: formData.state,
          geo_zone: formData.geo_zone,
          physical_fitness: formData.physical_fitness,
          emergency_contact: formData.emergency_contact,
          emergency_phone: formData.emergency_phone,
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userData) {
        setUser(userData)
      }

      toast.success('Profile updated successfully!')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      toast.error('Failed to update profile. Please try again.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-naija-green-100">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logoUrl}
                alt="Naija Ninja Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="font-bold text-lg text-naija-green-900">Naija Ninja</span>
            </Link>
          </div>
        </nav>
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="animate-spin w-12 h-12 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-naija-green-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logoUrl}
              alt="Naija Ninja Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="font-bold text-lg text-naija-green-900">Naija Ninja</span>
          </Link>
          <Link href="/user/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-naija-green-600 transition">
            <ArrowLeft size={18} />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-6 md:py-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-naija-green-900 mb-2">Edit Your Profile</h1>
          <p className="text-sm md:text-base text-gray-600">Update your personal information</p>
        </div>

        <div className="space-y-6">
          {/* Profile Photo */}
          <div className="bg-white rounded-xl shadow-sm border border-naija-green-100 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-2">
                <Camera className="text-naija-green-600" size={20} />
                <h2 className="text-lg font-bold text-naija-green-900">Profile Photo</h2>
              </div>
              
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto || isApplicationClosed}
                  className="hidden"
                />
                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition ${
                  uploadingPhoto || isApplicationClosed
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-naija-green-100 text-naija-green-600 hover:bg-naija-green-200 cursor-pointer'
                }`}
                title={isApplicationClosed ? 'Applications closed' : 'Edit photo'}>
                  {uploadingPhoto ? (
                    <div className="animate-spin w-5 h-5 border-2 border-naija-green-600 border-t-transparent rounded-full"></div>
                  ) : (
                    <Camera size={20} />
                  )}
                </span>
              </label>
            </div>

            <div className="flex items-center gap-8">
              <div className="relative w-56 h-64 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                {application?.photo_url ? (
                  <Image
                    src={application.photo_url}
                    alt={user?.full_name || 'Profile'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={80} className="text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <p className="text-gray-700 font-semibold mb-2">Professional profile photo</p>
                <p className="text-sm text-gray-600 mb-4">Max 10MB • JPG, PNG, etc.</p>
                
                {isApplicationClosed && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="font-semibold text-amber-900 mb-1">⚠️ Application Closed</p>
                    <p className="text-sm text-amber-800">Profile photo cannot be updated after the application deadline.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-sm border border-naija-green-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-naija-green-600" size={20} />
              <h2 className="text-lg font-bold text-naija-green-900">Account Information</h2>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-naija-green-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-naija-green-600" size={20} />
              <h2 className="text-lg font-bold text-naija-green-900">Personal Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  Phone Number (WhatsApp Preferred)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., 08012345678 or +2348012345678"
                  className={`w-full px-4 py-3 rounded-lg border ${phoneError ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-naija-green-600 focus:ring-naija-green-100'} focus:outline-none focus:ring-2`}
                />
                {phoneError && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {phoneError}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Birth Date
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
                />
                {formData.age && (
                  <p className="text-sm text-gray-600 mt-2">Age: {formData.age} years</p>
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-xl shadow-sm border border-naija-green-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-naija-green-600" size={20} />
              <h2 className="text-lg font-bold text-naija-green-900">Location</h2>
            </div>
            <div className="space-y-4">
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
                  value={formData.geo_zone}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-populated based on your state</p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-naija-green-50 rounded-lg">
                <input
                  type="checkbox"
                  name="physical_fitness"
                  id="fitness"
                  checked={formData.physical_fitness}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-naija-green-600"
                />
                <label htmlFor="fitness" className="text-sm text-gray-700">
                  I am physically fit and ready for competition
                </label>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-xl shadow-sm border border-naija-green-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="text-naija-green-600" size={20} />
              <h2 className="text-lg font-bold text-naija-green-900">Emergency Contact</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Name</label>
                <input
                  type="text"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                <input
                  type="tel"
                  name="emergency_phone"
                  value={formData.emergency_phone}
                  onChange={handleChange}
                  placeholder="e.g., 08012345678 or +2348012345678"
                  className={`w-full px-4 py-3 rounded-lg border ${emergencyPhoneError ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-naija-green-600 focus:ring-naija-green-100'} focus:outline-none focus:ring-2`}
                />
                {emergencyPhoneError && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {emergencyPhoneError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Link
              href="/user/dashboard"
              className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition text-center"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={saving || !!phoneError || !!emergencyPhoneError}
              className="flex-1 px-6 py-3 rounded-lg bg-naija-green-600 text-white font-semibold hover:bg-naija-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}