'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { Trophy, ArrowLeft } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  user_id: string
  full_name: string
  total_position: number | null
  final_time_seconds: number | null
  stages_completed: number
}

interface Season {
  id: string
  name: string
  year: number
}

export default function LeaderboardPage() {
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
        .order('year', { ascending: false })

      if (error) throw error
      setSeasons(data || [])
      if (data && data.length > 0) {
        setSelectedSeasonId(data[0].id)
      }
    } catch (err) {
      console.error('Failed to load seasons:', err)
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
          users (full_name)
        `)
        .eq('season_id', selectedSeasonId)
        .order('total_position', { ascending: true, nullsFirst: false })
        .order('final_time_seconds', { ascending: true, nullsFirst: false })

      if (error) throw error

      const entries = (data || []).map((entry: any, index: number) => ({
        rank: index + 1,
        user_id: entry.user_id,
        full_name: entry.users?.[0]?.full_name || 'Unknown',
        total_position: entry.total_position,
        final_time_seconds: entry.final_time_seconds,
        stages_completed: entry.stages_completed || 0,
      }))

      setLeaderboard(entries)
    } catch (err) {
      console.error('Failed to load leaderboard:', err)
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

  const currentSeason = seasons.find(s => s.id === selectedSeasonId)

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full"></div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-naija-green-600 rounded-lg flex items-center justify-center shadow-md overflow-hidden">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="font-bold text-gray-900 hidden sm:inline">Naija Ninja</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/leaderboard" className="text-naija-green-600">Leaderboard</Link>
            <Link href="/participants" className="text-gray-600 hover:text-gray-900">Participants</Link>
            <Link href="/merch" className="text-gray-600 hover:text-gray-900">Shop</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
          </div>
          <Link href="/register" className="px-6 py-2 bg-naija-green-600 text-white text-sm font-semibold rounded-lg hover:bg-naija-green-700">
            Apply
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-naija-green-600 hover:text-naija-green-700 mb-4 w-fit">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-600">Live rankings and performance</p>
        </div>

        {/* Season Selector - Only if multiple seasons */}
        {seasons.length > 1 && (
          <div className="mb-8 max-w-xs">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Season</label>
            <select
              value={selectedSeasonId}
              onChange={e => setSelectedSeasonId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-naija-green-600"
            >
              {seasons.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.year}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Leaderboard Table */}
        {leaderboard.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
            <Trophy size={32} className="mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 font-medium">No participants yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Name</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Position</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Time</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Stages</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, idx) => (
                  <tr key={entry.user_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {getMedalIcon(entry.rank) && <span className="text-lg">{getMedalIcon(entry.rank)}</span>}
                        <span className="font-bold text-naija-green-600">#{entry.rank}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">{entry.full_name}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {entry.total_position ? (
                        <span className="inline-block bg-naija-green-100 text-naija-green-700 px-2 py-1 rounded text-sm font-semibold">
                          {entry.total_position}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center font-mono text-gray-900 text-sm">
                      {formatTime(entry.final_time_seconds)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-semibold">
                        {entry.stages_completed}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}