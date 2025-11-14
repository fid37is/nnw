'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import ApplicationForm from '@/components/application/ApplicationForm'
import { ArrowLeft } from 'lucide-react'

export default function ApplicationPage() {
  const [userId, setUserId] = useState<string>('')
  const [applicationId, setApplicationId] = useState<string>('')
  const [activeSeason, setActiveSeason] = useState<string | null>(null)
  const [applicationOpen, setApplicationOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          window.location.href = '/login'
          return
        }

        setUserId(session.user.id)

        // Fetch active season and check application window
        const { data: seasonData } = await supabase
          .from('seasons')
          .select('id, application_start_date, application_end_date')
          .eq('status', 'active')
          .single()

        if (seasonData) {
          setActiveSeason(seasonData.id)
          
          // Check if application window is open
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          
          const startDate = new Date(seasonData.application_start_date)
          startDate.setHours(0, 0, 0, 0)
          
          const endDate = new Date(seasonData.application_end_date)
          endDate.setHours(23, 59, 59, 999)
          
          const isOpen = today >= startDate && today <= endDate
          setApplicationOpen(isOpen)
        }

        // Check if user has existing application
        const { data: appData } = await supabase
          .from('applications')
          .select('id')
          .eq('user_id', session.user.id)
          .single()

        if (appData) {
          setApplicationId(appData.id)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-12 h-12 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-naija-green-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-naija-green-600 to-naija-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">NNW</span>
            </div>
            <span className="font-bold text-lg text-naija-green-900">Naija Ninja</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-12">
        {/* Back Button */}
        <Link
          href="/user/dashboard"
          className="inline-flex items-center gap-2 text-naija-green-600 hover:text-naija-green-700 font-semibold mb-6 transition"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-naija-green-900 mb-2">
            {applicationId ? 'Update Your Application' : 'Submit Your Application'}
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Upload your video and profile photo to complete your application
          </p>
        </div>

        {/* Guidelines Card */}
        <div className="bg-naija-green-50 border border-naija-green-200 rounded-lg p-4 mb-8">
          <h2 className="font-bold text-naija-green-900 text-sm mb-3">📋 Video Guidelines</h2>
          <ul className="space-y-2 text-xs text-gray-700">
            <li className="flex gap-2">
              <span>✓</span>
              <span>Duration: 2-3 minutes</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Show full body in good lighting</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Demonstrate your physical fitness</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Clear audio and video quality</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Introduce yourself and your goals</span>
            </li>
          </ul>
        </div>

        {/* Form Card */}
        {!activeSeason ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 font-semibold">
              No active season available. Applications are currently closed.
            </p>
            <p className="text-sm text-yellow-700 mt-2">
              Please check back later when a new season opens.
            </p>
          </div>
        ) : !applicationOpen ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 font-semibold">
              Application window is currently closed.
            </p>
            <p className="text-sm text-yellow-700 mt-2">
              Applications are not being accepted at this time. Please check back during the application period.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-naija-green-100 p-6">
            <ApplicationForm
              userId={userId}
              applicationId={applicationId}
              seasonId={activeSeason}
              onSuccess={() => {
                toast.success('Application updated!')
                setTimeout(() => {
                  window.location.href = '/user/dashboard'
                }, 2000)
              }}
            />
          </div>
        )}
      </div>
    </main>
  )
}