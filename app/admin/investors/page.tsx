'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { RefreshCw, Users, DollarSign, TrendingUp, FileText } from 'lucide-react'

import { InvestorsTab }  from './InvestorsTab'
import { MetricsTab }    from './MetricsTab'
import { MilestonesTab } from './MilestonesTab'
import { DocumentsTab }  from './DocumentsTab'

import {
  InvestorUser, InvestorProfile, Metrics,
  MilestoneRow, DocumentRow, emptyMetrics,
} from './types'

type Tab = 'investors' | 'metrics' | 'milestones' | 'documents'

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'investors',  label: 'Investors',  icon: <Users size={15} /> },
  { key: 'metrics',    label: 'Metrics',    icon: <DollarSign size={15} /> },
  { key: 'milestones', label: 'Milestones', icon: <TrendingUp size={15} /> },
  { key: 'documents',  label: 'Documents',  icon: <FileText size={15} /> },
]

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full" />
      </main>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminInvestorsPage() {
  const [tab, setTab]         = useState<Tab>('investors')
  const [loading, setLoading] = useState(true)

  // Data state — owned here, passed down to tab components
  const [investors,  setInvestors]  = useState<InvestorUser[]>([])
  const [metrics,    setMetrics]    = useState<Metrics>(emptyMetrics)
  const [metricsId,  setMetricsId]  = useState<string | null>(null)
  const [milestones, setMilestones] = useState<MilestoneRow[]>([])
  const [documents,  setDocuments]  = useState<DocumentRow[]>([])

  // ── Auth + init ─────────────────────────────────────────────────────────────
  useEffect(() => { init() }, [])

  const init = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/login'; return }

      const { data: u } = await supabase
        .from('users').select('role').eq('id', session.user.id).single()

      if (!u || (u.role !== 'admin' && u.role !== 'super_admin')) {
        window.location.href = '/login'; return
      }

      await loadAll()
    } catch {
      window.location.href = '/login'
    } finally {
      setLoading(false)
    }
  }

  // ── Data loaders ────────────────────────────────────────────────────────────
  const loadAll = async () => {
    await Promise.allSettled([
      loadInvestors(),
      loadMetrics(),
      loadMilestones(),
      loadDocuments(),
    ])
  }

  const loadInvestors = async () => {
    const { data: users } = await supabase
      .from('users')
      .select('id, full_name, email, role, investor_status, must_change_password, created_at')
      .eq('role', 'investor')
      .order('created_at', { ascending: false })

    const { data: profiles } = await supabase.from('investor_profiles').select('*')
    const pm: Record<string, InvestorProfile> = {}
    ;(profiles || []).forEach((p: any) => { pm[p.user_id] = p })
    setInvestors((users || []).map((u: any) => ({ ...u, profile: pm[u.id] || null })))
  }

  const loadMetrics = async () => {
    const { data } = await supabase
      .from('investor_metrics')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (data) {
      setMetrics({ ...emptyMetrics, ...data, notes: data.notes || '' })
      setMetricsId(data.id)
    }
  }

  const loadMilestones = async () => {
    const { data } = await supabase
      .from('investor_milestones').select('*').order('sort_order')
    setMilestones((data || []).map((m: any) => ({ ...m, notes: m.notes || '' })))
  }

  const loadDocuments = async () => {
    const { data } = await supabase
      .from('investor_documents').select('*').order('created_at', { ascending: false })
    setDocuments(
      (data || []).map((d: any) => ({
        ...d,
        description: d.description || '',
        file_url:    d.file_url    || '',
      }))
    )
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) return <Skeleton />

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="mx-auto px-4 py-6 lg:p-8">

          {/* ── Header ── */}
          <div className="flex items-start sm:items-center justify-between gap-3 mb-6 flex-wrap">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-naija-green-900">
                Investor Management
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Accounts · profiles · metrics · milestones · documents
              </p>
            </div>
            <button
              onClick={loadAll}
              title="Refresh all data"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-naija-green-700 transition flex-shrink-0"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* ── Tab bar ── */}
          <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div
              className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition flex-shrink-0 ${
                    tab === t.key
                      ? 'bg-white text-naija-green-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Tab content ── */}
          {tab === 'investors' && (
            <InvestorsTab
              investors={investors}
              onReload={loadInvestors}
            />
          )}

          {tab === 'metrics' && (
            <MetricsTab
              metrics={metrics}
              metricsId={metricsId}
              onChange={setMetrics}
              onSaved={setMetricsId}
            />
          )}

          {tab === 'milestones' && (
            <MilestonesTab
              milestones={milestones}
              onReload={loadMilestones}
            />
          )}

          {tab === 'documents' && (
            <DocumentsTab
              documents={documents}
              onReload={loadDocuments}
            />
          )}

        </div>
      </main>
    </div>
  )
}