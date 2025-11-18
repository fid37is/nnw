'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { ArrowRight, Trophy, Users, Menu, X, User } from 'lucide-react'
import { toast } from 'sonner'
import Navbar from './navbar'

interface Champion {
  id: string
  user_id: string
  season_id: string
  full_name: string
  position: number
  photo_url: string | null
}

interface Runner {
  id: string
  user_id: string
  full_name: string
  position: number
  photo_url: string | null
}

interface Season {
  id: string
  name: string
  year: number
  application_start_date: string
  application_end_date: string
  status: string
}

interface YouTubeVideo {
  id: string
  title: string
  youtube_url: string
  description: string
  category: string
  order_position: number
}

interface Sponsor {
  id: string
  name: string
  logo_url: string
  website_url: string
}

export default function Home() {
  const [champion, setChampion] = useState<Champion | null>(null)
  const [runners, setRunners] = useState<Runner[]>([])
  const [season, setSeason] = useState<Season | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, active: 0, eliminated: 0 })
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const extractYouTubeId = (url: string): string => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }

    return ''
  }

  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submittingInquiry, setSubmittingInquiry] = useState(false)

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.subject || !inquiryForm.message) {
      toast.error('Please fill in all fields')
      return
    }

    setSubmittingInquiry(true)
    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([
          {
            name: inquiryForm.name,
            email: inquiryForm.email,
            subject: inquiryForm.subject,
            message: inquiryForm.message,
            status: 'new',
          },
        ])

      if (error) throw error

      toast.success('Thank you! Your inquiry has been sent. We will respond to your email shortly.')
      setInquiryForm({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch (err) {
      console.error('Error submitting inquiry:', err)
      toast.error('Failed to send inquiry. Please try again.')
    } finally {
      setSubmittingInquiry(false)
    }
  }

  const loadData = async () => {
    try {
      const { data: seasonData } = await supabase
        .from('seasons')
        .select('id, name, year, status, application_start_date, application_end_date')
        .order('year', { ascending: false })
        .limit(1)
        .single()

      if (seasonData) {
        setSeason(seasonData)
      }

      const { data: sponsorData } = await supabase
        .from('sponsors')
        .select('*')
        .order('created_at', { ascending: false })

      setSponsors(sponsorData || [])

      const { data: videoData } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('order_position', { ascending: true })

      setVideos(videoData || [])

      if (!seasonData) {
        setLoading(false)
        return
      }

      const { data: stagesData } = await supabase
        .from('competition_stages')
        .select('id')
        .eq('season_id', seasonData.id)

      if (!stagesData || stagesData.length === 0) {
        setLoading(false)
        return
      }

      const stageIds = stagesData.map(s => s.id)

      const { data: perfData } = await supabase
        .from('stage_performances')
        .select('user_id, position, time_seconds, status')
        .in('competition_stage_id', stageIds)
        .eq('status', 'completed')

      const userIds = [...new Set(perfData?.map(p => p.user_id) || [])]

      if (userIds.length === 0) {
        setLoading(false)
        return
      }

      const { data: usersData } = await supabase
        .from('users')
        .select('id, full_name')
        .in('id', userIds)

      let usersMap = new Map()
      usersData?.forEach((user: any) => {
        usersMap.set(user.id, user)
      })

      const { data: appData } = await supabase
        .from('applications')
        .select('user_id, photo_url')
        .eq('season_id', seasonData.id)
        .in('user_id', userIds)

      let appMap = new Map()
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
            photo_url: app?.photo_url || null,
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

      if (entries.length > 0) {
        setChampion({
          id: entries[0].user_id,
          user_id: entries[0].user_id,
          season_id: seasonData.id,
          full_name: entries[0].full_name,
          photo_url: entries[0].photo_url,
          position: 1,
        })
      }

      if (entries.length > 1) {
        const runnersArray = entries.slice(1, 3).map((entry, idx) => ({
          id: entry.user_id,
          user_id: entry.user_id,
          full_name: entry.full_name,
          photo_url: entry.photo_url,
          position: idx + 2,
        }))
        setRunners(runnersArray)
      }

      // Calculate stats from applications table matching participants page logic
      const { count: totalCount } = await supabase
        .from('applications')
        .select('id', { count: 'exact' })
        .eq('season_id', seasonData.id)
        .in('user_id', userIds)

      const { count: eliminatedCount } = await supabase
        .from('applications')
        .select('id', { count: 'exact' })
        .eq('season_id', seasonData.id)
        .in('user_id', userIds)
        .eq('status', 'eliminated')

      setStats({
        total: totalCount || 0,
        active: (totalCount || 0) - (eliminatedCount || 0),
        eliminated: eliminatedCount || 0,
      })
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  const isApplicationOpen = () => {
    if (!season) return false
    const today = new Date().toISOString().split('T')[0]
    return today >= season.application_start_date && today <= season.application_end_date
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar - Always visible */}
      <Navbar isApplicationOpen={isApplicationOpen()} />

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="animate-spin w-12 h-12 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full"></div>
        </div>
      ) : (
        <>
          {/* Application Status */}
          {season && (
            <div className={`${isApplicationOpen() ? 'bg-green-50 border-b border-green-200' : 'bg-amber-50 border-b border-amber-200'}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center text-sm font-medium">
                {isApplicationOpen() ? (
                  <span className="text-green-700">Applications Open • Deadline: {new Date(season.application_end_date).toLocaleDateString()}</span>
                ) : (
                  <span className="text-amber-700">Applications Closed • Next season opening soon</span>
                )}
              </div>
            </div>
          )}

          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-32 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
              <div className="text-[300px] md:text-[400px] font-black text-naija-green-100 opacity-20">
                NNW
              </div>
            </div>

            <div className="flex flex-col items-center text-center md:grid md:grid-cols-2 md:text-left md:items-center gap-12 md:gap-16 relative z-10">
              <div>
                <div className="inline-block px-3 py-1 bg-naija-green-100 text-naija-green-700 text-xs font-bold rounded-full mb-6">
                  SEASON {season?.year}
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Test Your Limits
                </h1>
                <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
                  Nigeria's premier physical competition. Compete against the best, push your boundaries, and claim your place in history.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  {isApplicationOpen() && (
                    <Link
                      href="/register"
                      className="px-8 py-3 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      Apply Now
                      <ArrowRight size={18} />
                    </Link>
                  )}
                  <Link
                    href="/leaderboard"
                    className="px-8 py-3 border-2 border-gray-200 text-gray-900 font-semibold rounded-lg hover:border-gray-300 transition text-center whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">View </span>Leaderboard
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-center w-full">
                {champion && season?.status === 'completed' ? (
                  <div className="w-full max-w-sm md:max-w-full">
                    <div className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
                        {champion.photo_url ? (
                          <Image
                            src={champion.photo_url}
                            alt={champion.full_name}
                            fill
                            loading="eager"
                            priority
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                              <div className="text-[200px]">👤</div>
                            </div>
                            <div className="relative z-10 text-[120px] text-gray-700 flex items-center justify-center h-full">?</div>
                          </>
                        )}
                        <div className="absolute top-3 left-3 w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-3xl font-bold shadow-lg border-2 border-white">
                          🥇
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <p className="text-xs font-semibold text-gray-200 mb-2">REIGNING CHAMPION</p>
                          <p className="text-white font-black text-2xl leading-tight line-clamp-3">
                            {champion.full_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-sm md:max-w-full">
                    <div className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300">
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                          <div className="text-[200px]">👤</div>
                        </div>
                        <div className="relative z-10 text-[120px] text-gray-600 flex items-center justify-center h-full">?</div>
                        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <p className="text-xs font-semibold text-gray-200 mb-2">NEXT CHAMPION</p>
                          <p className="text-white font-black text-2xl leading-tight">
                            Could Be You
                          </p>
                          {isApplicationOpen() && (
                            <p className="text-xs font-semibold text-gray-200 mt-2">Apply now and make history</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-naija-green-600 mb-2">{stats.total}</div>
                <p className="text-gray-600 font-medium">Total Warriors</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">{stats.active}</div>
                <p className="text-gray-600 font-medium">Competing</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-400 mb-2">{stats.eliminated}</div>
                <p className="text-gray-600 font-medium">Eliminated</p>
              </div>
            </div>
          </section>

          {/* Top Competitors */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Top Competitors</h2>
              <p className="text-gray-600">The leaders in this season's competition</p>
            </div>

            {champion || runners.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {champion && (
                    <div className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
                        {champion.photo_url ? (
                          <Image
                            src={champion.photo_url}
                            alt={champion.full_name}
                            fill
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300">
                            <User size={64} className="text-gray-500" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-3xl font-bold shadow-lg border-2 border-white">
                          🥇
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <p className="text-white font-black text-2xl leading-tight line-clamp-3">
                            {champion.full_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {runners.length > 0 && runners[0] && (
                    <div className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
                        {runners[0].photo_url ? (
                          <Image
                            src={runners[0].photo_url}
                            alt={runners[0].full_name}
                            fill
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300">
                            <User size={64} className="text-gray-500" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 w-14 h-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-3xl font-bold shadow-lg border-2 border-white">
                          🥈
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <p className="text-white font-black text-2xl leading-tight line-clamp-3">
                            {runners[0].full_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {runners.length > 1 && runners[1] && (
                    <div className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
                        {runners[1].photo_url ? (
                          <Image
                            src={runners[1].photo_url}
                            alt={runners[1].full_name}
                            fill
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300">
                            <User size={64} className="text-gray-500" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-3xl font-bold shadow-lg border-2 border-white">
                          🥉
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <p className="text-white font-black text-2xl leading-tight line-clamp-3">
                            {runners[1].full_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <Link
                    href="/leaderboard"
                    className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-200 text-gray-900 font-semibold rounded-lg hover:border-gray-300 transition"
                  >
                    <Users size={20} />
                    View Full Leaderboard
                  </Link>
                </div>
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
                <Trophy size={64} className="mx-auto mb-4 text-gray-300" />
                <p className="text-xl text-gray-600 font-semibold">Competition in progress</p>
                <p className="text-gray-500 mt-2">Top competitors will appear here as the season progresses</p>
              </div>
            )}
          </section>

          {/* Sponsors */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Supported By</h2>
            {sponsors.length > 0 ? (
              <div className={`grid ${sponsors.length === 1 ? 'justify-center' : 'grid-cols-2 md:grid-cols-4'} gap-4 md:gap-6`}>
                {sponsors.map((sponsor) => (
                  <a
                    key={sponsor.id}
                    href={sponsor.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`py-2 px-6 bg-gray-50 rounded-lg border border-gray-100 hover:border-naija-green-600 transition flex items-center justify-center gap-2 ${sponsors.length === 1 ? 'max-w-sm' : ''}`}
                  >
                    {sponsor.logo_url && (
                      <img
                        src={sponsor.logo_url}
                        alt={sponsor.name}
                        className="max-w-full max-h-16 object-contain flex-shrink-0"
                      />
                    )}
                    <p className="font-semibold text-gray-900 text-center text-sm">{sponsor.name}</p>
                  </a>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Be Our Sponsor</h3>
                <p className="text-gray-600 mb-6">Partner with Naija Ninja Warrior and reach thousands of passionate competitors</p>
                <Link
                  href="/contact"
                  className="inline-block px-6 py-3 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition"
                >
                  Contact Us
                </Link>
              </div>
            )}
          </section>

          {/* Video Highlights */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Event Highlights</h2>
              <p className="text-gray-600">Watch epic moments from past competitions</p>
            </div>
            {videos.length > 0 ? (
              <div className={`grid ${videos.length === 1 ? 'justify-center' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                {videos.map((video) => {
                  const videoId = extractYouTubeId(video.youtube_url)
                  return (
                    <div key={video.id} className={`rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 transition ${videos.length === 1 ? 'max-w-2xl' : ''}`}>
                      <div className="aspect-video bg-gray-200">
                        {videoId ? (
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg"
                          ></iframe>
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
                            Invalid video URL
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base">{video.title}</h3>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-600 text-lg">Stay tuned to watch our season highlights</p>
              </div>
            )}
          </section>

          {/* FAQ Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
              <p className="text-gray-600">Find answers to common questions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
              {[
                {
                  question: 'How do I apply?',
                  answer: 'Click the Apply button, fill out your information, and submit a short video and photos. Our team reviews and approves within 48 hours.'
                },
                {
                  question: 'What are the age requirements?',
                  answer: 'You must be 18 years or older to compete. Nigerian citizenship or residency is required.'
                },
                {
                  question: 'How many stages are there?',
                  answer: 'There are 3 competition stages: Elimination Round, Semi-Finals, and Finals. Only top performers advance.'
                },
                {
                  question: 'Where can I train?',
                  answer: 'Visit our Training Gyms section on the About page to find certified Ninja training locations near you.'
                },
                {
                  question: 'What happens if I get eliminated?',
                  answer: 'Eliminated participants are recognized on the leaderboard and can apply for the next season.'
                },
                {
                  question: 'Are there prizes?',
                  answer: 'Yes! Winners receive cash prizes, sponsorship deals, and the prestigious title of Naija Ninja Warrior Champion.'
                },
              ].map((faq, idx) => (
                <div key={idx} className="p-6 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Enquiry Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Got Questions?</h2>
                <p className="text-gray-600">Send us your inquiry and we'll get back to you shortly</p>
              </div>

              <form onSubmit={handleInquirySubmit} className="space-y-6 bg-gray-50 p-6 md:p-8 rounded-lg border border-gray-100">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                  <input
                    type="text"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-naija-green-600 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-naija-green-600 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
                  <input
                    type="text"
                    value={inquiryForm.subject}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, subject: e.target.value })}
                    placeholder="What is this about?"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-naija-green-600 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
                  <textarea
                    rows={4}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    placeholder="Your message..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-naija-green-600 transition resize-none"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={submittingInquiry}
                  className="w-full px-8 py-3 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submittingInquiry ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Sending...
                    </>
                  ) : (
                    'Send Inquiry'
                  )}
                </button>
              </form>
            </div>
          </section>

          {/* CTA Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
            <div className="bg-naija-green-600 rounded-2xl p-8 md:p-16 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Compete?</h2>
              {isApplicationOpen() ? (
                <>
                  <p className="text-base md:text-lg text-green-100 mb-8 max-w-2xl mx-auto">
                    {champion
                      ? `Can you dethrone ${champion.full_name}? Join hundreds of warriors and prove yourself.`
                      : 'Be the first to claim the champion title. Apply now and make history.'}
                  </p>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-naija-green-600 font-bold rounded-lg hover:bg-green-50 transition"
                  >
                    Apply Now
                    <ArrowRight size={20} />
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-base md:text-lg text-green-100 mb-8 max-w-2xl mx-auto">
                    Applications are currently closed. Stay tuned for the next season or register to get updates about future competitions.
                  </p>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-naija-green-600 font-bold rounded-lg hover:bg-green-50 transition"
                  >
                    Register for Updates
                    <ArrowRight size={20} />
                  </Link>
                </>
              )}
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-gray-100 py-12 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
              <p>© 2025 Naija Ninja Warrior. Challenge yourself. Become a legend.</p>
            </div>
          </footer>
        </>
      )}
    </main>
  )
}