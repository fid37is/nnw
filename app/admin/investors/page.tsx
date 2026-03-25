'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import {
  TrendingUp, Users, Plus, Edit2, Save, X,
  FileText, Milestone, DollarSign, RefreshCw, Trash2
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface InvestorUser {
  id: string
  full_name: string
  email: string
  role: string
  profile: InvestorProfile | null
}

interface InvestorProfile {
  id?: string
  user_id: string
  investment_amount: number
  investment_structure: 'equity' | 'revenue_share' | 'sponsorship'
  equity_percentage: number | null
  investment_date: string
  notes: string
}

interface Metrics {
  id?: string
  season_label: string
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
  notes: string
}

interface MilestoneRow {
  id?: string
  title: string
  target_date: string
  status: 'completed' | 'in_progress' | 'planned' | 'future'
  notes: string
  sort_order: number
}

interface DocumentRow {
  id?: string
  title: string
  description: string
  document_type: 'agreement' | 'report' | 'certificate' | 'other'
  file_url: string
  is_public: boolean
}

type Tab = 'investors' | 'metrics' | 'milestones' | 'documents'

const emptyMetrics: Metrics = {
  season_label: 'Season 1 — 2026',
  total_revenue: 0, sponsorship_revenue: 0, broadcasting_revenue: 0,
  ticket_revenue: 0, registration_revenue: 0, merchandise_revenue: 0,
  digital_revenue: 0, total_expenditure: 0, net_profit: 0, investor_return: 0,
  notes: '',
}

const emptyMilestone: MilestoneRow = {
  title: '', target_date: '', status: 'planned', notes: '', sort_order: 0,
}

