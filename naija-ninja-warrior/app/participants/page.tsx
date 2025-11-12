'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { Search, ArrowLeft } from 'lucide-react'

interface Participant {
  id: string
  full_name: string
  status: string
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
    try {
      const { data: activeData } = await supabase
        .from('applications')
        .select('id, user_id, users (full_name)')
        .eq('season_id', selectedSeasonId)
        .eq('status', 'approved')

      const { data: eliminatedData } = await supabase
        .from('applications')
        .select('id, user_id, users (full_name)')
        .eq('season_id', selectedSeasonId)
        .eq('status', 'eliminated')

      const allParticipants = [
        ...(activeData || []).map((p: any) => ({
          id: p.id,
          full_name: p.users?.[0]?.full_name || 'Unknown',
          status: 'active',
        })),
        ...(eliminatedData || []).map((p: any) => ({
          id: p.id,
          full_name: p.users?.[0]?.full_name || 'Unknown',
          status: 'eliminated',
        })),
      ]

      setParticipants(allParticipants)
    } catch (err) {
      console.error('Failed to load participants:', err)
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
            <Link href="/leaderboard" className="text-gray-600 hover:text-gray-900">Leaderboard</Link>
            <Link href="/participants" className="text-naija-green-600">Participants</Link>
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Participants</h1>
          <p className="text-gray-600">Browse all competitors</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-gray-900">{participants.length}</div>
            <p className="text-xs text-gray-600 mt-1">Total</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
            <div className="text-2xl font-bold text-green-700">{activeCount}</div>
            <p className="text-xs text-green-600 mt-1">Active</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center">
            <div className="text-2xl font-bold text-red-700">{eliminatedCount}</div>
            <p className="text-xs text-red-600 mt-1">Eliminated</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
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
        <div className="flex gap-2 mb-8">
          {(['all', 'active', 'eliminated'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                statusFilter === status
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
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredParticipants.map((participant, index) => (
              <div
                key={participant.id}
                className={`p-4 rounded-lg border ${
                  participant.status === 'active'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-200">
                  <span className="font-bold text-naija-green-600">{index + 1}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm text-center mb-2 line-clamp-2">{participant.full_name}</h3>
                <div className={`inline-block w-full px-2 py-1 rounded text-xs font-bold text-center ${
                  participant.status === 'active'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-red-200 text-red-800'
                }`}>
                  {participant.status === 'active' ? 'Active' : 'Eliminated'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}