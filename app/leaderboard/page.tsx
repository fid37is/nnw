'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { Trophy, ArrowLeft, User, Crown } from 'lucide-react'
import Navbar from '../navbar'

interface LeaderboardEntry {
  rank: number
  application_id: string
  user_id: string
  full_name: string
  preferred_name: string | null
  profile_photo: string | null
  total_points: number
  stages_completed: number
}

interface Season {
  id: string
  name: string
  year: number
  status: string
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
      // Get ONLY active (non-eliminated) applications
      const { data: applications, error: appsError } = await supabase
        .from('applications')
        .select('id, user_id, photo_url, status, is_eliminated')
        .eq('season_id', selectedSeasonId)
        .eq('status', 'approved')
        .eq('is_eliminated', false)

      if (appsError) throw appsError

      if (!applications || applications.length === 0) {
        setLeaderboard([])
        return
      }

      const applicationIds = applications.map(app => app.id)
      const userIds = [...new Set(applications.map(app => app.user_id))]

      // Get all completed performances
      const { data: perfData, error: perfError } = await supabase
        .from('stage_performances')
        .select('application_id, points, status')
        .in('application_id', applicationIds)
        .eq('status', 'completed')

      if (perfError) throw perfError

      // Get user data with preferred names
      const { data: usersData } = await supabase
        .from('users')
        .select('id, full_name, preferred_name')
        .in('id', userIds)

      const usersMap = new Map()
      usersData?.forEach((user: any) => {
        usersMap.set(user.id, user)
      })

      // Create app to user mapping
      const appToUserMap = new Map()
      applications.forEach(app => {
        appToUserMap.set(app.id, {
          user_id: app.user_id,
          photo_url: app.photo_url
        })
      })

      // Calculate total points and stages completed per participant
      const participantStats = new Map()

      perfData?.forEach((perf: any) => {
        const appInfo = appToUserMap.get(perf.application_id)
        if (!appInfo) return

        const appId = perf.application_id

        if (!participantStats.has(appId)) {
          participantStats.set(appId, {
            application_id: appId,
            user_id: appInfo.user_id,
            total_points: perf.points || 0,
            stages_completed: 1,
            photo_url: appInfo.photo_url
          })
        } else {
          const stats = participantStats.get(appId)
          stats.total_points += (perf.points || 0)
          stats.stages_completed += 1
        }
      })

      // Convert to array and sort by total points (highest first)
      const entries = Array.from(participantStats.values())
        .map((stats: any) => {
          const user = usersMap.get(stats.user_id)
          return {
            application_id: stats.application_id,
            user_id: stats.user_id,
            full_name: user?.full_name || 'Unknown',
            preferred_name: user?.preferred_name || null,
            profile_photo: stats.photo_url || null,
            total_points: stats.total_points,
            stages_completed: stats.stages_completed
          }
        })
        .sort((a, b) => b.total_points - a.total_points)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }))

      setLeaderboard(entries)
    } catch (err) {
      console.error('Failed to load leaderboard:', err)
      setLeaderboard([])
    }
  }

  const getDisplayName = (entry: LeaderboardEntry) => {
    return entry.preferred_name || entry.full_name
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
  const isSeasonEnded = currentSeason?.status === 'completed' || currentSeason?.status === 'ended'

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {loading ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="animate-spin w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full"></div>
        </div>
      ) : (
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
            <p className="text-lg text-gray-600">Live rankings - Active competitors only</p>
          </div>

          {/* Season Ended Banner */}
          {isSeasonEnded && (
            <div className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400 rounded-2xl p-8 shadow-lg text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Crown size={48} className="text-yellow-600" />
                <h2 className="text-3xl font-bold text-gray-900">Season Concluded!</h2>
                <Crown size={48} className="text-yellow-600" />
              </div>
              <p className="text-gray-700 text-lg mb-6">
                {currentSeason?.name} {currentSeason?.year} has ended. The competition is complete!
              </p>
              <Link 
                href="/hall-of-fame"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold rounded-xl hover:from-yellow-600 hover:to-amber-600 transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Trophy size={24} />
                <span>View Hall of Fame</span>
              </Link>
              <p className="text-gray-600 text-sm mt-4">See the champions and final standings from all completed seasons</p>
            </div>
          )}

          {/* Season Selector */}
          {seasons.length > 1 && !isSeasonEnded && (
            <div className="mb-10 max-w-xs">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Season</label>
              <select
                value={selectedSeasonId}
                onChange={e => setSelectedSeasonId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 font-medium transition"
              >
                {seasons.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.year} {(s.status === 'completed' || s.status === 'ended') && '(Ended)'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Leaderboard Cards - Only show if season is NOT ended */}
          {!isSeasonEnded && (
            <>
              {leaderboard.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-200">
                  <Trophy size={64} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-xl text-gray-600 font-semibold">No active competitors yet</p>
                  <p className="text-gray-500 mt-2">Check back soon for rankings!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.application_id}
                      className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                      {/* Card Image Container - 3:4 Aspect Ratio */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
                        {entry.profile_photo ? (
                          <Image
                            src={entry.profile_photo}
                            alt={getDisplayName(entry)}
                            fill
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300">
                            <User size={48} className="text-gray-500" />
                          </div>
                        )}

                        {/* Rank Badge */}
                        <div
                          className={`absolute top-3 left-3 w-12 h-12 rounded-full bg-gradient-to-br ${getRankGradient(
                            entry.rank
                          )} flex items-center justify-center text-2xl font-bold shadow-lg border-2 border-white`}
                        >
                          {getMedalEmoji(entry.rank) || entry.rank}
                        </div>

                        {/* Points Badge */}
                        <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow-lg">
                          <p className="text-xs font-bold text-gray-700">{entry.total_points} pts</p>
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                        {/* Name and Stats */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-black text-2xl leading-tight line-clamp-3">
                            {getDisplayName(entry)}
                          </p>
                          <p className="text-white/80 text-sm mt-1">{entry.stages_completed} stages</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </main>
  )
}