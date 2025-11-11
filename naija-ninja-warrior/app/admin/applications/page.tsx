'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Eye, Filter, Search } from 'lucide-react'

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
  age: number
  state: string
  users: UserData[]
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'under_review' | 'approved' | 'rejected'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [stateFilter, setStateFilter] = useState('')

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

      const { data: appsData, error } = await supabase
        .from('applications')
        .select(`
          id,
          user_id,
          status,
          submission_date,
          age,
          state,
          users (
            full_name,
            email,
            phone
          )
        `)
        .order('submission_date', { ascending: false })

      if (error) throw error

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
            <h1 className="text-3xl font-bold text-naija-green-900 mb-2">All Applications</h1>
            <p className="text-gray-600">Browse and review all applicant submissions</p>
          </div>

          {/* Stats */}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                  <Search size={16} />
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Name or email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                />
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

          {/* Applications Table */}
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600 font-semibold">No applications found</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Age</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">State</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Submitted</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredApplications.map(app => (
                      <tr key={app.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                          {app.users[0]?.full_name || 'N/A'}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {app.users[0]?.email || 'N/A'}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-900 font-semibold">
                          {app.age}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {app.state}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {new Date(app.submission_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                            {app.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <Link
                            href={`/admin/applications/${app.id}`}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-naija-green-100 text-naija-green-700 rounded-lg hover:bg-naija-green-200 transition font-semibold"
                          >
                            <Eye size={16} />
                            Review
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}