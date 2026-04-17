'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import {
  Shield, UserPlus, Trash2, Edit2, X, Search,
  Crown, AlertTriangle, KeyRound, Eye, EyeOff,
  ToggleLeft, ToggleRight, ChevronDown, ChevronUp,
  Check,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Admin {
  id: string
  full_name: string
  email: string
  role: 'admin' | 'super_admin'
  is_active: boolean
  created_at: string
  permissions: Record<string, { can_view: boolean; can_edit: boolean }>
}

const ALL_MODULES = [
  { key: 'dashboard',       label: 'Dashboard'       },
  { key: 'applications',    label: 'Applications'    },
  { key: 'payments',        label: 'Payments'        },
  { key: 'users',           label: 'Users'           },
  { key: 'job_applications',label: 'Job Applicants'  },
  { key: 'champions',       label: 'Champions'       },
  { key: 'seasons',         label: 'Seasons'         },
  { key: 'competition',     label: 'Competition'     },
  { key: 'messages',        label: 'Messages'        },
  { key: 'investors',       label: 'Investors'       },
  { key: 'audit_logs',      label: 'Audit Logs'      },
  { key: 'merch_sponsor',   label: 'Add Items'       },
  { key: 'waiting_list',    label: 'Waiting List'    },
]

const Bone = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
)

