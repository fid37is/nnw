'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Plus, Edit2, Trash2, Zap, AlertCircle, Trophy } from 'lucide-react'

interface Stage {
  id: string
  season_id: string
  name: string
  stage_order: number
  start_date: string
  end_date: string
  status: 'upcoming' | 'ongoing' | 'completed'
  max_winners: number | null
  is_final: boolean
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
    is_final: false,
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
      const { data: seasonsData, error: seasonsError } = await supabase
        .from('seasons')
        .select('id, name, year, status')
        .order('year', { ascending: false })

      if (seasonsError) throw seasonsError
      setSeasons(seasonsData || [])

      const { data: stagesData, error: stagesError } = await supabase
        .from('competition_stages')
        .select('id, season_id, name, stage_order, start_date, end_date, status, max_winners, is_final')
        .order('stage_order', { ascending: true })

      if (stagesError) throw stagesError

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
            is_final: s.is_final || false,
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

  const validateStageSequence = (stageOrder: number, startDate: string, endDate: string): string | null => {
    const seasonStages = stages.filter(s => s.season_id === selectedSeasonId && s.id !== editingId)
    
    // Check if dates are valid
    if (new Date(startDate) >= new Date(endDate)) {
      return 'End date must be after start date'
    }

    // For Stage 1 (order 1), no previous stage validation needed
    if (stageOrder === 1) {
      // Just check for date overlap with other stages
      const hasOverlap = seasonStages.some(s => {
        const sStart = new Date(s.start_date)
        const sEnd = new Date(s.end_date)
        const newStart = new Date(startDate)
        const newEnd = new Date(endDate)
        return (newStart <= sEnd && newEnd >= sStart)
      })
      
      if (hasOverlap) {
        return 'Date range overlaps with another stage'
      }
      return null
    }

    // For subsequent stages
    const previousStage = seasonStages.find(s => s.stage_order === stageOrder - 1)
    
    if (!previousStage) {
      return `Stage ${stageOrder - 1} must be created first`
    }

    if (previousStage.status !== 'completed') {
      return `Stage ${stageOrder - 1} must be completed before creating this stage`
    }

    // New stage must start after previous stage ends
    const prevEndDate = new Date(previousStage.end_date)
    const newStartDate = new Date(startDate)
    
    if (newStartDate <= prevEndDate) {
      return `Stage must start after ${new Date(prevEndDate).toLocaleDateString()}`
    }

    // Check for overlap with any other stage
    const hasOverlap = seasonStages.some(s => {
      const sStart = new Date(s.start_date)
      const sEnd = new Date(s.end_date)
      const newStart = new Date(startDate)
      const newEnd = new Date(endDate)
      return (newStart <= sEnd && newEnd >= sStart)
    })
    
    if (hasOverlap) {
      return 'Date range overlaps with another stage'
    }

    return null
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedSeasonId || !formData.name || !formData.start_date || !formData.end_date) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate stage sequence
    const validationError = validateStageSequence(
      formData.stage_order,
      formData.start_date,
      formData.end_date
    )

    if (validationError) {
      toast.error(validationError)
      return
    }

    // If marked as final, check if max_winners is 1
    if (formData.is_final && formData.max_winners && parseInt(formData.max_winners.toString()) !== 1) {
      toast.error('Final stage must have exactly 1 winner (the champion)')
      return
    }

    // Check if another stage is already marked as final for this season
    if (formData.is_final) {
      const existingFinal = stages.find(
        s => s.season_id === selectedSeasonId && s.is_final && s.id !== editingId
      )
      if (existingFinal) {
        toast.error(`${existingFinal.name} is already marked as the final stage`)
        return
      }
    }

