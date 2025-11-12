'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Plus, Edit2, Trash2, Calendar, Zap } from 'lucide-react'

interface Activity {
  id: string
  season_id: string
  name: string
  type: string
  start_date: string
  end_date: string
  location: string
  description: string
  status: 'upcoming' | 'ongoing' | 'completed'
}

interface Season {
  id: string
  name: string
  year: number
  status: 'upcoming' | 'active' | 'ended'
  start_date: string
  end_date: string
  application_start_date: string
  application_end_date: string
  activities?: Activity[]
}

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [loading, setLoading] = useState(true)
  const [showSeasonForm, setShowSeasonForm] = useState(false)
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [editingSeasonId, setEditingSeasonId] = useState<string | null>(null)
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ type: 'season' | 'activity'; id: string } | null>(null)
  const [seasonFormData, setSeasonFormData] = useState({
    name: '',
    year: new Date().getFullYear(),
    status: 'upcoming' as 'upcoming' | 'active' | 'ended',
    start_date: '',
    end_date: '',
    application_start_date: '',
    application_end_date: '',
  })
  const [activityFormData, setActivityFormData] = useState({
    name: '',
    type: 'state',
    start_date: '',
    end_date: '',
    location: '',
    description: '',
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed',
  })

  useEffect(() => {
    loadSeasons()
  }, [])

  const loadSeasons = async () => {
    try {
      const { data: seasonsData, error: seasonsError } = await supabase
        .from('seasons')
        .select('*')
        .order('year', { ascending: false })

      if (seasonsError) throw seasonsError

      const { data: activitiesData, error: activitiesError } = await supabase
        .from('competition_activities')
        .select('*')
        .order('start_date', { ascending: true })

      if (activitiesError) throw activitiesError

      const seasonsWithActivities = (seasonsData || []).map(season => ({
        ...season,
        activities: (activitiesData || []).filter(a => a.season_id === season.id),
      }))

      setSeasons(seasonsWithActivities as Season[])
    } catch (err) {
      toast.error('Failed to load seasons')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSeason = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!seasonFormData.name || !seasonFormData.start_date || !seasonFormData.end_date || !seasonFormData.application_start_date || !seasonFormData.application_end_date) {
      toast.error('Please fill in all season fields')
      return
    }

    try {
      if (editingSeasonId) {
        const { error } = await supabase
          .from('seasons')
          .update(seasonFormData)
          .eq('id', editingSeasonId)

        if (error) throw error
        toast.success('Season updated!')
      } else {
        const { error } = await supabase
          .from('seasons')
          .insert([seasonFormData])

        if (error) throw error
        toast.success('Season created!')
      }

      setSeasonFormData({
        name: '',
        year: new Date().getFullYear(),
        status: 'upcoming',
        start_date: '',
        end_date: '',
        application_start_date: '',
        application_end_date: '',
      })
      setEditingSeasonId(null)
      setShowSeasonForm(false)
      loadSeasons()
    } catch (err) {
      toast.error('Failed to save season')
    }
  }

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!setSelectedSeasonId || !activityFormData.name || !activityFormData.start_date || !activityFormData.end_date) {
      toast.error('Please fill in all activity fields')
      return
    }

    try {
      if (editingActivityId) {
        const { error } = await supabase
          .from('competition_activities')
          .update(activityFormData)
          .eq('id', editingActivityId)

        if (error) throw error
        toast.success('Activity updated!')
      } else {
        const { error } = await supabase
          .from('competition_activities')
          .insert([{
            season_id: setSelectedSeasonId,
            ...activityFormData,
          }])

        if (error) throw error
        toast.success('Activity created!')
      }

      setActivityFormData({
        name: '',
        type: 'state',
        start_date: '',
        end_date: '',
        location: '',
        description: '',
        status: 'upcoming',
      })
      setEditingActivityId(null)
      setShowActivityForm(false)
      loadSeasons()
    } catch (err) {
      toast.error('Failed to save activity')
    }
  }

  const handleDeleteSeason = async (id: string) => {
    if (!confirm('Delete this season and all its activities?')) return

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

  const handleDeleteActivity = async (id: string) => {
    if (!confirm('Delete this activity?')) return

    try {
      const { error } = await supabase
        .from('competition_activities')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Activity deleted!')
      loadSeasons()
    } catch (err) {
      toast.error('Failed to delete activity')
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

  function setSelectedSeasonId(id: string) {
    throw new Error('Function not implemented.')
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-naija-green-900">Seasons & Activities</h1>
              <p className="text-gray-600">Manage competition seasons and activities</p>
            </div>
            <button
              onClick={() => {
                setShowSeasonForm(true)
                setEditingSeasonId(null)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold"
            >
              <Plus size={20} />
              New Season
            </button>
          </div>

          {/* Season Form */}
          {showSeasonForm && (
            <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-6 mb-8">
              <h2 className="text-xl font-bold text-naija-green-900 mb-4">
                {editingSeasonId ? 'Edit Season' : 'Create New Season'}
              </h2>
              <form onSubmit={handleSaveSeason} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Season Name</label>
                    <input
                      type="text"
                      value={seasonFormData.name}
                      onChange={e => setSeasonFormData({ ...seasonFormData, name: e.target.value })}
                      placeholder="e.g., Season 1"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                    <input
                      type="number"
                      value={seasonFormData.year}
                      onChange={e => setSeasonFormData({ ...seasonFormData, year: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Season Start</label>
                    <input
                      type="date"
                      value={seasonFormData.start_date}
                      onChange={e => setSeasonFormData({ ...seasonFormData, start_date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Season End</label>
                    <input
                      type="date"
                      value={seasonFormData.end_date}
                      onChange={e => setSeasonFormData({ ...seasonFormData, end_date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Application Opens</label>
                    <input
                      type="date"
                      value={seasonFormData.application_start_date}
                      onChange={e => setSeasonFormData({ ...seasonFormData, application_start_date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Application Closes</label>
                    <input
                      type="date"
                      value={seasonFormData.application_end_date}
                      onChange={e => setSeasonFormData({ ...seasonFormData, application_end_date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select
                      value={seasonFormData.status}
                      onChange={e => setSeasonFormData({ ...seasonFormData, status: e.target.value as 'upcoming' | 'active' | 'ended' })}
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
                    {editingSeasonId ? 'Update' : 'Create'} Season
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSeasonForm(false)
                      setEditingSeasonId(null)
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
          <div className="space-y-6">
            {seasons.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Calendar size={32} className="mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 font-semibold">No seasons created yet</p>
              </div>
            ) : (
              seasons.map(season => (
                <div key={season.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-naija-green-900">
                        {season.name} {season.year}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                        <span>🏆 {new Date(season.start_date).toLocaleDateString()} - {new Date(season.end_date).toLocaleDateString()}</span>
                        <span>📝 Applications: {new Date(season.application_start_date).toLocaleDateString()} - {new Date(season.application_end_date).toLocaleDateString()}</span>
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
                        onClick={() => {
                          setSeasonFormData({
                            name: season.name,
                            year: season.year,
                            status: season.status,
                            start_date: season.start_date,
                            end_date: season.end_date,
                            application_start_date: season.application_start_date,
                            application_end_date: season.application_end_date,
                          })
                          setEditingSeasonId(season.id)
                          setShowSeasonForm(true)
                        }}
                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition flex items-center gap-2"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteSeason(season.id)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center gap-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        <Zap size={18} />
                        Competition Activities
                      </h4>
                      <button
                        onClick={() => {
                          setSelectedSeasonId(season.id)
                          setShowActivityForm(true)
                          setEditingActivityId(null)
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-naija-green-100 text-naija-green-700 rounded hover:bg-naija-green-200 transition text-sm font-semibold"
                      >
                        <Plus size={16} />
                        Add Activity
                      </button>
                    </div>

                    {season.activities && season.activities.length > 0 ? (
                      <div className="space-y-2">
                        {season.activities.map(activity => (
                          <div key={activity.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{activity.name}</p>
                              <p className="text-xs text-gray-600">
                                {activity.type.toUpperCase()} • {new Date(activity.start_date).toLocaleDateString()} - {new Date(activity.end_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setActivityFormData({
                                    name: activity.name,
                                    type: activity.type,
                                    start_date: activity.start_date,
                                    end_date: activity.end_date,
                                    location: activity.location,
                                    description: activity.description,
                                    status: activity.status,
                                  })
                                  setEditingActivityId(activity.id)
                                  setSelectedSeasonId(season.id)
                                  setShowActivityForm(true)
                                }}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteActivity(activity.id)}
                                className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No activities yet</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Activity Form Modal */}
          {showActivityForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                <h2 className="text-xl font-bold text-naija-green-900 mb-4">
                  {editingActivityId ? 'Edit Activity' : 'Add Activity'}
                </h2>
                <form onSubmit={handleSaveActivity} className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={activityFormData.name}
                      onChange={e => setActivityFormData({ ...activityFormData, name: e.target.value })}
                      placeholder="e.g., State Qualifiers"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                      <select
                        value={activityFormData.type}
                        onChange={e => setActivityFormData({ ...activityFormData, type: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                      >
                        <option value="state">State</option>
                        <option value="zone">Zone</option>
                        <option value="national">National</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                      <select
                        value={activityFormData.status}
                        onChange={e => setActivityFormData({ ...activityFormData, status: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Start</label>
                      <input
                        type="date"
                        value={activityFormData.start_date}
                        onChange={e => setActivityFormData({ ...activityFormData, start_date: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">End</label>
                      <input
                        type="date"
                        value={activityFormData.end_date}
                        onChange={e => setActivityFormData({ ...activityFormData, end_date: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={activityFormData.location}
                      onChange={e => setActivityFormData({ ...activityFormData, location: e.target.value })}
                      placeholder="e.g., Lagos Arena"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <textarea
                      value={activityFormData.description}
                      onChange={e => setActivityFormData({ ...activityFormData, description: e.target.value })}
                      placeholder="Activity details..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold text-sm"
                    >
                      {editingActivityId ? 'Update' : 'Add'} Activity
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowActivityForm(false)
                        setEditingActivityId(null)
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}