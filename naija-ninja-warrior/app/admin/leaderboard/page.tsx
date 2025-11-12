// File Path: app/admin/leaderboard/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Trophy, TrendingUp, Clock, Award } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  user_id: string
  full_name: string
  total_position: number | null
  final_time_seconds: number | null
  stages_completed: number
  last_stage_reached: string | null
}

interface Season {
  id: string
  name: string
  year: number
}

export default function AdminLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSeasons()
  }, [])

  useEffect(() => {
    if (selectedSeasonId) {
      loadLeaderboard()
    }
  }, [selectedSeasonId])

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

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('season_leaderboard')
        .select(`
          user_id,
          total_position,
          final_time_seconds,
          stages_completed,
          last_stage_reached,
          users (full_name)
        `)
        .eq('season_id', selectedSeasonId)
        .order('total_position', { ascending: true, nullsFirst: true })
        .order('final_time_seconds', { ascending: true, nullsFirst: true })

      if (error) throw error

      const entries = (data || []).map((entry: any, index: number) => ({
        rank: index + 1,
        user_id: entry.user_id,
        full_name: entry.users?.[0]?.full_name || 'Unknown',
        total_position: entry.total_position,
        final_time_seconds: entry.final_time_seconds,
        stages_completed: entry.stages_completed || 0,
        last_stage_reached: entry.last_stage_reached || 'Not started',
      }))

      setLeaderboard(entries)
    } catch (err) {
      toast.error('Failed to load leaderboard')
      console.error(err)
    }
  }

  const formatTime = (seconds: number | null) => {
    if (!seconds) return '-'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
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
              <Trophy size={32} />
              Live Leaderboard
            </h1>
            <p className="text-gray-600">Track top performers in real-time</p>
          </div>

          {/* Season Selector */}
          <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-4 mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Season</label>
            <select
              value={selectedSeasonId}
              onChange={e => setSelectedSeasonId(e.target.value)}
              className="w-full md:w-64 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600"
            >
              {seasons.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.year}
                </option>
              ))}
            </select>
          </div>

          {/* Leaderboard */}
          {leaderboard.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Trophy size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 font-semibold text-lg">No participants yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Top 3 Featured */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {leaderboard.slice(0, 3).map(entry => (
                  <div
                    key={entry.user_id}
                    className={`rounded-lg shadow-md border-2 p-6 text-center ${
                      entry.rank === 1
                        ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300'
                        : entry.rank === 2
                        ? 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300'
                        : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300'
                    }`}
                  >
                    <div className="text-5xl mb-3">{getMedalIcon(entry.rank)}</div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">#{entry.rank}</p>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{entry.full_name}</h3>
                    <div className="space-y-2 text-sm">
                      {entry.total_position && (
                        <div className="flex items-center justify-center gap-2 text-gray-700">
                          <Award size={16} />
                          <span>Position: {entry.total_position}</span>
                        </div>
                      )}
                      {entry.final_time_seconds && (
                        <div className="flex items-center justify-center gap-2 text-gray-700">
                          <Clock size={16} />
                          <span>{formatTime(entry.final_time_seconds)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <TrendingUp size={16} />
                        <span>{entry.stages_completed} stages completed</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Full Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-naija-green-600 to-naija-green-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Rank</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Participant</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-white">Position</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-white">Best Time</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-white">Stages</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Last Stage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {leaderboard.map((entry, idx) => (
                        <tr key={entry.user_id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 text-sm font-bold text-naija-green-600">
                            {entry.rank}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {getMedalIcon(entry.rank) && <span className="text-2xl">{getMedalIcon(entry.rank)}</span>}
                              <span className="font-semibold text-gray-900">{entry.full_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {entry.total_position ? (
                              <span className="inline-block bg-naija-green-100 text-naija-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                {entry.total_position}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center font-mono text-gray-900">
                            {formatTime(entry.final_time_seconds)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {entry.stages_completed}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {entry.last_stage_reached}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}