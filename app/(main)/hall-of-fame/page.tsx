'use client'

// File: app/(main)/hall-of-fame/page.tsx

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { Trophy, ArrowLeft, User, Crown, Medal, Award } from 'lucide-react'

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
    <>
      <header className="relative overflow-hidden bg-gradient-to-br from-nnw-navy via-nnw-navy to-nnw-green pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-nnw-ash hover:text-nnw-bone transition mb-6 text-xs font-mono tracking-widest uppercase">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-nnw-gold" />
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-nnw-gold">All Seasons</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <Trophy size={36} className="text-nnw-gold" />
            <h1 className="font-display uppercase text-4xl md:text-6xl text-nnw-bone leading-none">Hall of Fame.</h1>
          </div>
          <p className="text-nnw-ash text-lg max-w-xl">Celebrating our champions across all seasons.</p>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin w-10 h-10 border-4 border-nnw-gold/20 border-t-nnw-gold rounded-full" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {champions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-16 text-center border border-nnw-navy/10">
              <Trophy size={64} className="mx-auto mb-6 text-nnw-navy/20" />
              <p className="text-xl font-display uppercase text-nnw-navy mb-2">No Champions Yet</p>
              <p className="text-nnw-navy/50">Champions will appear here once seasons are completed!</p>
            </div>
          ) : (
            <div className="space-y-12">
              {champions.map((champion) => (
                <div
                  key={champion.season_id}
                  className="bg-white rounded-lg shadow-xl overflow-hidden border-2 border-nnw-gold/30"
                >
                  {/* Season Header */}
                  <div className="bg-gradient-to-r from-nnw-navy to-nnw-green px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-display uppercase text-3xl text-nnw-bone mb-1">
                          {champion.season_name} {champion.season_year}
                        </h2>
                        {champion.completion_date && (
                          <p className="text-nnw-ash text-sm">
                            Completed: {new Date(champion.completion_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                      <Award size={44} className="text-nnw-gold" />
                    </div>
                  </div>

                  {/* Champions Display */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Champion - Center/First */}
                      <div className={`${champion.second_runner_up_name || champion.third_runner_up_name ? 'md:col-start-2' : 'md:col-span-3 max-w-md mx-auto'}`}>
                        <div className="relative">
                          <div className="group relative overflow-hidden rounded-lg shadow-2xl ring-4 ring-nnw-gold ring-offset-4 hover:scale-105 transition-all duration-300">
                            <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-nnw-navy to-nnw-green">
                              {champion.champion_photo ? (
                                <Image
                                  src={champion.champion_photo}
                                  alt={getDisplayName(champion.champion_name, champion.champion_preferred_name)}
                                  fill
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User size={80} className="text-nnw-bone/40" />
                                </div>
                              )}

                              {/* Crown Badge */}
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-nnw-gold rounded-full p-4 shadow-2xl border-4 border-white">
                                <Crown size={40} className="text-nnw-navy" />
                              </div>

                              {/* Champion Label */}
                              <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-nnw-gold text-nnw-navy px-4 py-1.5 rounded-full text-sm font-display uppercase shadow-lg whitespace-nowrap">
                                🏆 Champion 🏆
                              </div>

                              {/* Gradient Overlay */}
                              <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-nnw-navy via-nnw-navy/70 to-transparent" />

                              {/* Name and Stats */}
                              <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                                <p className="text-nnw-bone font-display uppercase text-2xl mb-3 leading-tight">
                                  {getDisplayName(champion.champion_name, champion.champion_preferred_name)}
                                </p>
                                <div className="flex justify-center gap-4 text-nnw-bone/90">
                                  <div className="text-center">
                                    <p className="text-2xl font-display">{champion.champion_points}</p>
                                    <p className="text-xs font-mono uppercase tracking-wider">Points</p>
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
                          <div className="group relative overflow-hidden rounded-lg shadow-lg ring-2 ring-nnw-ash hover:scale-105 transition-all duration-300">
                            <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-nnw-navy to-nnw-ash">
                              {champion.second_runner_up_photo ? (
                                <Image
                                  src={champion.second_runner_up_photo}
                                  alt={getDisplayName(champion.second_runner_up_name, champion.second_runner_up_preferred_name || null)}
                                  fill
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User size={60} className="text-nnw-bone/40" />
                                </div>
                              )}

                              {/* Silver Medal */}
                              <div className="absolute top-3 left-3 bg-nnw-ash rounded-full p-2 shadow-lg border-2 border-white">
                                <Medal size={24} className="text-nnw-navy" />
                              </div>

                              <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full">
                                <p className="text-sm font-display uppercase text-nnw-navy">2nd</p>
                              </div>

                              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-nnw-navy via-nnw-navy/50 to-transparent" />

                              <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                                <p className="text-nnw-bone font-display uppercase text-lg leading-tight">
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
                          <div className="group relative overflow-hidden rounded-lg shadow-lg ring-2 ring-nnw-amber hover:scale-105 transition-all duration-300">
                            <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-nnw-navy to-nnw-amber">
                              {champion.third_runner_up_photo ? (
                                <Image
                                  src={champion.third_runner_up_photo}
                                  alt={getDisplayName(champion.third_runner_up_name, champion.third_runner_up_preferred_name || null)}
                                  fill
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User size={60} className="text-nnw-bone/40" />
                                </div>
                              )}

                              {/* Bronze Medal */}
                              <div className="absolute top-3 left-3 bg-nnw-amber rounded-full p-2 shadow-lg border-2 border-white">
                                <Medal size={24} className="text-nnw-bone" />
                              </div>

                              <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full">
                                <p className="text-sm font-display uppercase text-nnw-amber">3rd</p>
                              </div>

                              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-nnw-navy via-nnw-navy/50 to-transparent" />

                              <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                                <p className="text-nnw-bone font-display uppercase text-lg leading-tight">
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
    </>
  )
}