'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { Search, ArrowLeft, User, Users as UsersIcon, X } from 'lucide-react'
import Navbar from '../navbar'

interface Participant {
  id: string
  user_id: string
  full_name: string
  preferred_name: string | null
  status: string
  photo_url?: string | null
  age: number
  state: string
  geo_zone: string | null
  is_eliminated: boolean
}

interface ParticipantStats {
  ranking: number | null
  total_points: number
  challenges_completed: number
  challenges_won: number
  best_time: number | null
  average_points: number
  elimination_date?: string | null
}

interface Season {
  id: string
  name: string
  year: number
  status: string
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'eliminated'>('all')
  const [loading, setLoading] = useState(true)
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
  const [participantStats, setParticipantStats] = useState<ParticipantStats | null>(null)
  const [modalLoading, setModalLoading] = useState(false)

  useEffect(() => {
    loadSeasons()
  }, [])

  useEffect(() => {
    if (selectedSeasonId) {
      loadParticipants()
    }
  }, [selectedSeasonId])

  useEffect(() => {
    filterParticipants()
  }, [participants, searchTerm, statusFilter])

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

  const loadParticipants = async () => {
    setLoading(true)
    try {
      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select('id, user_id, status, photo_url, age, state, geo_zone, is_eliminated')
        .eq('season_id', selectedSeasonId)
        .eq('status', 'approved')

      if (appsError) throw appsError

      if (!appsData || appsData.length === 0) {
        setParticipants([])
        setLoading(false)
        return
      }

      const userIds = [...new Set(appsData.map(app => app.user_id))]
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, full_name, preferred_name')
        .in('id', userIds)

      if (usersError) throw usersError

      const usersMap = new Map()
      usersData?.forEach((user: any) => {
        usersMap.set(user.id, user)
      })

      const allParticipants = appsData.map((app: any) => {
        const user = usersMap.get(app.user_id)
        return {
          id: app.id,
          user_id: app.user_id,
          full_name: user?.full_name || 'Unknown',
          preferred_name: user?.preferred_name || null,
          photo_url: app.photo_url || null,
          status: app.is_eliminated ? 'eliminated' : 'active',
          age: app.age,
          state: app.state,
          geo_zone: app.geo_zone || null,
          is_eliminated: app.is_eliminated || false
        }
      })

      setParticipants(allParticipants)
    } catch (err) {
      console.error('Failed to load participants:', err)
      setParticipants([])
    } finally {
      setLoading(false)
    }
  }

  const filterParticipants = () => {
    let filtered = participants

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(p => {
        const displayName = p.preferred_name || p.full_name
        return displayName.toLowerCase().includes(searchTerm.toLowerCase())
      })
    }

