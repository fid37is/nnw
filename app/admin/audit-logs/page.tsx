'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Filter, Download } from 'lucide-react'

interface AuditLog {
  id: string
  admin_id: string
  application_id: string | null
  action: string
  details: string | null
  created_at: string
  admin_email: string
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filterAction, setFilterAction] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const actions = ['approved', 'rejected', 'under_review', 'comment_added', 'season_created', 'user_created']

  useEffect(() => {
    loadAuditLogs()
  }, [])

  useEffect(() => {
    let filtered = logs

    if (filterAction) {
      filtered = filtered.filter(log => log.action.includes(filterAction))
    }

    if (filterDateFrom) {
      filtered = filtered.filter(log => new Date(log.created_at) >= new Date(filterDateFrom))
    }

    if (filterDateTo) {
      const toDate = new Date(filterDateTo)
      toDate.setHours(23, 59, 59)
      filtered = filtered.filter(log => new Date(log.created_at) <= toDate)
    }

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.admin_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredLogs(filtered)
  }, [logs, filterAction, filterDateFrom, filterDateTo, searchTerm])

  const loadAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          id,
          admin_id,
          application_id,
          action,
          details,
          created_at,
          users (
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formatted = (data || []).map((log: any) => ({
        id: log.id,
        admin_id: log.admin_id,
        application_id: log.application_id,
        action: log.action,
        details: log.details,
        created_at: log.created_at,
        admin_email: log.users?.email || 'Unknown',
      }))

      setLogs(formatted)
      setFilteredLogs(formatted)
    } catch (err) {
      toast.error('Failed to load audit logs')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const downloadLogs = () => {
    if (filteredLogs.length === 0) {
      toast.error('No logs to export')
      return
    }

    const headers = ['Date', 'Admin Email', 'Action', 'Application ID', 'Details']
    const rows = filteredLogs.map(log => [
      new Date(log.created_at).toLocaleString(),
      log.admin_email,
      log.action,
      log.application_id || 'N/A',
      log.details || 'N/A',
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success(`Exported ${filteredLogs.length} logs`)
  }

  const getActionBadgeColor = (action: string) => {
    if (action.includes('approved')) return 'bg-green-100 text-green-800'
    if (action.includes('rejected')) return 'bg-red-100 text-red-800'
    if (action.includes('under_review')) return 'bg-yellow-100 text-yellow-800'
    if (action.includes('comment')) return 'bg-blue-100 text-blue-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-naija-green-900">Audit Logs</h1>
              <p className="text-gray-600">Track all admin actions and changes</p>
            </div>
            <button
              onClick={downloadLogs}
              className="flex items-center gap-2 px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold"
            >
              <Download size={20} />
              Export
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Email or action..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Action</label>
                <select
                  value={filterAction}
                  onChange={e => setFilterAction(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                >
                  <option value="">All Actions</option>
                  {actions.map(action => (
                    <option key={action} value={action}>{action}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={e => setFilterDateFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={e => setFilterDateTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setSearchTerm('')
                setFilterAction('')
                setFilterDateFrom('')
                setFilterDateTo('')
              }}
              className="mt-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 transition font-semibold"
            >
              Clear Filters
            </button>
          </div>

          {/* Logs Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full mx-auto"></div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600 font-semibold">No logs found</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Admin</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Application</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLogs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3 text-sm text-gray-900">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">{log.admin_email}</td>
                        <td className="px-6 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getActionBadgeColor(log.action)}`}>
                            {log.action.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {log.application_id ? log.application_id.substring(0, 8) + '...' : '—'}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">{log.details || '—'}</td>
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