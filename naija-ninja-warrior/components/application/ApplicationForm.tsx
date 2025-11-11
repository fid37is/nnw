'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Upload, X } from 'lucide-react'

interface ApplicationFormProps {
  userId: string
  seasonId: string  // ADD THIS
  applicationId?: string
  onSuccess?: () => void
}

export default function ApplicationForm({
  userId,
  seasonId,  // ADD THIS
  applicationId,
  onSuccess,
}: ApplicationFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string>('')
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const videoInputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file')
      return
    }

    // Validate file size (max 500MB)
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    // Validate file size (max 10MB)
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

    if (!videoFile) {
      toast.error('Please upload a video')
      return
    }

    if (!photoFile) {
      toast.error('Please upload a profile photo')
      return
    }

    setUploading(true)
    try {
      // Upload video
      const videoUrl = await uploadFile(videoFile, 'videos')
      toast.loading('Uploading photo...')

      // Upload photo
      const photoUrl = await uploadFile(photoFile, 'photos')
      toast.dismiss()

      // Create or update application
      if (applicationId) {
        const { error } = await supabase
          .from('applications')
          .update({
            video_url: videoUrl,
            photo_url: photoUrl,
          })
          .eq('id', applicationId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('applications')
          .insert({
            user_id: userId,
            season_id: seasonId,  // ADD THIS
            video_url: videoUrl,
            photo_url: photoUrl,
            status: 'pending',
          })

        if (error) throw error
      }

      toast.success('Application submitted successfully!')
      onSuccess?.()
    } catch (err) {
      console.error(err)
      toast.error('Failed to upload files. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Video Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Video Upload (3-5 minutes)
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
              className="absolute top-2 right-2 bg-naija-red text-white p-2 rounded-full hover:bg-red-600 transition"
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
              className="absolute top-2 right-2 bg-naija-red text-white p-2 rounded-full hover:bg-red-600 transition"
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