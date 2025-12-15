'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { Trophy, ArrowLeft, User, Crown, Medal, Award } from 'lucide-react'
import Navbar from '../navbar'

interface Champion {
  season_id: string
  season_name: string
  season_year: number
  champion_id: string
  champion_name: string
  champion_preferred_name: string | null
  champion_photo: string | null
  champion_points: number
  second_runner_up_name: string | null
  second_runner_up_preferred_name: string | null
  second_runner_up_photo: string | null
  third_runner_up_name: string | null
  third_runner_up_preferred_name: string | null
  third_runner_up_photo: string | null
  completion_date: string | null
}

export default function HallOfFamePage() {
  const [champions, setChampions] = useState<Champion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChampions()
  }, [])

  const loadChampions = async () => {
    try {
      // Get all completed/ended seasons
      const { data: seasons, error: seasonsError } = await supabase
        .from('seasons')
        .select('id, name, year, status, completion_date')
        .or('status.eq.completed,status.eq.ended,season_completed.eq.true')
        .order('year', { ascending: false })

      if (seasonsError) throw seasonsError

      if (!seasons || seasons.length === 0) {
        setChampions([])
        setLoading(false)
        return
      }

      const seasonIds = seasons.map(s => s.id)

      // Get all champions (positions 1, 2, 3) for these seasons
      const { data: championsData, error: championsError } = await supabase
        .from('champions')
        .select('*')
        .in('season_id', seasonIds)
        .in('position', [1, 2, 3])

      if (championsError) throw championsError

      // Get all user IDs from champions
      const userIds = [...new Set(championsData?.map(c => c.user_id) || [])]

      if (userIds.length === 0) {
        setChampions([])
        setLoading(false)
        return
      }

      // Get user data with preferred names
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, full_name, preferred_name')
        .in('id', userIds)

      if (usersError) throw usersError

      // Create users map
      const usersMap = new Map()
      usersData?.forEach((user: any) => {
        usersMap.set(user.id, user)
      })

      // Build champion records by season
      const championRecords: Champion[] = []

      seasons.forEach(season => {
        const seasonChamps = championsData?.filter(c => c.season_id === season.id) || []
        
        const champion = seasonChamps.find(c => c.position === 1)
        const secondPlace = seasonChamps.find(c => c.position === 2)
        const thirdPlace = seasonChamps.find(c => c.position === 3)

        if (champion) {
          const championUser = usersMap.get(champion.user_id)
          const secondUser = secondPlace ? usersMap.get(secondPlace.user_id) : null
          const thirdUser = thirdPlace ? usersMap.get(thirdPlace.user_id) : null

          championRecords.push({
            season_id: season.id,
            season_name: season.name,
            season_year: season.year,
            champion_id: champion.id,
            champion_name: championUser?.full_name || 'Unknown',
            champion_preferred_name: championUser?.preferred_name || null,
            champion_photo: champion.photo_url || null,
            champion_points: champion.final_points || 0,
            second_runner_up_name: secondUser?.full_name || null,
            second_runner_up_preferred_name: secondUser?.preferred_name || null,
            second_runner_up_photo: secondPlace?.photo_url || null,
            third_runner_up_name: thirdUser?.full_name || null,
            third_runner_up_preferred_name: thirdUser?.preferred_name || null,
            third_runner_up_photo: thirdPlace?.photo_url || null,
            completion_date: season.completion_date
          })
        }
      })

      setChampions(championRecords)
    } catch (err) {
      console.error('Failed to load champions:', err)
      setChampions([])
    } finally {
      setLoading(false)
    }
  }

  const getDisplayName = (fullName: string, preferredName: string | null) => {
    return preferredName || fullName
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-gray-50">
      <Navbar />

      {loading ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="animate-spin w-12 h-12 border-4 border-yellow-200 border-t-yellow-600 rounded-full"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header */}
          <div className="mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-yellow-700 hover:text-yellow-800 mb-6 font-medium transition group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Back to Home</span>
            </Link>
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Trophy size={48} className="text-yellow-600" />
                <h1 className="text-5xl md:text-6xl font-black text-gray-900">Hall of Fame</h1>
                <Trophy size={48} className="text-yellow-600" />
              </div>
              <p className="text-xl text-gray-600 font-medium">Celebrating Our Champions Across All Seasons</p>
            </div>
          </div>

          {champions.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-16 text-center border border-gray-200">
              <Trophy size={80} className="mx-auto mb-6 text-gray-300" />
              <p className="text-2xl text-gray-600 font-semibold mb-2">No Champions Yet</p>
              <p className="text-gray-500">Champions will appear here once seasons are completed!</p>
            </div>
          ) : (
            <div className="space-y-12">
              {champions.map((champion) => (
                <div
                  key={champion.season_id}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-yellow-300"
                >
                  {/* Season Header */}
                  <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-black text-white mb-1">
                          {champion.season_name} {champion.season_year}
                        </h2>
                        {champion.completion_date && (
                          <p className="text-yellow-100 text-sm">
                            Completed: {new Date(champion.completion_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                      <Award size={48} className="text-white/80" />
                    </div>
                  </div>

                  {/* Champions Display */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Champion - Center/First */}
                      <div className={`${champion.second_runner_up_name || champion.third_runner_up_name ? 'md:col-start-2' : 'md:col-span-3 max-w-md mx-auto'}`}>
                        <div className="relative">
                          {/* Champion Card */}
                          <div className="group relative overflow-hidden rounded-2xl shadow-2xl ring-4 ring-yellow-400 ring-offset-4 hover:scale-105 transition-all duration-300">
                            <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-yellow-300 to-amber-400">
                              {champion.champion_photo ? (
                                <Image
                                  src={champion.champion_photo}
                                  alt={getDisplayName(champion.champion_name, champion.champion_preferred_name)}
                                  fill
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User size={80} className="text-yellow-600/50" />
                                </div>
                              )}

                              {/* Crown Badge */}
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-full p-4 shadow-2xl border-4 border-white animate-pulse">
                                <Crown size={40} className="text-white" />
                              </div>

                              {/* Champion Label */}
                              <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-yellow-500 text-white px-4 py-1.5 rounded-full text-sm font-black shadow-lg whitespace-nowrap">
                                🏆 CHAMPION 🏆
                              </div>

                              {/* Gradient Overlay */}
                              <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

                              {/* Name and Stats */}
                              <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                                <p className="text-white font-black text-2xl mb-3 leading-tight">
                                  {getDisplayName(champion.champion_name, champion.champion_preferred_name)}
                                </p>
                                <div className="flex justify-center gap-4 text-white/90">
                                  <div className="text-center">
                                    <p className="text-2xl font-bold">{champion.champion_points}</p>
                                    <p className="text-xs">Points</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Second Runner-Up - Left */}
                      {champion.second_runner_up_name && (
                        <div className="md:order-first">
                          <div className="group relative overflow-hidden rounded-2xl shadow-lg ring-2 ring-gray-300 hover:scale-105 transition-all duration-300">
                            <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                              {champion.second_runner_up_photo ? (
                                <Image
                                  src={champion.second_runner_up_photo}
                                  alt={getDisplayName(champion.second_runner_up_name, champion.second_runner_up_preferred_name || null)}
                                  fill
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User size={60} className="text-gray-400" />
                                </div>
                              )}

                              {/* Silver Medal */}
                              <div className="absolute top-3 left-3 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full p-2 shadow-lg border-2 border-white">
                                <Medal size={24} className="text-white" />
                              </div>

                              <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full">
                                <p className="text-sm font-bold text-gray-700">2nd</p>
                              </div>

                              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                              <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                                <p className="text-white font-bold text-lg leading-tight">
                                  {getDisplayName(champion.second_runner_up_name, champion.second_runner_up_preferred_name || null)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Third Runner-Up - Right */}
                      {champion.third_runner_up_name && (
                        <div>
                          <div className="group relative overflow-hidden rounded-2xl shadow-lg ring-2 ring-orange-300 hover:scale-105 transition-all duration-300">
                            <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-orange-200 to-orange-300">
                              {champion.third_runner_up_photo ? (
                                <Image
                                  src={champion.third_runner_up_photo}
                                  alt={getDisplayName(champion.third_runner_up_name, champion.third_runner_up_preferred_name || null)}
                                  fill
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User size={60} className="text-orange-400" />
                                </div>
                              )}

                              {/* Bronze Medal */}
                              <div className="absolute top-3 left-3 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full p-2 shadow-lg border-2 border-white">
                                <Medal size={24} className="text-white" />
                              </div>

                              <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full">
                                <p className="text-sm font-bold text-orange-700">3rd</p>
                              </div>

                              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                              <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                                <p className="text-white font-bold text-lg leading-tight">
                                  {getDisplayName(champion.third_runner_up_name, champion.third_runner_up_preferred_name || null)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  )
}