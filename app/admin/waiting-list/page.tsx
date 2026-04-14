// File: app/admin/waiting-list/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Users, Search, Download, MapPin } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

interface WaitingListEntry {
  id: string
  full_name: string
  email: string
  phone: string | null
  state: string | null
  geo_zone: string | null
  interest_level: string
  source: string
  created_at: string
}

interface ZoneStat {
  zone: string
  count: number
  [key: string]: string | number
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Bone = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
)

function PageSkeleton() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <Bone className="h-7 w-36" />
              <Bone className="h-4 w-52" />
            </div>
            <Bone className="h-9 w-32 rounded-lg" />
          </div>
          {/* KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
                <Bone className="h-7 w-10" />
                <Bone className="h-3 w-20" />
              </div>
            ))}
          </div>
          {/* Zone chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <Bone className="h-5 w-36 mb-4" />
            <div className="flex items-end justify-around gap-3 h-40">
              {[40, 70, 55, 85, 60, 95].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-gray-200 rounded-t animate-pulse" style={{ height: `${h}px` }} />
                  <Bone className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <div className="flex gap-3">
              <Bone className="h-9 w-72 rounded-lg" />
              <Bone className="h-9 w-32 rounded-lg" />
            </div>
          </div>
          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-naija-green-900 h-10" />
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-6 px-4 py-3 border-b border-gray-50">
                <Bone className="h-4 w-4" />
                <Bone className="h-4 w-28" />
                <Bone className="h-4 w-40" />
                <Bone className="h-4 w-24" />
                <Bone className="h-4 w-20" />
                <Bone className="h-5 w-20 rounded-full" />
                <Bone className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function WaitingListPage() {
  const [entries,    setEntries]    = useState<WaitingListEntry[]>([])
  const [filtered,   setFiltered]   = useState<WaitingListEntry[]>([])
  const [loading,    setLoading]    = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [zoneFilter, setZoneFilter] = useState('all')
  const [zoneStats,  setZoneStats]  = useState<ZoneStat[]>([])

  // All 6 Nigerian geopolitical zones always shown even if count is 0
  const ALL_ZONES = ['North-West', 'North-East', 'North-Central', 'South-West', 'South-East', 'South-South']

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    let result = entries
    if (zoneFilter !== 'all') result = result.filter(e => e.geo_zone === zoneFilter)
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      result = result.filter(e =>
        e.full_name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.state || '').toLowerCase().includes(q) ||
        (e.phone || '').includes(q)
      )
    }
    setFiltered(result)
  }, [entries, zoneFilter, searchTerm])

  const loadData = async () => {
    try {
      const { data, error } = await supabase
        .from('waiting_list')
        .select('id, full_name, email, phone, state, geo_zone, interest_level, source, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error

      const list: WaitingListEntry[] = data || []
      setEntries(list)
      setFiltered(list)

      // Build zone stats for all 6 zones (0 if none yet)
      const zoneCount: Record<string, number> = {}
      ALL_ZONES.forEach(z => { zoneCount[z] = 0 })
      list.forEach(e => {
        if (e.geo_zone) zoneCount[e.geo_zone] = (zoneCount[e.geo_zone] || 0) + 1
      })
      setZoneStats(ALL_ZONES.map(zone => ({ zone, count: zoneCount[zone] || 0 })))
    } catch (err) {
      toast.error('Failed to load waiting list')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    const headers = ['Full Name', 'Email', 'Phone', 'State', 'Zone', 'Source', 'Date']
    const rows = filtered.map(e => [
      e.full_name, e.email, e.phone || '', e.state || '',
      e.geo_zone || '', e.source, new Date(e.created_at).toLocaleDateString(),
    ])
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `nnw-waiting-list-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Exported ${filtered.length} records`)
  }

  const zones    = ['all', ...Array.from(new Set(entries.map(e => e.geo_zone).filter(Boolean))) as string[]]
  const maxCount = Math.max(...zoneStats.map(z => z.count), 1)

  if (loading) return <PageSkeleton />

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8 lg:py-8">

          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Waiting List</h1>
              <p className="text-sm text-gray-500 mt-0.5">Pre-season competitor interest</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-naija-green-600 hover:bg-naija-green-700 text-white font-semibold rounded-lg transition text-sm"
            >
              <Download size={15} />
              Export ({filtered.length})
            </button>
          </div>

          {/* ── KPI row — all in one line, compact ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total Signups', value: entries.length,                                                                                     colour: 'text-naija-green-700', bg: 'bg-naija-green-50  border-naija-green-200' },
              { label: 'Zones Covered', value: zoneStats.filter(z => z.count > 0).length,                                                          colour: 'text-purple-700',      bg: 'bg-purple-50       border-purple-200'       },
              { label: 'With Phone',    value: entries.filter(e => e.phone).length,                                                                 colour: 'text-blue-700',        bg: 'bg-blue-50         border-blue-200'         },
              { label: 'This Week',     value: entries.filter(e => new Date(e.created_at) >= new Date(Date.now() - 7 * 864e5)).length,              colour: 'text-orange-700',      bg: 'bg-orange-50       border-orange-200'       },
            ].map((kpi, i) => (
              <div key={i} className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${kpi.bg}`}>
                <div>
                  <p className={`text-2xl font-black leading-none ${kpi.colour}`}>{kpi.value}</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{kpi.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Zone: bar chart (left) + pie chart (right) ── */}
          {(() => {
            const ZONE_COLOURS = ['#16a34a','#15803d','#166534','#22c55e','#4ade80','#86efac']
            const pieData = zoneStats.filter(z => z.count > 0)
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                {/* Bar chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <MapPin size={14} className="text-naija-green-600" />
                    Signups by Zone
                  </h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={zoneStats} margin={{ top: 4, right: 8, left: -20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="zone"
                        tick={{ fontSize: 10, fill: '#6b7280' }}
                        tickFormatter={z => z.replace('North-', 'N.').replace('South-', 'S.')}
                        angle={-35}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} allowDecimals={false} />
                      <Tooltip
                        formatter={(v: number) => [v, 'Signups']}
                        contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {zoneStats.map((_, i) => (
                          <Cell key={i} fill={ZONE_COLOURS[i % ZONE_COLOURS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin size={14} className="text-naija-green-600" />
                    Zone Distribution
                  </h3>
                  {pieData.length === 0 ? (
                    <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                      No signups yet
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="count"
                          nameKey="zone"
                          cx="50%"
                          cy="45%"
                          outerRadius={75}
                          innerRadius={35}
                          paddingAngle={3}
                          label={({ percent }) => `${Math.round((percent ?? 0) * 100)}%`}
                          labelLine={false}
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={ZONE_COLOURS[i % ZONE_COLOURS.length]} />
                          ))}
                        </Pie>
                        <Legend
                          iconType="circle"
                          iconSize={8}
                          formatter={(value) => <span style={{ fontSize: 11, color: '#374151' }}>{value}</span>}
                        />
                        <Tooltip
                          formatter={(v: number) => [v, 'Signups']}
                          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>

              </div>
            )
          })()}

          {/* ── Search + Filter ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="relative w-72">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name, email, state, phone..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500"
                />
              </div>
              <select
                value={zoneFilter}
                onChange={e => setZoneFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500 bg-white shrink-0"
              >
                <option value="all">All Zones</option>
                {zones.filter(z => z !== 'all').map(z => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
              <span className="text-xs text-gray-400 shrink-0 ml-auto">
                {filtered.length} / {entries.length}
              </span>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-naija-green-900 text-white text-xs">
                    <th className="text-left px-4 py-3 font-semibold">#</th>
                    <th className="text-left px-4 py-3 font-semibold">Name</th>
                    <th className="text-left px-4 py-3 font-semibold">Email</th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Phone</th>
                    <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">State</th>
                    <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Zone</th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry, i) => (
                    <tr
                      key={entry.id}
                      className={`border-b border-gray-50 hover:bg-naija-green-50/40 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
                    >
                      <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{entry.full_name}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{entry.email}</td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{entry.phone || '—'}</td>
                      <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{entry.state || '—'}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {entry.geo_zone ? (
                          <span className="text-xs font-semibold px-2 py-0.5 bg-naija-green-100 text-naija-green-800 rounded-full">
                            {entry.geo_zone}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                        No entries found
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