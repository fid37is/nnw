'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import {
  Users, UserPlus, Edit2, Lock, X, CheckCircle,
  Trash2, Mail, Eye, EyeOff, Copy, RefreshCw,
  LayoutGrid, List, TrendingUp, Calendar,
} from 'lucide-react'
import { InvestorUser, InvestorProfile, ic, lc } from './types'

// ── Helpers ───────────────────────────────────────────────────────────────────

const structureLabel: Record<string, string> = {
  equity: 'Equity',
  revenue_share: 'Revenue Share',
  sponsorship: 'Sponsorship',
}

const fmt = (n: number) =>
  n >= 1_000_000
    ? `₦${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `₦${(n / 1_000).toFixed(0)}K`
    : `₦${n}`

// ── Investor Grid Card ────────────────────────────────────────────────────────

function InvestorGridCard({
  inv,
  onEdit,
  onRevoke,
  onRestore,
  onDelete,
  onResetPw,
}: {
  inv: InvestorUser
  onEdit: (inv: InvestorUser) => void
  onRevoke: (id: string, name: string) => void
  onRestore: (id: string, name: string) => void
  onDelete: (id: string, name: string) => void
  onResetPw: (id: string) => void
}) {
  const initials = inv.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const isRevoked = inv.investor_status === 'revoked'

  return (
    <div
      className={`relative flex flex-col rounded-2xl overflow-hidden border transition-all ${
        isRevoked ? 'border-red-200 opacity-75' : 'border-gray-200 hover:border-naija-green-300 hover:shadow-md'
      } bg-white`}
    >
      {/* Status bar */}
      <div
        className={`h-1 w-full ${isRevoked ? 'bg-red-400' : 'bg-gradient-to-r from-naija-green-400 to-naija-green-600'}`}
      />

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Avatar + name */}
        <div className="flex items-start gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm ${
              isRevoked ? 'bg-red-100 text-red-600' : 'bg-naija-green-100 text-naija-green-700'
            }`}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-900 text-sm leading-tight truncate">{inv.full_name}</p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{inv.email}</p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {isRevoked && (
                <span className="text-[10px] bg-red-100 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full font-semibold">
                  Revoked
                </span>
              )}
              {inv.must_change_password && (
                <span className="text-[10px] bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full font-semibold">
                  Pending PW
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Investment details */}
        {inv.profile ? (
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-naija-green-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-500 mb-0.5 font-medium">Amount</p>
              <p className="text-sm font-bold text-naija-green-700">{fmt(inv.profile.investment_amount)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-500 mb-0.5 font-medium">Structure</p>
              <p className="text-sm font-bold text-gray-700">
                {structureLabel[inv.profile.investment_structure] ?? inv.profile.investment_structure}
              </p>
            </div>
            {inv.profile.equity_percentage && (
              <div className="col-span-2 bg-blue-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 mb-0.5 font-medium">Equity</p>
                <p className="text-sm font-bold text-blue-700">{inv.profile.equity_percentage}%</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
            <p className="text-xs text-orange-600 font-medium">No investment profile set</p>
          </div>
        )}

        <p className="text-[10px] text-gray-400 flex items-center gap-1">
          <Calendar size={10} />
          Added {new Date(inv.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-1.5 mt-auto">
          <button
            onClick={() => onEdit(inv)}
            className="flex items-center justify-center gap-1 px-2 py-2 bg-naija-green-50 text-naija-green-700 border border-naija-green-200 rounded-lg text-xs font-medium hover:bg-naija-green-100 transition"
          >
            <Edit2 size={11} /> {inv.profile ? 'Edit Profile' : 'Set Profile'}
          </button>
          <button
            onClick={() => onResetPw(inv.id)}
            className="flex items-center justify-center gap-1 px-2 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium hover:bg-blue-100 transition"
          >
            <Lock size={11} /> Reset PW
          </button>
          {isRevoked ? (
            <button
              onClick={() => onRestore(inv.id, inv.full_name)}
              className="flex items-center justify-center gap-1 px-2 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-medium hover:bg-green-100 transition"
            >
              <CheckCircle size={11} /> Restore
            </button>
          ) : (
            <button
              onClick={() => onRevoke(inv.id, inv.full_name)}
              className="flex items-center justify-center gap-1 px-2 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded-lg text-xs font-medium hover:bg-orange-100 transition"
            >
              <X size={11} /> Revoke
            </button>
          )}
          <button
            onClick={() => onDelete(inv.id, inv.full_name)}
            className="flex items-center justify-center gap-1 px-2 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100 transition"
          >
            <Trash2 size={11} /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Investor List Row ─────────────────────────────────────────────────────────

function InvestorListRow({
  inv,
  onEdit,
  onRevoke,
  onRestore,
  onDelete,
  onResetPw,
}: {
  inv: InvestorUser
  onEdit: (inv: InvestorUser) => void
  onRevoke: (id: string, name: string) => void
  onRestore: (id: string, name: string) => void
  onDelete: (id: string, name: string) => void
  onResetPw: (id: string) => void
}) {
  const initials = inv.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const isRevoked = inv.investor_status === 'revoked'

  return (
    <div
      className={`flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50 ${
        isRevoked ? 'opacity-70' : ''
      }`}
    >
      {/* Left: avatar + info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-xs ${
            isRevoked ? 'bg-red-100 text-red-600' : 'bg-naija-green-100 text-naija-green-700'
          }`}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-gray-900 text-sm">{inv.full_name}</p>
            {isRevoked && (
              <span className="text-[10px] bg-red-100 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full font-semibold">
                Revoked
              </span>
            )}
            {inv.must_change_password && (
              <span className="text-[10px] bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full font-semibold">
                Pending PW
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">{inv.email}</p>
        </div>
      </div>

      {/* Middle: investment info — hidden on mobile */}
      <div className="hidden md:flex items-center gap-6 flex-shrink-0">
        {inv.profile ? (
          <>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 mb-0.5">Amount</p>
              <p className="text-sm font-bold text-naija-green-700">{fmt(inv.profile.investment_amount)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 mb-0.5">Structure</p>
              <p className="text-xs font-semibold text-gray-600">
                {structureLabel[inv.profile.investment_structure] ?? inv.profile.investment_structure}
                {inv.profile.equity_percentage ? ` · ${inv.profile.equity_percentage}%` : ''}
              </p>
            </div>
          </>
        ) : (
          <p className="text-xs text-orange-500 font-medium">No profile</p>
        )}
        <div className="text-right">
          <p className="text-[10px] text-gray-400 mb-0.5">Added</p>
          <p className="text-xs text-gray-500">
            {new Date(inv.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(inv)}
          title={inv.profile ? 'Edit Profile' : 'Set Profile'}
          className="p-2 text-gray-400 hover:text-naija-green-600 hover:bg-naija-green-50 rounded-lg transition"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={() => onResetPw(inv.id)}
          title="Reset Password"
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
        >
          <Lock size={14} />
        </button>
        {isRevoked ? (
          <button
            onClick={() => onRestore(inv.id, inv.full_name)}
            title="Restore Access"
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
          >
            <CheckCircle size={14} />
          </button>
        ) : (
          <button
            onClick={() => onRevoke(inv.id, inv.full_name)}
            title="Revoke Access"
            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
          >
            <X size={14} />
          </button>
        )}
        <button
          onClick={() => onDelete(inv.id, inv.full_name)}
          title="Delete Account"
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Main InvestorsTab ─────────────────────────────────────────────────────────

interface Props {
  investors: InvestorUser[]
  onReload: () => Promise<void>
}

export function InvestorsTab({ investors, onReload }: Props) {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [editProfile, setEditProfile] = useState<InvestorProfile | null>(null)
  const [saving, setSaving] = useState(false)
  const [creatingUser, setCreatingUser] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showCf, setShowCf] = useState(false)
  const [copiedPw, setCopiedPw] = useState(false)
  const [createForm, setCreateForm] = useState({
    full_name: '', email: '', phone: '',
    password: '', confirm_password: '',
    investment_amount: 0,
    investment_structure: 'equity' as 'equity' | 'revenue_share' | 'sponsorship',
    equity_percentage: '',
    notes: '',
  })

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

  const handleCreateInvestor = async () => {
    if (!createForm.full_name.trim()) { toast.error('Full name is required'); return }
    if (!createForm.email.includes('@')) { toast.error('Valid email required'); return }
    if (createForm.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    if (createForm.password !== createForm.confirm_password) { toast.error('Passwords do not match'); return }
    setCreatingUser(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')
      const res = await fetch('/api/admin/create-investor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({
          full_name: createForm.full_name, email: createForm.email, phone: createForm.phone,
          password: createForm.password, investment_amount: createForm.investment_amount,
          investment_structure: createForm.investment_structure,
          equity_percentage: createForm.equity_percentage, notes: createForm.notes,
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to create account')
      toast.success(`✓ Account created for ${createForm.full_name}`)
      setCreateForm({ full_name: '', email: '', phone: '', password: '', confirm_password: '', investment_amount: 0, investment_structure: 'equity', equity_percentage: '', notes: '' })
      setShowCreateForm(false)
      await onReload()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create investor account')
    } finally { setCreatingUser(false) }
  }

  const revokeAccess = async (userId: string, name: string) => {
    if (!confirm(`Revoke investor access for ${name}?`)) return
    const { data, error } = await supabase.from('users').update({ investor_status: 'revoked' }).eq('id', userId).select('id')
    if (error || !data?.length) { toast.error('Failed to revoke access'); return }
    toast.success(`Access revoked for ${name}`)
    await onReload()
  }

  const restoreAccess = async (userId: string, name: string) => {
    const { data, error } = await supabase.from('users').update({ investor_status: 'active' }).eq('id', userId).select('id')
    if (error || !data?.length) { toast.error('Failed to restore access'); return }
    toast.success(`Access restored for ${name}`)
    await onReload()
  }

  const deleteInvestor = async (userId: string, name: string) => {
    if (!confirm(`Permanently delete ${name}'s account? This cannot be undone.`)) return
    setSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')
      const res = await fetch('/api/admin/delete-investor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ user_id: userId }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to delete account')
      toast.success(`${name}'s account permanently deleted`)
      await onReload()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete investor account')
    } finally { setSaving(false) }
  }

  const forcePasswordReset = async (userId: string) => {
    const { error } = await supabase.from('users').update({ must_change_password: true }).eq('id', userId)
    if (error) { toast.error('Failed'); return }
    toast.success('Investor will be prompted to change password on next login')
    await onReload()
  }

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
      await onReload()
    } catch { toast.error('Failed to save profile') }
    finally { setSaving(false) }
  }

  const openEdit = (inv: InvestorUser) => {
    setEditProfile(inv.profile || {
      user_id: inv.id, investment_amount: 0,
      investment_structure: 'equity', equity_percentage: null,
      investment_date: new Date().toISOString().split('T')[0], notes: '',
    })
    setShowProfileForm(true)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${view === 'grid' ? 'bg-white text-naija-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <LayoutGrid size={14} /> Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${view === 'list' ? 'bg-white text-naija-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <List size={14} /> List
          </button>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-naija-green-600 text-white rounded-lg text-sm font-bold hover:bg-naija-green-700 transition shadow-sm"
        >
          <UserPlus size={15} /> Create Investor Account
        </button>
      </div>

      {/* Investor count */}
      <p className="text-xs text-gray-500 font-medium">
        {investors.length} investor{investors.length !== 1 ? 's' : ''} ·{' '}
        {investors.filter(i => i.investor_status !== 'revoked').length} active
      </p>

      {/* Empty state */}
      {investors.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <Users size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">No investor accounts yet</p>
          <p className="text-gray-400 text-xs mt-1">Click "Create Investor Account" to add one</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {investors.map(inv => (
            <InvestorGridCard
              key={inv.id} inv={inv}
              onEdit={openEdit}
              onRevoke={revokeAccess}
              onRestore={restoreAccess}
              onDelete={deleteInvestor}
              onResetPw={forcePasswordReset}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {investors.map(inv => (
            <InvestorListRow
              key={inv.id} inv={inv}
              onEdit={openEdit}
              onRevoke={revokeAccess}
              onRestore={restoreAccess}
              onDelete={deleteInvestor}
              onResetPw={forcePasswordReset}
            />
          ))}
        </div>
      )}

      {/* ── Create Investor Modal ── */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg">
            <div className="bg-gradient-to-br from-naija-green-700 to-naija-green-800 rounded-t-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Create Investor Account</h3>
                  <p className="text-naija-green-200 text-xs sm:text-sm mt-0.5">
                    The investor will be prompted to change their password on first login.
                  </p>
                </div>
                <button onClick={() => setShowCreateForm(false)} className="text-white/70 hover:text-white ml-3 flex-shrink-0">
                  <X size={22} />
                </button>
              </div>
            </div>
            <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
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
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`${lc} mb-0`}>Temporary Password *</label>
                  <button type="button" onClick={generatePassword}
                    className="text-xs text-naija-green-600 hover:text-naija-green-700 font-semibold">
                    Generate
                  </button>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPw ? 'text' : 'password'} className={`${ic} pl-9 pr-20`}
                    value={createForm.password}
                    onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Min 8 characters" />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {createForm.password && (
                      <button type="button" onClick={copyPassword} className="p-1 text-gray-400 hover:text-naija-green-600">
                        {copiedPw ? <CheckCircle size={15} className="text-naija-green-600" /> : <Copy size={15} />}
                      </button>
                    )}
                    <button type="button" onClick={() => setShowPw(!showPw)} className="p-1 text-gray-400 hover:text-gray-600">
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Copy this before sending — you won't see it again.</p>
              </div>
              <div>
                <label className={lc}>Confirm Password *</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showCf ? 'text' : 'password'} className={`${ic} pl-9 pr-10`}
                    value={createForm.confirm_password}
                    onChange={e => setCreateForm(f => ({ ...f, confirm_password: e.target.value }))}
                    placeholder="Repeat password" />
                  <button type="button" onClick={() => setShowCf(!showCf)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showCf ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {createForm.confirm_password && createForm.password !== createForm.confirm_password && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Investment Profile (optional)</p>
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
                      placeholder="Any internal notes..." />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 sm:p-6 border-t border-gray-100 flex gap-3">
              <button onClick={handleCreateInvestor} disabled={creatingUser}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-naija-green-600 text-white rounded-xl font-bold text-sm hover:bg-naija-green-700 disabled:opacity-60 transition">
                <UserPlus size={16} />
                {creatingUser ? 'Creating...' : 'Create Account'}
              </button>
              <button onClick={() => setShowCreateForm(false)}
                className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Profile Modal ── */}
      {showProfileForm && editProfile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md">
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Investment Profile</h3>
              <button onClick={() => { setShowProfileForm(false); setEditProfile(null) }}><X size={20} /></button>
            </div>
            <div className="p-5 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
              <div>
                <label className={lc}>Investment Amount (₦)</label>
                <input type="number" className={ic} value={editProfile.investment_amount}
                  onChange={e => setEditProfile({ ...editProfile, investment_amount: Number(e.target.value) })} />
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
                    onChange={e => setEditProfile({ ...editProfile, equity_percentage: Number(e.target.value) })} />
                </div>
              )}
              <div>
                <label className={lc}>Investment Date</label>
                <input type="date" className={ic} value={editProfile.investment_date?.split('T')[0] || ''}
                  onChange={e => setEditProfile({ ...editProfile, investment_date: e.target.value })} />
              </div>
              <div>
                <label className={lc}>Notes</label>
                <textarea rows={2} className={ic} value={editProfile.notes}
                  onChange={e => setEditProfile({ ...editProfile, notes: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 p-5 sm:p-6 border-t border-gray-100">
              <button onClick={saveProfile} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-naija-green-600 text-white rounded-xl font-bold text-sm hover:bg-naija-green-700 disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
              <button onClick={() => { setShowProfileForm(false); setEditProfile(null) }}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}