// ── Main ──────────────────────────────────────────────────────────────────────
function AdminsContent() {
  const router      = useRouter()
  const searchParams = useSearchParams()

  const [admins,        setAdmins]        = useState<Admin[]>([])
  const [filtered,      setFiltered]      = useState<Admin[]>([])
  const [loading,       setLoading]       = useState(true)
  const [currentAdmin,  setCurrentAdmin]  = useState<Admin | null>(null)
  const [isSuperAdmin,  setIsSuperAdmin]  = useState(false)
  const [searchTerm,    setSearchTerm]    = useState('')
  const [expandedId,    setExpandedId]    = useState<string | null>(null)

  // Modals
  const [showAddModal,    setShowAddModal]    = useState(false)
  const [editAdmin,       setEditAdmin]       = useState<Admin | null>(null)
  const [deleteTarget,    setDeleteTarget]    = useState<Admin | null>(null)
  const [deactivateTarget,setDeactivateTarget]= useState<Admin | null>(null)
  const [resetTarget,     setResetTarget]     = useState<Admin | null>(null)

  // Add admin form
  const [addEmail,   setAddEmail]   = useState('')
  const [addRole,    setAddRole]    = useState<'admin' | 'super_admin'>('admin')
  const [addLoading, setAddLoading] = useState(false)

  // Edit role
  const [editRole,    setEditRole]    = useState<'admin' | 'super_admin'>('admin')
  const [editLoading, setEditLoading] = useState(false)

  // Delete
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Password reset
  const [newPassword,   setNewPassword]   = useState('')
  const [showPassword,  setShowPassword]  = useState(false)
  const [resetLoading,  setResetLoading]  = useState(false)

  // Permissions saving
  const [savingPerms,   setSavingPerms]   = useState<string | null>(null)
  const [localPerms,    setLocalPerms]    = useState<
    Record<string, Record<string, { can_view: boolean; can_edit: boolean }>>
  >({})

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: userData } = await supabase
        .from('users')
        .select('id, full_name, email, role, is_active, created_at')
        .eq('id', user.id)
        .single()

      if (!userData || !['admin', 'super_admin'].includes(userData.role)) {
        router.push('/dashboard'); return
      }

      setCurrentAdmin({ ...userData, permissions: {} })
      setIsSuperAdmin(userData.role === 'super_admin')
      await loadAdmins()

      if (searchParams.get('action') === 'add' && userData.role === 'super_admin') {
        setShowAddModal(true)
      }
    }
    init()
  }, [])

  useEffect(() => {
    const q = searchTerm.toLowerCase()
    setFiltered(admins.filter(a =>
      a.full_name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q)
    ))
  }, [admins, searchTerm])

  const loadAdmins = async () => {
    try {
      const { data: adminUsers, error } = await supabase
        .from('users')
        .select('id, full_name, email, role, is_active, created_at')
        .in('role', ['admin', 'super_admin'])
        .order('created_at', { ascending: true })

      if (error) throw error

      // Load all permissions for all admins
      const { data: permsData } = await supabase
        .from('admin_permissions')
        .select('user_id, module, can_view, can_edit')
        .in('user_id', (adminUsers || []).map(a => a.id))

      // Build permissions map
      const permsMap: Record<string, Record<string, { can_view: boolean; can_edit: boolean }>> = {}
      ;(permsData || []).forEach(p => {
        if (!permsMap[p.user_id]) permsMap[p.user_id] = {}
        permsMap[p.user_id][p.module] = { can_view: p.can_view, can_edit: p.can_edit }
      })

      const result: Admin[] = (adminUsers || []).map(a => ({
        ...a,
        permissions: permsMap[a.id] || {},
      }))

      setAdmins(result)
      setFiltered(result)

      // Init local perms state
      const localInit: typeof localPerms = {}
      result.forEach(a => { localInit[a.id] = { ...a.permissions } })
      setLocalPerms(localInit)
    } catch (err) {
      toast.error('Failed to load admins')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdmin = async () => {
    if (!addEmail.trim()) { toast.error('Email is required'); return }
    setAddLoading(true)
    try {
      const { data: targetUser, error: findError } = await supabase
        .from('users')
        .select('id, role')
        .eq('email', addEmail.trim().toLowerCase())
        .single()

      if (findError || !targetUser) {
        toast.error('No user found with that email. They must register first.')
        return
      }
      if (['admin', 'super_admin'].includes(targetUser.role)) {
        toast.error('This user is already an admin')
        return
      }

      const { error } = await supabase
        .from('users')
        .update({ role: addRole })
        .eq('id', targetUser.id)

      if (error) throw error

      // Give default dashboard view permission
      await supabase.from('admin_permissions').upsert({
        user_id:  targetUser.id,
        module:   'dashboard',
        can_view: true,
        can_edit: false,
      })

      toast.success(`${addEmail} promoted to ${addRole === 'super_admin' ? 'Super Admin' : 'Admin'}`)
      setShowAddModal(false)
      setAddEmail('')
      setAddRole('admin')
      await loadAdmins()
    } catch (err: any) {
      toast.error(err.message || 'Failed to add admin')
    } finally {
      setAddLoading(false)
    }
  }

  const handleEditRole = async () => {
    if (!editAdmin) return
    setEditLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: editRole })
        .eq('id', editAdmin.id)

      if (error) throw error
      toast.success('Role updated')
      setEditAdmin(null)
      await loadAdmins()
    } catch (err: any) {
      toast.error(err.message || 'Failed to update role')
    } finally {
      setEditLoading(false)
    }
  }

  const handleToggleActive = async (admin: Admin) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          is_active:       !admin.is_active,
          deactivated_at:  admin.is_active ? new Date().toISOString() : null,
          deactivated_by:  admin.is_active ? currentAdmin?.id : null,
        })
        .eq('id', admin.id)

      if (error) throw error
      toast.success(admin.is_active ? 'Admin deactivated' : 'Admin reactivated')
      setDeactivateTarget(null)
      await loadAdmins()
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      // Demote to user first
      const { error } = await supabase
        .from('users')
        .update({ role: 'user' })
        .eq('id', deleteTarget.id)

      if (error) throw error

      // Remove all permissions
      await supabase
        .from('admin_permissions')
        .delete()
        .eq('user_id', deleteTarget.id)

      toast.success(`${deleteTarget.full_name} removed from admins`)
      setDeleteTarget(null)
      await loadAdmins()
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove admin')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setResetLoading(true)
    try {
      if (resetTarget?.id === currentAdmin?.id) {
        // Reset own password
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) throw error
      } else {
        // Super admin resets another admin's password via admin API
        const { error } = await supabase.functions.invoke('reset-admin-password', {
          body: { user_id: resetTarget?.id, new_password: newPassword },
        })
        if (error) throw error
      }
      toast.success('Password updated successfully')
      setResetTarget(null)
      setNewPassword('')
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password')
    } finally {
      setResetLoading(false)
    }
  }

  const handlePermChange = (
    adminId: string,
    module: string,
    field: 'can_view' | 'can_edit',
    value: boolean
  ) => {
    setLocalPerms(prev => ({
      ...prev,
      [adminId]: {
        ...prev[adminId],
        [module]: {
          can_view: prev[adminId]?.[module]?.can_view ?? false,
          can_edit: prev[adminId]?.[module]?.can_edit ?? false,
          [field]: value,
          // If disabling view, also disable edit
          ...(field === 'can_view' && !value ? { can_edit: false } : {}),
        },
      },
    }))
  }

  const handleSavePermissions = async (adminId: string) => {
    setSavingPerms(adminId)
    try {
      const perms = localPerms[adminId] || {}
      const upserts = ALL_MODULES.map(m => ({
        user_id:  adminId,
        module:   m.key,
        can_view: perms[m.key]?.can_view ?? false,
        can_edit: perms[m.key]?.can_edit ?? false,
        updated_at: new Date().toISOString(),
      }))

      const { error } = await supabase
        .from('admin_permissions')
        .upsert(upserts, { onConflict: 'user_id,module' })

      if (error) throw error
      toast.success('Permissions saved')
      await loadAdmins()
    } catch (err: any) {
      toast.error(err.message || 'Failed to save permissions')
    } finally {
      setSavingPerms(null)
    }
  }

  const handleGrantAll = (adminId: string) => {
    const all: Record<string, { can_view: boolean; can_edit: boolean }> = {}
    ALL_MODULES.forEach(m => { all[m.key] = { can_view: true, can_edit: true } })
    setLocalPerms(prev => ({ ...prev, [adminId]: all }))
  }

  const handleRevokeAll = (adminId: string) => {
    const none: Record<string, { can_view: boolean; can_edit: boolean }> = {}
    ALL_MODULES.forEach(m => { none[m.key] = { can_view: false, can_edit: false } })
    setLocalPerms(prev => ({ ...prev, [adminId]: none }))
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="mx-auto px-4 py-8 lg:p-8 max-w-6xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-naija-green-900">Manage Admins</h1>
              <p className="text-gray-500 text-sm mt-1">Control admin access, roles and permissions</p>
            </div>
            {isSuperAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-naija-green-600 hover:bg-naija-green-700 text-white font-semibold rounded-xl transition text-sm"
              >
                <UserPlus size={16} /> Add Admin
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-naija-green-100 flex items-center justify-center">
                <Shield size={20} className="text-naija-green-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-naija-green-900">
                  {admins.filter(a => a.role === 'admin').length}
                </p>
                <p className="text-xs text-gray-500">Admins</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Crown size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-amber-700">
                  {admins.filter(a => a.role === 'super_admin').length}
                </p>
                <p className="text-xs text-gray-500">Super Admins</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <div className="relative w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search admins..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500"
              />
            </div>
          </div>

          {/* Admin list */}
          <div className="space-y-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                    <Bone className="h-5 w-48 mb-2" />
                    <Bone className="h-4 w-64" />
                  </div>
                ))
              : filtered.map(admin => {
                  const isMe  = admin.id === currentAdmin?.id
                  const isSA  = admin.role === 'super_admin'
                  const isExp = expandedId === admin.id
                  const perms = localPerms[admin.id] || {}

                  return (
                    <div
                      key={admin.id}
                      className={`bg-white rounded-xl border transition-all ${
                        !admin.is_active ? 'border-gray-200 opacity-60' : 'border-gray-200'
                      }`}
                    >
                      {/* Admin row */}
                      <div className="flex items-center gap-4 p-4">
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0
                          ${isSA ? 'bg-amber-500' : 'bg-naija-green-500'}`}>
                          {admin.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-gray-900">{admin.full_name}</span>
                            {isMe && <span className="text-xs text-naija-green-600 font-semibold">(you)</span>}
                            {!admin.is_active && (
                              <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-semibold">
                                Deactivated
                              </span>
                            )}
                            {isSA ? (
                              <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                                <Crown size={10} /> Super Admin
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-naija-green-100 text-naija-green-700 rounded-full">
                                <Shield size={10} /> Admin
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{admin.email}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Reset password */}
                          {(isMe || isSuperAdmin) && (
                            <button
                              onClick={() => { setResetTarget(admin); setNewPassword('') }}
                              className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition"
                              title="Reset password"
                            >
                              <KeyRound size={15} />
                            </button>
                          )}

                          {/* Edit role — super admin only, not self */}
                          {isSuperAdmin && !isMe && (
                            <button
                              onClick={() => { setEditAdmin(admin); setEditRole(admin.role) }}
                              className="p-2 rounded-lg hover:bg-naija-green-50 text-naija-green-600 transition"
                              title="Edit role"
                            >
                              <Edit2 size={15} />
                            </button>
                          )}

                          {/* Deactivate/Reactivate — super admin only, not self */}
                          {isSuperAdmin && !isMe && (
                            <button
                              onClick={() => setDeactivateTarget(admin)}
                              className={`p-2 rounded-lg transition ${
                                admin.is_active
                                  ? 'hover:bg-yellow-50 text-yellow-500'
                                  : 'hover:bg-green-50 text-green-500'
                              }`}
                              title={admin.is_active ? 'Deactivate' : 'Reactivate'}
                            >
                              {admin.is_active ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                            </button>
                          )}

                          {/* Delete — super admin only, not self */}
                          {isSuperAdmin && !isMe && (
                            <button
                              onClick={() => setDeleteTarget(admin)}
                              className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition"
                              title="Remove admin"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}

                          {/* Expand permissions — super admin only, not self */}
                          {isSuperAdmin && !isMe && (
                            <button
                              onClick={() => setExpandedId(isExp ? null : admin.id)}
                              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition"
                              title="Manage permissions"
                            >
                              {isExp ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Permissions panel */}
                      {isExp && isSuperAdmin && (
                        <div className="border-t border-gray-100 px-4 py-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-gray-700">Module Permissions</h3>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleGrantAll(admin.id)}
                                className="text-xs px-3 py-1 bg-naija-green-100 text-naija-green-700 rounded-lg hover:bg-naija-green-200 transition font-semibold"
                              >
                                Grant All
                              </button>
                              <button
                                onClick={() => handleRevokeAll(admin.id)}
                                className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-semibold"
                              >
                                Revoke All
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                            {ALL_MODULES.map(mod => {
                              const p = perms[mod.key] || { can_view: false, can_edit: false }
                              return (
                                <div key={mod.key} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                                  <span className="text-xs font-medium text-gray-700">{mod.label}</span>
                                  <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-1 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={p.can_view}
                                        onChange={e => handlePermChange(admin.id, mod.key, 'can_view', e.target.checked)}
                                        className="w-3 h-3 accent-naija-green-600"
                                      />
                                      <span className="text-xs text-gray-500">View</span>
                                    </label>
                                    <label className="flex items-center gap-1 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={p.can_edit}
                                        disabled={!p.can_view}
                                        onChange={e => handlePermChange(admin.id, mod.key, 'can_edit', e.target.checked)}
                                        className="w-3 h-3 accent-naija-green-600 disabled:opacity-40"
                                      />
                                      <span className="text-xs text-gray-500">Edit</span>
                                    </label>
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          <button
                            onClick={() => handleSavePermissions(admin.id)}
                            disabled={savingPerms === admin.id}
                            className="flex items-center gap-2 px-4 py-2 bg-naija-green-600 hover:bg-naija-green-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50"
                          >
                            {savingPerms === admin.id ? (
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Check size={14} />
                            )}
                            {savingPerms === admin.id ? 'Saving...' : 'Save Permissions'}
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
          </div>
        </div>
      </main>

      {/* ── Add Admin Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-naija-green-100 flex items-center justify-center">
                  <UserPlus size={20} className="text-naija-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Add Admin</h3>
                  <p className="text-xs text-gray-500">Promote an existing user</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">User Email</label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={addEmail}
                  onChange={e => setAddEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500"
                />
                <p className="text-xs text-gray-400 mt-1">User must already have an account</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Role</label>
                <select
                  value={addRole}
                  onChange={e => setAddRole(e.target.value as 'admin' | 'super_admin')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500 bg-white"
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              {addRole === 'super_admin' && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">Super admins can manage all other admins and permissions.</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleAddAdmin} disabled={addLoading}
                className="flex-1 px-4 py-2.5 bg-naija-green-600 text-white rounded-xl text-sm font-semibold hover:bg-naija-green-700 disabled:opacity-50">
                {addLoading ? 'Adding...' : 'Add Admin'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Role Modal ── */}
      {editAdmin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Change Role</h3>
              <button onClick={() => setEditAdmin(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Changing role for <span className="font-semibold">{editAdmin.full_name}</span>
            </p>
            <select
              value={editRole}
              onChange={e => setEditRole(e.target.value as 'admin' | 'super_admin')}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500 bg-white mb-6"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <div className="flex gap-3">
              <button onClick={() => setEditAdmin(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleEditRole} disabled={editLoading}
                className="flex-1 px-4 py-2.5 bg-naija-green-600 text-white rounded-xl text-sm font-semibold hover:bg-naija-green-700 disabled:opacity-50">
                {editLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reset Password Modal ── */}
      {resetTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <KeyRound size={18} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Reset Password</h3>
                  <p className="text-xs text-gray-500">{resetTarget.full_name}</p>
                </div>
              </div>
              <button onClick={() => { setResetTarget(null); setNewPassword('') }}
                className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New password (min. 8 characters)"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {resetTarget.id !== currentAdmin?.id && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  You are resetting the password for <strong>{resetTarget.full_name}</strong>.
                  Make sure to share the new password securely.
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setResetTarget(null); setNewPassword('') }}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleResetPassword} disabled={resetLoading}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                {resetLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Deactivate Confirm ── */}
      {deactivateTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4
              ${deactivateTarget.is_active ? 'bg-yellow-100' : 'bg-green-100'}`}>
              <AlertTriangle size={24} className={deactivateTarget.is_active ? 'text-yellow-600' : 'text-green-600'} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">
              {deactivateTarget.is_active ? 'Deactivate Admin' : 'Reactivate Admin'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {deactivateTarget.is_active
                ? `${deactivateTarget.full_name} will lose access to the admin portal immediately.`
                : `${deactivateTarget.full_name} will regain access to the admin portal.`}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeactivateTarget(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={() => handleToggleActive(deactivateTarget)}
                className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-semibold transition
                  ${deactivateTarget.is_active
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : 'bg-green-600 hover:bg-green-700'}`}
              >
                {deactivateTarget.is_active ? 'Deactivate' : 'Reactivate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Remove Admin</h3>
            <p className="text-sm text-gray-500 mb-6">
              <span className="font-semibold text-gray-900">{deleteTarget.full_name}</span> will be
              demoted to a regular user and all their permissions removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50">
                {deleteLoading ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full" />
      </div>
    }>
      <AdminsContent />
    </Suspense>
  )
}