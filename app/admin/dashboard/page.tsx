'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, Users, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Analytics {
  totalApplications: number
  approved: number
  rejected: number
  pending: number
  underReview: number
  approvalRate: number
  byState:  { state: string; count: number }[]
  byZone:   { zone:  string; count: number }[]
  byStatus: { name:  string; value: number }[]
  ageGroups:{ range: string; count: number }[]
}

// ── Skeleton primitives ───────────────────────────────────────────────────────
const Bone = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
)

// Mirrors the 5-stat card row
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          <Bone className="h-4 w-24" />
          <Bone className="h-8 w-16" />
        </div>
      ))}
    </div>
  )
}

// Mirrors the 2-chart row
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

// Mirrors the bottom 2-panel row
function BottomRowSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* bar chart panel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <Bone className="h-5 w-32" />
        <Bone className="h-[300px] w-full" />
      </div>
      {/* zone list panel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <Bone className="h-5 w-44" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <Bone className="h-4 w-28" />
            <div className="flex items-center gap-3 flex-1">
              <Bone className="h-2 w-full rounded-full" />
              <Bone className="h-4 w-6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="mx-auto px-4 py-8 lg:p-8">
          {/* Header */}
          <div className="mb-8 space-y-2">
            <Bone className="h-8 w-64" />
            <Bone className="h-4 w-48" />
          </div>
          <StatsSkeleton />
          <ChartRowSkeleton />
          <BottomRowSkeleton />
        </div>
      </main>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { authChecked } = useAuthGuard({
    requiredRole: 'admin',
    loginPath:    '/login',
  })

  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    if (authChecked) loadAnalytics()
  }, [authChecked])

  const loadAnalytics = async () => {
    try {
      const { data: allApps, error } = await supabase
        .from('applications')
        .select('id, status, age, state, geo_zone')

      if (error) throw error
      const apps = allApps || []

      const totalApplications = apps.length
      const approved    = apps.filter(a => a.status === 'approved').length
      const rejected    = apps.filter(a => a.status === 'rejected').length
      const pending     = apps.filter(a => a.status === 'pending').length
      const underReview = apps.filter(a => a.status === 'under_review').length
      const approvalRate = totalApplications > 0
        ? Math.round((approved / totalApplications) * 100)
        : 0

      const stateCount: Record<string, number> = {}
      const zoneCount:  Record<string, number> = {}
      const ageRanges:  Record<string, number> = { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '55+': 0 }

      apps.forEach(app => {
        if (app.state)    stateCount[app.state]    = (stateCount[app.state]    || 0) + 1
        if (app.geo_zone) zoneCount[app.geo_zone]  = (zoneCount[app.geo_zone]  || 0) + 1
        const age = app.age
        if      (age >= 18 && age <= 25) ageRanges['18-25']++
        else if (age >= 26 && age <= 35) ageRanges['26-35']++
        else if (age >= 36 && age <= 45) ageRanges['36-45']++
        else if (age >= 46 && age <= 55) ageRanges['46-55']++
        else if (age >  55)              ageRanges['55+']++
      })

      setAnalytics({
        totalApplications, approved, rejected, pending, underReview, approvalRate,
        byState: Object.entries(stateCount)
          .map(([state, count]) => ({ state, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        byZone: Object.entries(zoneCount)
          .map(([zone, count]) => ({ zone, count }))
          .sort((a, b) => b.count - a.count),
        byStatus: [
          { name: 'Approved',    value: approved    },
          { name: 'Rejected',    value: rejected    },
          { name: 'Pending',     value: pending     },
          { name: 'Under Review',value: underReview },
        ].filter(s => s.value > 0),
        ageGroups: Object.entries(ageRanges)
          .map(([range, count]) => ({ range, count }))
          .filter(a => a.count > 0),
      })
    } catch (err) {
      toast.error('Failed to load analytics')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Show skeleton while auth is being checked OR data is loading
  if (!authChecked || loading || !analytics) return <AnalyticsSkeleton />

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

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {[
              { icon: <Users       size={18} className="text-naija-green-600" />, label: 'TOTAL',        value: analytics.totalApplications, color: 'text-naija-green-900', border: 'border-gray-200'          },
              { icon: <CheckCircle size={18} className="text-green-600"       />, label: 'APPROVED',     value: analytics.approved,          color: 'text-green-600',        border: 'border-green-200'         },
              { icon: <XCircle     size={18} className="text-red-600"         />, label: 'REJECTED',     value: analytics.rejected,          color: 'text-red-600',          border: 'border-red-200'           },
              { icon: <Clock       size={18} className="text-yellow-600"      />, label: 'PENDING',      value: analytics.pending + analytics.underReview, color: 'text-yellow-600', border: 'border-yellow-200' },
              { icon: <TrendingUp  size={18} className="text-naija-green-600" />, label: 'APPROVAL RATE',value: `${analytics.approvalRate}%`, color: 'text-naija-green-600', border: 'border-naija-green-200'  },
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

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Status Distribution</h2>
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
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Age Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.ageGroups}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10c084" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Top States</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.byState} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="state" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10c084" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Applications by Zone</h2>
              <div className="space-y-3">
                {analytics.byZone.map((zone, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 w-32 truncate">{zone.zone}</span>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-naija-green-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${(zone.count / Math.max(...analytics.byZone.map(z => z.count))) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-8 text-right">{zone.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}