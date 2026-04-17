'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, Users, CheckCircle, XCircle, Clock, UserCheck, Search } from 'lucide-react'

interface Analytics {
  totalUsers: number
  totalApplications: number
  approved: number
  rejected: number
  pending: number
  underReview: number
  approvalRate: number
  byState:   { state: string; count: number }[]
  byZone:    { zone:  string; count: number }[]
  byStatus:  { name:  string; value: number }[]
  ageGroups: { range: string; count: number }[]
  usersByZone: { zone: string; count: number }[]
  newUsersThisWeek: number
}

interface UserRow {
  id: string
  full_name: string
  email: string
  role: string
  state: string | null
  geo_zone: string | null
  created_at: string
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Bone = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
)

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          <Bone className="h-4 w-24" />
          <Bone className="h-8 w-16" />
        </div>
      ))}
    </div>
  )
}

function ChartRowSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {[0, 1].map(i => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <Bone className="h-5 w-40" />
          <Bone className="h-[300px] w-full" />
        </div>
      ))}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-8">
      <div className="bg-naija-green-900 h-10" />
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center gap-6 px-4 py-3 border-b border-gray-50">
          <Bone className="h-4 w-4" />
          <Bone className="h-4 w-28" />
          <Bone className="h-4 w-40" />
          <Bone className="h-4 w-20" />
          <Bone className="h-4 w-20" />
          <Bone className="h-5 w-16 rounded-full" />
          <Bone className="h-4 w-24" />
        </div>
      ))}
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="mx-auto px-4 py-8 lg:p-8">
          <div className="mb-8 space-y-2">
            <Bone className="h-8 w-64" />
            <Bone className="h-4 w-48" />
          </div>
          <StatsSkeleton />
          <ChartRowSkeleton />
          <ChartRowSkeleton />
          <TableSkeleton />
        </div>
      </main>
    </div>
  )
}

