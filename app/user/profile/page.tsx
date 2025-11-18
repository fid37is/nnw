'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Save, User, Phone, Mail, MapPin, Calendar, AlertCircle, Shield, Camera, Award, Lock, Edit2, X } from 'lucide-react'
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
  preferred_name: string | null
  status: string | null
}

interface ApplicationData {
  id: string
  photo_url: string | null
  is_participant: boolean
  is_accepted: boolean
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
  const [preferredName, setPreferredName] = useState('')
  const [savingNickname, setSavingNickname] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
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
      setPreferredName(userData.preferred_name || '')

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
        .select('id, photo_url, is_participant, is_accepted')
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

      const updateData: any = {
        full_name: formData.full_name,
        phone: formData.phone,
        birth_date: formData.birth_date,
        age: parseInt(formData.age),
        state: formData.state,
        geo_zone: formData.geo_zone,
        physical_fitness: formData.physical_fitness,
        emergency_contact: formData.emergency_contact,
        emergency_phone: formData.emergency_phone,
      }

      // Only update preferred_name if user can edit it and it has changed
      if (canEditNickname && preferredName.trim() && preferredName !== user.preferred_name) {
        updateData.preferred_name = preferredName.trim()
        updateData.preferred_name_updated_at = new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id)

      if (updateError) throw updateError

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userData) {
        setUser(userData)
        setPreferredName(userData.preferred_name || '')
      }

      toast.success('Profile updated successfully!')
      setIsEditing(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      toast.error('Failed to update profile. Please try again.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    // Reset form to current user data
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        birth_date: user.birth_date || '',
        age: user.age?.toString() || '',
        state: user.state || '',
        geo_zone: user.geo_zone || '',
        physical_fitness: user.physical_fitness || false,
        emergency_contact: user.emergency_contact || '',
        emergency_phone: user.emergency_phone || '',
      })
      setPreferredName(user.preferred_name || '')
    }
    setPhoneError('')
    setEmergencyPhoneError('')
    setIsEditing(false)
  }

  const handleUpdateNickname = async () => {
    if (!user) return

    if (!preferredName.trim()) {
      toast.error('Please enter a nickname')
      return
    }

    setSavingNickname(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          preferred_name: preferredName.trim(),
          preferred_name_updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userData) {
        setUser(userData)
      }

      toast.success('Nickname updated successfully!')
    } catch (err) {
      console.error('Error updating nickname:', err)
      toast.error('Failed to update nickname')
    } finally {
      setSavingNickname(false)
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
                loading="eager"
                priority
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

  const isAccepted = application?.is_accepted || false
  const isParticipant = application?.is_participant || false
  const canEditNickname = isAccepted && !isParticipant

  return (
    <main className="min-h-screen">
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
            <span className="hidden sm:inline font-semibold">Back to Dashboard</span>
            <span className="sm:hidden font-semibold">Back</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6 md:py-12">
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-naija-green-900 mb-2">Your Profile</h1>
            <p className="text-sm md:text-base text-gray-600">
              {isEditing ? 'Update your personal information' : 'View your personal information'}
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition text-sm font-semibold"
            >
              <Edit2 size={16} />
              <span className="hidden sm:inline">Edit Profile</span>
              <span className="sm:hidden">Edit</span>
            </button>
          )}
        </div>

        <div className="space-y-4 md:space-y-6">
          {/* Profile Photo & Nickname Card */}
          <div className="bg-white rounded-xl shadow-sm border border-naija-green-100 p-4 md:p-6">
            <div className="flex items-start justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-2">
                <Camera className="text-naija-green-600" size={20} />
                <h2 className="text-base md:text-lg font-bold text-naija-green-900">Profile Photo</h2>
              </div>
              
              {isEditing && (
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
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Photo */}
              <div className="relative w-full max-w-[200px] h-56 md:w-56 md:h-64 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 mx-auto md:mx-0 border-2 border-gray-300">
                {application?.photo_url ? (
                  <Image
                    src={application.photo_url}
                    alt={user?.full_name || 'Profile'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={60} className="text-gray-400 md:w-20 md:h-20" />
                  </div>
                )}
              </div>

              {/* Photo Info & Nickname */}
              <div className="flex-1 space-y-4">
                {isEditing && (
                  <div>
                    <p className="text-sm md:text-base text-gray-700 font-semibold mb-1 md:mb-2">Professional profile photo</p>
                    <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">Max 10MB • JPG, PNG, etc.</p>
                    
                    {isApplicationClosed && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 md:p-4">
                        <p className="text-sm font-semibold text-amber-900 mb-1">⚠️ Application Closed</p>
                        <p className="text-xs md:text-sm text-amber-800">Profile photo cannot be updated after the application deadline.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Nickname Section - Only for Accepted Users */}
                {isAccepted && (
                  <div className={`${isEditing ? 'border-t pt-4' : ''} ${canEditNickname ? 'border-naija-green-200' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className={canEditNickname ? 'text-naija-green-600' : 'text-gray-400'} size={18} />
                      <h3 className="text-sm md:text-base font-bold text-gray-900">Preferred Name / Nickname</h3>
                      {!canEditNickname && <Lock size={14} className="text-gray-400" />}
                    </div>
                    
                    {isEditing ? (
                      <>
                        <p className="text-xs text-gray-600 mb-3">
                          {canEditNickname 
                            ? "This is the name you'll be called during challenge phases (e.g., 'Shadow Warrior')" 
                            : "Your nickname is locked after becoming a participant"}
                        </p>
                        <input
                          type="text"
                          value={preferredName}
                          onChange={(e) => setPreferredName(e.target.value)}
                          disabled={!canEditNickname}
                          placeholder="Enter your preferred name"
                          maxLength={50}
                          className={`w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border focus:outline-none focus:ring-2 ${
                            canEditNickname 
                              ? 'border-naija-green-300 focus:border-naija-green-600 focus:ring-naija-green-100' 
                              : 'border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed'
                          }`}
                        />
                      </>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4">
                        <p className="text-sm md:text-base font-semibold text-gray-900">
                          {preferredName || 'Not set'}
                        </p>
                        {!preferredName && canEditNickname && (
                          <p className="text-xs text-gray-500 mt-1">Click Edit Profile to set your nickname</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-sm border border-naija-green-100 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Shield className="text-naija-green-600" size={20} />
              <h2 className="text-base md:text-lg font-bold text-naija-green-900">Account Information</h2>
            </div>
            <div>
              <label className="text-xs md:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email Address
              </label>
              <div className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border border-gray-300 bg-gray-50 text-gray-600">
                {user?.email}
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-naija-green-100 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <User className="text-naija-green-600" size={20} />
              <h2 className="text-base md:text-lg font-bold text-naija-green-900">Personal Information</h2>
            </div>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
                  />
                ) : (
                  <div className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border border-gray-200 bg-gray-50">
                    {formData.full_name || 'Not set'}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs md:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  Phone Number (WhatsApp Preferred)
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g., 08012345678 or +2348012345678"
                      className={`w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border ${phoneError ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-naija-green-600 focus:ring-naija-green-100'} focus:outline-none focus:ring-2`}
                    />
                    {phoneError && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {phoneError}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border border-gray-200 bg-gray-50">
                    {formData.phone || 'Not set'}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs md:text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Birth Date
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="date"
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
                    />
                    {formData.age && (
                      <p className="text-xs md:text-sm text-gray-600 mt-2">Age: {formData.age} years</p>
                    )}
                  </>
                ) : (
                  <div className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border border-gray-200 bg-gray-50">
                    {formData.birth_date ? new Date(formData.birth_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not set'}
                    {formData.age && <span className="ml-2 text-gray-500">({formData.age} years)</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-xl shadow-sm border border-naija-green-100 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <MapPin className="text-naija-green-600" size={20} />
              <h2 className="text-base md:text-lg font-bold text-naija-green-900">Location</h2>
            </div>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">State</label>
                {isEditing ? (
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
                  >
                    <option value="">Select your state</option>
                    {NIGERIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border border-gray-200 bg-gray-50">
                    {formData.state || 'Not set'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Geo-Political Zone</label>
                <div className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border border-gray-200 bg-gray-50 text-gray-600">
                  {formData.geo_zone || 'Not set'}
                </div>
                {isEditing && <p className="text-xs text-gray-500 mt-1">Auto-populated based on your state</p>}
              </div>

              <div className={`flex items-center gap-3 p-3 md:p-4 rounded-lg ${isEditing ? 'bg-naija-green-50' : 'bg-gray-50 border border-gray-200'}`}>
                {isEditing ? (
                  <>
                    <input
                      type="checkbox"
                      name="physical_fitness"
                      id="fitness"
                      checked={formData.physical_fitness}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-gray-300 text-naija-green-600"
                    />
                    <label htmlFor="fitness" className="text-xs md:text-sm text-gray-700">
                      I am physically fit and ready for competition
                    </label>
                  </>
                ) : (
                  <p className="text-xs md:text-sm text-gray-700">
                    Physical Fitness: <span className="font-semibold">{formData.physical_fitness ? '✓ Yes' : '✗ No'}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-xl shadow-sm border border-naija-green-100 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <AlertCircle className="text-naija-green-600" size={20} />
              <h2 className="text-base md:text-lg font-bold text-naija-green-900">Emergency Contact</h2>
            </div>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Contact Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
                  />
                ) : (
                  <div className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border border-gray-200 bg-gray-50">
                    {formData.emergency_contact || 'Not set'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                {isEditing ? (
                  <>
                    <input
                      type="tel"
                      name="emergency_phone"
                      value={formData.emergency_phone}
                      onChange={handleChange}
                      placeholder="e.g., 08012345678 or +2348012345678"
                      className={`w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border ${emergencyPhoneError ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-naija-green-600 focus:ring-naija-green-100'} focus:outline-none focus:ring-2`}
                    />
                    {emergencyPhoneError && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {emergencyPhoneError}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg border border-gray-200 bg-gray-50">
                    {formData.emergency_phone || 'Not set'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons - Only show when editing */}
          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="flex-1 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition text-center flex items-center justify-center gap-2"
              >
                <X size={16} className="md:w-[18px] md:h-[18px]" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || !!phoneError || !!emergencyPhoneError}
                className="flex-1 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-lg bg-naija-green-600 text-white font-semibold hover:bg-naija-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="md:w-[18px] md:h-[18px]" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}