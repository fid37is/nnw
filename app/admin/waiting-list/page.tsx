// admin/waiting-list/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Users, Search, Download, MapPin, TrendingUp, Zap } from 'lucide-react'

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
}

interface InterestStat {
  level: string
  count: number
}

const INTEREST_LABELS: Record<string, string> = {
  competitor: 'Competitor',
  spectator: 'Spectator',
  sponsor: 'Sponsor',
  media: 'Media',
}

const INTEREST_COLOURS: Record<string, string> = {
  competitor: 'bg-naija-green-100 text-naija-green-800',
  spectator: 'bg-blue-100 text-blue-800',
  sponsor: 'bg-yellow-100 text-yellow-800',
  media: 'bg-purple-100 text-purple-800',
}

export default function WaitingListPage() {
  // ── Auth guard ──────────────────────────────────────────────────────────────
  const { authChecked } = useAuthGuard({ requiredRole: 'admin' })

  // ── State ───────────────────────────────────────────────────────────────────
  const [entries, setEntries] = useState<WaitingListEntry[]>([])
  const [filtered, setFiltered] = useState<WaitingListEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [zoneFilter, setZoneFilter] = useState('all')
  const [interestFilter, setInterestFilter] = useState('all')
  const [zoneStats, setZoneStats] = useState<ZoneStat[]>([])
  const [interestStats, setInterestStats] = useState<InterestStat[]>([])

  // ── Load data only after auth is confirmed ──────────────────────────────────
  useEffect(() => {
    if (authChecked) loadData()
  }, [authChecked])

  // ── Client-side filtering ───────────────────────────────────────────────────
  useEffect(() => {
    let result = entries

    if (zoneFilter !== 'all') {
      result = result.filter(e => e.geo_zone === zoneFilter)
    }
    if (interestFilter !== 'all') {
      result = result.filter(e => e.interest_level === interestFilter)
    }
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
  }, [entries, zoneFilter, interestFilter, searchTerm])

  // ── Data fetch ──────────────────────────────────────────────────────────────
  const loadData = async () => {
    try {
      // Fetch all waiting list rows ordered newest-first
      const { data, error } = await supabase
        .from('waiting_list')
        .select('id, full_name, email, phone, state, geo_zone, interest_level, source, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error

      const list: WaitingListEntry[] = data || []
      setEntries(list)
      setFiltered(list)

      // Derive zone stats from the fetched rows (avoids a second query)
      const zoneCount: Record<string, number> = {}
      list.forEach(e => {
        if (e.geo_zone) zoneCount[e.geo_zone] = (zoneCount[e.geo_zone] || 0) + 1
      })
      setZoneStats(
        Object.entries(zoneCount)
          .map(([zone, count]) => ({ zone, count }))
          .sort((a, b) => b.count - a.count)
      )

      // Derive interest stats from the fetched rows
      const intCount: Record<string, number> = {}
      list.forEach(e => {
        intCount[e.interest_level] = (intCount[e.interest_level] || 0) + 1
      })
      setInterestStats(
        Object.entries(intCount)
          .map(([level, count]) => ({ level, count }))
          .sort((a, b) => b.count - a.count)
      )
    } catch (err) {
      toast.error('Failed to load waiting list')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ── CSV export ──────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const headers = ['Full Name', 'Email', 'Phone', 'State', 'Zone', 'Interest', 'Source', 'Date']
    const rows = filtered.map(e => [
      e.full_name,
      e.email,
      e.phone || '',
      e.state || '',
      e.geo_zone || '',
      INTEREST_LABELS[e.interest_level] || e.interest_level,
      e.source,
      new Date(e.created_at).toLocaleDateString(),
    ])

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nnw-waiting-list-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Exported ${filtered.length} records`)
  }

  // ── Derived filter options ──────────────────────────────────────────────────
  const zones = ['all', ...Array.from(new Set(entries.map(e => e.geo_zone).filter(Boolean))) as string[]]
  const interests = ['all', ...Array.from(new Set(entries.map(e => e.interest_level)))]

  // ── Auth pending — render nothing (hook handles redirect) ───────────────────
  if (!authChecked) return null

  // ── Loading spinner ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 min-h-screen flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full" />
        </main>
      </div>
    )
  }

  // ── Derived KPI counts ──────────────────────────────────────────────────────
  const competitorCount = entries.filter(e => e.interest_level === 'competitor').length
  const sponsorCount = entries.filter(e => e.interest_level === 'sponsor').length

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="mx-auto px-4 py-8 lg:p-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Users size={28} className="text-naija-green-600" />
                <h1 className="text-3xl font-bold text-naija-green-900">Waiting List</h1>
              </div>
              <p className="text-gray-500 text-sm">
                Pre-season interest tracking — investor KPI data
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-5 py-2.5 bg-naija-green-600 hover:bg-naija-green-700 text-white font-semibold rounded-xl transition text-sm"
            >
              <Download size={16} />
              Export CSV ({filtered.length})
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Signups',    value: entries.length,   icon: Users,      colour: 'text-naija-green-600', bg: 'bg-naija-green-50' },
              { label: 'Competitors',      value: competitorCount,  icon: Zap,        colour: 'text-blue-600',        bg: 'bg-blue-50' },
              { label: 'Sponsor Interest', value: sponsorCount,     icon: TrendingUp, colour: 'text-yellow-600',      bg: 'bg-yellow-50' },
              { label: 'Zones Covered',    value: zoneStats.length, icon: MapPin,     colour: 'text-purple-600',      bg: 'bg-purple-50' },
            ].map((kpi, i) => {
              const Icon = kpi.icon
              return (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon size={18} className={kpi.colour} />
                  </div>
                  <p className={`text-3xl font-black ${kpi.colour}`}>{kpi.value}</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">{kpi.label}</p>
                </div>
              )
            })}
          </div>

          {/* Zone + Interest breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            {/* By Zone */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-naija-green-600" />
                Signups by Zone
              </h3>
              <div className="space-y-3">
                {zoneStats.length > 0 ? zoneStats.map((z, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{z.zone}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-naija-green-500 h-2 rounded-full"
                          style={{ width: `${Math.round((z.count / entries.length) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-6 text-right">{z.count}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-400">No zone data yet</p>
                )}
              </div>
            </div>

            {/* By Interest */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-naija-green-600" />
                Signups by Interest
              </h3>
              <div className="space-y-3">
                {interestStats.map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${INTEREST_COLOURS[s.level] || 'bg-gray-100 text-gray-700'}`}>
                      {INTEREST_LABELS[s.level] || s.level}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-naija-green-500 h-2 rounded-full"
                          style={{ width: `${Math.round((s.count / entries.length) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-6 text-right">{s.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, state..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500"
                />
              </div>
              <select
                value={zoneFilter}
                onChange={e => setZoneFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500 bg-white"
              >
                <option value="all">All Zones</option>
                {zones.filter(z => z !== 'all').map(z => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
              <select
                value={interestFilter}
                onChange={e => setInterestFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500 bg-white"
              >
                <option value="all">All Interests</option>
                {interests.filter(i => i !== 'all').map(i => (
                  <option key={i} value={i}>{INTEREST_LABELS[i] || i}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Showing {filtered.length} of {entries.length} entries
            </p>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-naija-green-900 text-white">
                    <th className="text-left px-5 py-3 font-semibold">#</th>
                    <th className="text-left px-5 py-3 font-semibold">Name</th>
                    <th className="text-left px-5 py-3 font-semibold">Email</th>
                    <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Phone</th>
                    <th className="text-left px-5 py-3 font-semibold hidden lg:table-cell">State</th>
                    <th className="text-left px-5 py-3 font-semibold hidden lg:table-cell">Zone</th>
                    <th className="text-left px-5 py-3 font-semibold">Interest</th>
                    <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry, i) => (
                    <tr
                      key={entry.id}
                      className={`border-b border-gray-50 hover:bg-naija-green-50/50 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                    >
                      <td className="px-5 py-3 text-gray-400 text-xs">{i + 1}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{entry.full_name}</td>
                      <td className="px-5 py-3 text-gray-600">{entry.email}</td>
                      <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{entry.phone || '—'}</td>
                      <td className="px-5 py-3 text-gray-600 hidden lg:table-cell">{entry.state || '—'}</td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        {entry.geo_zone ? (
                          <span className="text-xs font-semibold px-2 py-1 bg-naija-green-100 text-naija-green-800 rounded-full">
                            {entry.geo_zone}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${INTEREST_COLOURS[entry.interest_level] || 'bg-gray-100 text-gray-700'}`}>
                          {INTEREST_LABELS[entry.interest_level] || entry.interest_level}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs hidden md:table-cell">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center text-gray-400">
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