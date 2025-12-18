'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import JobsManagement from '@/components/admin/JobsManagement'
import ApplicationsManagement from '@/components/admin/ApplicationsManagement'
import { Briefcase, Inbox, RefreshCw, Plus, Download } from 'lucide-react'

interface JobApplication {
  id: string
  job_id: string | null
  position: string
  position_id: string
  department: string
  full_name: string
  email: string
  phone: string
  location: string
  cover_letter: string
  linkedin_url: string | null
  portfolio_url: string | null
  years_experience: string | null
  resume_url: string
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
  created_at: string
  reviewed_at: string | null
  admin_notes: string | null
}

interface Job {
  id: string
  position_id: string
  title: string
  department: string
  category: string
  location: string
  job_type: string
  salary: string
  description: string
  requirements: string[]
  responsibilities: string[]
  is_active: boolean
  applications_count: number
  created_at: string
  updated_at: string
}

export default function AdminJobApplicationsPage() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<'applications' | 'jobs'>('applications')
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = '/login'
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (userData?.role !== 'admin') {
        toast.error('Unauthorized access')
        window.location.href = '/user/dashboard'
        return
      }

      // Load applications
      const { data: applicationsData, error: appsError } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (appsError) throw appsError
      setApplications(applicationsData || [])

      // Load jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (jobsError) throw jobsError
      setJobs(jobsData || [])

    } catch (err) {
      console.error('Error loading data:', err)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await loadData()
      toast.success('Data refreshed successfully')
    } catch (err) {
      console.error('Error refreshing:', err)
      toast.error('Failed to refresh data')
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full"></div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-naija-green-900 flex items-center gap-2 sm:gap-3">
                  <Briefcase size={28} className="sm:w-8 sm:h-8" />
                  Careers & Applications
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Manage job postings and review applications</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition disabled:opacity-50 text-sm sm:text-base"
                >
                  <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                  <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 sm:px-6 py-3 font-semibold border-b-2 transition whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'applications'
                  ? 'text-naija-green-600 border-naija-green-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Inbox size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Applications</span>
                <span className="sm:hidden">Apps</span>
                ({applications.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 sm:px-6 py-3 font-semibold border-b-2 transition whitespace-nowrap text-sm sm:text-base ${
                activeTab === 'jobs'
                  ? 'text-naija-green-600 border-naija-green-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Briefcase size={18} className="sm:w-5 sm:h-5" />
                Jobs ({jobs.length})
              </div>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'applications' ? (
            <ApplicationsManagement applications={applications} onApplicationsChange={loadData} />
          ) : (
            <JobsManagement jobs={jobs} onJobsChange={loadData} />
          )}
        </div>
      </main>
    </div>
  )
}