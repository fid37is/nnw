'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Trophy, Edit2, Save, X } from 'lucide-react'

interface Champion {
  id: string
  season_id: string
  user_id: string
  title: string
  description: string
  user_name: string
  season_name: string
  season_year: number
}

interface Season {
  id: string
  name: string
  year: number
  status: string
}

interface ApprovedUser {
  id: string
  full_name: string
}

export default function ChampionsPage() {
  const [champions, setChampions] = useState<Champion[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [approvedUsers, setApprovedUsers] = useState<ApprovedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [championToDelete, setChampionToDelete] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    season_id: '',
    user_id: '',
    title: '',
    description: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load champions
      const { data: championsData, error: championsError } = await supabase
        .from('season_champions')
        .select(`
          id,
          season_id,
          user_id,
          title,
          description,
          users (full_name),
          seasons (name, year)
        `)
        .order('seasons(year)', { ascending: false })

      if (championsError && championsError.code !== 'PGRST116') throw championsError

      if (championsData) {
        setChampions(
          championsData.map((c: any) => ({
            id: c.id,
            season_id: c.season_id,
            user_id: c.user_id,
            title: c.title,
            description: c.description,
            user_name: c.users?.[0]?.full_name || 'Unknown',
            season_name: c.seasons?.[0]?.name || 'Unknown',
            season_year: c.seasons?.[0]?.year || 0,
          }))
        )
      }

      // Load seasons
      const { data: seasonsData, error: seasonsError } = await supabase
        .from('seasons')
        .select('id, name, year, status')
        .order('year', { ascending: false })

      if (seasonsError) throw seasonsError
      setSeasons(seasonsData || [])

      // Load approved users
      const { data: usersData, error: usersError } = await supabase
        .from('applications')
        .select(`user_id, users (id, full_name)`)
        .eq('status', 'approved')

      if (usersError) throw usersError

      const uniqueUsers = Array.from(
        new Map(
          (usersData || []).map((item: any) => [
            item.users[0]?.id,
            { id: item.users[0]?.id, full_name: item.users[0]?.full_name },
          ])
        ).values()
      )

      setApprovedUsers(uniqueUsers as ApprovedUser[])
    } catch (err) {
      toast.error('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.season_id || !formData.user_id || !formData.title) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('season_champions')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
        toast.success('Champion updated!')
      } else {
        const { error } = await supabase
          .from('season_champions')
          .insert([formData])

        if (error) throw error
        toast.success('Champion added!')
      }

      setFormData({ season_id: '', user_id: '', title: '', description: '' })
      setEditingId(null)
      setShowForm(false)
      loadData()
    } catch (err) {
      toast.error('Failed to save champion')
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (!championToDelete) return

    try {
      const { error } = await supabase
        .from('season_champions')
        .delete()
        .eq('id', championToDelete)

      if (error) throw error
      toast.success('Champion deleted!')
      setShowDeleteConfirm(false)
      setChampionToDelete(null)
      loadData()
    } catch (err) {
      toast.error('Failed to delete champion')
    }
  }

  if (loading) {
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-naija-green-900 flex items-center gap-2">
                <Trophy size={32} />
                Season Champions
              </h1>
              <p className="text-gray-600">Manage champions for each season</p>
            </div>
            <button
              onClick={() => {
                setShowForm(true)
                setEditingId(null)
                setFormData({ season_id: '', user_id: '', title: '', description: '' })
              }}
              className="px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold"
            >
              Add Champion
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-6 mb-8">
              <h2 className="text-xl font-bold text-naija-green-900 mb-4">
                {editingId ? 'Edit Champion' : 'Add New Champion'}
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Season</label>
                    <select
                      value={formData.season_id}
                      onChange={e => setFormData({ ...formData, season_id: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                    >
                      <option value="">Select Season</option>
                      {seasons.map(season => (
                        <option key={season.id} value={season.id}>
                          {season.name} {season.year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Champion</label>
                    <select
                      value={formData.user_id}
                      onChange={e => setFormData({ ...formData, user_id: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                    >
                      <option value="">Select Approved Participant</option>
                      {approvedUsers.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.full_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., National Champion"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Optional: Achievement details"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold"
                  >
                    {editingId ? 'Update' : 'Add'} Champion
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Champions List */}
          {champions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Trophy size={32} className="mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 font-semibold">No champions recorded yet</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {champions.map(champion => (
                <div key={champion.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy size={20} className="text-yellow-500" />
                        <h3 className="text-lg font-bold text-naija-green-900">{champion.user_name}</h3>
                      </div>
                      <p className="text-gray-600 mb-1">
                        <span className="font-semibold">{champion.title}</span> • {champion.season_name} {champion.season_year}
                      </p>
                      {champion.description && (
                        <p className="text-sm text-gray-500">{champion.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setFormData({
                            season_id: champion.season_id,
                            user_id: champion.user_id,
                            title: champion.title,
                            description: champion.description,
                          })
                          setEditingId(champion.id)
                          setShowForm(true)
                        }}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition flex items-center gap-2"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setChampionToDelete(champion.id)
                          setShowDeleteConfirm(true)
                        }}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center gap-2"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Delete Champion</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to remove this champion record?</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setChampionToDelete(null)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}