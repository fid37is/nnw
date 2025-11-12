'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Clock, Save } from 'lucide-react'

interface Stage {
  id: string
  name: string
  stage_order: number
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
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('')
  const [selectedStageId, setSelectedStageId] = useState<string>('')
  const [performanceData, setPerformanceData] = useState<{ [key: string]: { position: string; time: string } }>({})

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
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('seasons')
        .select('id, name, year, status')
        .eq('status', 'active')
        .lte('application_start_date', today)
        .gte('application_end_date', today)
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
        .select('id, name, stage_order')
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
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          user_id,
          status,
          users (id, full_name)
        `)
        .eq('season_id', seasonId)
        .eq('status', 'approved')

      if (error) throw error

      setParticipants(
        (data || []).map((app: any) => ({
          id: app.id,
          user_id: app.user_id,
          full_name: app.users?.[0]?.full_name || 'Unknown',
          user_name: app.users?.[0]?.full_name || 'Unknown',
          position: null,
          time_seconds: null,
          status: 'pending',
        }))
      )
    } catch (err) {
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

      const perfMap: { [key: string]: { position: string; time: string } } = {}
      ;(data || []).forEach((perf: any) => {
        perfMap[perf.user_id] = {
          position: perf.position?.toString() || '',
          time: perf.time_seconds?.toString() || '',
        }
      })

      setPerformanceData(perfMap)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSavePerformance = async (userId: string) => {
    const perf = performanceData[userId]
    if (!perf || (!perf.position && !perf.time)) {
      toast.error('Enter position or time')
      return
    }

    try {
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
            position: perf.position ? parseInt(perf.position) : null,
            time_seconds: perf.time ? parseInt(perf.time) : null,
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
            position: perf.position ? parseInt(perf.position) : null,
            time_seconds: perf.time ? parseInt(perf.time) : null,
            status: 'completed',
          })

        if (error) throw error
      }

      toast.success('Performance saved!')
      loadPerformances()
    } catch (err) {
      toast.error('Failed to save performance')
      console.error(err)
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-naija-green-900 flex items-center gap-2">
              <Clock size={32} />
              Record Performance
            </h1>
            <p className="text-gray-600">Enter times and positions for participants</p>
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
                  {stages.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Participants Table */}
          {participants.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600 font-semibold">No approved participants</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Participant</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Position</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Time (seconds)</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {participants.map(participant => (
                      <tr key={participant.user_id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                          {participant.full_name}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <input
                            type="number"
                            min="1"
                            value={performanceData[participant.user_id]?.position || ''}
                            onChange={e => setPerformanceData({
                              ...performanceData,
                              [participant.user_id]: {
                                ...performanceData[participant.user_id],
                                position: e.target.value,
                              }
                            })}
                            placeholder="Position"
                            className="w-20 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-naija-green-600"
                          />
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <input
                            type="number"
                            min="0"
                            value={performanceData[participant.user_id]?.time || ''}
                            onChange={e => setPerformanceData({
                              ...performanceData,
                              [participant.user_id]: {
                                ...performanceData[participant.user_id],
                                time: e.target.value,
                              }
                            })}
                            placeholder="Seconds"
                            className="w-24 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-naija-green-600"
                          />
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <button
                            onClick={() => handleSavePerformance(participant.user_id)}
                            className="px-3 py-1 bg-naija-green-600 text-white rounded hover:bg-naija-green-700 transition flex items-center gap-1 text-sm"
                          >
                            <Save size={16} />
                            Save
                          </button>
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