const emptyDoc: DocumentRow = {
  title: '', description: '', document_type: 'agreement', file_url: '', is_public: false,
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminInvestorsPage() {
  const [tab, setTab]               = useState<Tab>('investors')
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)

  // Investor users
  const [investors, setInvestors]   = useState<InvestorUser[]>([])
  const [allUsers, setAllUsers]     = useState<{ id: string; full_name: string; email: string }[]>([])
  const [editProfile, setEditProfile] = useState<InvestorProfile | null>(null)
  const [showProfileForm, setShowProfileForm] = useState(false)

  // Metrics
  const [metrics, setMetrics]       = useState<Metrics>(emptyMetrics)
  const [metricsId, setMetricsId]   = useState<string | null>(null)

  // Milestones
  const [milestones, setMilestones] = useState<MilestoneRow[]>([])
  const [editMilestone, setEditMilestone] = useState<MilestoneRow | null>(null)
  const [showMilestoneForm, setShowMilestoneForm] = useState(false)

  // Documents
  const [documents, setDocuments]   = useState<DocumentRow[]>([])
  const [editDoc, setEditDoc]       = useState<DocumentRow | null>(null)
  const [showDocForm, setShowDocForm] = useState(false)

  useEffect(() => { checkAdminAndLoad() }, [])

  const checkAdminAndLoad = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/login'; return }
      const { data: u } = await supabase.from('users').select('role').eq('id', session.user.id).single()
      if (u?.role !== 'admin') { window.location.href = '/user/dashboard'; return }
      await loadAll()
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const loadAll = async () => {
    await Promise.all([loadInvestors(), loadMetrics(), loadMilestones(), loadDocuments(), loadAllUsers()])
  }

  const loadAllUsers = async () => {
    const { data } = await supabase.from('users').select('id, full_name, email').order('full_name')
    setAllUsers(data || [])
  }

  const loadInvestors = async () => {
    const { data: users } = await supabase
      .from('users').select('id, full_name, email, role').eq('role', 'investor').order('full_name')
    const { data: profiles } = await supabase.from('investor_profiles').select('*')
    const profileMap: Record<string, InvestorProfile> = {}
    ;(profiles || []).forEach((p: any) => { profileMap[p.user_id] = p })
    setInvestors((users || []).map((u: any) => ({ ...u, profile: profileMap[u.id] || null })))
  }

  const loadMetrics = async () => {
    const { data } = await supabase
      .from('investor_metrics').select('*').order('updated_at', { ascending: false }).limit(1).single()
    if (data) { setMetrics({ ...emptyMetrics, ...data, notes: data.notes || '' }); setMetricsId(data.id) }
  }

  const loadMilestones = async () => {
    const { data } = await supabase.from('investor_milestones').select('*').order('sort_order')
    setMilestones((data || []).map((m: any) => ({ ...m, notes: m.notes || '' })))
  }

  const loadDocuments = async () => {
    const { data } = await supabase.from('investor_documents').select('*').order('created_at', { ascending: false })
    setDocuments((data || []).map((d: any) => ({ ...d, description: d.description || '', file_url: d.file_url || '' })))
  }

  // ── Grant / revoke investor role ──────────────────────────────────────────
  const grantInvestorRole = async (userId: string) => {
    const { error } = await supabase.from('users').update({ role: 'investor' }).eq('id', userId)
    if (error) { toast.error('Failed to grant investor role'); return }
    toast.success('Investor role granted')
    await loadInvestors()
    await loadAllUsers()
  }

  const revokeInvestorRole = async (userId: string) => {
    if (!confirm('Remove investor access for this user?')) return
    const { error } = await supabase.from('users').update({ role: 'user' }).eq('id', userId)
    if (error) { toast.error('Failed to revoke role'); return }
    await supabase.from('investor_profiles').delete().eq('user_id', userId)
    toast.success('Investor access removed')
    await loadInvestors()
  }

  // ── Save investor profile ─────────────────────────────────────────────────
  const saveProfile = async () => {
    if (!editProfile) return
    setSaving(true)
    try {
      const payload = {
        user_id: editProfile.user_id,
        investment_amount: Number(editProfile.investment_amount),
        investment_structure: editProfile.investment_structure,
        equity_percentage: editProfile.equity_percentage ? Number(editProfile.equity_percentage) : null,
        investment_date: editProfile.investment_date || new Date().toISOString(),
        notes: editProfile.notes,
        updated_at: new Date().toISOString(),
      }
      const { error } = editProfile.id
        ? await supabase.from('investor_profiles').update(payload).eq('id', editProfile.id)
        : await supabase.from('investor_profiles').insert(payload)
      if (error) throw error
      toast.success('Profile saved')
      setShowProfileForm(false)
      setEditProfile(null)
      await loadInvestors()
    } catch (err) { toast.error('Failed to save profile') }
    finally { setSaving(false) }
  }

  // ── Save metrics ──────────────────────────────────────────────────────────
  const saveMetrics = async () => {
    setSaving(true)
    try {
      const payload = { ...metrics, updated_at: new Date().toISOString() }
      const { error } = metricsId
        ? await supabase.from('investor_metrics').update(payload).eq('id', metricsId)
        : await supabase.from('investor_metrics').insert(payload)
      if (error) throw error
      toast.success('Metrics saved — investors can see these now')
      await loadMetrics()
    } catch (err) { toast.error('Failed to save metrics') }
    finally { setSaving(false) }
  }

  // ── Save milestone ────────────────────────────────────────────────────────
  const saveMilestone = async () => {
    if (!editMilestone) return
    setSaving(true)
    try {
      const { error } = editMilestone.id
        ? await supabase.from('investor_milestones').update({ ...editMilestone, updated_at: new Date().toISOString() }).eq('id', editMilestone.id)
        : await supabase.from('investor_milestones').insert(editMilestone)
      if (error) throw error
      toast.success('Milestone saved')
      setShowMilestoneForm(false); setEditMilestone(null)
      await loadMilestones()
    } catch (err) { toast.error('Failed to save milestone') }
    finally { setSaving(false) }
  }

  const deleteMilestone = async (id: string) => {
    if (!confirm('Delete this milestone?')) return
    await supabase.from('investor_milestones').delete().eq('id', id)
    toast.success('Deleted'); await loadMilestones()
  }

  // ── Save document ─────────────────────────────────────────────────────────
  const saveDocument = async () => {
    if (!editDoc) return
    setSaving(true)
    try {
      const { error } = editDoc.id
        ? await supabase.from('investor_documents').update({ ...editDoc, updated_at: new Date().toISOString() }).eq('id', editDoc.id)
        : await supabase.from('investor_documents').insert(editDoc)
      if (error) throw error
      toast.success('Document saved')
      setShowDocForm(false); setEditDoc(null)
      await loadDocuments()
    } catch (err) { toast.error('Failed to save document') }
    finally { setSaving(false) }
  }

  const deleteDocument = async (id: string) => {
    if (!confirm('Delete this document?')) return
    await supabase.from('investor_documents').delete().eq('id', id)
    toast.success('Deleted'); await loadDocuments()
  }

  // ── UI helpers ────────────────────────────────────────────────────────────
  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500'
  const labelCls = 'block text-xs font-semibold text-gray-700 mb-1'
  const fmt = (n: number) => (n / 1_000_000).toFixed(1) + 'M'

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 min-h-screen flex items-center justify-center">
          <div className="animate-spin w-10 h-10 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-8 lg:p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-naija-green-900">Investor Management</h1>
              <p className="text-gray-500 text-sm mt-1">Manage investor accounts, metrics, milestones, and documents</p>
            </div>
            <button onClick={() => loadAll()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
              <RefreshCw size={15}/> Refresh
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-8 overflow-x-auto">
            {([
              { key: 'investors',  label: 'Investors',  icon: <Users size={15}/> },
              { key: 'metrics',    label: 'Metrics',    icon: <DollarSign size={15}/> },
              { key: 'milestones', label: 'Milestones', icon: <TrendingUp size={15}/> },
              { key: 'documents',  label: 'Documents',  icon: <FileText size={15}/> },
            ] as const).map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition flex-shrink-0 ${tab === t.key ? 'bg-white text-naija-green-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          {/* ── TAB: INVESTORS ── */}
          {tab === 'investors' && (
            <div className="space-y-6">
              {/* Grant access */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-bold text-gray-900 mb-4">Grant Investor Access</h2>
                <p className="text-sm text-gray-500 mb-4">Select a registered user and grant them investor portal access.</p>
                <div className="flex gap-3 flex-wrap">
                  <select id="grant-select" className={`${inputCls} max-w-xs`}>
                    <option value="">Select a user...</option>
                    {allUsers.filter(u => !investors.find(i => i.id === u.id)).map(u => (
                      <option key={u.id} value={u.id}>{u.full_name} — {u.email}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      const sel = document.getElementById('grant-select') as HTMLSelectElement
                      if (sel.value) grantInvestorRole(sel.value)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-naija-green-600 text-white rounded-lg text-sm font-semibold hover:bg-naija-green-700 transition">
                    <Plus size={15}/> Grant Access
                  </button>
                </div>
              </div>

              {/* Investor list */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">Active Investors ({investors.length})</h2>
                </div>
                {investors.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">No investors yet</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {investors.map(inv => (
                      <div key={inv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">{inv.full_name}</p>
                          <p className="text-xs text-gray-500">{inv.email}</p>
                          {inv.profile ? (
                            <p className="text-xs text-naija-green-700 mt-1">
                              ₦{(inv.profile.investment_amount/1_000_000).toFixed(1)}M · {inv.profile.investment_structure}
                              {inv.profile.equity_percentage ? ` · ${inv.profile.equity_percentage}%` : ''}
                            </p>
                          ) : (
                            <p className="text-xs text-orange-500 mt-1">No investment profile set</p>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => {
                              setEditProfile(inv.profile || { user_id: inv.id, investment_amount: 0, investment_structure: 'equity', equity_percentage: null, investment_date: new Date().toISOString().split('T')[0], notes: '' })
                              setShowProfileForm(true)
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-naija-green-50 text-naija-green-700 border border-naija-green-200 rounded-lg text-xs font-medium hover:bg-naija-green-100">
                            <Edit2 size={13}/> {inv.profile ? 'Edit Profile' : 'Set Profile'}
                          </button>
                          <button onClick={() => revokeInvestorRole(inv.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100">
                            <X size={13}/> Revoke
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile form modal */}
              {showProfileForm && editProfile && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">Investment Profile</h3>
                      <button onClick={() => { setShowProfileForm(false); setEditProfile(null) }}><X size={20}/></button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className={labelCls}>Investment Amount (₦)</label>
                        <input type="number" className={inputCls} value={editProfile.investment_amount}
                          onChange={e => setEditProfile({ ...editProfile, investment_amount: Number(e.target.value) })}/>
                      </div>
                      <div>
                        <label className={labelCls}>Structure</label>
                        <select className={inputCls} value={editProfile.investment_structure}
                          onChange={e => setEditProfile({ ...editProfile, investment_structure: e.target.value as any })}>
                          <option value="equity">Equity Ownership</option>
                          <option value="revenue_share">Revenue Share</option>
                          <option value="sponsorship">Sponsorship</option>
                        </select>
                      </div>
                      {editProfile.investment_structure === 'equity' && (
                        <div>
                          <label className={labelCls}>Equity % (e.g. 10.00)</label>
                          <input type="number" step="0.01" className={inputCls} value={editProfile.equity_percentage || ''}
                            onChange={e => setEditProfile({ ...editProfile, equity_percentage: Number(e.target.value) })}/>
                        </div>
                      )}
                      <div>
                        <label className={labelCls}>Investment Date</label>
                        <input type="date" className={inputCls} value={editProfile.investment_date?.split('T')[0] || ''}
                          onChange={e => setEditProfile({ ...editProfile, investment_date: e.target.value })}/>
                      </div>
                      <div>
                        <label className={labelCls}>Notes (internal)</label>
                        <textarea rows={2} className={inputCls} value={editProfile.notes}
                          onChange={e => setEditProfile({ ...editProfile, notes: e.target.value })}/>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={saveProfile} disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-naija-green-600 text-white rounded-lg font-semibold text-sm hover:bg-naija-green-700 disabled:opacity-60">
                        <Save size={15}/>{saving ? 'Saving...' : 'Save Profile'}
                      </button>
                      <button onClick={() => { setShowProfileForm(false); setEditProfile(null) }}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB: METRICS ── */}
          {tab === 'metrics' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-gray-900">Financial Metrics</h2>
                  <p className="text-sm text-gray-500 mt-1">These figures are visible to all investors on their dashboard. Update them regularly.</p>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className={labelCls}>Season Label</label>
                  <input type="text" className={inputCls} value={metrics.season_label}
                    onChange={e => setMetrics({ ...metrics, season_label: e.target.value })}
                    placeholder="e.g. Season 1 — 2026"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {([
                    ['sponsorship_revenue',   'Sponsorship Revenue (₦)'],
                    ['broadcasting_revenue',  'Broadcasting & Streaming Revenue (₦)'],
                    ['ticket_revenue',        'Ticket Sales & Events Revenue (₦)'],
                    ['registration_revenue',  'Registration Fees Revenue (₦)'],
                    ['merchandise_revenue',   'Merchandise Revenue (₦)'],
                    ['digital_revenue',       'Digital Platform Revenue (₦)'],
                    ['total_expenditure',     'Total Expenditure (₦)'],
                    ['investor_return',       'Total Returns Distributed to Investors (₦)'],
                  ] as const).map(([field, label]) => (
                    <div key={field}>
                      <label className={labelCls}>{label}</label>
                      <input type="number" className={inputCls} value={(metrics as any)[field]}
                        onChange={e => {
                          const updated = { ...metrics, [field]: Number(e.target.value) }
                          // Auto-calculate totals
                          updated.total_revenue = updated.sponsorship_revenue + updated.broadcasting_revenue +
                            updated.ticket_revenue + updated.registration_revenue +
                            updated.merchandise_revenue + updated.digital_revenue
                          updated.net_profit = updated.total_revenue - updated.total_expenditure
                          setMetrics(updated)
                        }}/>
                    </div>
                  ))}
                </div>
                {/* Summary */}
                <div className="bg-naija-green-50 rounded-lg p-4 border border-naija-green-200">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div><p className="text-xs text-gray-500 mb-1">Total Revenue</p><p className="font-bold text-naija-green-700">₦{fmt(metrics.total_revenue)}</p></div>
                    <div><p className="text-xs text-gray-500 mb-1">Expenditure</p><p className="font-bold text-orange-600">₦{fmt(metrics.total_expenditure)}</p></div>
                    <div><p className="text-xs text-gray-500 mb-1">Net Profit</p><p className="font-bold text-blue-700">₦{fmt(metrics.net_profit)}</p></div>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Notes (visible to investors)</label>
                  <textarea rows={2} className={inputCls} value={metrics.notes}
                    onChange={e => setMetrics({ ...metrics, notes: e.target.value })}
                    placeholder="Any additional context for investors..."/>
                </div>
                <button onClick={saveMetrics} disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-naija-green-600 text-white rounded-lg font-semibold text-sm hover:bg-naija-green-700 disabled:opacity-60">
                  <Save size={15}/>{saving ? 'Saving...' : 'Save & Publish Metrics'}
                </button>
              </div>
            </div>
          )}

          {/* ── TAB: MILESTONES ── */}
          {tab === 'milestones' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => { setEditMilestone({ ...emptyMilestone }); setShowMilestoneForm(true) }}
                  className="flex items-center gap-2 px-4 py-2 bg-naija-green-600 text-white rounded-lg text-sm font-semibold hover:bg-naija-green-700">
                  <Plus size={15}/> Add Milestone
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {milestones.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">No milestones yet</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {milestones.map(m => (
                      <div key={m.id} className="p-4 flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{m.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                              m.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                              m.status === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                              m.status === 'planned' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                              'bg-gray-100 text-gray-600 border-gray-200'}`}>{m.status}</span>
                            {m.target_date && <p className="text-xs text-gray-400">{new Date(m.target_date).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })}</p>}
                          </div>
                          {m.notes && <p className="text-xs text-gray-500 mt-1">{m.notes}</p>}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => { setEditMilestone(m); setShowMilestoneForm(true) }}
                            className="p-1.5 text-gray-500 hover:text-naija-green-600 hover:bg-naija-green-50 rounded"><Edit2 size={14}/></button>
                          <button onClick={() => m.id && deleteMilestone(m.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {showMilestoneForm && editMilestone && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">{editMilestone.id ? 'Edit' : 'Add'} Milestone</h3>
                      <button onClick={() => { setShowMilestoneForm(false); setEditMilestone(null) }}><X size={20}/></button>
                    </div>
                    <div className="space-y-4">
                      <div><label className={labelCls}>Title</label>
                        <input className={inputCls} value={editMilestone.title}
                          onChange={e => setEditMilestone({ ...editMilestone, title: e.target.value })}/></div>
                      <div><label className={labelCls}>Target Date</label>
                        <input type="date" className={inputCls} value={editMilestone.target_date}
                          onChange={e => setEditMilestone({ ...editMilestone, target_date: e.target.value })}/></div>
                      <div><label className={labelCls}>Status</label>
                        <select className={inputCls} value={editMilestone.status}
                          onChange={e => setEditMilestone({ ...editMilestone, status: e.target.value as any })}>
                          <option value="planned">Planned</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="future">Future</option>
                        </select></div>
                      <div><label className={labelCls}>Sort Order</label>
                        <input type="number" className={inputCls} value={editMilestone.sort_order}
                          onChange={e => setEditMilestone({ ...editMilestone, sort_order: Number(e.target.value) })}/></div>
                      <div><label className={labelCls}>Notes (optional)</label>
                        <textarea rows={2} className={inputCls} value={editMilestone.notes}
                          onChange={e => setEditMilestone({ ...editMilestone, notes: e.target.value })}/></div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={saveMilestone} disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-naija-green-600 text-white rounded-lg font-semibold text-sm hover:bg-naija-green-700 disabled:opacity-60">
                        <Save size={15}/>{saving ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={() => { setShowMilestoneForm(false); setEditMilestone(null) }}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB: DOCUMENTS ── */}
          {tab === 'documents' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => { setEditDoc({ ...emptyDoc }); setShowDocForm(true) }}
                  className="flex items-center gap-2 px-4 py-2 bg-naija-green-600 text-white rounded-lg text-sm font-semibold hover:bg-naija-green-700">
                  <Plus size={15}/> Add Document
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {documents.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">No documents uploaded yet</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {documents.map(d => (
                      <div key={d.id} className="p-4 flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{d.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{d.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{d.document_type}</span>
                            {d.file_url && <span className="text-xs text-naija-green-600">File attached</span>}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => { setEditDoc(d); setShowDocForm(true) }}
                            className="p-1.5 text-gray-500 hover:text-naija-green-600 hover:bg-naija-green-50 rounded"><Edit2 size={14}/></button>
                          <button onClick={() => d.id && deleteDocument(d.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {showDocForm && editDoc && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">{editDoc.id ? 'Edit' : 'Add'} Document</h3>
                      <button onClick={() => { setShowDocForm(false); setEditDoc(null) }}><X size={20}/></button>
                    </div>
                    <div className="space-y-4">
                      <div><label className={labelCls}>Title</label>
                        <input className={inputCls} value={editDoc.title}
                          onChange={e => setEditDoc({ ...editDoc, title: e.target.value })}/></div>
                      <div><label className={labelCls}>Description</label>
                        <textarea rows={2} className={inputCls} value={editDoc.description}
                          onChange={e => setEditDoc({ ...editDoc, description: e.target.value })}/></div>
                      <div><label className={labelCls}>Type</label>
                        <select className={inputCls} value={editDoc.document_type}
                          onChange={e => setEditDoc({ ...editDoc, document_type: e.target.value as any })}>
                          <option value="agreement">Agreement</option>
                          <option value="report">Report</option>
                          <option value="certificate">Certificate</option>
                          <option value="other">Other</option>
                        </select></div>
                      <div><label className={labelCls}>File URL (Supabase Storage or external link)</label>
                        <input className={inputCls} value={editDoc.file_url}
                          placeholder="https://..."
                          onChange={e => setEditDoc({ ...editDoc, file_url: e.target.value })}/></div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={saveDocument} disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-naija-green-600 text-white rounded-lg font-semibold text-sm hover:bg-naija-green-700 disabled:opacity-60">
                        <Save size={15}/>{saving ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={() => { setShowDocForm(false); setEditDoc(null) }}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
