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
import SocialMediaSection from '../components/sections/SocialMediaSection'
import CTASection from '../components/sections/CTASection'

interface Champion {
  id: string
  user_id: string
  season_id: string
  full_name: string
  position: number
  photo_url: string | null
  final_points?: number
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
      // Get the most recent season
      const { data: seasonData } = await supabase
        .from('seasons')
        .select('id, name, year, status, application_start_date, application_end_date')
        .order('year', { ascending: false })
        .limit(1)
        .single()

      if (seasonData) {
        setSeason(seasonData)
      }

      // Load sponsors
      const { data: sponsorData } = await supabase
        .from('sponsors')
        .select('*')
        .order('created_at', { ascending: false })

      setSponsors(sponsorData || [])

      // Load videos
      const { data: videoData } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('order_position', { ascending: true })

      setVideos(videoData || [])

      if (!seasonData) {
        setLoading(false)
        return
      }

      // Load champion from champions table (position 1)
      const { data: championData } = await supabase
        .from('champions')
        .select('*')
        .eq('season_id', seasonData.id)
        .eq('position', 1)
        .single()

      if (championData) {
        setChampion({
          id: championData.id,
          user_id: championData.user_id,
          season_id: championData.season_id,
          full_name: championData.full_name,
          position: championData.position,
          photo_url: championData.photo_url,
          final_points: championData.final_points,
        })
      }

      // Load runners-up from champions table (positions 2 and 3)
      const { data: runnersData } = await supabase
        .from('champions')
        .select('*')
        .eq('season_id', seasonData.id)
        .in('position', [2, 3])
        .order('position', { ascending: true })

      if (runnersData) {
        setRunners(runnersData.map(runner => ({
          id: runner.id,
          user_id: runner.user_id,
          full_name: runner.full_name,
          position: runner.position,
          photo_url: runner.photo_url,
        })))
      }

      // Load stats - count approved applications
      const { count: totalCount } = await supabase
        .from('applications')
        .select('id', { count: 'exact' })
        .eq('season_id', seasonData.id)
        .eq('status', 'approved')

      const { count: eliminatedCount } = await supabase
        .from('applications')
        .select('id', { count: 'exact' })
        .eq('season_id', seasonData.id)
        .eq('status', 'approved')
        .eq('is_eliminated', true)

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
          
          <SocialMediaSection />
          
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