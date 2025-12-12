'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Trophy, Crown, Award, Calendar } from 'lucide-react'
import Image from 'next/image'

interface Champion {
  id: string
  season_id: string
  user_id: string
  full_name: string
  photo_url: string | null
  final_points: number
  position: number
  created_at: string
}

interface Season {
  id: string
  name: string
  year: number
  status: string
}

interface SeasonWithChampion {
  season: Season
  champion: Champion | null
}

export default function AdminChampionsPage() {
  const [seasonsWithChampions, setSeasonsWithChampions] = useState<SeasonWithChampion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAllChampions()
  }, [])

  const loadAllChampions = async () => {
    try {
      // Get all ended seasons
      const { data: seasons, error: seasonsError } = await supabase
        .from('seasons')
        .select('id, name, year, status')
        .eq('status', 'ended')
        .order('year', { ascending: false })

      if (seasonsError) throw seasonsError

      if (!seasons || seasons.length === 0) {
        setSeasonsWithChampions([])
        setLoading(false)
        return
      }

      // Get champions for all seasons (only position 1 - the actual champion)
      const { data: champions, error: championsError } = await supabase
        .from('champions')
        .select('*')
        .eq('position', 1) // Only get the champion (1st place)
        .in('season_id', seasons.map(s => s.id))

      if (championsError) throw championsError

      // Map champions to their seasons
      const championsMap = new Map(
        (champions || []).map(champ => [champ.season_id, champ])
      )

      const seasonsWithChamps = seasons.map(season => ({
        season,
        champion: championsMap.get(season.id) || null
      }))

      setSeasonsWithChampions(seasonsWithChamps)
    } catch (err) {
      toast.error('Failed to load champions')
      console.error(err)
    } finally {
      setLoading(false)
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
              <Crown size={32} className="text-yellow-500" />
              Champions Hall of Fame
            </h1>
            <p className="text-gray-600">All season champions throughout the competition history</p>
          </div>

          {/* Champions List */}
          {seasonsWithChampions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Trophy size={64} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 font-semibold text-xl">No champions yet</p>
              <p className="text-gray-500 text-sm mt-2">
                Complete a season and set champions to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Grid View - Featured Champions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seasonsWithChampions.map(({ season, champion }) => (
                  <div
                    key={season.id}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-yellow-400 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    {champion ? (
                      <>
                        {/* Champion Photo */}
                        <div className="relative h-72 bg-gradient-to-br from-gray-200 to-gray-300">
                          {champion.photo_url ? (
                            <Image
                              src={champion.photo_url}
                              alt={champion.full_name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Trophy size={80} className="text-gray-400" />
                            </div>
                          )}
                          
                          {/* Crown Badge */}
                          <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white/50 group-hover:rotate-12 transition-transform duration-300">
                            <Crown size={32} className="text-white" />
                          </div>

                          {/* Season Badge */}
                          <div className="absolute top-4 right-4">
                            <div className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                              <p className="text-white text-xs font-bold">{season.year}</p>
                            </div>
                          </div>

                          {/* Gradient Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                        </div>

                        {/* Champion Info */}
                        <div className="p-6">
                          <div className="mb-3">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-bold">
                              <Crown size={12} />
                              CHAMPION
                            </span>
                          </div>
                          
                          <h3 className="text-2xl font-black text-gray-900 mb-1 line-clamp-2">
                            {champion.full_name}
                          </h3>
                          
                          <p className="text-sm text-gray-600 mb-3 font-semibold">
                            {season.name} {season.year}
                          </p>
                          
                          <div className="flex items-center gap-2 text-purple-700 mb-3">
                            <Award size={18} />
                            <span className="font-bold">{champion.final_points} points</span>
                          </div>
                          
                          <div className="pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar size={14} />
                              Crowned: {new Date(champion.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* No Champion Yet */
                      <div className="p-8 text-center">
                        <Trophy size={48} className="mx-auto mb-3 text-gray-300" />
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {season.name} {season.year}
                        </h3>
                        <p className="text-sm text-gray-500">No champion set yet</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Table View - All Champions Summary */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-naija-green-900 mb-6 flex items-center gap-2">
                  <Trophy size={28} />
                  Champions Timeline
                </h2>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-yellow-500 to-yellow-600">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Season</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Year</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Champion</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-white">Final Points</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-white">Crowned</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {seasonsWithChampions.map(({ season, champion }, idx) => (
                        <tr key={season.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 font-semibold text-gray-900">
                            {season.name}
                          </td>
                          <td className="px-6 py-4 text-gray-900 font-medium">
                            {season.year}
                          </td>
                          <td className="px-6 py-4">
                            {champion ? (
                              <div className="flex items-center gap-3">
                                <Crown size={20} className="text-yellow-500" />
                                <span className="font-semibold text-gray-900">
                                  {champion.full_name}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Not set</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {champion ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                                <Award size={14} />
                                {champion.final_points}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {champion 
                              ? new Date(champion.created_at).toLocaleDateString()
                              : '-'
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-300 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-800 text-sm font-semibold">Total Seasons</p>
                      <p className="text-3xl font-black text-yellow-900 mt-1">
                        {seasonsWithChampions.length}
                      </p>
                    </div>
                    <Calendar size={40} className="text-yellow-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-300 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-800 text-sm font-semibold">Champions Crowned</p>
                      <p className="text-3xl font-black text-purple-900 mt-1">
                        {seasonsWithChampions.filter(s => s.champion).length}
                      </p>
                    </div>
                    <Crown size={40} className="text-purple-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-300 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-800 text-sm font-semibold">Avg Champion Points</p>
                      <p className="text-3xl font-black text-green-900 mt-1">
                        {seasonsWithChampions.filter(s => s.champion).length > 0
                          ? Math.round(
                              seasonsWithChampions
                                .filter(s => s.champion)
                                .reduce((sum, s) => sum + (s.champion?.final_points || 0), 0) /
                              seasonsWithChampions.filter(s => s.champion).length
                            )
                          : 0}
                      </p>
                    </div>
                    <Award size={40} className="text-green-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-6">
            <div className="flex gap-3">
              <Trophy size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">Hall of Fame</p>
                <p className="text-sm text-blue-700">
                  This page displays all champions from every completed season. Champions are automatically 
                  added when you process eliminations on the final stage of each season.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}