    try {
      const dataToSave = {
        name: formData.name,
        stage_order: formData.stage_order,
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: formData.status,
        max_winners: formData.max_winners ? parseInt(formData.max_winners.toString()) : null,
        is_final: formData.is_final,
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
        max_winners: '',
        is_final: false,
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
      const stageToDeleteObj = stages.find(s => s.id === stageToDelete)
      
      // Check if there are stages after this one
      const hasLaterStages = stages.some(
        s => s.season_id === stageToDeleteObj?.season_id && s.stage_order > (stageToDeleteObj?.stage_order || 0)
      )

      if (hasLaterStages) {
        toast.error('Cannot delete this stage. Delete later stages first.')
        setShowDeleteConfirm(false)
        setStageToDelete(null)
        return
      }

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

  const getNextStageOrder = () => {
    const seasonStages = stages.filter(s => s.season_id === selectedSeasonId)
    if (seasonStages.length === 0) return 1
    return Math.max(...seasonStages.map(s => s.stage_order)) + 1
  }

  const getLastStageEndDate = () => {
    const seasonStages = stages.filter(s => s.season_id === selectedSeasonId)
    if (seasonStages.length === 0) return ''
    const lastStage = seasonStages.reduce((prev, curr) => 
      curr.stage_order > prev.stage_order ? curr : prev
    )
    return lastStage.end_date
  }

  const canCreateNewStage = () => {
    const seasonStages = stages.filter(s => s.season_id === selectedSeasonId)
    if (seasonStages.length === 0) return true
    
    const lastStage = seasonStages.reduce((prev, curr) => 
      curr.stage_order > prev.stage_order ? curr : prev
    )
    
    return lastStage.status === 'completed'
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-naija-green-900 flex items-center gap-2">
                <Zap size={32} />
                Competition Stages
              </h1>
              <p className="text-gray-600">Manage sequential stages for each season</p>
            </div>
            <button
              onClick={() => {
                if (!canCreateNewStage() && filteredStages.length > 0) {
                  toast.error('Complete the current stage before creating a new one')
                  return
                }
                const nextOrder = getNextStageOrder()
                const lastEndDate = getLastStageEndDate()
                setShowForm(true)
                setEditingId(null)
                setFormData({ 
                  name: '', 
                  stage_order: nextOrder, 
                  start_date: lastEndDate || '', 
                  end_date: '', 
                  status: 'upcoming',
                  max_winners: '',
                  is_final: false,
                })
              }}
              className="px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold flex items-center gap-2 disabled:opacity-50"
              disabled={!canCreateNewStage() && filteredStages.length > 0}
            >
              <Plus size={20} />
              Add Stage
            </button>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Stage Rules:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Stages must be created in order (1, 2, 3...)</li>
                  <li>Each stage must start after the previous stage ends</li>
                  <li>Previous stage must be completed before creating the next</li>
                  <li>Date ranges cannot overlap</li>
                  <li>Mark the last stage as "Final" - the remaining participant becomes champion</li>
                  <li>Final stage must have exactly 1 winner</li>
                </ul>
              </div>
            </div>
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
                      placeholder="e.g., Quarter Final, Semi Final, Grand Final"
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
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 bg-gray-50"
                      required
                      readOnly={!editingId}
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-assigned based on sequence</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                      min={getLastStageEndDate() || undefined}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                      required
                    />
                    {getLastStageEndDate() && (
                      <p className="text-xs text-gray-500 mt-1">
                        Must be after {new Date(getLastStageEndDate()).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">End Date *</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                      min={formData.start_date || undefined}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Max Winners * {formData.is_final && '(Must be 1)'}
                    </label>
                    <input
                      type="number"
                      value={formData.max_winners}
                      onChange={e => setFormData({ ...formData, max_winners: e.target.value })}
                      min="1"
                      placeholder="e.g., 10"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                      required
                      disabled={formData.is_final}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.is_final 
                        ? 'Final stage has 1 winner (champion)'
                        : 'Number of participants who advance to next stage'}
                    </p>
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

                <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="is_final"
                    checked={formData.is_final}
                    onChange={e => setFormData({ 
                      ...formData, 
                      is_final: e.target.checked,
                      max_winners: e.target.checked ? '1' : formData.max_winners
                    })}
                    className="w-5 h-5 text-naija-green-600 rounded focus:ring-naija-green-500"
                  />
                  <label htmlFor="is_final" className="flex items-center gap-2 text-sm font-semibold text-yellow-900 cursor-pointer">
                    <Trophy size={18} className="text-yellow-600" />
                    Mark as Final Stage (Championship Round)
                  </label>
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
              <p className="text-gray-500 text-sm mt-1">Create your first stage to start the competition</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredStages.map(stage => (
                <div key={stage.id} className={`bg-white rounded-lg shadow-sm border-2 p-6 ${
                  stage.is_final ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50' : 'border-gray-200'
                }`}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex w-8 h-8 bg-naija-green-600 text-white rounded-full items-center justify-center text-sm font-bold">
                          {stage.stage_order}
                        </span>
                        <h3 className="text-lg font-bold text-naija-green-900">{stage.name}</h3>
                        {stage.is_final && (
                          <span className="ml-2 px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
                            <Trophy size={14} />
                            FINAL STAGE
                          </span>
                        )}
                        {stage.max_winners && !stage.is_final && (
                          <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                            Top {stage.max_winners} advance
                          </span>
                        )}
                        {stage.max_winners && stage.is_final && (
                          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">
                            1 Champion
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
                            is_final: stage.is_final,
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
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this stage? All performances will be deleted too. You can only delete the last stage in the sequence.
                </p>
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