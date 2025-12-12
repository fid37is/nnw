'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AllApplicationsTab from '@/components/admin/AllApplicationsTab'
import { Eye, Search, Loader2, Calendar, Users, FileText, CheckCircle, AlertTriangle } from 'lucide-react'

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
  is_accepted: boolean
  payment_status: 'unpaid' | 'pending' | 'confirmed'
  is_participant: boolean
  is_eliminated: boolean
  accepted_date: string | null
}

interface Application extends ApplicationRow {
  users: UserData[]
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [selectedApps, setSelectedApps] = useState<string[]>([])
  const [bulkApproving, setBulkApproving] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [activeTab, setActiveTab] = useState<'all' | 'participants'>('all')

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
    // Filter applications based on active tab
    let baseApplications = applications
    
    if (activeTab === 'participants') {
      // Only show participants (those whose payment has been confirmed)
      baseApplications = applications.filter(app => app.is_participant)
    }

    let filtered = baseApplications

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
    setCurrentPage(1)
  }, [applications, stateFilter, searchTerm, activeTab])

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

      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select('id, user_id, status, submission_date, age, state, season_id, is_accepted, payment_status, is_participant, is_eliminated, accepted_date')
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

  // Stats for participants tab
  const participantStats = {
    total: applications.filter(a => a.is_participant).length,
    notApproved: applications.filter(a => a.is_participant && a.status !== 'approved').length,
    approved: applications.filter(a => a.is_participant && a.status === 'approved' && !a.is_eliminated).length,
    eliminated: applications.filter(a => a.is_participant && a.is_eliminated).length,
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

  const handleBulkApprove = async () => {
    if (selectedApps.length === 0) {
      toast.error('Please select participants')
      return
    }

    // Filter out already approved or eliminated participants
    const participantsToApprove = applications.filter(
      app => selectedApps.includes(app.id) && app.is_participant && 
      app.status !== 'approved' && !app.is_eliminated
    )

    if (participantsToApprove.length === 0) {
      toast.error('Selected participants are already approved or have been eliminated')
      return
    }

    setBulkApproving(true)
    try {
      const { error: updateError } = await supabase
        .from('applications')
        .update({ status: 'approved' })
        .in('id', participantsToApprove.map(p => p.id))

      if (updateError) throw updateError

      toast.success(
        `${participantsToApprove.length} participant(s) approved! Go to Messaging Center to send approval notifications using templates.`,
        { duration: 6000 }
      )
      setSelectedApps([])
      loadApplications()
    } catch (err) {
      console.error('Error approving participants:', err)
      toast.error('Failed to approve participants')
    } finally {
      setBulkApproving(false)
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
            <h1 className="text-3xl font-bold text-naija-green-900 mb-2">Application Management</h1>
            <p className="text-gray-600">Review applications and manage participants</p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 font-semibold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'text-naija-green-700 border-b-2 border-naija-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText size={18} />
              All Applications
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'all' ? 'bg-naija-green-100 text-naija-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {applications.filter(a => !a.is_participant).length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`px-6 py-3 font-semibold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'participants'
                  ? 'text-naija-green-700 border-b-2 border-naija-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users size={18} />
              All Participants
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'participants' ? 'bg-naija-green-100 text-naija-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {applications.filter(a => a.is_participant).length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'all' ? (
            <AllApplicationsTab applications={applications} onRefresh={loadApplications} />
          ) : (
            <>
              {/* Stats Cards for Participants */}
              <div className="grid grid-cols-4 gap-3 md:gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <p className="text-xs text-gray-600 mb-1 font-semibold">Total Participants</p>
                  <p className="text-2xl font-bold text-naija-green-900">{participantStats.total}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-4">
                  <p className="text-xs text-gray-600 mb-1 font-semibold">Awaiting Approval</p>
                  <p className="text-2xl font-bold text-orange-600">{participantStats.notApproved}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4">
                  <p className="text-xs text-gray-600 mb-1 font-semibold">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{participantStats.approved}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
                  <p className="text-xs text-gray-600 mb-1 font-semibold">Eliminated</p>
                  <p className="text-2xl font-bold text-red-600">{participantStats.eliminated}</p>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No participants found
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || stateFilter
                      ? 'Try adjusting your filters'
                      : 'No participants have completed payment yet'}
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
                            onClick={handleBulkApprove}
                            disabled={bulkApproving}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition flex items-center gap-2"
                          >
                            {bulkApproving ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Approving...
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} />
                                Approve Selected
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">{filteredApplications.length}</span> Total
                      </p>
                    </div>
                  </div>

                  {/* Participants List */}
                  <div>
                    {currentPageApps.map((app) => (
                      <ParticipantCard
                        key={app.id}
                        application={app}
                        isSelected={selectedApps.includes(app.id)}
                        onToggleSelect={() => toggleSelectApp(app.id)}
                        onRefresh={loadApplications}
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
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function ParticipantCard({
  application,
  isSelected,
  onToggleSelect,
  onRefresh,
}: {
  application: Application
  isSelected: boolean
  onToggleSelect: () => void
  onRefresh: () => void
}) {
  const [isHovering, setIsHovering] = useState(false)
  const [approving, setApproving] = useState(false)

  const handleApprove = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (application.status === 'approved' || application.is_eliminated) {
      toast.info(application.is_eliminated
        ? 'This participant has been eliminated from competition'
        : 'This participant is already approved')
      return
    }

    setApproving(true)
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'approved' })
        .eq('id', application.id)

      if (error) throw error

      toast.success('Participant approved! Go to Messaging Center to send approval notification using templates.')
      onRefresh()
    } catch (err) {
      console.error('Error approving participant:', err)
      toast.error('Failed to approve participant')
    } finally {
      setApproving(false)
    }
  }

  return (
    <div className="relative">
      <div
        className={`relative border rounded-lg transition-all pl-12 p-4 mb-2 ${
          isSelected
            ? 'bg-naija-green-50 border-naija-green-500'
            : isHovering
              ? 'bg-gray-50 border-gray-300'
              : 'bg-white border-gray-200'
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
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

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {application.users[0]?.full_name || 'N/A'}
            </h3>
          </div>

          <div className="min-w-0">
            <p className="text-sm text-gray-600 truncate">
              {application.users[0]?.email || 'N/A'}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">{application.age} years</p>
          </div>

          <div className="min-w-0">
            <p className="text-sm text-gray-600 truncate">{application.state}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{new Date(application.submission_date).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            {application.is_eliminated ? (
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 flex items-center gap-1 whitespace-nowrap">
                <AlertTriangle size={14} />
                Eliminated
              </span>
            ) : application.status === 'approved' ? (
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center gap-1 whitespace-nowrap">
                <CheckCircle size={14} />
                Approved
              </span>
            ) : (
              <button
                onClick={handleApprove}
                disabled={approving}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-xs whitespace-nowrap disabled:opacity-50"
              >
                {approving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} />
                    Approve
                  </>
                )}
              </button>
            )}

            <a
              href={`/admin/applications/${application.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-naija-green-100 text-naija-green-700 rounded-lg hover:bg-naija-green-200 transition font-semibold text-xs whitespace-nowrap"
            >
              <Eye size={14} />
              Review
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}