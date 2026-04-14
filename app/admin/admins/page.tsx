'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import {
  Shield, ShieldCheck, UserPlus, Trash2, Edit2,
  X, Check, Search, Crown, AlertTriangle,
} from 'lucide-react'

interface Admin {
  id: string
  full_name: string
  email: string
  role: 'admin' | 'super_admin'
  created_at: string
  state: string | null
}

const Bone = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
)

function AdminsContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const [admins,       setAdmins]       = useState<Admin[]>([])
  const [filtered,     setFiltered]     = useState<Admin[]>([])
  const [loading,      setLoading]      = useState(true)
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [searchTerm,   setSearchTerm]   = useState('')

  // Add admin modal
  const [showAddModal,  setShowAddModal]  = useState(false)
  const [addEmail,      setAddEmail]      = useState('')
  const [addRole,       setAddRole]       = useState<'admin' | 'super_admin'>('admin')
  const [addLoading,    setAddLoading]    = useState(false)

  // Edit role modal
  const [editAdmin,    setEditAdmin]    = useState<Admin | null>(null)
  const [editRole,     setEditRole]     = useState<'admin' | 'super_admin'>('admin')
  const [editLoading,  setEditLoading]  = useState(false)

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null)
  const [deleteLoading,setDeleteLoading]= useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: userData } = await supabase
        .from('users').select('id, full_name, email, role, created_at, state')
        .eq('id', user.id).single()

      if (!userData || !['admin', 'super_admin'].includes(userData.role)) {
        router.push('/dashboard'); return
      }

      setCurrentAdmin(userData)
      setIsSuperAdmin(userData.role === 'super_admin')
      await loadAdmins()

      // Auto-open add modal if ?action=add
      if (searchParams.get('action') === 'add' && userData.role === 'super_admin') {
        setShowAddModal(true)
      }
    }
    init()
  }, [])

  useEffect(() => {
    const q = searchTerm.toLowerCase()
    setFiltered(
      admins.filter(a =>
        a.full_name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q)
      )
    )
  }, [admins, searchTerm])

  const loadAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, role, created_at, state')
        .in('role', ['admin', 'super_admin'])
        .order('created_at', { ascending: true })

      if (error) throw error
      setAdmins(data || [])
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
      // Find user by email
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

      const { error: updateError } = await supabase
        .from('users')
        .update({ role: addRole })
        .eq('id', targetUser.id)

      if (updateError) throw updateError

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
      toast.success('Role updated successfully')
      setEditAdmin(null)
      await loadAdmins()
    } catch (err: any) {
      toast.error(err.message || 'Failed to update role')
    } finally {
      setEditLoading(false)
    }
  }

  const handleRemoveAdmin = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: 'user' })
        .eq('id', deleteTarget.id)

      if (error) throw error
      toast.success(`${deleteTarget.full_name} removed from admins`)
      setDeleteTarget(null)
      await loadAdmins()
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove admin')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="mx-auto px-4 py-8 lg:p-8 max-w-5xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-naija-green-900">Manage Admins</h1>
              <p className="text-gray-500 text-sm mt-1">Control admin access and permissions</p>
            </div>
            {isSuperAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-naija-green-600 hover:bg-naija-green-700 text-white font-semibold rounded-xl transition text-sm"
              >
                <UserPlus size={16} />
                Add Admin
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-naija-green-100 flex items-center justify-center">
                  <Shield size={20} className="text-naija-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-black text-naija-green-900">
                    {admins.filter(a => a.role === 'admin').length}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">Admins</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Crown size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-black text-amber-700">
                    {admins.filter(a => a.role === 'super_admin').length}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">Super Admins</p>
                </div>
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

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-naija-green-900 text-white text-xs">
                    <th className="text-left px-4 py-3 font-semibold">#</th>
                    <th className="text-left px-4 py-3 font-semibold">Name</th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Email</th>
                    <th className="text-left px-4 py-3 font-semibold">Role</th>
                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Since</th>
                    {isSuperAdmin && (
                      <th className="text-left px-4 py-3 font-semibold">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="px-4 py-3"><Bone className="h-4 w-4" /></td>
                        <td className="px-4 py-3"><Bone className="h-4 w-28" /></td>
                        <td className="px-4 py-3 hidden md:table-cell"><Bone className="h-4 w-40" /></td>
                        <td className="px-4 py-3"><Bone className="h-5 w-20 rounded-full" /></td>
                        <td className="px-4 py-3 hidden md:table-cell"><Bone className="h-4 w-20" /></td>
                        {isSuperAdmin && <td className="px-4 py-3"><Bone className="h-8 w-20 rounded-lg" /></td>}
                      </tr>
                    ))
                  ) : filtered.map((admin, i) => {
                    const isMe = admin.id === currentAdmin?.id
                    const isSA = admin.role === 'super_admin'
                    return (
                      <tr
                        key={admin.id}
                        className={`border-b border-gray-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'} hover:bg-naija-green-50/30`}
                      >
                        <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0
                              ${isSA ? 'bg-amber-500' : 'bg-naija-green-500'}`}>
                              {admin.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900">{admin.full_name}</span>
                            {isMe && (
                              <span className="text-xs text-naija-green-600 font-semibold">(you)</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{admin.email}</td>
                        <td className="px-4 py-3">
                          {isSA ? (
                            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full w-fit">
                              <Crown size={10} /> Super Admin
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-naija-green-100 text-naija-green-700 rounded-full w-fit">
                              <Shield size={10} /> Admin
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                          {new Date(admin.created_at).toLocaleDateString()}
                        </td>
                        {isSuperAdmin && (
                          <td className="px-4 py-3">
                            {!isMe && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => { setEditAdmin(admin); setEditRole(admin.role) }}
                                  className="p-1.5 rounded-lg hover:bg-naija-green-100 text-naija-green-600 transition"
                                  title="Edit role"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget(admin)}
                                  className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition"
                                  title="Remove admin"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    )
                  })}
                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={isSuperAdmin ? 6 : 5} className="px-4 py-12 text-center text-gray-400 text-sm">
                        No admins found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
              <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
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
                <p className="text-xs text-gray-400 mt-1">The user must already have an account</p>
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
                  <p className="text-xs text-amber-700">Super admins can add/remove other admins and change permissions.</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAdmin}
                disabled={addLoading}
                className="flex-1 px-4 py-2.5 bg-naija-green-600 text-white rounded-xl text-sm font-semibold hover:bg-naija-green-700 transition disabled:opacity-50"
              >
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
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">Edit Role</h3>
              <button onClick={() => setEditAdmin(null)} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Changing role for <span className="font-semibold text-gray-900">{editAdmin.full_name}</span>
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
              <button
                onClick={() => setEditAdmin(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditRole}
                disabled={editLoading}
                className="flex-1 px-4 py-2.5 bg-naija-green-600 text-white rounded-xl text-sm font-semibold hover:bg-naija-green-700 transition disabled:opacity-50"
              >
                {editLoading ? 'Saving...' : 'Save Role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-center mb-2">Remove Admin</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Remove <span className="font-semibold text-gray-900">{deleteTarget.full_name}</span> as admin?
              They will be demoted to a regular user.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveAdmin}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
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
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-10 h-10 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full" /></div>}>
      <AdminsContent />
    </Suspense>
  )
}