'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Navbar from './navbar'
import HeroSection from '../components/sections/HeroSection'
import StatsSection from '../components/sections/StatsSection'
import TopCompetitors from '../components/sections/TopCompetitors'
import SponsorsSection from '../components/sections/SponsorsSection'
import VideoHighlights from '../components/sections/VideoHighlights'
import FAQSection from '../components/sections/FAQSection'
import InquirySection from '../components/sections/InquirySection'
import CTASection from '../components/sections/CTASection'

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
    <main className="min-h-screen bg-white pt-20">
      <Navbar isApplicationOpen={isApplicationOpen()} />

      {loading ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="animate-spin w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full"></div>
        </div>
      ) : (
        <>
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

          <HeroSection 
            champion={champion} 
            season={season} 
            isApplicationOpen={isApplicationOpen()} 
          />
          
          <StatsSection stats={stats} />
          
          <TopCompetitors champion={champion} runners={runners} />
          
          <SponsorsSection sponsors={sponsors} />
          
          <VideoHighlights videos={videos} extractYouTubeId={extractYouTubeId} />
          
          <FAQSection />
          
          <InquirySection />
          
          <CTASection 
            champion={champion} 
            isApplicationOpen={isApplicationOpen()} 
          />

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