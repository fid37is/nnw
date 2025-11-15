'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Eye, Search, Loader2, Calendar, MapPin, User, Mail } from 'lucide-react'

interface UserData {
  full_name: string
  email: string
  phone: string
}

interface ApplicationRow {
  id: string
  user_id: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  submission_date: string
  age: number
  state: string
  season_id: string
}

interface Application extends ApplicationRow {
  users: UserData[]
}

interface MessageTemplate {
  id: string
  name: string
  title: string
  content: string
  template_type: 'approval' | 'rejection' | 'general'
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'under_review' | 'approved' | 'rejected'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [selectedApps, setSelectedApps] = useState<string[]>([])
  const [bulkActioning, setBulkActioning] = useState<{ [key: string]: boolean }>({})
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [currentSeason, setCurrentSeason] = useState<{ id: string; name: string; year: number } | null>(null)

  const states = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
    'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
    'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
    'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ]

  useEffect(() => {
    loadApplications()
  }, [])

  useEffect(() => {
    let filtered = applications

    if (filter !== 'all') {
      filtered = filtered.filter(app => app.status === filter)
    }

    if (stateFilter) {
      filtered = filtered.filter(app => app.state === stateFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(app => {
        const user = app.users[0]
        return (
          user?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }

    setFilteredApplications(filtered)
  }, [applications, filter, stateFilter, searchTerm])

  const loadApplications = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        window.location.href = '/login'
        return
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (userError) {
        console.error('Error fetching user role:', userError)
        toast.error('Failed to verify admin access')
        window.location.href = '/login'
        return
      }

      if (userData?.role !== 'admin') {
        toast.error('Unauthorized access')
        window.location.href = '/user/dashboard'
        return
      }

      // Load templates
      const { data: templatesData } = await supabase
        .from('message_templates')
        .select('*')

      setTemplates(templatesData || [])

      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select('id, user_id, status, submission_date, age, state, season_id')
        .order('submission_date', { ascending: false })

      if (appsError) {
        console.error('Error fetching applications:', appsError)
        throw appsError
      }

      if (!appsData || appsData.length === 0) {
        setApplications([])
        setFilteredApplications([])
        setLoading(false)
        return
      }

      const userIds = [...new Set(appsData.map((app: ApplicationRow) => app.user_id))]
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, full_name, email, phone')
        .in('id', userIds)

      if (usersError) {
        console.error('Error fetching users:', usersError)
        throw usersError
      }

      const usersMap = new Map()
      usersData?.forEach((user: any) => {
        usersMap.set(user.id, user)
      })

      const combinedData: Application[] = appsData.map((app: ApplicationRow) => ({
        ...app,
        users: usersMap.has(app.user_id) ? [usersMap.get(app.user_id)] : []
      }))

      setApplications(combinedData)
      setFilteredApplications(combinedData)
    } catch (err) {
      console.error('Error loading applications:', err)
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    underReview: applications.filter(a => a.status === 'under_review').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }

  const toggleSelectApp = (appId: string) => {
    setSelectedApps(prev =>
      prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    )
  }

  const toggleSelectAll = () => {
    const currentPageApps = filteredApplications.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
    
    if (selectedApps.length === currentPageApps.length && currentPageApps.length > 0) {
      setSelectedApps([])
    } else {
      setSelectedApps(currentPageApps.map(app => app.id))
    }
  }

  const handleBulkMarkUnderReview = async () => {
    if (selectedApps.length === 0) {
      toast.error('Please select applications')
      return
    }

    setBulkActioning(prev => ({ ...prev, review: true }))
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'under_review' })
        .in('id', selectedApps)

      if (error) throw error

      toast.success(`${selectedApps.length} application(s) marked as under review`)
      setSelectedApps([])
      loadApplications()
    } catch (err) {
      console.error('Error updating applications:', err)
      toast.error('Failed to update applications')
    } finally {
      setBulkActioning(prev => ({ ...prev, review: false }))
    }
  }

  const handleBulkApprove = async () => {
    if (selectedApps.length === 0) {
      toast.error('Please select applications')
      return
    }

    setBulkActioning(prev => ({ ...prev, approve: true }))
    try {
      const { error: updateError } = await supabase
        .from('applications')
        .update({ status: 'approved' })
        .in('id', selectedApps)

      if (updateError) throw updateError

      toast.success(`${selectedApps.length} application(s) approved. Send notification from Messaging page.`)
      setSelectedApps([])
      loadApplications()
    } catch (err) {
      console.error('Error approving applications:', err)
      toast.error('Failed to approve applications')
    } finally {
      setBulkActioning(prev => ({ ...prev, approve: false }))
    }
  }

