'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import Navbar from './navbar'
import Footer from './footer'
import HeroSection from '../components/sections/HeroSection'
import StatsSection from '../components/sections/StatsSection'
import ZoneMapSection from '../components/sections/ZoneMapSection'
import CompetitionProcessSection from '../components/sections/CompetionProcessSection'
import VideoHighlights from '../components/sections/VideoHighlights'
import TopCompetitors from '../components/sections/TopCompetitors'
import SponsorsSection from '../components/sections/SponsorsSection'
import FAQSection from '../components/sections/FAQSection'
import InquirySection from '../components/sections/InquirySection'
import SocialMediaSection from '../components/sections/SocialMediaSection'
import CTASection from '../components/sections/CTASection'

interface Champion { id:string; user_id:string; season_id:string; full_name:string; position:number; photo_url:string|null; final_points?:number }
interface Runner    { id:string; user_id:string; full_name:string; position:number; photo_url:string|null }
interface Season    { id:string; name:string; year:number; application_start_date:string; application_end_date:string; status:string }
interface YouTubeVideo { id:string; title:string; youtube_url:string; description:string; category:string; order_position:number }
interface Sponsor   { id:string; name:string; logo_url:string; website_url:string }

const extractYouTubeId = (url: string): string => {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) { const m = url.match(p); if (m) return m[1] }
  return ''
}

const isOpen = (season: Season | null): boolean => {
  if (!season) return false
  const today = new Date().toISOString().split('T')[0]
  return today >= season.application_start_date && today <= season.application_end_date
}

export default function Home() {
  const [champion, setChampion] = useState<Champion | null>(null)
  const [runners,  setRunners]  = useState<Runner[]>([])
  const [season,   setSeason]   = useState<Season | null>(null)
  const [stats,    setStats]    = useState({ total: 0, active: 0, eliminated: 0 })
  const [videos,   setVideos]   = useState<YouTubeVideo[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])

  // ── Hero is visible immediately — no loading gate ─────────────────────────
  // Data loads in the background and sections update as it arrives.
  // This removes the full-screen spinner that was blocking first paint.

  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // ── Phase 1: Fetch season + sponsors + videos in TRUE parallel ──────────
      // Previously these ran one-after-another. Now all three fire simultaneously.
      const [seasonRes, sponsorRes, videoRes] = await Promise.all([
        supabase
          .from('seasons')
          .select('id,name,year,status,application_start_date,application_end_date')
          .order('year', { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from('sponsors')
          .select('id,name,logo_url,website_url')
          .order('created_at', { ascending: false }),
        supabase
          .from('youtube_videos')
          .select('id,title,youtube_url,description,category,order_position')
          .order('order_position', { ascending: true })
          .limit(6),
      ])

      const seasonData = seasonRes.data
      if (seasonData) setSeason(seasonData)
      setSponsors(sponsorRes.data || [])
      setVideos(videoRes.data || [])

      if (!seasonData) return

      // ── Phase 2: Season-dependent queries — also in parallel ───────────────
      const [championRes, runnersRes, totalRes, eliminatedRes] = await Promise.all([
        supabase
          .from('champions')
          .select('id,user_id,season_id,full_name,position,photo_url,final_points')
          .eq('season_id', seasonData.id)
          .eq('position', 1)
          .single(),
        supabase
          .from('champions')
          .select('id,user_id,full_name,position,photo_url')
          .eq('season_id', seasonData.id)
          .in('position', [2, 3])
          .order('position', { ascending: true }),
        supabase
          .from('applications')
          .select('id', { count: 'exact', head: true }) // head:true = count only, no rows returned
          .eq('season_id', seasonData.id)
          .eq('status', 'approved'),
        supabase
          .from('applications')
          .select('id', { count: 'exact', head: true })
          .eq('season_id', seasonData.id)
          .eq('status', 'approved')
          .eq('is_eliminated', true),
      ])

      if (championRes.data) {
        const c = championRes.data
        setChampion({ id:c.id, user_id:c.user_id, season_id:c.season_id,
          full_name:c.full_name, position:c.position, photo_url:c.photo_url,
          final_points:c.final_points })
      }
      if (runnersRes.data) {
        setRunners(runnersRes.data.map((r: any) => ({
          id:r.id, user_id:r.user_id, full_name:r.full_name,
          position:r.position, photo_url:r.photo_url,
        })))
      }

      const total     = totalRes.count     || 0
      const eliminated = eliminatedRes.count || 0
      setStats({ total, active: total - eliminated, eliminated })

    } catch (err) {
      console.error('Home page data load error:', err)
    }
  }

  const applicationOpen = isOpen(season)

  return (
    <main className="min-h-screen bg-white">
      <Navbar isApplicationOpen={applicationOpen} />

      {/* ── NO LOADING GATE ────────────────────────────────────────────────────
          The hero renders immediately. Sections that need data show skeleton
          states or empty states until data arrives — much faster perceived load.
      ─────────────────────────────────────────────────────────────────────── */}

      {/* Application status banner — only shown once season loads */}
      {season && (
        <div className={`${applicationOpen ? 'bg-naija-green-600' : 'bg-gray-800'} text-white text-center text-xs font-bold py-2.5 tracking-wide mt-20`}>
          {applicationOpen
            ? `Applications Open · Deadline: ${new Date(season.application_end_date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}`
            : 'Applications Closed · Next season opening soon — Register to be notified'}
        </div>
      )}

      <HeroSection
        champion={champion}
        season={season}
        isApplicationOpen={applicationOpen}
      />
      <StatsSection stats={stats} />
      <ZoneMapSection isApplicationOpen={applicationOpen} />
      <CompetitionProcessSection isApplicationOpen={applicationOpen} />
      <VideoHighlights videos={videos} extractYouTubeId={extractYouTubeId} />
      <TopCompetitors champion={champion} runners={runners} />
      <SponsorsSection sponsors={sponsors} />
      <FAQSection />
      <InquirySection />
      <SocialMediaSection />
      <CTASection champion={champion} isApplicationOpen={applicationOpen} />
      <Footer />
    </main>
  )
}