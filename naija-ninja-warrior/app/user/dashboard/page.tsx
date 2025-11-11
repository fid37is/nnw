'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { LogOut, FileText, Upload, Clock, CheckCircle, XCircle } from 'lucide-react'

interface Application {
  id: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  submission_date: string
  season_id: string
  video_url: string | null
  photo_url: string | null
}

interface User {
  id: string
  email: string
  full_name: string
  phone: string
}

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          window.location.href = '/login'
          return
        }

        // Get user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (userError) throw userError

        setUser(userData)

        // Get application data
        const { data: appData, error: appError } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (appError && appError.code !== 'PGRST116') {
          throw appError
        }

        if (appData) {
          setApplication(appData)
        }
      } catch (err) {
        setError('Failed to load dashboard')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} />
      case 'rejected':
        return <XCircle size={20} />
      case 'under_review':
        return <Clock size={20} />
      default:
        return <FileText size={20} />
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
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-naija-green-600 transition font-semibold"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl md:text-4xl font-bold text-naija-green-900 mb-1">
            Welcome, {user?.full_name}! 👋
          </h1>
          <p className="text-sm md:text-base text-gray-600">Manage your application</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-naija-green-100 p-4 mb-6">
          <h2 className="text-base font-bold text-naija-green-900 mb-3">Your Profile</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Email:</span>
              <span className="font-semibold">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Phone:</span>
              <span className="font-semibold">{user?.phone || '—'}</span>
            </div>
          </div>
          <div className="flex justify-end">
            <Link
              href="/user/profile"
              className="px-3 py-2 bg-naija-green-100 text-naija-green-700 rounded-lg text-sm font-semibold hover:bg-naija-green-200 transition"
            >
              Edit Profile
            </Link>
          </div>
        </div>
       
        {/* Application Status */}
        {application ? (
          <div className="space-y-6">
            {/* Status Card */}
          <div className="bg-white rounded-2xl shadow-md border border-naija-green-100 p-6">
              <h2 className="text-lg font-bold text-naija-green-900 mb-4">Application Status</h2>
              <div className={`flex items-center gap-4 p-4 rounded-lg border-2 ${getStatusColor(application.status)}`}>
                {getStatusIcon(application.status)}
                <div>
                  <p className="font-semibold capitalize">{application.status.replace('_', ' ')}</p>
                  <p className="text-sm">
                    Submitted on {new Date(application.submission_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Status Details */}
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Video Uploaded:</span>
                  <span className="font-semibold">
                    {application.video_url ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Photo Uploaded:</span>
                  <span className="font-semibold">
                    {application.photo_url ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {application.status === 'pending' || !application.video_url || !application.photo_url ? (
              <div className="grid grid-cols-1 gap-3 mt-4">
                <Link
                  href={`/user/application/${application.id}`}
                  className="flex items-center justify-center gap-2 bg-naija-green-600 text-white rounded-lg py-3 px-4 hover:bg-naija-green-700 transition font-semibold text-sm"
                >
                  <Upload size={18} />
                  Upload Media
                </Link>
                <Link
                  href="/user/profile"
                  className="flex items-center justify-center gap-2 bg-naija-green-100 text-naija-green-700 rounded-lg py-3 px-4 hover:bg-naija-green-200 transition font-semibold text-sm"
                >
                  <FileText size={18} />
                  View Details
                </Link>
              </div>
            ) : (
              <div className="bg-naija-green-50 border-2 border-naija-green-200 rounded-lg p-3 text-center mt-4">
                <p className="text-naija-green-900 font-semibold text-sm">
                  ✓ Application complete! Under review.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-naija-green-100 p-6 text-center">
            <div className="inline-block w-14 h-14 bg-naija-green-100 rounded-full items-center justify-center mb-3">
              <span className="text-2xl">📝</span>
            </div>
            <h2 className="text-lg font-bold text-naija-green-900 mb-2">No Application Yet</h2>
            <p className="text-sm text-gray-600 mb-4">Start your journey to become a Naija Ninja Warrior!</p>
            <Link
              href="/user/application/new"
              className="inline-block px-5 py-2 bg-naija-green-600 text-white rounded-lg text-sm font-semibold hover:bg-naija-green-700 transition"
            >
              Create Application
            </Link>
          </div>
        )}

        {/* Next Steps */}
        <div className="mt-8 bg-naija-green-50 border border-naija-green-200 rounded-lg p-4">
          <h3 className="font-bold text-naija-green-900 text-sm mb-3">📋 Application Checklist</h3>
          <ul className="space-y-2 text-xs text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-4 text-center font-bold">{application?.photo_url ? '✓' : '○'}</span>
              Profile Photo
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 text-center font-bold">{application?.video_url ? '✓' : '○'}</span>
              3-5 Min Video
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 text-center font-bold">{application?.status === 'under_review' || application?.status === 'approved' ? '✓' : '○'}</span>
              Under Review
            </li>
            <li className="flex items-center gap-2">
              <span className="w-4 text-center font-bold">{application?.status === 'approved' ? '✓' : '○'}</span>
              Approved
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}