'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import {
  TrendingUp, Users, Plus, Edit2, Save, X,
  FileText, DollarSign, RefreshCw, Trash2,
  Eye, EyeOff, UserPlus, Copy, CheckCircle,
  Mail, Lock
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
interface InvestorUser {
  id: string
  full_name: string
  email: string
  role: string
  must_change_password: boolean
  created_at: string
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

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminInvestorsPage() {
  const [tab, setTab]             = useState<Tab>('investors')
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)

  // Investors
  const [investors, setInvestors] = useState<InvestorUser[]>([])
  const [editProfile, setEditProfile] = useState<InvestorProfile | null>(null)
  const [showProfileForm, setShowProfileForm] = useState(false)

  // Create investor account
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState({
    full_name: '', email: '', phone: '',
    password: '', confirm_password: '',
    investment_amount: 0,
    investment_structure: 'equity' as 'equity' | 'revenue_share' | 'sponsorship',
    equity_percentage: '',
    notes: '',
  })
  const [showPw, setShowPw]   = useState(false)
  const [showCf, setShowCf]   = useState(false)
  const [copiedPw, setCopiedPw] = useState(false)
  const [creatingUser, setCreatingUser] = useState(false)

  // Metrics
  const [metrics, setMetrics]   = useState<Metrics>(emptyMetrics)
  const [metricsId, setMetricsId] = useState<string | null>(null)

  // Milestones
  const [milestones, setMilestones] = useState<MilestoneRow[]>([])
  const [editMilestone, setEditMilestone] = useState<MilestoneRow | null>(null)
  const [showMilestoneForm, setShowMilestoneForm] = useState(false)

  // Documents
  const [documents, setDocuments] = useState<DocumentRow[]>([])
  const [editDoc, setEditDoc]     = useState<DocumentRow | null>(null)
  const [showDocForm, setShowDocForm] = useState(false)

  useEffect(() => { init() }, [])

