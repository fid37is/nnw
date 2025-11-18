'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Users, CheckCircle, XCircle, AlertCircle, BarChart3, User, Award, Trophy } from 'lucide-react'
import Image from 'next/image'

interface Stage {
  id: string
  name: string
  stage_order: number
  start_date: string
  end_date: string
  status: 'upcoming' | 'ongoing' | 'completed'
}

interface Performance {
  user_id: string
  full_name: string
  profile_photo: string | null
  position: number | null
  time_seconds: number | null
  points: number | null
  status: string
}

interface Season {
  id: string
  name: string
  year: number
}

interface StageStats {
  total_participants: number
  completed: number
  pending: number
  elimination_rate: number
  total_points_awarded: number
  average_points: number
}

export default function AdminStageProgressPage() {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('')
  const [selectedStageId, setSelectedStageId] = useState<string>('')
  const [performances, setPerformances] = useState<Performance[]>([])
  const [stageStats, setStageStats] = useState<StageStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSeasons()
  }, [])

  useEffect(() => {
    if (selectedSeasonId) {
      loadStages(selectedSeasonId)
    }
  }, [selectedSeasonId])

  useEffect(() => {
    if (selectedSeasonId && selectedStageId) {
      loadStageProgress()
    }
  }, [selectedSeasonId, selectedStageId])

  const loadSeasons = async () => {
    try {
      const { data, error } = await supabase
        .from('seasons')
        .select('id, name, year, status')
        .eq('status', 'active')
        .order('year', { ascending: false })

      if (error) throw error
      setSeasons(data || [])
      if (data && data.length > 0) {
        setSelectedSeasonId(data[0].id)
      }
    } catch (err) {
      toast.error('Failed to load seasons')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadStages = async (seasonId: string) => {
    try {
      const { data, error } = await supabase
        .from('competition_stages')
        .select('id, name, stage_order, start_date, end_date, status')
        .eq('season_id', seasonId)
        .order('stage_order', { ascending: true })

      if (error) throw error
      setStages(data || [])
      if (data && data.length > 0) {
        setSelectedStageId(data[0].id)
      }
    } catch (err) {
      toast.error('Failed to load stages')
    }
  }

  const loadStageProgress = async () => {
    try {
      // Get total approved participants for this season with their photos
      const { data: appData } = await supabase
        .from('applications')
        .select('id, user_id, photo_url')
        .eq('season_id', selectedSeasonId)
        .eq('status', 'approved')

      const totalParticipants = appData?.length || 0

      // Get performances for this stage with points
      const { data: perfData, error } = await supabase
        .from('stage_performances')
        .select('user_id, position, time_seconds, points, status')
        .eq('competition_stage_id', selectedStageId)
        .order('position', { ascending: true, nullsFirst: false })
        .order('time_seconds', { ascending: true, nullsFirst: false })

      if (error) throw error

      // Get user IDs from performances
      const userIds = perfData?.map(p => p.user_id) || []
      
      // Fetch user details (names)
      let usersMap = new Map()
      if (userIds.length > 0) {
        const { data: usersData } = await supabase
          .from('users')
          .select('id, full_name')
          .in('id', userIds)

        usersData?.forEach((user: any) => {
          usersMap.set(user.id, user)
        })
      }

      // Create application map for photos
      const appMap = new Map()
      appData?.forEach((app: any) => {
        appMap.set(app.user_id, app)
      })

      // Map performances with user data and photos
      const perfs = (perfData || []).map((p: any) => {
        const user = usersMap.get(p.user_id)
        const app = appMap.get(p.user_id)
        return {
          user_id: p.user_id,
          full_name: user?.full_name || 'Unknown',
          profile_photo: app?.photo_url || null,
          position: p.position,
          time_seconds: p.time_seconds,
          points: p.points || 0,
          status: p.status,
        }
      })

      setPerformances(perfs)

      // Calculate stats
      const completed = perfs.filter(p => p.status === 'completed').length
      const pending = totalParticipants - completed
      const eliminationRate = totalParticipants > 0 ? (pending / totalParticipants) * 100 : 0
      const totalPointsAwarded = perfs.reduce((sum, p) => sum + (p.points || 0), 0)
      const averagePoints = completed > 0 ? Math.round(totalPointsAwarded / completed) : 0

      setStageStats({
        total_participants: totalParticipants,
        completed,
        pending,
        elimination_rate: Math.round(eliminationRate),
        total_points_awarded: totalPointsAwarded,
        average_points: averagePoints,
      })
    } catch (err) {
      toast.error('Failed to load stage progress')
      console.error(err)
    }
  }

  const formatTime = (seconds: number | null) => {
    if (!seconds) return '-'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStageStatusColor = (status: string) => {
    if (status === 'ongoing') return 'bg-blue-100 text-blue-800 border-blue-300'
    if (status === 'completed') return 'bg-green-100 text-green-800 border-green-300'
    return 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const getPositionBadgeColor = (position: number | null) => {
    if (!position) return 'bg-gray-100 text-gray-700'
    if (position === 1) return 'bg-yellow-100 text-yellow-800 border-2 border-yellow-400'
    if (position === 2) return 'bg-gray-200 text-gray-800 border-2 border-gray-400'
    if (position === 3) return 'bg-orange-100 text-orange-800 border-2 border-orange-400'
    return 'bg-naija-green-100 text-naija-green-700'
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

  const currentStage = stages.find(s => s.id === selectedStageId)

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-naija-green-900 flex items-center gap-2">
              <BarChart3 size={32} />
              Stage Progress
            </h1>
            <p className="text-gray-600">Track participant advancement and points through each stage</p>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Season</label>
              <select
                value={selectedSeasonId}
                onChange={e => setSelectedSeasonId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
              >
                {seasons.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.year}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Stage</label>
              <select
                value={selectedStageId}
                onChange={e => setSelectedStageId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
              >
                {stages.map(s => (
                  <option key={s.id} value={s.id}>
                    Stage {s.stage_order}: {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stage Info & Stats */}
          {currentStage && stageStats && (
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-naija-green-900">{currentStage.name}</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {new Date(currentStage.start_date).toLocaleDateString()} - {new Date(currentStage.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg border-2 font-semibold text-lg ${getStageStatusColor(currentStage.status)}`}>
                    {currentStage.status.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs font-semibold">Total</p>
                      <p className="text-2xl font-bold text-blue-700 mt-2">{stageStats.total_participants}</p>
                    </div>
                    <Users size={28} className="text-blue-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm border border-green-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs font-semibold">Completed</p>
                      <p className="text-2xl font-bold text-green-700 mt-2">{stageStats.completed}</p>
                    </div>
                    <CheckCircle size={28} className="text-green-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-sm border border-orange-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs font-semibold">Pending</p>
                      <p className="text-2xl font-bold text-orange-700 mt-2">{stageStats.pending}</p>
                    </div>
                    <AlertCircle size={28} className="text-orange-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-sm border border-red-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs font-semibold">Elim. Rate</p>
                      <p className="text-2xl font-bold text-red-700 mt-2">{stageStats.elimination_rate}%</p>
                    </div>
                    <XCircle size={28} className="text-red-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-sm border border-purple-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs font-semibold">Total Points</p>
                      <p className="text-2xl font-bold text-purple-700 mt-2">{stageStats.total_points_awarded}</p>
                    </div>
                    <Award size={28} className="text-purple-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow-sm border border-amber-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs font-semibold">Avg Points</p>
                      <p className="text-2xl font-bold text-amber-700 mt-2">{stageStats.average_points}</p>
                    </div>
                    <Trophy size={28} className="text-amber-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Participants List */}
          {performances.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Users size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 font-semibold text-lg">No performances recorded yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-naija-green-600 to-naija-green-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-white">Rank</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-white">Participant</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-white">Position</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-white">Time</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-white">Points</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-white">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {performances.map((perf, idx) => (
                      <tr key={perf.user_id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4">
                          <span className="inline-flex w-8 h-8 bg-naija-green-600 text-white rounded-full items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                              {perf.profile_photo ? (
                                <Image
                                  src={perf.profile_photo}
                                  alt={perf.full_name}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User size={20} className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <p className="font-semibold text-gray-900">{perf.full_name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {perf.position ? (
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getPositionBadgeColor(perf.position)}`}>
                              {perf.position === 1 && '🥇'}
                              {perf.position === 2 && '🥈'}
                              {perf.position === 3 && '🥉'}
                              {perf.position > 3 && '#'}
                              {perf.position}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-gray-900 font-semibold">
                          {formatTime(perf.time_seconds)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {perf.points !== null && perf.points > 0 ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                              <Award size={14} />
                              {perf.points}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {perf.status === 'completed' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                              <CheckCircle size={16} />
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                              <AlertCircle size={16} />
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}