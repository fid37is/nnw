'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Users, CheckCircle, Clock, XCircle, Filter } from 'lucide-react'

interface UserData {
  full_name: string
  email: string
  phone: string
}

interface Application {
  id: string
  user_id: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  submission_date: string
  users: UserData[]
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'under_review' | 'approved' | 'rejected'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkUpdating, setBulkUpdating] = useState(false)

  useEffect(() => {
    checkAuthAndLoadApplications()
  }, [])

  useEffect(() => {
    let filtered = applications

    if (filter !== 'all') {
      filtered = filtered.filter(app => app.status === filter)
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
  }, [filter, searchTerm, applications])

  const checkAuthAndLoadApplications = async () => {
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

      const { data: appsData } = await supabase
        .from('applications')
        .select(`
          id,
          user_id,
          status,
          submission_date,
          users (
            full_name,
            email,
            phone
          )
        `)
        .order('submission_date', { ascending: false })

      if (appsData) {
        setApplications(appsData as Application[])
        setFilteredApplications(appsData as Application[])
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = () => {
    if (selectedIds.size === filteredApplications.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredApplications.map(app => app.id)))
    }
  }

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) {
      toast.error('No applications selected')
      return
    }

    setBulkUpdating(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        toast.error('Session expired')
        return
      }

      const { error } = await supabase
        .from('applications')
        .update({
          status: 'approved',
          reviewed_by_admin: session.user.id,
          reviewed_at: new Date().toISOString(),
        })
        .in('id', Array.from(selectedIds))

      if (error) throw error

      for (const appId of selectedIds) {
        const app = applications.find(a => a.id === appId)
        if (app && app.users[0]) {
          await fetch('/api/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: app.users[0].email,
              subject: 'Your Naija Ninja Warrior Application is Approved! 🎉',
              html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><h2>Congratulations ${app.users[0].full_name}!</h2><p>Your application has been <strong>APPROVED</strong>.</p></div>`,
            }),
          })
        }
      }

      toast.success(`${selectedIds.size} applications approved!`)
      setSelectedIds(new Set())
      await checkAuthAndLoadApplications()
    } catch (err) {
      toast.error('Failed to approve applications')
    } finally {
      setBulkUpdating(false)
    }
  }

  const handleBulkReject = async () => {
    if (selectedIds.size === 0) {
      toast.error('No applications selected')
      return
    }

    setBulkUpdating(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        toast.error('Session expired')
        return
      }

      const { error } = await supabase
        .from('applications')
        .update({
          status: 'rejected',
          reviewed_by_admin: session.user.id,
          reviewed_at: new Date().toISOString(),
        })
        .in('id', Array.from(selectedIds))

      if (error) throw error

      for (const appId of selectedIds) {
        const app = applications.find(a => a.id === appId)
        if (app && app.users[0]) {
          await fetch('/api/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: app.users[0].email,
              subject: 'Naija Ninja Warrior Application Update',
              html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"><p>Hi ${app.users[0].full_name},</p><p>Thank you for your application. We regret to inform you it was not selected this season.</p></div>`,
            }),
          })
        }
      }

      toast.success(`${selectedIds.size} applications rejected!`)
      setSelectedIds(new Set())
      await checkAuthAndLoadApplications()
    } catch (err) {
      toast.error('Failed to reject applications')
    } finally {
      setBulkUpdating(false)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} />
      case 'rejected':
        return <XCircle size={16} />
      case 'under_review':
        return <Clock size={16} />
      default:
        return <Clock size={16} />
    }
  }

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    underReview: applications.filter(a => a.status === 'under_review').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
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
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-naija-green-900 mb-2">Applications Dashboard</h1>
            <p className="text-gray-600">Review and approve applicant submissions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4 mb-8">
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                  <Filter size={16} />
                  Filter by Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'pending', 'under_review', 'approved', 'rejected'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                        filter === status
                          ? 'bg-naija-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-3">
            {filteredApplications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Users size={32} className="mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 font-semibold">No applications found</p>
              </div>
            ) : (
              <>
                {/* Selection Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredApplications.length && filteredApplications.length > 0}
                      onChange={handleSelectAll}
                      className="w-5 h-5 rounded border-gray-300 text-naija-green-600 cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {selectedIds.size > 0 ? `${selectedIds.size} Selected` : 'Select All'}
                    </span>
                  </div>
                  {selectedIds.size > 0 && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedIds(new Set())}
                        className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded transition"
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleBulkReject}
                        disabled={bulkUpdating}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-semibold"
                      >
                        Reject ({selectedIds.size})
                      </button>
                      <button
                        onClick={handleBulkApprove}
                        disabled={bulkUpdating}
                        className="px-4 py-2 bg-naija-green-600 text-white text-sm rounded-lg hover:bg-naija-green-700 transition disabled:opacity-50 font-semibold"
                      >
                        Approve ({selectedIds.size})
                      </button>
                    </div>
                  )}
                </div>

                {/* Application Rows */}
                {filteredApplications.map(app => (
                  <div
                    key={app.id}
                    className={`bg-white rounded-lg shadow-sm border p-4 flex items-center gap-4 hover:shadow-md hover:border-naija-green-200 transition cursor-pointer ${
                      selectedIds.has(app.id) ? 'border-naija-green-600 bg-naija-green-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleSelectOne(app.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(app.id)}
                      onChange={() => handleSelectOne(app.id)}
                      onClick={e => e.stopPropagation()}
                      className="w-5 h-5 rounded border-gray-300 text-naija-green-600 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0" onClick={e => e.stopPropagation()}>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                            {app.users[0]?.full_name || 'N/A'}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600 truncate">{app.users[0]?.email || 'N/A'}</p>
                        </div>
                        <div className="hidden md:block text-sm text-gray-600">
                          {new Date(app.submission_date).toLocaleDateString()}
                        </div>
                        <div className="hidden md:block text-sm text-gray-600">
                          Phone: {app.users[0]?.phone || 'N/A'}
                        </div>
                        <div className="flex items-center justify-end">
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(app.status)}`}>
                            {getStatusIcon(app.status)}
                            <span>{app.status.replace('_', ' ').toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}