  const init = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { window.location.href = '/login'; return }
    const { data: u } = await supabase.from('users').select('role').eq('id', session.user.id).single()
    if (u?.role !== 'admin') { window.location.href = '/user/dashboard'; return }
    await loadAll()
    setLoading(false)
  }

  const loadAll = async () => {
    await Promise.all([loadInvestors(), loadMetrics(), loadMilestones(), loadDocuments()])
  }

  const loadInvestors = async () => {
    const { data: users } = await supabase
      .from('users')
      .select('id, full_name, email, role, must_change_password, created_at')
      .eq('role', 'investor')
      .order('created_at', { ascending: false })

    const { data: profiles } = await supabase.from('investor_profiles').select('*')
    const pm: Record<string, InvestorProfile> = {}
    ;(profiles || []).forEach((p: any) => { pm[p.user_id] = p })
    setInvestors((users || []).map((u: any) => ({ ...u, profile: pm[u.id] || null })))
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

  // ── Generate password suggestion ───────────────────────────────────────────
  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$'
    let pw = ''
    for (let i = 0; i < 12; i++) pw += chars[Math.floor(Math.random() * chars.length)]
    setCreateForm(f => ({ ...f, password: pw, confirm_password: pw }))
  }

  const copyPassword = () => {
    navigator.clipboard.writeText(createForm.password)
    setCopiedPw(true)
    setTimeout(() => setCopiedPw(false), 2000)
    toast.success('Password copied')
  }

  // ── Create investor account via API route (bypasses email verification) ───
  const handleCreateInvestor = async () => {
    if (!createForm.full_name.trim()) { toast.error('Full name is required'); return }
    if (!createForm.email.includes('@')) { toast.error('Valid email required'); return }
    if (createForm.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    if (createForm.password !== createForm.confirm_password) { toast.error('Passwords do not match'); return }

    setCreatingUser(true)
    try {
      // Get admin's current session token to authenticate the API call
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const res = await fetch('/api/admin/create-investor', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          full_name:            createForm.full_name,
          email:                createForm.email,
          phone:                createForm.phone,
          password:             createForm.password,
          investment_amount:    createForm.investment_amount,
          investment_structure: createForm.investment_structure,
          equity_percentage:    createForm.equity_percentage,
          notes:                createForm.notes,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Failed to create account')
      }

      toast.success(`✓ Account created for ${createForm.full_name} — they can log in immediately`)

      setCreateForm({
        full_name: '', email: '', phone: '', password: '', confirm_password: '',
        investment_amount: 0, investment_structure: 'equity', equity_percentage: '', notes: '',
      })
      setShowCreateForm(false)
      await loadInvestors()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create investor account')
    } finally {
      setCreatingUser(false)
    }
  }

  // ── Revoke access ──────────────────────────────────────────────────────────
  const revokeAccess = async (userId: string, name: string) => {
    if (!confirm(`Remove investor access for ${name}? This will prevent them from logging into the investor portal.`)) return
    const { error } = await supabase.from('users').update({ role: 'user' }).eq('id', userId)
    if (error) { toast.error('Failed to revoke access'); return }
    toast.success(`Access removed for ${name}`)
    await loadInvestors()
  }

  // ── Reset password flag ────────────────────────────────────────────────────
  const forcePasswordReset = async (userId: string) => {
    const { error } = await supabase.from('users').update({ must_change_password: true }).eq('id', userId)
    if (error) { toast.error('Failed'); return }
    toast.success('Investor will be prompted to change password on next login')
    await loadInvestors()
  }

  // ── Save profile ──────────────────────────────────────────────────────────
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
      toast.success('Investment profile saved')
      setShowProfileForm(false); setEditProfile(null)
      await loadInvestors()
    } catch { toast.error('Failed to save profile') }
    finally { setSaving(false) }
  }

  // ── Save metrics ───────────────────────────────────────────────────────────
  const saveMetrics = async () => {
    setSaving(true)
    try {
      const payload = { ...metrics, updated_at: new Date().toISOString() }
      const { error } = metricsId
        ? await supabase.from('investor_metrics').update(payload).eq('id', metricsId)
        : await supabase.from('investor_metrics').insert(payload)
      if (error) throw error
      toast.success('Metrics published to investor dashboards')
      await loadMetrics()
    } catch { toast.error('Failed to save metrics') }
    finally { setSaving(false) }
  }

  // ── Save milestone ─────────────────────────────────────────────────────────
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
    } catch { toast.error('Failed to save milestone') }
    finally { setSaving(false) }
  }

  const deleteMilestone = async (id: string) => {
    if (!confirm('Delete this milestone?')) return
    await supabase.from('investor_milestones').delete().eq('id', id)
    toast.success('Deleted'); await loadMilestones()
  }

  // ── Save document ──────────────────────────────────────────────────────────
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
    } catch { toast.error('Failed to save document') }
    finally { setSaving(false) }
  }

  const deleteDocument = async (id: string) => {
    if (!confirm('Delete this document?')) return
    await supabase.from('investor_documents').delete().eq('id', id)
    toast.success('Deleted'); await loadDocuments()
  }

  // ── UI helpers ─────────────────────────────────────────────────────────────
  const ic = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500'
  const lc = 'block text-xs font-semibold text-gray-700 mb-1.5'
  const fmt = (n: number) => (n / 1_000_000).toFixed(1) + 'M'

  if (loading) return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full" />
      </main>
    </div>
  )

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="mx-auto px-4 py-8 lg:p-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-naija-green-900">Investor Management</h1>
              <p className="text-gray-500 text-sm mt-1">Create accounts, manage profiles, metrics, milestones and documents</p>
            </div>
            <button onClick={loadAll} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition">
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

              {/* Create account button */}
              <div className="flex justify-end">
                <button onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-naija-green-600 text-white rounded-lg text-sm font-bold hover:bg-naija-green-700 transition shadow-sm">
                  <UserPlus size={16}/> Create Investor Account
                </button>
              </div>

              {/* Investor list */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900">Active Investors ({investors.length})</h2>
                </div>
                {investors.length === 0 ? (
                  <div className="p-10 text-center">
                    <Users size={36} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm font-medium">No investor accounts yet</p>
                    <p className="text-gray-400 text-xs mt-1">Click "Create Investor Account" to add one</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {investors.map(inv => (
                      <div key={inv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-900">{inv.full_name}</p>
                            {inv.must_change_password && (
                              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
                                Awaiting password change
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{inv.email}</p>
                          {inv.profile ? (
                            <p className="text-xs text-naija-green-700 mt-1">
                              ₦{(inv.profile.investment_amount / 1_000_000).toFixed(1)}M
                              · {inv.profile.investment_structure}
                              {inv.profile.equity_percentage ? ` · ${inv.profile.equity_percentage}%` : ''}
                            </p>
                          ) : (
                            <p className="text-xs text-orange-500 mt-1">No investment profile set</p>
                          )}
                          <p className="text-xs text-gray-400 mt-0.5">
                            Added {new Date(inv.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-wrap flex-shrink-0">
                          <button
                            onClick={() => {
                              setEditProfile(inv.profile || {
                                user_id: inv.id, investment_amount: 0,
                                investment_structure: 'equity', equity_percentage: null,
                                investment_date: new Date().toISOString().split('T')[0], notes: ''
                              })
                              setShowProfileForm(true)
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-naija-green-50 text-naija-green-700 border border-naija-green-200 rounded-lg text-xs font-medium hover:bg-naija-green-100 transition">
                            <Edit2 size={13}/>{inv.profile ? 'Edit Profile' : 'Set Profile'}
                          </button>
                          <button onClick={() => forcePasswordReset(inv.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium hover:bg-blue-100 transition">
                            <Lock size={13}/> Reset PW
                          </button>
                          <button onClick={() => revokeAccess(inv.id, inv.full_name)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100 transition">
                            <X size={13}/> Revoke
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Create Investor Modal ── */}
              {showCreateForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
                    <div className="bg-gradient-to-br from-naija-green-700 to-naija-green-800 rounded-t-2xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white">Create Investor Account</h3>
                          <p className="text-naija-green-200 text-sm mt-0.5">
                            The investor will be prompted to change their password on first login.
                          </p>
                        </div>
                        <button onClick={() => setShowCreateForm(false)} className="text-white/70 hover:text-white">
                          <X size={22}/>
                        </button>
                      </div>
                    </div>

                    <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

                      {/* Personal details */}
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Account Details</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className={lc}>Full Name *</label>
                          <input className={ic} value={createForm.full_name}
                            onChange={e => setCreateForm(f => ({ ...f, full_name: e.target.value }))}
                            placeholder="e.g. Chukwuemeka Obi" />
                        </div>
                        <div>
                          <label className={lc}>Email Address *</label>
                          <div className="relative">
                            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input type="email" className={`${ic} pl-9`} value={createForm.email}
                              onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))}
                              placeholder="investor@email.com" />
                          </div>
                        </div>
                        <div>
                          <label className={lc}>Phone (optional)</label>
                          <input className={ic} value={createForm.phone}
                            onChange={e => setCreateForm(f => ({ ...f, phone: e.target.value }))}
                            placeholder="08012345678" />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className={`${lc} mb-0`}>Temporary Password *</label>
                          <button type="button" onClick={generatePassword}
                            className="text-xs text-naija-green-600 hover:text-naija-green-700 font-semibold">
                            Generate strong password
                          </button>
                        </div>
                        <div className="relative">
                          <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                          <input type={showPw ? 'text' : 'password'} className={`${ic} pl-9 pr-20`}
                            value={createForm.password}
                            onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))}
                            placeholder="Min 8 characters" />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            {createForm.password && (
                              <button type="button" onClick={copyPassword}
                                className="p-1 text-gray-400 hover:text-naija-green-600 transition">
                                {copiedPw ? <CheckCircle size={15} className="text-naija-green-600"/> : <Copy size={15}/>}
                              </button>
                            )}
                            <button type="button" onClick={() => setShowPw(!showPw)}
                              className="p-1 text-gray-400 hover:text-gray-600">
                              {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Copy this before sending — you won't see it again. The investor must change it on first login.
                        </p>
                      </div>

                      <div>
                        <label className={lc}>Confirm Password *</label>
                        <div className="relative">
                          <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                          <input type={showCf ? 'text' : 'password'} className={`${ic} pl-9 pr-10`}
                            value={createForm.confirm_password}
                            onChange={e => setCreateForm(f => ({ ...f, confirm_password: e.target.value }))}
                            placeholder="Repeat password" />
                          <button type="button" onClick={() => setShowCf(!showCf)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showCf ? <EyeOff size={15}/> : <Eye size={15}/>}
                          </button>
                        </div>
                        {createForm.confirm_password && createForm.password !== createForm.confirm_password && (
                          <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                        )}
                      </div>

                      {/* Investment profile */}
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Investment Profile (optional — can set later)</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className={lc}>Investment Amount (₦)</label>
                            <input type="number" className={ic} value={createForm.investment_amount || ''}
                              onChange={e => setCreateForm(f => ({ ...f, investment_amount: Number(e.target.value) }))}
                              placeholder="e.g. 100000000" />
                          </div>
                          <div>
                            <label className={lc}>Structure</label>
                            <select className={ic} value={createForm.investment_structure}
                              onChange={e => setCreateForm(f => ({ ...f, investment_structure: e.target.value as any }))}>
                              <option value="equity">Equity Ownership</option>
                              <option value="revenue_share">Revenue Share</option>
                              <option value="sponsorship">Sponsorship</option>
                            </select>
                          </div>
                          {createForm.investment_structure === 'equity' && (
                            <div>
                              <label className={lc}>Equity % (e.g. 10.00)</label>
                              <input type="number" step="0.01" className={ic} value={createForm.equity_percentage}
                                onChange={e => setCreateForm(f => ({ ...f, equity_percentage: e.target.value }))}
                                placeholder="10.00" />
                            </div>
                          )}
                          <div className={createForm.investment_structure === 'equity' ? '' : 'sm:col-span-2'}>
                            <label className={lc}>Notes (internal)</label>
                            <textarea rows={2} className={ic} value={createForm.notes}
                              onChange={e => setCreateForm(f => ({ ...f, notes: e.target.value }))}
                              placeholder="Any internal notes about this investor..." />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border-t border-gray-100 flex gap-3">
                      <button onClick={handleCreateInvestor} disabled={creatingUser}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-naija-green-600 text-white rounded-xl font-bold text-sm hover:bg-naija-green-700 disabled:opacity-60 transition">
                        <UserPlus size={16}/>
                        {creatingUser ? 'Creating Account...' : 'Create Investor Account'}
                      </button>
                      <button onClick={() => setShowCreateForm(false)}
                        className="px-5 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Edit Profile Modal ── */}
              {showProfileForm && editProfile && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                      <h3 className="font-bold text-gray-900">Investment Profile</h3>
                      <button onClick={() => { setShowProfileForm(false); setEditProfile(null) }}><X size={20}/></button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <label className={lc}>Investment Amount (₦)</label>
                        <input type="number" className={ic} value={editProfile.investment_amount}
                          onChange={e => setEditProfile({ ...editProfile, investment_amount: Number(e.target.value) })}/>
                      </div>
                      <div>
                        <label className={lc}>Structure</label>
                        <select className={ic} value={editProfile.investment_structure}
                          onChange={e => setEditProfile({ ...editProfile, investment_structure: e.target.value as any })}>
                          <option value="equity">Equity Ownership</option>
                          <option value="revenue_share">Revenue Share</option>
                          <option value="sponsorship">Sponsorship</option>
                        </select>
                      </div>
                      {editProfile.investment_structure === 'equity' && (
                        <div>
                          <label className={lc}>Equity %</label>
                          <input type="number" step="0.01" className={ic} value={editProfile.equity_percentage || ''}
                            onChange={e => setEditProfile({ ...editProfile, equity_percentage: Number(e.target.value) })}/>
                        </div>
                      )}
                      <div>
                        <label className={lc}>Investment Date</label>
                        <input type="date" className={ic} value={editProfile.investment_date?.split('T')[0] || ''}
                          onChange={e => setEditProfile({ ...editProfile, investment_date: e.target.value })}/>
                      </div>
                      <div>
                        <label className={lc}>Notes</label>
                        <textarea rows={2} className={ic} value={editProfile.notes}
                          onChange={e => setEditProfile({ ...editProfile, notes: e.target.value })}/>
                      </div>
                    </div>
                    <div className="flex gap-3 p-6 border-t border-gray-100">
                      <button onClick={saveProfile} disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-naija-green-600 text-white rounded-xl font-bold text-sm hover:bg-naija-green-700 disabled:opacity-60">
                        <Save size={15}/>{saving ? 'Saving...' : 'Save Profile'}
                      </button>
                      <button onClick={() => { setShowProfileForm(false); setEditProfile(null) }}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600">Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB: METRICS ── */}
          {tab === 'metrics' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="font-bold text-gray-900 text-lg">Financial Metrics</h2>
                <p className="text-sm text-gray-500 mt-1">Visible to all investors on their dashboard. Update regularly.</p>
              </div>
              <div className="space-y-5">
                <div>
                  <label className={lc}>Season Label</label>
                  <input className={ic} value={metrics.season_label}
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
                      <label className={lc}>{label}</label>
                      <input type="number" className={ic} value={(metrics as any)[field]}
                        onChange={e => {
                          const u = { ...metrics, [field]: Number(e.target.value) }
                          u.total_revenue = u.sponsorship_revenue + u.broadcasting_revenue +
                            u.ticket_revenue + u.registration_revenue + u.merchandise_revenue + u.digital_revenue
                          u.net_profit = u.total_revenue - u.total_expenditure
                          setMetrics(u)
                        }}/>
                    </div>
                  ))}
                </div>
                <div className="bg-naija-green-50 rounded-xl p-4 border border-naija-green-200">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[['Total Revenue', fmt(metrics.total_revenue), 'text-naija-green-700'],
                      ['Expenditure',    fmt(metrics.total_expenditure), 'text-orange-600'],
                      ['Net Profit',     fmt(metrics.net_profit), 'text-blue-700']].map(([l,v,c])=>(
                      <div key={l}><p className="text-xs text-gray-500 mb-1">{l}</p><p className={`font-bold ${c}`}>₦{v}</p></div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={lc}>Notes (shown to investors)</label>
                  <textarea rows={2} className={ic} value={metrics.notes}
                    onChange={e => setMetrics({ ...metrics, notes: e.target.value })}
                    placeholder="Any additional context..."/>
                </div>
                <button onClick={saveMetrics} disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-naija-green-600 text-white rounded-xl font-bold text-sm hover:bg-naija-green-700 disabled:opacity-60 transition">
                  <Save size={15}/>{saving ? 'Saving...' : 'Save & Publish Metrics'}
                </button>
              </div>
            </div>
          )}

          {/* ── TAB: MILESTONES ── */}
          {tab === 'milestones' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => { setEditMilestone({ title:'',target_date:'',status:'planned',notes:'',sort_order:milestones.length+1 }); setShowMilestoneForm(true) }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-naija-green-600 text-white rounded-lg text-sm font-bold hover:bg-naija-green-700 transition">
                  <Plus size={15}/> Add Milestone
                </button>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {milestones.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 text-sm">No milestones yet</div>
                ) : milestones.map(m => (
                  <div key={m.id} className="p-4 flex items-start justify-between gap-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{m.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                          m.status==='completed'?'bg-green-100 text-green-700 border-green-200':
                          m.status==='in_progress'?'bg-blue-100 text-blue-700 border-blue-200':
                          m.status==='planned'?'bg-yellow-100 text-yellow-700 border-yellow-200':
                          'bg-gray-100 text-gray-600 border-gray-200'}`}>{m.status}</span>
                        {m.target_date && <p className="text-xs text-gray-400">{new Date(m.target_date).toLocaleDateString('en-NG',{month:'short',year:'numeric'})}</p>}
                      </div>
                      {m.notes && <p className="text-xs text-gray-500 mt-1">{m.notes}</p>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => { setEditMilestone(m); setShowMilestoneForm(true) }}
                        className="p-1.5 text-gray-400 hover:text-naija-green-600 hover:bg-naija-green-50 rounded transition"><Edit2 size={14}/></button>
                      <button onClick={() => m.id && deleteMilestone(m.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
              {showMilestoneForm && editMilestone && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-bold text-gray-900">{editMilestone.id?'Edit':'Add'} Milestone</h3>
                      <button onClick={() => { setShowMilestoneForm(false); setEditMilestone(null) }}><X size={20}/></button>
                    </div>
                    <div className="space-y-4">
                      <div><label className={lc}>Title</label><input className={ic} value={editMilestone.title} onChange={e=>setEditMilestone({...editMilestone,title:e.target.value})}/></div>
                      <div><label className={lc}>Target Date</label><input type="date" className={ic} value={editMilestone.target_date} onChange={e=>setEditMilestone({...editMilestone,target_date:e.target.value})}/></div>
                      <div><label className={lc}>Status</label>
                        <select className={ic} value={editMilestone.status} onChange={e=>setEditMilestone({...editMilestone,status:e.target.value as any})}>
                          <option value="planned">Planned</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="future">Future</option>
                        </select></div>
                      <div><label className={lc}>Sort Order</label><input type="number" className={ic} value={editMilestone.sort_order} onChange={e=>setEditMilestone({...editMilestone,sort_order:Number(e.target.value)})}/></div>
                      <div><label className={lc}>Notes</label><textarea rows={2} className={ic} value={editMilestone.notes} onChange={e=>setEditMilestone({...editMilestone,notes:e.target.value})}/></div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={saveMilestone} disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-naija-green-600 text-white rounded-xl font-bold text-sm hover:bg-naija-green-700 disabled:opacity-60">
                        <Save size={15}/>{saving?'Saving...':'Save'}
                      </button>
                      <button onClick={()=>{setShowMilestoneForm(false);setEditMilestone(null)}}
                        className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600">Cancel</button>
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
                <button onClick={() => { setEditDoc({title:'',description:'',document_type:'agreement',file_url:'',is_public:false}); setShowDocForm(true) }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-naija-green-600 text-white rounded-lg text-sm font-bold hover:bg-naija-green-700 transition">
                  <Plus size={15}/> Add Document
                </button>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {documents.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 text-sm">No documents uploaded yet</div>
                ) : documents.map(d => (
                  <div key={d.id} className="p-4 flex items-start justify-between gap-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{d.title}</p>
                      {d.description && <p className="text-xs text-gray-500 mt-0.5">{d.description}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{d.document_type}</span>
                        {d.file_url && <span className="text-xs text-naija-green-600">✓ File URL set</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => { setEditDoc(d); setShowDocForm(true) }}
                        className="p-1.5 text-gray-400 hover:text-naija-green-600 hover:bg-naija-green-50 rounded transition"><Edit2 size={14}/></button>
                      <button onClick={() => d.id && deleteDocument(d.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
              {showDocForm && editDoc && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-bold text-gray-900">{editDoc.id?'Edit':'Add'} Document</h3>
                      <button onClick={()=>{setShowDocForm(false);setEditDoc(null)}}><X size={20}/></button>
                    </div>
                    <div className="space-y-4">
                      <div><label className={lc}>Title</label><input className={ic} value={editDoc.title} onChange={e=>setEditDoc({...editDoc,title:e.target.value})}/></div>
                      <div><label className={lc}>Description</label><textarea rows={2} className={ic} value={editDoc.description} onChange={e=>setEditDoc({...editDoc,description:e.target.value})}/></div>
                      <div><label className={lc}>Type</label>
                        <select className={ic} value={editDoc.document_type} onChange={e=>setEditDoc({...editDoc,document_type:e.target.value as any})}>
                          <option value="agreement">Agreement</option>
                          <option value="report">Report</option>
                          <option value="certificate">Certificate</option>
                          <option value="other">Other</option>
                        </select></div>
                      <div>
                        <label className={lc}>File URL</label>
                        <input className={ic} value={editDoc.file_url} placeholder="https://..." onChange={e=>setEditDoc({...editDoc,file_url:e.target.value})}/>
                        <p className="text-xs text-gray-400 mt-1">Paste a Supabase Storage URL or any direct download link</p>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={saveDocument} disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-naija-green-600 text-white rounded-xl font-bold text-sm hover:bg-naija-green-700 disabled:opacity-60">
                        <Save size={15}/>{saving?'Saving...':'Save'}
                      </button>
                      <button onClick={()=>{setShowDocForm(false);setEditDoc(null)}}
                        className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600">Cancel</button>
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