// ── Role badge ────────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin:    'bg-red-100 text-red-700',
    investor: 'bg-purple-100 text-purple-700',
    user:     'bg-naija-green-100 text-naija-green-800',
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[role] ?? 'bg-gray-100 text-gray-600'}`}>
      {role}
    </span>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [analytics,   setAnalytics]   = useState<Analytics | null>(null)
  const [users,       setUsers]       = useState<UserRow[]>([])
  const [filtered,    setFiltered]    = useState<UserRow[]>([])
  const [loading,     setLoading]     = useState(true)
  const [searchTerm,  setSearchTerm]  = useState('')
  const [roleFilter,  setRoleFilter]  = useState('all')

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (!user || userError) { window.location.replace('/login'); return }

        const { data: userData, error: roleError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (roleError || !userData || (userData.role !== 'admin' && userData.role !== 'super_admin')) {
          await supabase.auth.signOut()
          window.location.replace('/login')
          return
        }

        await loadAnalytics()
      } catch {
        window.location.replace('/login')
      }
    }
    init()
  }, [])

  // Filter users whenever search/role changes
  useEffect(() => {
    let result = users
    if (roleFilter !== 'all') result = result.filter(u => u.role === roleFilter)
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      result = result.filter(u =>
        u.full_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.state     || '').toLowerCase().includes(q) ||
        (u.geo_zone  || '').toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [users, searchTerm, roleFilter])

  const loadAnalytics = async () => {
    try {
      const [
        { data: allApps,   error: appsError  },
        { data: allUsers,  error: usersError },
      ] = await Promise.all([
        supabase.from('applications').select('id, status, age, state, geo_zone'),
        supabase.from('users').select('id, full_name, email, role, state, geo_zone, created_at').order('created_at', { ascending: false }),
      ])

      if (appsError)  throw appsError
      if (usersError) throw usersError

      const apps      = allApps  || []
      const usersList = allUsers || []

      console.log('Applications:', apps.length)
      console.log('Users:', usersList.length)

      // ── Applications stats ──
      const totalApplications = apps.length
      const approved    = apps.filter(a => a.status === 'approved').length
      const rejected    = apps.filter(a => a.status === 'rejected').length
      const pending     = apps.filter(a => a.status === 'pending').length
      const underReview = apps.filter(a => a.status === 'under_review').length
      const approvalRate = totalApplications > 0
        ? Math.round((approved / totalApplications) * 100) : 0

      // ── Users stats ──
      const totalUsers = usersList.filter(u => u.role !== 'admin').length
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const newUsersThisWeek = usersList.filter(
        u => u.role !== 'admin' && new Date(u.created_at) >= oneWeekAgo
      ).length

      // ── Group by state / zone / age ──
      const stateCount: Record<string, number> = {}
      const zoneCount:  Record<string, number> = {}
      const ageRanges:  Record<string, number> = {
        '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '55+': 0,
      }
      apps.forEach(app => {
        if (app.state)    stateCount[app.state]   = (stateCount[app.state]   || 0) + 1
        if (app.geo_zone) zoneCount[app.geo_zone] = (zoneCount[app.geo_zone] || 0) + 1
        const age = app.age
        if      (age >= 18 && age <= 25) ageRanges['18-25']++
        else if (age >= 26 && age <= 35) ageRanges['26-35']++
        else if (age >= 36 && age <= 45) ageRanges['36-45']++
        else if (age >= 46 && age <= 55) ageRanges['46-55']++
        else if (age >  55)              ageRanges['55+']++
      })

      const userZoneCount: Record<string, number> = {}
      usersList.forEach(u => {
        if (u.geo_zone && u.role !== 'admin')
          userZoneCount[u.geo_zone] = (userZoneCount[u.geo_zone] || 0) + 1
      })

      setAnalytics({
        totalUsers, newUsersThisWeek,
        totalApplications, approved, rejected, pending, underReview, approvalRate,
        byState: Object.entries(stateCount)
          .map(([state, count]) => ({ state, count }))
          .sort((a, b) => b.count - a.count).slice(0, 10),
        byZone: Object.entries(zoneCount)
          .map(([zone, count]) => ({ zone, count }))
          .sort((a, b) => b.count - a.count),
        byStatus: [
          { name: 'Approved',     value: approved    },
          { name: 'Rejected',     value: rejected    },
          { name: 'Pending',      value: pending     },
          { name: 'Under Review', value: underReview },
        ].filter(s => s.value > 0),
        ageGroups: Object.entries(ageRanges)
          .map(([range, count]) => ({ range, count }))
          .filter(a => a.count > 0),
        usersByZone: Object.entries(userZoneCount)
          .map(([zone, count]) => ({ zone, count }))
          .sort((a, b) => b.count - a.count),
      })

      setUsers(usersList)
      setFiltered(usersList)
    } catch (err) {
      toast.error('Failed to load analytics')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !analytics) return <AnalyticsSkeleton />

  const COLORS = ['#10c084', '#E74C3C', '#3498db', '#f39c12']

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="mx-auto px-4 py-8 lg:p-8">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-naija-green-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Detailed insights and statistics</p>
          </div>

          {/* ── 6 Stat Cards ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { icon: <Users       size={18} className="text-naija-green-600" />, label: 'TOTAL USERS',    value: analytics.totalUsers,          color: 'text-naija-green-900', border: 'border-naija-green-200' },
              { icon: <UserCheck   size={18} className="text-blue-600"        />, label: 'NEW THIS WEEK',  value: analytics.newUsersThisWeek,    color: 'text-blue-600',        border: 'border-blue-200'        },
              { icon: <Users       size={18} className="text-gray-500"        />, label: 'APPLICATIONS',   value: analytics.totalApplications,   color: 'text-gray-700',        border: 'border-gray-200'        },
              { icon: <CheckCircle size={18} className="text-green-600"       />, label: 'APPROVED',       value: analytics.approved,            color: 'text-green-600',       border: 'border-green-200'       },
              { icon: <XCircle     size={18} className="text-red-600"         />, label: 'REJECTED',       value: analytics.rejected,            color: 'text-red-600',         border: 'border-red-200'         },
              { icon: <TrendingUp  size={18} className="text-naija-green-600" />, label: 'APPROVAL RATE',  value: `${analytics.approvalRate}%`,  color: 'text-naija-green-600', border: 'border-naija-green-200' },
            ].map(card => (
              <div key={card.label} className={`bg-white rounded-lg shadow-sm border ${card.border} p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  {card.icon}
                  <p className="text-xs text-gray-600 font-semibold">{card.label}</p>
                </div>
                <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* ── Charts Row 1 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Users by Zone</h2>
              {analytics.usersByZone.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">No zone data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.usersByZone}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="zone" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10c084" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Age Distribution</h2>
              {analytics.ageGroups.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">No application data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.ageGroups}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10c084" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ── Charts Row 2 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Application Status</h2>
              {analytics.byStatus.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">No applications yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.byStatus}
                      cx="50%" cy="50%"
                      labelLine={false}
                      label={({ name, value }: any) => `${name}: ${value}`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {analytics.byStatus.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Top States</h2>
              {analytics.byState.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">No application data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.byState} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="state" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10c084" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ── Applications by Zone ── */}
          {analytics.byZone.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Applications by Zone</h2>
              <div className="space-y-3">
                {analytics.byZone.map((zone, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 w-32 truncate">{zone.zone}</span>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-naija-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${(zone.count / Math.max(...analytics.byZone.map(z => z.count))) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-8 text-right">{zone.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Users Table ── */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-lg font-bold text-gray-900">All Users</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search name, email, state..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500 w-64"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500 bg-white"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="investor">Investor</option>
                  <option value="admin">Admin</option>
                </select>
                <span className="text-xs text-gray-400 shrink-0">{filtered.length} / {users.length}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-naija-green-900 text-white text-xs">
                    <th className="text-left px-4 py-3 font-semibold">#</th>
                    <th className="text-left px-4 py-3 font-semibold">Name</th>
                    <th className="text-left px-4 py-3 font-semibold">Email</th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">State</th>
                    <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Zone</th>
                    <th className="text-left px-4 py-3 font-semibold">Role</th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr
                      key={u.id}
                      className={`border-b border-gray-50 hover:bg-naija-green-50/40 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
                    >
                      <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{u.full_name}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{u.email}</td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{u.state || '—'}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {u.geo_zone ? (
                          <span className="text-xs font-semibold px-2 py-0.5 bg-naija-green-100 text-naija-green-800 rounded-full">
                            {u.geo_zone}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}