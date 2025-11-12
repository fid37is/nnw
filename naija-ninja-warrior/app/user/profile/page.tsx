'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Save, User, Phone, Mail, MapPin, Calendar, AlertCircle, Shield } from 'lucide-react'

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
]

interface User {
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
  role: string
  profile_completed: boolean
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
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
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
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
        setError('Failed to load profile')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Auto-calculate age from birth date
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
      setFormData(prev => ({ ...prev, geo_zone: stateToZone[value] || '' }))
    }

    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSaving(true)

    try {
      if (!user) {
        setError('User not found')
        return
      }

      // Validate required fields
      if (!formData.full_name.trim()) {
        setError('Full name is required')
        return
      }
      if (!formData.phone.trim()) {
        setError('Phone number is required')
        return
      }
      if (!formData.state) {
        setError('State is required')
        return
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

      setSuccess(true)
      
      // Refresh user data
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userData) {
        setUser(userData)
      }

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError('Failed to update profile. Please try again.')
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
              <div className="w-10 h-10 bg-gradient-to-br from-naija-green-600 to-naija-green-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">NNW</span>
              </div>
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
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-naija-green-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-naija-green-600 to-naija-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">NNW</span>
            </div>
            <span className="font-bold text-lg text-naija-green-900">Naija Ninja</span>
          </Link>
          <Link href="/user/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-naija-green-600 transition">
            <ArrowLeft size={18} />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-naija-green-900 mb-2">Edit Your Profile</h1>
          <p className="text-sm md:text-base text-gray-600">Update your personal information</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            <span>Profile updated successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Information (Read-only) */}
          <div className="bg-white rounded-xl shadow-sm border border-naija-green-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-naija-green-600" size={20} />
              <h2 className="text-lg font-bold text-naija-green-900">Account Information</h2>
            </div>
            <div className="space-y-3">
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
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 XXX XXX XXXX"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
                />
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
                  placeholder="+234 XXX XXX XXXX"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
                />
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
              type="submit"
              disabled={saving}
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
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}