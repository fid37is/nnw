'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { Search, ArrowLeft, User, Menu, X } from 'lucide-react'

interface Participant {
  id: string
  user_id: string
  full_name: string
  status: string
  photo_url?: string | null
  age: number
  state: string
  geo_zone: string | null
}

interface ParticipantStats {
  ranking: number | null
  total_points: number
  challenges_completed: number
  challenges_won: number
  elimination_date?: string | null
}

interface Season {
  id: string
  name: string
  year: number
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'eliminated'>('all')
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
        .select('id, user_id, status, photo_url, age, state, geo_zone')
        .eq('season_id', selectedSeasonId)
        .in('status', ['approved', 'eliminated'])

      if (appsError) throw appsError

      if (!appsData || appsData.length === 0) {
        setParticipants([])
        setLoading(false)
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

      const allParticipants = appsData.map((app: any) => {
        const user = usersMap.get(app.user_id)
        return {
          id: app.id,
          user_id: app.user_id,
          full_name: user?.full_name || 'Unknown',
          photo_url: app.photo_url || null,
          status: app.status === 'eliminated' ? 'eliminated' : 'active',
          age: app.age,
          state: app.state,
          geo_zone: app.geo_zone || null,
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
      filtered = filtered.filter(p =>
        p.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredParticipants(filtered)
  }

  const loadParticipantStats = async (participant: Participant) => {
    setModalLoading(true)
    setSelectedParticipant(participant)
    
    try {
      // Fetch performance records for this participant
      const { data: performances, error: perfError } = await supabase
        .from('performance')
        .select('points, challenge_id, rank, completed_at')
        .eq('application_id', participant.id)
        .order('completed_at', { ascending: false })

      if (perfError) throw perfError

      // Calculate stats
      const totalPoints = performances?.reduce((sum, p) => sum + (p.points || 0), 0) || 0
      const challengesCompleted = performances?.length || 0
      const challengesWon = performances?.filter(p => p.rank === 1).length || 0

      // Get current ranking from leaderboard
      const { data: leaderboard, error: leaderboardError } = await supabase
        .from('performance')
        .select('application_id, points')
        .eq('challenge_id', performances?.[0]?.challenge_id || '')
        
      if (leaderboardError) throw leaderboardError

      // Calculate ranking based on total points
      const allScores = await supabase
        .from('performance')
        .select('application_id, points')
        .eq('application_id', participant.id)

      // For simplicity, get ranking by comparing total points
      const { data: allParticipantScores } = await supabase
        .from('performance')
        .select('application_id, points')
        .in('application_id', participants.map(p => p.id))

      const scoreMap = new Map<string, number>()
      allParticipantScores?.forEach((score: any) => {
        const current = scoreMap.get(score.application_id) || 0
        scoreMap.set(score.application_id, current + (score.points || 0))
      })

      const sortedScores = Array.from(scoreMap.entries())
        .sort((a, b) => b[1] - a[1])
      
      const ranking = sortedScores.findIndex(([id]) => id === participant.id) + 1

      // Get elimination date if eliminated
      let eliminationDate = null
      if (participant.status === 'eliminated') {
        const { data: appData } = await supabase
          .from('applications')
          .select('reviewed_at')
          .eq('id', participant.id)
          .single()
        
        eliminationDate = appData?.reviewed_at || null
      }

      setParticipantStats({
        ranking: ranking > 0 ? ranking : null,
        total_points: totalPoints,
        challenges_completed: challengesCompleted,
        challenges_won: challengesWon,
        elimination_date: eliminationDate,
      })
    } catch (err) {
      console.error('Failed to load participant stats:', err)
      setParticipantStats({
        ranking: null,
        total_points: 0,
        challenges_completed: 0,
        challenges_won: 0,
      })
    } finally {
      setModalLoading(false)
    }
  }

  const closeModal = () => {
    setSelectedParticipant(null)
    setParticipantStats(null)
  }

  const activeCount = participants.filter(p => p.status === 'active').length
  const eliminatedCount = participants.filter(p => p.status === 'eliminated').length

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
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center overflow-hidden">
              <Image
                src="/logo.png"
                alt="Naija Ninja Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="font-bold text-gray-900 hidden sm:inline text-sm md:text-base">Naija Ninja</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition">Home</Link>
            <Link href="/leaderboard" className="text-gray-600 hover:text-gray-900 transition">Leaderboard</Link>
            <Link href="/participants" className="text-naija-green-600 font-semibold">Participants</Link>
            <Link href="/merch" className="text-gray-600 hover:text-gray-900 transition">Shop</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition">About</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link href="/register" className="px-6 py-2 bg-naija-green-600 text-white text-sm font-semibold rounded-lg hover:bg-naija-green-700 transition">
              Register
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-4 space-y-3">
              <Link href="/" className="block py-2 text-gray-600 hover:text-gray-900 transition">
                Home
              </Link>
              <Link href="/leaderboard" className="block py-2 text-gray-600 hover:text-gray-900 transition">
                Leaderboard
              </Link>
              <Link href="/participants" className="block py-2 text-naija-green-600 font-semibold">
                Participants
              </Link>
              <Link href="/merch" className="block py-2 text-gray-600 hover:text-gray-900 transition">
                Shop
              </Link>
              <Link href="/about" className="block py-2 text-gray-600 hover:text-gray-900 transition">
                About
              </Link>
              <hr className="my-2" />
              <Link href="/login" className="block py-2 text-gray-600 hover:text-gray-900 transition">
                Login
              </Link>
              <Link href="/register" className="block w-full px-6 py-2 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition text-center">
                Register
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-naija-green-600 hover:text-naija-green-700 mb-6 font-medium transition group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Participants</h1>
            <p className="text-gray-600">Browse all competitors</p>
          </div>
        </div>

        {/* Season Selector */}
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

        {/* Stats */}
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

        {/* Search */}
        <div className="relative mb-8 max-w-md mx-auto">
          <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-naija-green-600"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
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

        {/* Participants Grid */}
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
                {/* Card Image Container - 3:4 Aspect Ratio */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
                  {participant.photo_url ? (
                    <Image
                      src={participant.photo_url}
                      alt={participant.full_name}
                      fill
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <User size={64} className="text-gray-500" />
                    </div>
                  )}

                  {/* Status Badge - Top Right */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-white ${
                      participant.status === 'active' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {participant.status === 'active' ? 'Active' : 'Eliminated'}
                    </span>
                  </div>

                  {/* Gradient Overlay at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

                  {/* Info at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-bold text-base leading-tight line-clamp-2 mb-1">
                      {participant.full_name}, {participant.age}
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

      {/* Modal */}
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
                {/* Header with Photo */}
                <div className="relative h-80 bg-gradient-to-br from-naija-green-500 to-naija-green-700">
                  {selectedParticipant.photo_url ? (
                    <Image
                      src={selectedParticipant.photo_url}
                      alt={selectedParticipant.full_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={96} className="text-white/50" />
                    </div>
                  )}
                  
                  {/* Close Button */}
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition"
                  >
                    <X size={24} />
                  </button>

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                      selectedParticipant.status === 'active' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {selectedParticipant.status === 'active' ? 'Active' : 'Eliminated'}
                    </span>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent"></div>
                  
                  {/* Name and Location */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-3xl font-bold text-white mb-1">
                      {selectedParticipant.full_name}
                    </h2>
                    <p className="text-white/90 text-lg">
                      Age {selectedParticipant.age} • {selectedParticipant.state}
                      {selectedParticipant.geo_zone && ` • ${selectedParticipant.geo_zone}`}
                    </p>
                  </div>
                </div>

                {/* Stats Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Competition Statistics</h3>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
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
                      <p className="text-xs text-green-600 font-medium mt-1">Points</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200 text-center">
                      <div className="text-2xl font-bold text-purple-700">
                        {participantStats?.challenges_completed || 0}
                      </div>
                      <p className="text-xs text-purple-600 font-medium mt-1">Completed</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3 border border-amber-200 text-center">
                      <div className="text-2xl font-bold text-amber-700">
                        {participantStats?.challenges_won || 0}
                      </div>
                      <p className="text-xs text-amber-600 font-medium mt-1">Won</p>
                    </div>
                  </div>

                  {/* Elimination Info */}
                  {selectedParticipant.status === 'eliminated' && participantStats?.elimination_date && (
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

                  {/* Additional Info */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Participant Details</h4>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Name:</span>
                        <span className="font-medium text-gray-900">{selectedParticipant.full_name}</span>
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
                        <span className={`font-medium ${
                          selectedParticipant.status === 'active' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {selectedParticipant.status === 'active' ? 'Active Competitor' : 'Eliminated'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Close Button */}
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