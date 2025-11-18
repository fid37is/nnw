'use client'

import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Upload, X } from 'lucide-react'

interface Season {
  id: string
  name: string
  year: number
  application_start_date: string
  application_end_date: string
}

interface UserProfile {
  id: string
  full_name: string
  email: string
  phone: string
  birth_date: string
  age: number
  state: string
  geo_zone: string
  physical_fitness: boolean
  emergency_contact: string
  emergency_phone: string
  profile_completed: boolean
}

interface ApplicationFormProps {
  userId: string
  applicationId?: string
  seasonId?: string
  onSuccess?: () => void
}

export default function ApplicationForm({
  userId,
  applicationId,
  seasonId,
  onSuccess,
}: ApplicationFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string>('')
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [activeSeason, setActiveSeason] = useState<Season | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [seasonLoading, setSeasonLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    checkActiveSeasonAndApplicationWindow()
    fetchUserProfile()
  }, [userId])

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview)
      if (photoPreview) URL.revokeObjectURL(photoPreview)
    }
  }, [videoPreview, photoPreview])

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, phone, birth_date, age, state, geo_zone, physical_fitness, emergency_contact, emergency_phone, profile_completed')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        toast.error('Failed to load user profile')
        return
      }

      setUserProfile(data)

      // Check if profile is incomplete
      if (!data.profile_completed || !data.age || !data.birth_date || !data.state) {
        toast.error('Please complete your profile before applying', {
          description: 'Visit your profile page to fill in required information'
        })
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setProfileLoading(false)
    }
  }

  const checkActiveSeasonAndApplicationWindow = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('seasons')
        .select('id, name, year, application_start_date, application_end_date, status')
        .eq('status', 'active')
        .lte('application_start_date', today)
        .gte('application_end_date', today)
        .maybeSingle()

      if (error) {
        console.error('Error checking season:', error)
      }

      if (!data) {
        const { data: upcomingData } = await supabase
          .from('seasons')
          .select('id, name, year, application_start_date, application_end_date, status')
          .eq('status', 'upcoming')
          .gt('application_start_date', today)
          .order('application_start_date', { ascending: true })
          .limit(1)
          .maybeSingle()

        if (upcomingData) {
          setActiveSeason(upcomingData as Season)
        }
      } else {
        setActiveSeason(data as Season)
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setSeasonLoading(false)
    }
  }

  const isApplicationWindowOpen = () => {
    if (!activeSeason) return false
    const today = new Date().toISOString().split('T')[0]
    return (
      today >= activeSeason.application_start_date &&
      today <= activeSeason.application_end_date
    )
  }

  const isProfileComplete = () => {
    if (!userProfile) return false
    return (
      userProfile.profile_completed &&
      userProfile.age &&
      userProfile.birth_date &&
      userProfile.state &&
      userProfile.emergency_contact &&
      userProfile.emergency_phone
    )
  }

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file')
      return
    }

    if (file.size > 500 * 1024 * 1024) {
      toast.error('Video must be less than 500MB')
      return
    }

    setVideoFile(file)
    const preview = URL.createObjectURL(file)
    setVideoPreview(preview)
    toast.success(`Video selected: ${file.name}`)
  }

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setPhotoFile(file)
    const preview = URL.createObjectURL(file)
    setPhotoPreview(preview)
    toast.success(`Photo selected: ${file.name}`)
  }

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `${bucket}/${fileName}`

    const { error } = await supabase.storage
      .from('applications')
      .upload(filePath, file, { upsert: false })

    if (error) {
      throw new Error(error.message)
    }

    const { data } = supabase.storage
      .from('applications')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!activeSeason) {
      toast.error('No active season available for applications')
      return
    }

    if (!isApplicationWindowOpen()) {
      toast.error('Application window is closed for this season')
      return
    }

    if (!isProfileComplete()) {
      toast.error('Please complete your profile before applying')
      return
    }

    if (!videoFile) {
      toast.error('Please upload a video')
      return
    }

    if (!photoFile) {
      toast.error('Please upload a profile photo')
      return
    }

    setUploading(true)
    const toastId = toast.loading('Uploading video...')
    
    try {
      // Upload video
      const videoUrl = await uploadFile(videoFile, 'videos')
      toast.loading('Uploading photo...', { id: toastId })

      // Upload photo
      const photoUrl = await uploadFile(photoFile, 'photos')
      toast.dismiss(toastId)

      // Create or update application with data from user profile
      if (applicationId) {
        const { error } = await supabase
          .from('applications')
          .update({
            video_url: videoUrl,
            photo_url: photoUrl,
            season_id: activeSeason.id,
            // Update profile data in case it changed
            age: userProfile!.age,
            birth_date: userProfile!.birth_date,
            state: userProfile!.state,
            geo_zone: userProfile!.geo_zone,
            physical_fitness: userProfile!.physical_fitness,
            emergency_contact: userProfile!.emergency_contact,
            emergency_phone: userProfile!.emergency_phone,
            waiver_accepted: true,
          })
          .eq('id', applicationId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('applications')
          .insert({
            user_id: userId,
            video_url: videoUrl,
            photo_url: photoUrl,
            status: 'pending',
            season_id: activeSeason.id,
            // Pull data from user profile
            age: userProfile!.age,
            birth_date: userProfile!.birth_date,
            state: userProfile!.state,
            geo_zone: userProfile!.geo_zone,
            physical_fitness: userProfile!.physical_fitness,
            emergency_contact: userProfile!.emergency_contact,
            emergency_phone: userProfile!.emergency_phone,
            waiver_accepted: true,
          })

        if (error) throw error
      }

      toast.success('Application submitted successfully!')
      onSuccess?.()
    } catch (err) {
      console.error(err)
      toast.dismiss(toastId)
      toast.error('Failed to submit application. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (seasonLoading || profileLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading...</p>
      </div>
    )
  }

  if (!userProfile || !isProfileComplete()) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-900 font-semibold mb-2">Incomplete Profile</p>
        <p className="text-yellow-700 text-sm mb-4">
          You need to complete your profile before submitting an application.
        </p>
        <p className="text-yellow-700 text-sm mb-4">
          Required information: Age, Birth Date, State, Emergency Contact
        </p>
        <a
          href="/user/profile"
          className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
        >
          Complete Profile
        </a>
      </div>
    )
  }

  if (!activeSeason) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-900 font-semibold mb-2">No Active Season</p>
        <p className="text-red-700 text-sm">
          There is currently no active season accepting applications. Please check back later.
        </p>
      </div>
    )
  }

  if (!isApplicationWindowOpen()) {
    const startDate = new Date(activeSeason.application_start_date).toLocaleDateString()
    const endDate = new Date(activeSeason.application_end_date).toLocaleDateString()

    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-900 font-semibold mb-2">Application Window Closed</p>
        <p className="text-yellow-700 text-sm mb-3">
          {activeSeason.name} {activeSeason.year} applications were open from {startDate} to {endDate}.
        </p>
        <p className="text-yellow-700 text-sm">
          Check back for the next season's application window.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Season Info */}
      <div className="bg-naija-green-50 border border-naija-green-200 rounded-lg p-4">
        <p className="text-sm text-naija-green-900">
          <strong>Applying for:</strong> {activeSeason.name} {activeSeason.year}
        </p>
        <p className="text-xs text-naija-green-700 mt-1">
          Application deadline: {new Date(activeSeason.application_end_date).toLocaleDateString()}
        </p>
      </div>

      {/* Profile Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Your Profile Information</h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
          <div><strong>Name:</strong> {userProfile.full_name}</div>
          <div><strong>Age:</strong> {userProfile.age} years</div>
          <div><strong>State:</strong> {userProfile.state}</div>
          <div><strong>Zone:</strong> {userProfile.geo_zone}</div>
        </div>
        <p className="text-xs text-gray-500 mt-2 italic">
          This information will be used for your application
        </p>
      </div>

      {/* Video Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Video Upload (2-3 minutes)
        </label>
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoSelect}
          className="hidden"
        />

        {videoPreview ? (
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <video
              src={videoPreview}
              controls
              className="w-full max-h-80 object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setVideoFile(null)
                setVideoPreview('')
              }}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="w-full border-2 border-dashed border-naija-green-300 rounded-lg py-8 px-4 text-center hover:border-naija-green-600 transition"
          >
            <Upload size={32} className="mx-auto mb-2 text-naija-green-600" />
            <p className="font-semibold text-gray-700">Click to upload video</p>
            <p className="text-xs text-gray-500">Max 500MB • MP4, WebM, etc.</p>
          </button>
        )}
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Profile Photo
        </label>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoSelect}
          className="hidden"
        />

        {photoPreview ? (
          <div className="relative bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={photoPreview}
              alt="Profile"
              className="w-full max-h-64 object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setPhotoFile(null)
                setPhotoPreview('')
              }}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="w-full border-2 border-dashed border-naija-green-300 rounded-lg py-8 px-4 text-center hover:border-naija-green-600 transition"
          >
            <Upload size={32} className="mx-auto mb-2 text-naija-green-600" />
            <p className="font-semibold text-gray-700">Click to upload photo</p>
            <p className="text-xs text-gray-500">Max 10MB • JPG, PNG, etc.</p>
          </button>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={uploading || !videoFile || !photoFile}
        className="w-full px-4 py-3 rounded-lg bg-naija-green-600 text-white font-semibold hover:bg-naija-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Submit Application'}
      </button>
    </form>
  )
}