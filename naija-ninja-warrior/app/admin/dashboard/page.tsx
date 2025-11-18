'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Analytics {
  totalApplications: number
  approved: number
  rejected: number
  pending: number
  underReview: number
  approvalRate: number
  byState: { state: string; count: number }[]
  byZone: { zone: string; count: number }[]
  byStatus: { name: string; value: number }[]
  ageGroups: { range: string; count: number }[]
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      // Get all applications
      const { data: allApps, error: appsError } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          age,
          state,
          geo_zone
        `)

      if (appsError) throw appsError

      const apps = allApps || []

      // Calculate totals
      const totalApplications = apps.length
      const approved = apps.filter(a => a.status === 'approved').length
      const rejected = apps.filter(a => a.status === 'rejected').length
      const pending = apps.filter(a => a.status === 'pending').length
      const underReview = apps.filter(a => a.status === 'under_review').length
      const approvalRate = totalApplications > 0 ? Math.round((approved / totalApplications) * 100) : 0

      // Group by state
      const stateCount: { [key: string]: number } = {}
      apps.forEach(app => {
        stateCount[app.state] = (stateCount[app.state] || 0) + 1
      })
      const byState = Object.entries(stateCount)
        .map(([state, count]) => ({ state, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      // Group by zone
      const zoneCount: { [key: string]: number } = {}
      apps.forEach(app => {
        zoneCount[app.geo_zone] = (zoneCount[app.geo_zone] || 0) + 1
      })
      const byZone = Object.entries(zoneCount)
        .map(([zone, count]) => ({ zone, count }))
        .sort((a, b) => b.count - a.count)

      // Status breakdown
      const byStatus = [
        { name: 'Approved', value: approved },
        { name: 'Rejected', value: rejected },
        { name: 'Pending', value: pending },
        { name: 'Under Review', value: underReview },
      ].filter(s => s.value > 0)

      // Age groups
      const ageRanges: { [key: string]: number } = {
        '18-25': 0,
        '26-35': 0,
        '36-45': 0,
        '46-55': 0,
        '55+': 0,
      }
      apps.forEach(app => {
        if (app.age >= 18 && app.age <= 25) ageRanges['18-25']++
        else if (app.age >= 26 && app.age <= 35) ageRanges['26-35']++
        else if (app.age >= 36 && app.age <= 45) ageRanges['36-45']++
        else if (app.age >= 46 && app.age <= 55) ageRanges['46-55']++
        else if (app.age > 55) ageRanges['55+']++
      })
      const ageGroups = Object.entries(ageRanges)
        .map(([range, count]) => ({ range, count }))
        .filter(a => a.count > 0)

      setAnalytics({
        totalApplications,
        approved,
        rejected,
        pending,
        underReview,
        approvalRate,
        byState,
        byZone,
        byStatus,
        ageGroups,
      })
    } catch (err) {
      toast.error('Failed to load analytics')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#10c084', '#E74C3C', '#3498db', '#f39c12']

  if (loading || !analytics) {
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
        <div className="max-w-7xl mx-auto px-4 py-8 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-naija-green-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Detailed insights and statistics</p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users size={18} className="text-naija-green-600" />
                <p className="text-xs text-gray-600 font-semibold">TOTAL</p>
              </div>
              <p className="text-3xl font-bold text-naija-green-900">{analytics.totalApplications}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={18} className="text-green-600" />
                <p className="text-xs text-gray-600 font-semibold">APPROVED</p>
              </div>
              <p className="text-3xl font-bold text-green-600">{analytics.approved}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle size={18} className="text-red-600" />
                <p className="text-xs text-gray-600 font-semibold">REJECTED</p>
              </div>
              <p className="text-3xl font-bold text-red-600">{analytics.rejected}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={18} className="text-yellow-600" />
                <p className="text-xs text-gray-600 font-semibold">PENDING</p>
              </div>
              <p className="text-3xl font-bold text-yellow-600">{analytics.pending + analytics.underReview}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-naija-green-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-naija-green-600" />
                <p className="text-xs text-gray-600 font-semibold">APPROVAL RATE</p>
              </div>
              <p className="text-3xl font-bold text-naija-green-600">{analytics.approvalRate}%</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Status Distribution */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Status Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.byStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }: any) => `${name || ''}: ${value || 0}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.byStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Age Distribution */}
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

          {/* Top States and Zones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top States */}
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

            {/* Zones */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Applications by Zone</h2>
              <div className="space-y-3">
                {analytics.byZone.map((zone, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{zone.zone}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-naija-green-600 h-2 rounded-full"
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