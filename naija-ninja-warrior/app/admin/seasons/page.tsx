'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react'

interface Season {
  id: string
  name: string
  year: number
  status: 'upcoming' | 'active' | 'ended'
  start_date: string
  end_date: string
}

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    year: new Date().getFullYear(),
    status: 'upcoming' as 'upcoming' | 'active' | 'ended',
    start_date: '',
    end_date: '',
  })

  useEffect(() => {
    loadSeasons()
  }, [])

  const loadSeasons = async () => {
    try {
      const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .order('year', { ascending: false })

      if (error) throw error
      setSeasons(data || [])
    } catch (err) {
      toast.error('Failed to load seasons')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.start_date || !formData.end_date) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('seasons')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
        toast.success('Season updated!')
      } else {
        const { error } = await supabase
          .from('seasons')
          .insert([formData])

        if (error) throw error
        toast.success('Season created!')
      }

      setFormData({
        name: '',
        year: new Date().getFullYear(),
        status: 'upcoming',
        start_date: '',
        end_date: '',
      })
      setEditingId(null)
      setShowForm(false)
      loadSeasons()
    } catch (err) {
      toast.error('Failed to save season')
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this season?')) return

    try {
      const { error } = await supabase
        .from('seasons')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Season deleted!')
      loadSeasons()
    } catch (err) {
      toast.error('Failed to delete season')
    }
  }

  const handleEdit = (season: Season) => {
    setFormData({
      name: season.name,
      year: season.year,
      status: season.status,
      start_date: season.start_date,
      end_date: season.end_date,
    })
    setEditingId(season.id)
    setShowForm(true)
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="w-full mx-auto px-4 py-8 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-naija-green-900">Seasons Management</h1>
              <p className="text-gray-600">Create and manage competition seasons</p>
            </div>
            <button
              onClick={() => {
                setShowForm(true)
                setEditingId(null)
                setFormData({
                  name: '',
                  year: new Date().getFullYear(),
                  status: 'upcoming' as 'upcoming' | 'active' | 'ended',
                  start_date: '',
                  end_date: '',
                })
              }}
              className="flex items-center gap-2 px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold"
            >
              <Plus size={20} />
              New Season
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-6 mb-8">
              <h2 className="text-xl font-bold text-naija-green-900 mb-4">
                {editingId ? 'Edit Season' : 'Create New Season'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Season Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Season 1"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Year
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as 'upcoming' | 'active' | 'ended' })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="active">Active</option>
                      <option value="ended">Ended</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold"
                  >
                    {editingId ? 'Update' : 'Create'} Season
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

          {/* Seasons List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full mx-auto"></div>
            </div>
          ) : seasons.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Calendar size={32} className="mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 font-semibold">No seasons created yet</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {seasons.map(season => (
                <div
                  key={season.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-naija-green-900">
                        {season.name} {season.year}
                      </h3>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>📅 {new Date(season.start_date).toLocaleDateString()} - {new Date(season.end_date).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded font-semibold ${
                          season.status === 'active' ? 'bg-green-100 text-green-800' :
                          season.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {season.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(season)}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition flex items-center gap-2"
                      >
                        <Edit2 size={18} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(season.id)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center gap-2"
                      >
                        <Trash2 size={18} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}