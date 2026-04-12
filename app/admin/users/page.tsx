'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Users, Search, Filter, Download, X } from 'lucide-react'

interface User {
  id: string
  email: string
  full_name: string
  phone: string
  role: string
  created_at: string
  application_count: number
  approved_count: number
}

export default function UsersPage() {
  const [users, setUsers]               = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading]           = useState(true)
  const [searchTerm, setSearchTerm]     = useState('')
  const [roleFilter, setRoleFilter]     = useState<'all' | 'user' | 'admin'>('all')

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/login'; return }
      const { data: u } = await supabase.from('users').select('role').eq('id', session.user.id).single()
      if (u?.role !== 'admin') { window.location.href = '/user/dashboard'; return }
    }
    checkAuth()
  }, [])

  useEffect(() => { loadUsers() }, [])

  useEffect(() => {
    let filtered = users
    if (roleFilter !== 'all') filtered = filtered.filter(u => u.role === roleFilter)
    if (searchTerm) {
      const s = searchTerm.toLowerCase()
      filtered = filtered.filter(u =>
        u.full_name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.phone.includes(searchTerm)
      )
    }
    setFilteredUsers(filtered)
  }, [users, roleFilter, searchTerm])

  const loadUsers = async () => {
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users').select('*').order('created_at', { ascending: false })
      if (usersError) throw usersError

      const { data: appsData, error: appsError } = await supabase
        .from('applications').select('user_id, status')
      if (appsError) throw appsError

      const appCounts: { [key: string]: { total: number; approved: number } } = {}
      ;(appsData || []).forEach(app => {
        if (!appCounts[app.user_id]) appCounts[app.user_id] = { total: 0, approved: 0 }
        appCounts[app.user_id].total++
        if (app.status === 'approved') appCounts[app.user_id].approved++
      })

      const usersWithCounts = (usersData || []).map(user => ({
        ...user,
        application_count: appCounts[user.id]?.total || 0,
        approved_count:    appCounts[user.id]?.approved || 0,
      }))

      setUsers(usersWithCounts as User[])
      setFilteredUsers(usersWithCounts as User[])
    } catch (err) {
      toast.error('Failed to load users')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const downloadUsersList = () => {
    if (filteredUsers.length === 0) { toast.error('No users to export'); return }
    const headers = ['Name', 'Email', 'Phone', 'Role', 'Joined', 'Applications', 'Approved']
    const rows = filteredUsers.map(u => [
      u.full_name, u.email, u.phone, u.role.toUpperCase(),
      new Date(u.created_at).toLocaleDateString(),
      u.application_count, u.approved_count,
    ])
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success(`Exported ${filteredUsers.length} users`)
  }

  const stats = {
    total:            users.length,
    admins:           users.filter(u => u.role === 'admin').length,
    regularUsers:     users.filter(u => u.role === 'user').length,
    withApplications: users.filter(u => u.application_count > 0).length,
  }

  const hasFilters = searchTerm || roleFilter !== 'all'

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-10 mx-auto">

          {/* ── Header ── */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-naija-green-900">Users Management</h1>
              <p className="text-sm text-gray-500 mt-0.5">All users in the system</p>
            </div>
            <button
              onClick={downloadUsersList}
              className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold text-sm flex-shrink-0"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">CSV</span>
            </button>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total Users',        value: stats.total,            color: 'text-naija-green-900' },
              { label: 'Admins',             value: stats.admins,           color: 'text-blue-600' },
              { label: 'Regular Users',      value: stats.regularUsers,     color: 'text-green-600' },
              { label: 'With Applications',  value: stats.withApplications, color: 'text-orange-600' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <p className="text-xs text-gray-500 font-semibold mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* ── Filters ── */}
          <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Search */}
              <div className="sm:col-span-2">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Name, email or phone..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <select
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Users</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>

            {hasFilters && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Showing <span className="font-semibold text-gray-800">{filteredUsers.length}</span> of {users.length} users
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setRoleFilter('all') }}
                  className="flex items-center gap-1 text-xs text-naija-green-600 hover:text-naija-green-700 font-semibold"
                >
                  <X size={12} /> Clear
                </button>
              </div>
            )}
          </div>

          {/* ── Table / Empty state ── */}
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Users size={32} className="mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 font-semibold">No users found</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {['Name', 'Email', 'Phone', 'Role', 'Joined', 'Apps', 'Approved'].map(h => (
                          <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 transition">
                          <td className="px-5 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{user.full_name}</td>
                          <td className="px-5 py-3 text-sm text-gray-500 max-w-[200px] truncate">{user.email}</td>
                          <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">{user.phone || '—'}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {user.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-3 text-sm font-semibold text-gray-900 text-center">{user.application_count}</td>
                          <td className="px-5 py-3 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              user.approved_count > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {user.approved_count}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden space-y-3">
                {filteredUsers.map(user => (
                  <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{user.full_name}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                        user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-500 border-t border-gray-100 pt-3">
                      <div>
                        <span className="text-gray-400">Phone</span>
                        <p className="font-medium text-gray-700 mt-0.5">{user.phone || '—'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Joined</span>
                        <p className="font-medium text-gray-700 mt-0.5">{new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Applications</span>
                        <p className="font-semibold text-gray-900 mt-0.5">{user.application_count}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Approved</span>
                        <p className={`font-semibold mt-0.5 ${user.approved_count > 0 ? 'text-green-700' : 'text-gray-500'}`}>
                          {user.approved_count}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}