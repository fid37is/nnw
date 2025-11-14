'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { Trophy, ArrowLeft, User, Clock } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  user_id: string
  full_name: string
  profile_photo: string | null
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
      const { data: stagesData } = await supabase
        .from('competition_stages')
        .select('id')
        .eq('season_id', selectedSeasonId)

      if (!stagesData || stagesData.length === 0) {
        setLeaderboard([])
        return
      }

      const stageIds = stagesData.map(s => s.id)

      const { data: perfData, error } = await supabase
        .from('stage_performances')
        .select('user_id, position, time_seconds, status, competition_stage_id')
        .in('competition_stage_id', stageIds)
        .eq('status', 'completed')

      if (error) throw error

      const userIds = [...new Set(perfData?.map(p => p.user_id) || [])]

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

      // Get applications for photos
      const { data: appData } = await supabase
        .from('applications')
        .select('user_id, photo_url')
        .eq('season_id', selectedSeasonId)

      const appMap = new Map()
      appData?.forEach((app: any) => {
        appMap.set(app.user_id, app)
      })

      const userStats = new Map()

      perfData?.forEach((perf: any) => {
        if (!userStats.has(perf.user_id)) {
          userStats.set(perf.user_id, {
            user_id: perf.user_id,
            total_position: 0,
            final_time_seconds: 0,
            stages_completed: 0,
          })
        }

        const stats = userStats.get(perf.user_id)
        stats.total_position += perf.position || 0
        stats.final_time_seconds += perf.time_seconds || 0
        stats.stages_completed += 1
      })

      const entries = Array.from(userStats.values())
        .map((stats: any) => {
          const user = usersMap.get(stats.user_id)
          const app = appMap.get(stats.user_id)
          return {
            user_id: stats.user_id,
            full_name: user?.full_name || 'Unknown',
            profile_photo: app?.photo_url || null,
            total_position: stats.total_position,
            final_time_seconds: stats.final_time_seconds,
            stages_completed: stats.stages_completed,
          }
        })
        .sort((a, b) => {
          if (a.total_position !== b.total_position) {
            return a.total_position - b.total_position
          }
          return a.final_time_seconds - b.final_time_seconds
        })
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
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

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  const getRankGradient = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-500'
    if (rank === 2) return 'from-gray-300 to-gray-400'
    if (rank === 3) return 'from-orange-400 to-orange-500'
    return 'from-green-400 to-green-500'
  }

  const currentSeason = seasons.find(s => s.id === selectedSeasonId)

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full"></div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden shadow-md">
              <Image
                src="/logo.png"
                alt="Naija Ninja Logo"
                width={48}
                height={48}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:inline">Naija Ninja</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition">Home</Link>
            <Link href="/leaderboard" className="text-green-600 font-semibold">Leaderboard</Link>
            <Link href="/participants" className="text-gray-600 hover:text-gray-900 transition">Participants</Link>
            <Link href="/merch" className="text-gray-600 hover:text-gray-900 transition">Shop</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition">About</Link>
          </div>
          <Link href="/register" className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all transform hover:scale-105">
            Apply Now
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 font-medium transition group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <Trophy size={40} className="text-green-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Leaderboard</h1>
          </div>
          <p className="text-lg text-gray-600">Live rankings and competitor performance</p>
        </div>

        {/* Season Selector */}
        {seasons.length > 1 && (
          <div className="mb-10 max-w-xs">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Season</label>
            <select
              value={selectedSeasonId}
              onChange={e => setSelectedSeasonId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 font-medium transition"
            >
              {seasons.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.year}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Leaderboard Cards */}
        {leaderboard.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-200">
            <Trophy size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-xl text-gray-600 font-semibold">No competitors yet</p>
            <p className="text-gray-500 mt-2">Check back soon for rankings!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {leaderboard.map((entry) => (
              <div
                key={entry.user_id}
                className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                {/* Card Image Container - 3:4 Aspect Ratio */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
                  {entry.profile_photo ? (
                    <Image
                      src={entry.profile_photo}
                      alt={entry.full_name}
                      fill
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <User size={48} className="text-gray-500" />
                    </div>
                  )}

                  {/* Rank Badge - Top Left */}
                  <div
                    className={`absolute top-3 left-3 w-12 h-12 rounded-full bg-gradient-to-br ${getRankGradient(
                      entry.rank
                    )} flex items-center justify-center text-2xl font-bold shadow-lg border-2 border-white`}
                  >
                    {getMedalEmoji(entry.rank)}
                  </div>

                  {/* Time Badge - Top Right */}
                  <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow-lg">
                    <p className="text-xs font-bold text-gray-700">{formatTime(entry.final_time_seconds)}</p>
                  </div>

                  {/* Gradient Overlay at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                  {/* Name at Bottom - Large and Bold */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-black text-2xl leading-tight line-clamp-3">
                      {entry.full_name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}