  const handleBulkReject = async () => {
    if (selectedApps.length === 0) {
      toast.error('Please select applications')
      return
    }

    setBulkActioning(prev => ({ ...prev, reject: true }))
    try {
      const { error: updateError } = await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .in('id', selectedApps)

      if (updateError) throw updateError

      toast.success(`${selectedApps.length} application(s) rejected. Send notification from Messaging page.`)
      setSelectedApps([])
      loadApplications()
    } catch (err) {
      console.error('Error rejecting applications:', err)
      toast.error('Failed to reject applications')
    } finally {
      setBulkActioning(prev => ({ ...prev, reject: false }))
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

  const currentPageApps = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const isAllSelected = selectedApps.length === currentPageApps.length && currentPageApps.length > 0

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-naija-green-900 mb-2">All Applications</h1>
            <p className="text-gray-600">Browse and review all applicant submissions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-xs text-gray-600 mb-1 font-semibold">Total</p>
              <p className="text-2xl font-bold text-naija-green-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
              <p className="text-xs text-gray-600 mb-1 font-semibold">Pending</p>
              <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-4">
              <p className="text-xs text-gray-600 mb-1 font-semibold">Under Review</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.underReview}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4">
              <p className="text-xs text-gray-600 mb-1 font-semibold">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
              <p className="text-xs text-gray-600 mb-1 font-semibold">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Name or email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <select
                  value={stateFilter}
                  onChange={e => setStateFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                >
                  <option value="">All States</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setFilter('all')
                    setStateFilter('')
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No applications found
              </h3>
              <p className="text-gray-600">
                {searchTerm || filter !== 'all' || stateFilter
                  ? 'Try adjusting your filters'
                  : 'No applications have been submitted yet'}
              </p>
            </div>
          ) : (
            <>
              {/* Selection Toolbar */}
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-4">
                  {currentPageApps.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div
                        onClick={toggleSelectAll}
                        className={`w-5 h-5 rounded border-2 cursor-pointer transition-all flex items-center justify-center ${
                          isAllSelected ? 'bg-naija-green-600 border-naija-green-600' : 'border-gray-300 hover:border-naija-green-400'
                        }`}
                      >
                        {isAllSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">Select All</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {selectedApps.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm font-semibold text-gray-900 flex items-center">
                        {selectedApps.length} selected
                      </span>
                      <button
                        onClick={handleBulkMarkUnderReview}
                        disabled={bulkActioning.review}
                        className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg text-xs font-semibold hover:bg-yellow-700 disabled:opacity-50 transition flex items-center gap-1"
                      >
                        {bulkActioning.review && <Loader2 size={14} className="animate-spin" />}
                        Under Review
                      </button>
                      <button
                        onClick={handleBulkApprove}
                        disabled={bulkActioning.approve}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 disabled:opacity-50 transition flex items-center gap-1"
                      >
                        {bulkActioning.approve && <Loader2 size={14} className="animate-spin" />}
                        Approve
                      </button>
                      <button
                        onClick={handleBulkReject}
                        disabled={bulkActioning.reject}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 disabled:opacity-50 transition flex items-center gap-1"
                      >
                        {bulkActioning.reject && <Loader2 size={14} className="animate-spin" />}
                        Reject
                      </button>
                    </div>
                  )}

                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{filteredApplications.length}</span> Total
                  </p>
                </div>
              </div>

              {/* Applications List */}
              <div>
                {currentPageApps.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    isSelected={selectedApps.includes(app.id)}
                    onToggleSelect={() => toggleSelectApp(app.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {Math.ceil(filteredApplications.length / itemsPerPage) > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.ceil(filteredApplications.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-naija-green-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredApplications.length / itemsPerPage)))}
                    disabled={currentPage === Math.ceil(filteredApplications.length / itemsPerPage)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function ApplicationCard({
  application,
  isSelected,
  onToggleSelect,
}: {
  application: Application
  isSelected: boolean
  onToggleSelect: () => void
}) {
  const [isHovering, setIsHovering] = useState(false)

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <Link href={`/admin/applications/${application.id}`}>
      <div className="relative">
        <div
          className={`relative border rounded-lg transition-all pl-12 p-4 ${
            isSelected
              ? 'bg-naija-green-50 border-naija-green-500'
              : isHovering
                ? 'bg-gray-50 border-gray-300'
                : 'bg-white border-gray-200'
          }`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Checkbox on Left Margin */}
          <div
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleSelect()
            }}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded border-2 cursor-pointer transition-all flex items-center justify-center ${
              isSelected ? 'bg-naija-green-600 border-naija-green-600' : 'border-gray-300 hover:border-naija-green-400'
            } ${isHovering || isSelected ? 'opacity-100' : 'opacity-0'}`}
          >
            {isSelected && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>

          {/* Application Details - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
            {/* Applicant Name */}
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {application.users[0]?.full_name || 'N/A'}
              </h3>
            </div>

            {/* Email */}
            <div className="min-w-0">
              <p className="text-sm text-gray-600 truncate">
                {application.users[0]?.email || 'N/A'}
              </p>
            </div>

            {/* Age */}
            <div>
              <p className="text-sm font-semibold text-gray-900">{application.age}</p>
            </div>

            {/* State */}
            <div className="min-w-0">
              <p className="text-sm text-gray-600 truncate">{application.state}</p>
            </div>

            {/* Submission Date */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{new Date(application.submission_date).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Status & Action */}
            <div className="flex items-center justify-end gap-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(
                  application.status
                )}`}
              >
                {application.status.replace('_', ' ').toUpperCase()}
              </span>

              <button
                onClick={(e) => {
                  e.preventDefault()
                  window.location.href = `/admin/applications/${application.id}`
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-naija-green-100 text-naija-green-700 rounded-lg hover:bg-naija-green-200 transition font-semibold text-xs whitespace-nowrap"
              >
                <Eye size={14} />
                Review
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-2" />
    </Link>
  )
}