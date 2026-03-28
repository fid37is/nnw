'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import InvestorSidebar from '@/components/investor/InvestorSidebar'
import {
  TrendingUp, Users, DollarSign, Calendar,
  CheckCircle, Clock, MapPin, BarChart2,
  ArrowUpRight, RefreshCw, AlertCircle,
  Trophy, Zap, FileText
} from 'lucide-react'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

interface InvestorData {
  full_name: string
  email: string
  investment_amount: number
  investment_structure: 'equity' | 'revenue_share' | 'sponsorship'
  equity_percentage: number | null
  investment_date: string
}

interface FinancialMetrics {
  total_revenue: number
  sponsorship_revenue: number
  broadcasting_revenue: number
  ticket_revenue: number
  registration_revenue: number
  merchandise_revenue: number
  digital_revenue: number
  total_expenditure: number
  net_profit: number
  investor_return: number
  last_updated: string
}

interface OperationalMetrics {
  total_applications: number
  approved_contestants: number
  confirmed_participants: number
  total_payments_confirmed: number
  zones_active: number
  current_season: string
  season_status: string
}

interface Milestone {
  id: string
  title: string
  target_date: string
  status: 'completed' | 'in_progress' | 'planned' | 'future'
  notes: string | null
}

interface Season {
  id: string
  name: string
  year: number
  status: string
  start_date: string
  end_date: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => {
  if (n >= 1_000_000_000) return `₦${(n / 1_000_000_000).toFixed(2)}B`
  if (n >= 1_000_000)     return `₦${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)         return `₦${(n / 1_000).toFixed(0)}K`
  return `₦${n.toLocaleString()}`
}

const statusColor = (s: string) => {
  switch (s) {
    case 'completed':   return 'bg-green-100 text-green-700 border-green-200'
    case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'planned':     return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    default:            return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

const statusLabel = (s: string) => {
  switch (s) {
    case 'completed':   return 'Completed'
    case 'in_progress': return 'In Progress'
    case 'planned':     return 'Planned'
    default:            return 'Future'
  }
}

const structureLabel = (s: string) => {
  switch (s) {
    case 'equity':        return 'Equity Ownership'
    case 'revenue_share': return 'Revenue Share'
    case 'sponsorship':   return 'Sponsorship'
    default:              return s
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function InvestorDashboard() {
  const [investor, setInvestor]     = useState<InvestorData | null>(null)
  const [financials, setFinancials] = useState<FinancialMetrics | null>(null)
  const [ops, setOps]               = useState<OperationalMetrics | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [season, setSeason]         = useState<Season | null>(null)
  const [loading, setLoading]       = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  useEffect(() => { loadAll() }, [])

  const loadAll = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      // 1. Auth check
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/investor/login'; return }

      // 2. Role check — must be 'investor'
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, full_name, email')
        .eq('id', session.user.id)
        .single()

      if (userError || userData?.role !== 'investor') {
        toast.error('Access restricted to investors only')
        window.location.href = '/user/dashboard'
        return
      }

      // 3. Investor profile from investor_profiles table
      const { data: investorData } = await supabase
        .from('investor_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (investorData) {
        setInvestor({
          full_name: userData.full_name,
          email: userData.email,
          investment_amount: investorData.investment_amount,
          investment_structure: investorData.investment_structure,
          equity_percentage: investorData.equity_percentage,
          investment_date: investorData.investment_date,
        })
      } else {
        // Fallback: investor has account but no profile yet
        setInvestor({
          full_name: userData.full_name,
          email: userData.email,
          investment_amount: 0,
          investment_structure: 'equity',
          equity_percentage: null,
          investment_date: new Date().toISOString(),
        })
      }

      // 4. Financial metrics (admin-maintained table)
      const { data: financialData } = await supabase
        .from('investor_metrics')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (financialData) {
        setFinancials({
          total_revenue:         financialData.total_revenue        || 0,
          sponsorship_revenue:   financialData.sponsorship_revenue  || 0,
          broadcasting_revenue:  financialData.broadcasting_revenue || 0,
          ticket_revenue:        financialData.ticket_revenue       || 0,
          registration_revenue:  financialData.registration_revenue || 0,
          merchandise_revenue:   financialData.merchandise_revenue  || 0,
          digital_revenue:       financialData.digital_revenue      || 0,
          total_expenditure:     financialData.total_expenditure    || 0,
          net_profit:            financialData.net_profit           || 0,
          investor_return:       financialData.investor_return      || 0,
          last_updated:          financialData.updated_at,
        })
      }

      // 5. Operational metrics — pulled live from existing tables
      const [appsResult, paymentsResult, seasonResult] = await Promise.all([
        supabase.from('applications').select('id, status, is_accepted, is_participant, payment_status, geo_zone'),
        supabase.from('applications').select('id, payment_status').eq('payment_status', 'confirmed'),
        supabase.from('seasons').select('*').eq('status', 'active').single(),
      ])

      const apps = appsResult.data || []
      const activeZones = [...new Set(apps.filter(a => a.status === 'approved').map((a: any) => a.geo_zone))].filter(Boolean)

      setOps({
        total_applications:       apps.length,
        approved_contestants:     apps.filter(a => a.status === 'approved').length,
        confirmed_participants:   apps.filter(a => a.is_participant).length,
        total_payments_confirmed: (paymentsResult.data || []).length,
        zones_active:             activeZones.length,
        current_season:           seasonResult.data?.name || 'Pre-Season',
        season_status:            seasonResult.data?.status || 'upcoming',
      })

      if (seasonResult.data) setSeason(seasonResult.data)

      // 6. Milestones
      const { data: milestonesData } = await supabase
        .from('investor_milestones')
        .select('*')
        .order('target_date', { ascending: true })

      setMilestones(milestonesData || defaultMilestones)

      setLastRefresh(new Date())
    } catch (err) {
      console.error(err)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex">
        <InvestorSidebar />
        <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full mx-auto mb-4" />
            <p className="text-gray-600 text-sm">Loading your dashboard...</p>
          </div>
        </main>
      </div>
    )
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex">
      <InvestorSidebar />

      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="mx-auto px-4 py-8 lg:p-8">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-naija-green-900">
                Welcome back, {investor?.full_name?.split(' ')[0] || 'Investor'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {season ? `${season.name} — ${ops?.season_status}` : 'Pre-Season'}
                &nbsp;·&nbsp;
                Last updated {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => loadAll(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition text-sm font-medium disabled:opacity-60"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {/* ── Investment Summary Banner ── */}
          {investor && (
            <div className="bg-gradient-to-br from-naija-green-700 to-naija-green-800 text-white rounded-xl p-6 mb-8 shadow-md">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-naija-green-300 text-xs uppercase tracking-wide mb-1">Your Investment</p>
                  <p className="text-2xl font-bold">{investor.investment_amount ? fmt(investor.investment_amount) : '—'}</p>
                </div>
                <div>
                  <p className="text-naija-green-300 text-xs uppercase tracking-wide mb-1">Structure</p>
                  <p className="text-lg font-bold">{structureLabel(investor.investment_structure)}</p>
                </div>
                {investor.equity_percentage && (
                  <div>
                    <p className="text-naija-green-300 text-xs uppercase tracking-wide mb-1">Equity Stake</p>
                    <p className="text-2xl font-bold">{investor.equity_percentage}%</p>
                  </div>
                )}
                <div>
                  <p className="text-naija-green-300 text-xs uppercase tracking-wide mb-1">Returns to Date</p>
                  <p className="text-2xl font-bold text-naija-green-300">
                    {financials ? fmt(financials.investor_return) : '₦0'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Financial Metrics ── */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Financial Metrics</h2>
              {financials?.last_updated && (
                <p className="text-xs text-gray-400">
                  Updated {new Date(financials.last_updated).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>

            {financials ? (
              <>
                {/* Top line */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {[
                    { label: 'Total Revenue', value: fmt(financials.total_revenue), icon: <TrendingUp size={18}/>, color: 'text-naija-green-600', bg: 'bg-naija-green-50 border-naija-green-200' },
                    { label: 'Total Expenditure', value: fmt(financials.total_expenditure), icon: <ArrowUpRight size={18}/>, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
                    { label: 'Net Profit', value: fmt(financials.net_profit), icon: <DollarSign size={18}/>, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
                  ].map((card, i) => (
                    <div key={i} className={`rounded-xl p-5 border ${card.bg}`}>
                      <div className={`flex items-center gap-2 mb-2 ${card.color}`}>
                        {card.icon}
                        <p className="text-xs font-semibold uppercase tracking-wide">{card.label}</p>
                      </div>
                      <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                    </div>
                  ))}
                </div>

                {/* Revenue breakdown */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Revenue by Stream</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Sponsorships',           value: financials.sponsorship_revenue,  color: 'bg-naija-green-500' },
                      { label: 'Broadcasting & Streaming',value: financials.broadcasting_revenue, color: 'bg-blue-500' },
                      { label: 'Ticket Sales & Events',   value: financials.ticket_revenue,       color: 'bg-purple-500' },
                      { label: 'Registration Fees',       value: financials.registration_revenue, color: 'bg-yellow-500' },
                      { label: 'Merchandise',             value: financials.merchandise_revenue,  color: 'bg-orange-500' },
                      { label: 'Digital Platform',        value: financials.digital_revenue,      color: 'bg-teal-500' },
                    ].map((stream, i) => {
                      const pct = financials.total_revenue > 0
                        ? Math.round((stream.value / financials.total_revenue) * 100)
                        : 0
                      return (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 font-medium">{stream.label}</span>
                            <span className="text-gray-900 font-bold">{fmt(stream.value)}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className={`${stream.color} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <AlertCircle size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Financial data will appear here</p>
                <p className="text-gray-400 text-sm mt-1">The admin team updates these figures regularly. Check back soon.</p>
              </div>
            )}
          </div>

          {/* ── Operational Metrics ── */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Operational Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: 'Total Applications', value: ops?.total_applications ?? '—', icon: <Users size={18}/>, color: 'text-naija-green-600' },
                { label: 'Approved Contestants', value: ops?.approved_contestants ?? '—', icon: <CheckCircle size={18}/>, color: 'text-green-600' },
                { label: 'Confirmed Participants', value: ops?.confirmed_participants ?? '—', icon: <Trophy size={18}/>, color: 'text-blue-600' },
                { label: 'Payments Confirmed', value: ops?.total_payments_confirmed ?? '—', icon: <DollarSign size={18}/>, color: 'text-purple-600' },
                { label: 'Zones with Applicants', value: ops?.zones_active ?? '—', icon: <MapPin size={18}/>, color: 'text-orange-600' },
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className={`${card.color} mb-2`}>{card.icon}</div>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-tight">{card.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Season Progress + Milestones ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* Season Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={18} className="text-naija-green-600" />
                <h2 className="text-base font-bold text-gray-900">Season Overview</h2>
              </div>
              {season ? (
                <div className="space-y-3 text-sm">
                  {[
                    ['Season',       season.name],
                    ['Year',         season.year],
                    ['Status',       season.status.charAt(0).toUpperCase() + season.status.slice(1)],
                    ['Start Date',   season.start_date ? new Date(season.start_date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric'}) : '—'],
                    ['End Date',     season.end_date   ? new Date(season.end_date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric'}) : '—'],
                  ].map(([label, value], i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Clock size={28} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No active season yet</p>
                  <p className="text-gray-400 text-xs mt-1">Season 1 launches Q4 2026</p>
                </div>
              )}
            </div>

            {/* Milestones */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={18} className="text-naija-green-600" />
                <h2 className="text-base font-bold text-gray-900">Milestones</h2>
              </div>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {milestones.length > 0 ? milestones.map((m, i) => (
                  <div key={m.id || i} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      m.status === 'completed'   ? 'bg-green-500' :
                      m.status === 'in_progress' ? 'bg-blue-500'  :
                      m.status === 'planned'     ? 'bg-yellow-400' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{m.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${statusColor(m.status)}`}>
                          {statusLabel(m.status)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {m.target_date ? new Date(m.target_date).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' }) : '—'}
                      </p>
                      {m.notes && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{m.notes}</p>}
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-400 text-sm text-center py-4">No milestones configured yet</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Documents quick link ── */}
          <div className="bg-gradient-to-br from-naija-green-50 to-white rounded-xl border border-naija-green-200 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-naija-green-100 rounded-lg flex items-center justify-center">
                  <FileText size={20} className="text-naija-green-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Your Documents</h3>
                  <p className="text-sm text-gray-500">Investment agreements, reports, and certificates</p>
                </div>
              </div>
              <Link
                href="/investor/documents"
                className="flex items-center gap-2 px-5 py-2.5 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition text-sm flex-shrink-0"
              >
                View Documents
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          {/* ── Disclaimer ── */}
          <p className="text-xs text-gray-400 text-center mt-8 leading-relaxed">
            This dashboard is for informational purposes only and provides read-only access to NNW investment data.
            Financial figures are updated periodically by the NNW admin team. For queries, contact{' '}
            <a href="mailto:phyd3lis@gmail.com" className="text-naija-green-600 hover:underline">phyd3lis@gmail.com</a>.
          </p>

        </div>
      </main>
    </div>
  )
}

// ─── Default milestones (shown before DB table is seeded) ─────────────────────
const defaultMilestones: Milestone[] = [
  { id: '1', title: 'LLC Incorporation & Legal Setup',       target_date: '2026-06-01', status: 'planned',  notes: null },
  { id: '2', title: 'Trademark Strategy Finalised',          target_date: '2026-06-01', status: 'planned',  notes: null },
  { id: '3', title: 'Series A Close & Agreements Signed',    target_date: '2026-09-01', status: 'planned',  notes: null },
  { id: '4', title: 'Course Construction & Pilot Episode',   target_date: '2026-09-01', status: 'planned',  notes: null },
  { id: '5', title: 'Season 1 Launch — 6 Zones',             target_date: '2026-10-01', status: 'planned',  notes: null },
  { id: '6', title: 'National Finals Broadcast — Abuja',     target_date: '2026-12-01', status: 'planned',  notes: null },
  { id: '7', title: 'Franchise Expansion Prep — Africa',     target_date: '2027-01-01', status: 'future',   notes: null },
  { id: '8', title: 'Season 2 + 2 New African Markets',      target_date: '2027-06-01', status: 'future',   notes: null },
]