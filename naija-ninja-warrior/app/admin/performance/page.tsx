'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Clock, Save, AlertTriangle } from 'lucide-react'

interface Stage {
  id: string
  name: string
  stage_order: number
  max_winners: number | null
}

interface Participant {
  id: string
  user_id: string
  user_name: string
  full_name: string
  position: number | null
  time_seconds: number | null
  status: string
}

interface Season {
  id: string
  name: string
  year: number
}

export default function PerformancePage() {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [savingUserId, setSavingUserId] = useState<string | null>(null)
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('')
  const [selectedStageId, setSelectedStageId] = useState<string>('')
  const [performanceData, setPerformanceData] = useState<{ [key: string]: { minutes: string; seconds: string } }>({})
  const [showEliminationConfirm, setShowEliminationConfirm] = useState(false)
  const [eliminationPreview, setEliminationPreview] = useState<string[]>([])

  useEffect(() => {
    loadSeasons()
  }, [])

  useEffect(() => {
    if (selectedSeasonId) {
      loadStages(selectedSeasonId)
      loadParticipants(selectedSeasonId)
    }
  }, [selectedSeasonId])

  useEffect(() => {
    if (selectedSeasonId && selectedStageId) {
      loadPerformances()
    }
  }, [selectedStageId])

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
        .select('id, name, stage_order, max_winners')
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

  const loadParticipants = async (seasonId: string) => {
    try {
      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select('id, user_id, status')
        .eq('season_id', seasonId)
        .eq('status', 'approved')

      if (appsError) throw appsError

      if (!appsData || appsData.length === 0) {
        setParticipants([])
        return
      }

      const userIds = [...new Set(appsData.map(app => app.user_id))]
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, full_name')
        .in('id', userIds)

      if (usersError) throw usersError

      const usersMap = new Map()
      usersData?.forEach((user: any) => {
        usersMap.set(user.id, user)
      })

      const participantsList = appsData.map((app: any) => {
        const user = usersMap.get(app.user_id)
        return {
          id: app.id,
          user_id: app.user_id,
          full_name: user?.full_name || 'Unknown',
          user_name: user?.full_name || 'Unknown',
          position: null,
          time_seconds: null,
          status: 'pending',
        }
      })

      setParticipants(participantsList)
    } catch (err) {
      console.error('Failed to load participants:', err)
      toast.error('Failed to load participants')
    }
  }

  const loadPerformances = async () => {
    try {
      const { data, error } = await supabase
        .from('stage_performances')
        .select('user_id, position, time_seconds, status')
        .eq('competition_stage_id', selectedStageId)

      if (error && error.code !== 'PGRST116') throw error

      const perfMap: { [key: string]: { minutes: string; seconds: string } } = {}
      ;(data || []).forEach((perf: any) => {
        if (perf.time_seconds) {
          const minutes = Math.floor(perf.time_seconds / 60)
          const seconds = perf.time_seconds % 60
          perfMap[perf.user_id] = {
            minutes: minutes.toString(),
            seconds: seconds.toString(),
          }
        }
      })

      setPerformanceData(perfMap)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSavePerformance = async (userId: string) => {
    const perf = performanceData[userId]
    if (!perf || (!perf.minutes && !perf.seconds)) {
      toast.error('Enter time in minutes and seconds')
      return
    }

    setSavingUserId(userId)

    try {
      // Convert minutes and seconds to total seconds
      const minutes = parseInt(perf.minutes || '0')
      const seconds = parseInt(perf.seconds || '0')
      const totalSeconds = minutes * 60 + seconds

      if (totalSeconds <= 0) {
        toast.error('Time must be greater than zero')
        setSavingUserId(null)
        return
      }

      // Check if performance already exists
      const { data: existingPerf } = await supabase
        .from('stage_performances')
        .select('id')
        .eq('competition_stage_id', selectedStageId)
        .eq('user_id', userId)
        .single()

      if (existingPerf) {
        const { error } = await supabase
          .from('stage_performances')
          .update({
            time_seconds: totalSeconds,
            status: 'completed',
          })
          .eq('id', existingPerf.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('stage_performances')
          .insert({
            competition_stage_id: selectedStageId,
            user_id: userId,
            application_id: participants.find(p => p.user_id === userId)?.id,
            time_seconds: totalSeconds,
            status: 'completed',
          })

        if (error) throw error
      }

      // Recalculate positions for all participants in this stage
      await updatePositions()

      toast.success('Performance saved!')
      loadPerformances()
    } catch (err) {
      toast.error('Failed to save performance')
      console.error(err)
    } finally {
      setSavingUserId(null)
    }
  }

  const updatePositions = async () => {
    try {
      // Get all performances for this stage
      const { data: allPerformances, error } = await supabase
        .from('stage_performances')
        .select('id, user_id, time_seconds')
        .eq('competition_stage_id', selectedStageId)
        .not('time_seconds', 'is', null)
        .order('time_seconds', { ascending: true })

      if (error) throw error

      // Update positions based on sorted times (lowest time = position 1)
      for (let i = 0; i < allPerformances.length; i++) {
        const { error: updateError } = await supabase
          .from('stage_performances')
          .update({ position: i + 1 })
          .eq('id', allPerformances[i].id)

        if (updateError) throw updateError
      }
    } catch (err) {
      console.error('Failed to update positions:', err)
    }
  }

  const calculateEliminations = () => {
    const currentStage = stages.find(s => s.id === selectedStageId)
    if (!currentStage || !currentStage.max_winners) {
      toast.error('Stage configuration error: No winner limit set')
      return
    }

    // Get all participants with recorded times
    const participantsWithTimes = participants
      .filter(p => performanceData[p.user_id]?.minutes || performanceData[p.user_id]?.seconds)
      .map(p => {
        const minutes = parseInt(performanceData[p.user_id]?.minutes || '0')
        const seconds = parseInt(performanceData[p.user_id]?.seconds || '0')
        return {
          ...p,
          totalSeconds: minutes * 60 + seconds,
        }
      })
      .sort((a, b) => a.totalSeconds - b.totalSeconds) // Sort by time (lowest first)

    if (participantsWithTimes.length === 0) {
      toast.error('No performances recorded yet')
      return
    }

    if (participantsWithTimes.length <= currentStage.max_winners) {
      toast.info('No eliminations needed - all participants qualify')
      return
    }

    const maxWinners = currentStage.max_winners
    const toEliminate = participantsWithTimes.slice(maxWinners) // Everyone after the max_winners

    setEliminationPreview(toEliminate.map(p => p.user_id))
    setShowEliminationConfirm(true)
  }

  const handleElimination = async () => {
    try {
      // Update application status to 'eliminated' for those who didn't make it
      for (const userId of eliminationPreview) {
        const participant = participants.find(p => p.user_id === userId)
        if (participant) {
          const { error } = await supabase
            .from('applications')
            .update({ status: 'eliminated' })
            .eq('id', participant.id)

          if (error) throw error
        }
      }

      toast.success(`${eliminationPreview.length} participant(s) eliminated`)
      setShowEliminationConfirm(false)
      setEliminationPreview([])
      loadParticipants(selectedSeasonId)
    } catch (err) {
      console.error(err)
      toast.error('Failed to eliminate participants')
    }
  }

  const formatTime = (userId: string) => {
    const perf = performanceData[userId]
    if (!perf || (!perf.minutes && !perf.seconds)) return '-'
    const minutes = perf.minutes || '0'
    const seconds = perf.seconds || '0'
    return `${minutes}:${seconds.padStart(2, '0')}`
  }

  const getPositionForUser = (userId: string) => {
    const participantsWithTimes = participants
      .filter(p => performanceData[p.user_id]?.minutes || performanceData[p.user_id]?.seconds)
      .map(p => {
        const minutes = parseInt(performanceData[p.user_id]?.minutes || '0')
        const seconds = parseInt(performanceData[p.user_id]?.seconds || '0')
        return {
          user_id: p.user_id,
          totalSeconds: minutes * 60 + seconds,
        }
      })
      .sort((a, b) => a.totalSeconds - b.totalSeconds)

    const position = participantsWithTimes.findIndex(p => p.user_id === userId)
    return position >= 0 ? position + 1 : null
  }

  const currentStage = stages.find(s => s.id === selectedStageId)
  const participantsWithTimes = participants.filter(p => performanceData[p.user_id]?.minutes || performanceData[p.user_id]?.seconds).length

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-naija-green-900 flex items-center gap-2">
              <Clock size={32} />
              Record Performance
            </h1>
            <p className="text-gray-600">Enter completion times for participants</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Season</label>
                <select
                  value={selectedSeasonId}
                  onChange={e => setSelectedSeasonId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                >
                  {seasons.length === 0 && <option>No active seasons</option>}
                  {seasons.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stage</label>
                <select
                  value={selectedStageId}
                  onChange={e => setSelectedStageId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
                >
                  {stages.length === 0 && <option>No stages</option>}
                  {stages.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.max_winners ? `(Top ${s.max_winners} advance)` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stage Info */}
          {currentStage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-blue-600 mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900">
                    {currentStage.max_winners 
                      ? `This stage advances the top ${currentStage.max_winners} participant(s). Recorded: ${participantsWithTimes}/${participants.length}`
                      : 'No elimination limit set for this stage'}
                  </p>
                  {currentStage.max_winners && participantsWithTimes > currentStage.max_winners && (
                    <button
                      onClick={calculateEliminations}
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                    >
                      Process Eliminations
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Participants Table */}
          {participants.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600 font-semibold">No approved participants</p>
              <p className="text-gray-500 text-sm mt-2">Make sure applications are approved for the selected season</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Position</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Participant</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Time (MM:SS)</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {participants
                      .sort((a, b) => {
                        const timeA = performanceData[a.user_id] 
                          ? (parseInt(performanceData[a.user_id].minutes || '0') * 60 + parseInt(performanceData[a.user_id].seconds || '0'))
                          : Infinity
                        const timeB = performanceData[b.user_id]
                          ? (parseInt(performanceData[b.user_id].minutes || '0') * 60 + parseInt(performanceData[b.user_id].seconds || '0'))
                          : Infinity
                        return timeA - timeB
                      })
                      .map((participant) => {
                        const position = getPositionForUser(participant.user_id)
                        return (
                          <tr key={participant.user_id} className="hover:bg-gray-50">
                            <td className="px-6 py-3 text-sm">
                              {position ? (
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-naija-green-600 text-white rounded-full text-xs font-bold">
                                  {position}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-3 text-sm font-medium text-gray-900">
                              {participant.full_name}
                            </td>
                            <td className="px-6 py-3 text-sm">
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  value={performanceData[participant.user_id]?.minutes || ''}
                                  onChange={e => setPerformanceData({
                                    ...performanceData,
                                    [participant.user_id]: {
                                      ...performanceData[participant.user_id],
                                      minutes: e.target.value,
                                    }
                                  })}
                                  placeholder="MM"
                                  className="w-16 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-naija-green-600 text-center"
                                />
                                <span className="text-gray-500 font-bold">:</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="59"
                                  value={performanceData[participant.user_id]?.seconds || ''}
                                  onChange={e => {
                                    const val = parseInt(e.target.value || '0')
                                    if (val <= 59) {
                                      setPerformanceData({
                                        ...performanceData,
                                        [participant.user_id]: {
                                          ...performanceData[participant.user_id],
                                          seconds: e.target.value,
                                        }
                                      })
                                    }
                                  }}
                                  placeholder="SS"
                                  className="w-16 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-naija-green-600 text-center"
                                />
                              </div>
                            </td>
                            <td className="px-6 py-3 text-sm">
                              <button
                                onClick={() => handleSavePerformance(participant.user_id)}
                                disabled={savingUserId === participant.user_id}
                                className="px-3 py-1 bg-naija-green-600 text-white rounded hover:bg-naija-green-700 transition flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {savingUserId === participant.user_id ? (
                                  <>
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <Save size={16} />
                                    Save
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Elimination Confirmation Dialog */}
          {showEliminationConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="text-red-600" size={24} />
                  Confirm Eliminations
                </h3>
                <p className="text-gray-600 mb-4">
                  The following {eliminationPreview.length} participant(s) will be eliminated based on their times:
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 max-h-48 overflow-y-auto">
                  <ul className="space-y-1">
                    {eliminationPreview.map(userId => {
                      const participant = participants.find(p => p.user_id === userId)
                      const time = formatTime(userId)
                      return (
                        <li key={userId} className="text-sm text-gray-900">
                          <strong>{participant?.full_name}</strong> - {time}
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleElimination}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    Confirm Elimination
                  </button>
                  <button
                    onClick={() => {
                      setShowEliminationConfirm(false)
                      setEliminationPreview([])
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