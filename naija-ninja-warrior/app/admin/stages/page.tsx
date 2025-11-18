'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Plus, Edit2, Trash2, Zap } from 'lucide-react'

interface Stage {
  id: string
  season_id: string
  name: string
  stage_order: number
  start_date: string
  end_date: string
  status: 'upcoming' | 'ongoing' | 'completed'
  max_winners: number | null
  season_name: string
}

interface Season {
  id: string
  name: string
  year: number
  status: string
}

export default function StagesPage() {
  const [stages, setStages] = useState<Stage[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [stageToDelete, setStageToDelete] = useState<string | null>(null)
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    stage_order: 1,
    start_date: '',
    end_date: '',
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed',
    max_winners: '' as string | number,
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (seasons.length > 0 && !selectedSeasonId) {
      setSelectedSeasonId(seasons[0].id)
    }
  }, [seasons])

  const loadData = async () => {
    try {
      // Load seasons
      const { data: seasonsData, error: seasonsError } = await supabase
        .from('seasons')
        .select('id, name, year, status')
        .order('year', { ascending: false })

      if (seasonsError) throw seasonsError
      setSeasons(seasonsData || [])

      // Load stages with season info separately
      const { data: stagesData, error: stagesError } = await supabase
        .from('competition_stages')
        .select('id, season_id, name, stage_order, start_date, end_date, status, max_winners')
        .order('stage_order', { ascending: true })

      if (stagesError) throw stagesError

      // Get season names
      if (stagesData && stagesData.length > 0) {
        const seasonIds = [...new Set(stagesData.map((s: any) => s.season_id))]
        const { data: seasonNames } = await supabase
          .from('seasons')
          .select('id, name')
          .in('id', seasonIds)

        const seasonMap = new Map()
        seasonNames?.forEach((s: any) => seasonMap.set(s.id, s.name))

        setStages(
          stagesData.map((s: any) => ({
            id: s.id,
            season_id: s.season_id,
            name: s.name,
            stage_order: s.stage_order,
            start_date: s.start_date,
            end_date: s.end_date,
            status: s.status,
            max_winners: s.max_winners,
            season_name: seasonMap.get(s.season_id) || 'Unknown',
          }))
        )
      } else {
        setStages([])
      }
    } catch (err) {
      toast.error('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedSeasonId || !formData.name || !formData.start_date || !formData.end_date) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const dataToSave = {
        name: formData.name,
        stage_order: formData.stage_order,
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: formData.status,
        max_winners: formData.max_winners ? parseInt(formData.max_winners.toString()) : null,
      }

      if (editingId) {
        const { error } = await supabase
          .from('competition_stages')
          .update(dataToSave)
          .eq('id', editingId)

        if (error) throw error
        toast.success('Stage updated!')
      } else {
        const { error } = await supabase
          .from('competition_stages')
          .insert([{ season_id: selectedSeasonId, ...dataToSave }])

        if (error) throw error
        toast.success('Stage created!')
      }

      setFormData({ 
        name: '', 
        stage_order: 1, 
        start_date: '', 
        end_date: '', 
        status: 'upcoming',
        max_winners: ''
      })
      setEditingId(null)
      setShowForm(false)
      loadData()
    } catch (err) {
      toast.error('Failed to save stage')
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (!stageToDelete) return

    try {
      const { error } = await supabase
        .from('competition_stages')
        .delete()
        .eq('id', stageToDelete)

      if (error) throw error
      toast.success('Stage deleted!')
      setShowDeleteConfirm(false)
      setStageToDelete(null)
      loadData()
    } catch (err) {
      toast.error('Failed to delete stage')
    }
  }

  const filteredStages = selectedSeasonId
    ? stages.filter(s => s.season_id === selectedSeasonId)
    : []

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
                <Zap size={32} />
                Competition Stages
              </h1>
              <p className="text-gray-600">Manage stages for each season</p>
            </div>
            <button
              onClick={() => {
                setShowForm(true)
                setEditingId(null)
                setFormData({ 
                  name: '', 
                  stage_order: 1, 
                  start_date: '', 
                  end_date: '', 
                  status: 'upcoming',
                  max_winners: ''
                })
              }}
              className="px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              Add Stage
            </button>
          </div>

          {/* Season Selector */}
          <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-4 mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Season</label>
            <select
              value={selectedSeasonId}
              onChange={e => setSelectedSeasonId(e.target.value)}
              className="w-full md:w-64 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
            >
              {seasons.map(season => (
                <option key={season.id} value={season.id}>
                  {season.name} {season.year}
                </option>
              ))}
            </select>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-6 mb-8">
              <h2 className="text-xl font-bold text-naija-green-900 mb-4">
                {editingId ? 'Edit Stage' : 'Add New Stage'}
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Stage Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Stage 1, Quarter Final, Semi Final"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Stage Order *</label>
                    <input
                      type="number"
                      value={formData.stage_order}
                      onChange={e => setFormData({ ...formData, stage_order: parseInt(e.target.value) })}
                      min="1"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">End Date *</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Max Winners *</label>
                    <input
                      type="number"
                      value={formData.max_winners}
                      onChange={e => setFormData({ ...formData, max_winners: e.target.value })}
                      min="1"
                      placeholder="e.g., 10"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Number of participants who advance to next stage</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold"
                  >
                    {editingId ? 'Update' : 'Add'} Stage
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

          {/* Stages List */}
          {filteredStages.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Zap size={32} className="mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 font-semibold">No stages created for this season</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredStages.map(stage => (
                <div key={stage.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex w-8 h-8 bg-naija-green-600 text-white rounded-full items-center justify-center text-sm font-bold">
                          {stage.stage_order}
                        </span>
                        <h3 className="text-lg font-bold text-naija-green-900">{stage.name}</h3>
                        {stage.max_winners && (
                          <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                            Top {stage.max_winners} advance
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {new Date(stage.start_date).toLocaleDateString()} - {new Date(stage.end_date).toLocaleDateString()}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        stage.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                        stage.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {stage.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setFormData({
                            name: stage.name,
                            stage_order: stage.stage_order,
                            start_date: stage.start_date,
                            end_date: stage.end_date,
                            status: stage.status,
                            max_winners: stage.max_winners || '',
                          })
                          setEditingId(stage.id)
                          setShowForm(true)
                        }}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition flex items-center gap-2"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setStageToDelete(stage.id)
                          setShowDeleteConfirm(true)
                        }}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center gap-2"
                      >
                        <Trash2 size={18} />
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
                <h3 className="text-lg font-bold text-gray-900 mb-3">Delete Stage</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this stage? All performances will be deleted too.</p>
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
                      setStageToDelete(null)
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