    setFilteredParticipants(filtered)
  }

  const loadParticipantStats = async (participant: Participant) => {
    setModalLoading(true)
    setSelectedParticipant(participant)

    try {
      const { data: performances, error: perfError } = await supabase
        .from('stage_performances')
        .select('points, time_seconds, position, competition_stage_id, completed_at, status')
        .eq('application_id', participant.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })

      if (perfError) throw perfError

      const totalPoints = performances?.reduce((sum, p) => sum + (p.points || 0), 0) || 0
      const challengesCompleted = performances?.length || 0
      const challengesWon = performances?.filter(p => p.position === 1).length || 0

      const validTimes = performances?.filter(p => p.time_seconds).map(p => p.time_seconds) || []
      const bestTime = validTimes.length > 0 ? Math.min(...validTimes) : null

      const averagePoints = challengesCompleted > 0 ? Math.round(totalPoints / challengesCompleted) : 0

      const { data: allPerformances } = await supabase
        .from('stage_performances')
        .select('application_id, points')
        .eq('status', 'completed')
        .in('application_id', participants.map(p => p.id))

      const scoreMap = new Map<string, number>()
      allPerformances?.forEach((perf: any) => {
        const current = scoreMap.get(perf.application_id) || 0
        scoreMap.set(perf.application_id, current + (perf.points || 0))
      })

      const sortedScores = Array.from(scoreMap.entries())
        .sort((a, b) => b[1] - a[1])

      const ranking = sortedScores.findIndex(([id]) => id === participant.id) + 1

      let eliminationDate = null
      if (participant.is_eliminated) {
        const { data: appData } = await supabase
          .from('applications')
          .select('eliminated_at')
          .eq('id', participant.id)
          .single()

        eliminationDate = appData?.eliminated_at || null
      }

      setParticipantStats({
        ranking: ranking > 0 ? ranking : null,
        total_points: totalPoints,
        challenges_completed: challengesCompleted,
        challenges_won: challengesWon,
        best_time: bestTime,
        average_points: averagePoints,
        elimination_date: eliminationDate,
      })
    } catch (err) {
      console.error('Failed to load participant stats:', err)
      setParticipantStats({
        ranking: null,
        total_points: 0,
        challenges_completed: 0,
        challenges_won: 0,
        best_time: null,
        average_points: 0,
      })
    } finally {
      setModalLoading(false)
    }
  }

  const closeModal = () => {
    setSelectedParticipant(null)
    setParticipantStats(null)
  }

  const getDisplayName = (participant: Participant) => {
    return participant.preferred_name || participant.full_name
  }

  const activeCount = participants.filter(p => !p.is_eliminated).length
  const eliminatedCount = participants.filter(p => p.is_eliminated).length

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {loading ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="animate-spin w-8 h-8 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-naija-green-600 hover:text-naija-green-700 mb-6 font-medium transition group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Back to Home</span>
            </Link>
            <div className="flex items-center gap-4 mb-3">
              <UsersIcon size={40} className="text-naija-green-600" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Participants</h1>
            </div>
            <p className="text-gray-600">Browse all competitors</p>
          </div>

          {seasons.length > 1 && (
            <div className="mb-8 max-w-xs mx-auto">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Season</label>
              <select
                value={selectedSeasonId}
                onChange={(e) => setSelectedSeasonId(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-naija-green-600 font-medium"
              >
                {seasons.map((season) => (
                  <option key={season.id} value={season.id}>
                    {season.name} ({season.year})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{participants.length}</div>
              <p className="text-xs text-gray-600 mt-1">Total</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-700">{activeCount}</div>
              <p className="text-xs text-green-600 mt-1">Active</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center">
              <div className="text-2xl md:text-3xl font-bold text-red-700">{eliminatedCount}</div>
              <p className="text-xs text-red-600 mt-1">Eliminated</p>
            </div>
          </div>

          {/* Search and Filters on Same Row */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-naija-green-600"
              />
            </div>

            <div className="flex gap-2 flex-wrap justify-center md:justify-end">
              {(['all', 'active', 'eliminated'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${statusFilter === status
                    ? status === 'active' ? 'bg-green-600 text-white' : status === 'eliminated' ? 'bg-red-600 text-white' : 'bg-naija-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {filteredParticipants.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-600 font-medium">No participants found</p>
              {participants.length === 0 && (
                <p className="text-gray-500 text-sm mt-2">No approved participants for this season yet</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredParticipants.map((participant) => (
                <div
                  key={participant.id}
                  onClick={() => loadParticipantStats(participant)}
                  className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
                    {participant.photo_url ? (
                      <Image
                        src={participant.photo_url}
                        alt={getDisplayName(participant)}
                        fill
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <User size={64} className="text-gray-500" />
                      </div>
                    )}

                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-white ${participant.status === 'active'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                        }`}>
                        {participant.status === 'active' ? 'Active' : 'Eliminated'}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-bold text-base leading-tight line-clamp-2 mb-1">
                        {getDisplayName(participant)}, {participant.age}
                      </p>
                      <p className="text-white/90 text-xs leading-tight">
                        {participant.state}
                        {participant.geo_zone && ` • ${participant.geo_zone}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedParticipant && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {modalLoading ? (
              <div className="p-12 flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full"></div>
              </div>
            ) : (
              <>
                <div className="relative h-80 bg-gradient-to-br from-naija-green-500 to-naija-green-700">
                  {selectedParticipant.photo_url ? (
                    <Image
                      src={selectedParticipant.photo_url}
                      alt={getDisplayName(selectedParticipant)}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={96} className="text-white/50" />
                    </div>
                  )}

                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition"
                  >
                    <X size={24} />
                  </button>

                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg ${selectedParticipant.status === 'active'
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                      }`}>
                      {selectedParticipant.status === 'active' ? 'Active' : 'Eliminated'}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-3xl font-bold text-white mb-1">
                      {getDisplayName(selectedParticipant)}
                    </h2>
                    <p className="text-white/90 text-lg">
                      Age {selectedParticipant.age} • {selectedParticipant.state}
                      {selectedParticipant.geo_zone && ` • ${selectedParticipant.geo_zone}`}
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Competition Statistics</h3>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200 text-center">
                      <div className="text-2xl font-bold text-blue-700">
                        {participantStats?.ranking || 'N/A'}
                      </div>
                      <p className="text-xs text-blue-600 font-medium mt-1">Ranking</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200 text-center">
                      <div className="text-2xl font-bold text-green-700">
                        {participantStats?.total_points || 0}
                      </div>
                      <p className="text-xs text-green-600 font-medium mt-1">Total Points</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200 text-center">
                      <div className="text-2xl font-bold text-purple-700">
                        {participantStats?.average_points || 0}
                      </div>
                      <p className="text-xs text-purple-600 font-medium mt-1">Avg Points</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-3 border border-indigo-200 text-center">
                      <div className="text-2xl font-bold text-indigo-700">
                        {participantStats?.challenges_completed || 0}
                      </div>
                      <p className="text-xs text-indigo-600 font-medium mt-1">Completed</p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3 border border-amber-200 text-center">
                      <div className="text-2xl font-bold text-amber-700">
                        {participantStats?.challenges_won || 0}
                      </div>
                      <p className="text-xs text-amber-600 font-medium mt-1">Won</p>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-3 border border-cyan-200 text-center">
                      <div className="text-xl font-bold text-cyan-700">
                        {participantStats?.best_time
                          ? `${Math.floor(participantStats.best_time / 60)}:${(participantStats.best_time % 60).toString().padStart(2, '0')}`
                          : 'N/A'}
                      </div>
                      <p className="text-xs text-cyan-600 font-medium mt-1">Best Time</p>
                    </div>
                  </div>

                  {selectedParticipant.is_eliminated && participantStats?.elimination_date && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <h4 className="font-semibold text-red-900 text-sm mb-1">Elimination</h4>
                      <p className="text-xs text-red-700">
                        Eliminated on {new Date(participantStats.elimination_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Participant Details</h4>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium text-gray-900">{getDisplayName(selectedParticipant)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium text-gray-900">{selectedParticipant.age}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">State:</span>
                        <span className="font-medium text-gray-900">{selectedParticipant.state}</span>
                      </div>
                      {selectedParticipant.geo_zone && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Region:</span>
                          <span className="font-medium text-gray-900">{selectedParticipant.geo_zone}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${selectedParticipant.status === 'active' ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {selectedParticipant.status === 'active' ? 'Active Competitor' : 'Eliminated'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={closeModal}
                    className="w-full mt-4 px-6 py-2.5 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}