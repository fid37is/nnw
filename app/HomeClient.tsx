// File: app/HomeClient.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase/client'
import styles from '@/components/sections/nnw/nnw.module.css'
import { Champion, Runner, Season, YouTubeVideo, Sponsor } from '@/components/sections/nnw/types'
import { isApplicationOpen } from '@/components/sections/nnw/data'

import Ticker from '@/components/sections/nnw/Ticker'
import Nav from '@/components/sections/nnw/Nav'
import Hero from '@/components/sections/nnw/Hero'
import FormatSection from '@/components/sections/nnw/FormatSection'

// Below-the-fold sections load on demand, same pattern the rest of the app uses.
const ScheduleSection  = dynamic(() => import('@/components/sections/nnw/ScheduleSection'))
const GallerySection   = dynamic(() => import('@/components/sections/nnw/GallerySection'))
const GauntletSection  = dynamic(() => import('@/components/sections/nnw/GauntletSection'))
const StreamSection    = dynamic(() => import('@/components/sections/nnw/StreamSection'))
const RosterSection    = dynamic(() => import('@/components/sections/nnw/RosterSection'))
const StandingsSection = dynamic(() => import('@/components/sections/nnw/StandingsSection'))
const RewardsSection   = dynamic(() => import('@/components/sections/nnw/RewardsSection'))
const WaitlistSection    = dynamic(() => import('@/components/sections/nnw/WaitlistSection'))
const SponsorsSection    = dynamic(() => import('@/components/sections/SponsorsSection'))
const InquirySection     = dynamic(() => import('@/components/sections/nnw/InquirySection'))
const SocialMediaSection = dynamic(() => import('@/components/sections/nnw/SocialMediaSection'))
const CTASection        = dynamic(() => import('@/components/sections/nnw/CTASection'))
const Footer             = dynamic(() => import('@/components/sections/nnw/Footer'))

function HomeClientContent() {
  const [champion, setChampion]         = useState<Champion | null>(null)
  const [runners, setRunners]           = useState<Runner[]>([])
  const [season, setSeason]             = useState<Season | null>(null)
  const [stats, setStats]               = useState({ total: 0, active: 0, eliminated: 0 })
  const [videos, setVideos]             = useState<YouTubeVideo[]>([])
  const [sponsors, setSponsors]         = useState<Sponsor[]>([])
  const [waitingCount, setWaitingCount] = useState(0)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [seasonRes, sponsorRes, videoRes, waitingRes] = await Promise.all([
        supabase.from('seasons').select('id,name,year,status,application_start_date,application_end_date')
          .order('year', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('sponsors').select('id,name,logo_url,website_url').order('created_at', { ascending: false }),
        supabase.from('youtube_videos').select('id,title,youtube_url,description,category,order_position')
          .order('order_position', { ascending: true }).limit(6),
        supabase.from('waiting_list').select('*', { count: 'exact', head: true }),
      ])

      const seasonData = seasonRes.data
      if (seasonRes.error) console.error('seasons query failed:', seasonRes.error)
      if (seasonData) setSeason(seasonData)
      if (sponsorRes.error) console.error('sponsors query failed:', sponsorRes.error)
      setSponsors(sponsorRes.data || [])
      if (videoRes.error) console.error('youtube_videos query failed:', videoRes.error)
      setVideos(videoRes.data || [])
      if (waitingRes.error) console.error('waiting_list count failed:', waitingRes.error)
      else setWaitingCount(waitingRes.count ?? 0)

      if (!seasonData) return

      const [championRes, runnersRes, totalRes, eliminatedRes] = await Promise.all([
        supabase.from('champions').select('id,user_id,season_id,full_name,position,photo_url,final_points')
          .eq('season_id', seasonData.id).eq('position', 1).maybeSingle(),
        supabase.from('champions').select('id,user_id,full_name,position,photo_url')
          .eq('season_id', seasonData.id).in('position', [2, 3]).order('position', { ascending: true }),
        supabase.from('applications').select('id', { count: 'exact', head: true })
          .eq('season_id', seasonData.id).eq('status', 'approved'),
        supabase.from('applications').select('id', { count: 'exact', head: true })
          .eq('season_id', seasonData.id).eq('status', 'approved').eq('is_eliminated', true),
      ])

      if (championRes.data) {
        const c = championRes.data
        setChampion({ id: c.id, user_id: c.user_id, season_id: c.season_id, full_name: c.full_name, position: c.position, photo_url: c.photo_url, final_points: c.final_points })
      }
      if (runnersRes.data) {
        setRunners(runnersRes.data.map((r: any) => ({ id: r.id, user_id: r.user_id, full_name: r.full_name, position: r.position, photo_url: r.photo_url })))
      }

      const total = totalRes.count || 0
      const eliminated = eliminatedRes.count || 0
      setStats({ total, active: total - eliminated, eliminated })
    } catch (err) {
      console.error('Home page data load error:', err)
    }
  }

  const applicationOpen = isApplicationOpen(season)

  // Countdown target: applications' deadline when open, otherwise next window's start date, else a placeholder.
  const countdownTarget = season
    ? new Date(applicationOpen ? season.application_end_date : season.application_start_date).getTime()
    : new Date('2027-03-14T08:00:00').getTime()

  const tickerItems = [
    season
      ? (applicationOpen
          ? `APPLICATIONS OPEN · DEADLINE ${new Date(season.application_end_date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}`
          : 'APPLICATIONS CLOSED · NEXT SEASON OPENING SOON')
      : "NIGERIA'S NEXT WARRIOR · STAY TUNED FOR SEASON DATES",
    season ? `${season.name.toUpperCase()} · ${season.year}` : 'A WLA COMPANY · SIX ZONES · ONE ARENA',
    waitingCount > 0 ? `${waitingCount} ON THE WAITING LIST` : 'JOIN THE WAITING LIST FOR UPDATES',
    'GRAND FINALE VENUE ANNOUNCEMENT SOON',
  ]

  return (
    <div className={styles.nnw}>
      <Ticker items={tickerItems} />
      <Nav applyLabel={applicationOpen ? 'Apply Now' : 'Get Notified'} />
      <Hero season={season} applicationOpen={applicationOpen} countdownTarget={countdownTarget} warriorsTotal={stats.total} />
      {!applicationOpen && <WaitlistSection waitingCount={waitingCount} />}
      <FormatSection />
      <ScheduleSection />
      <GallerySection />
      <GauntletSection />
      <StreamSection videos={videos} />
      <RosterSection champion={champion} runners={runners} />
      <StandingsSection />
      <RewardsSection />
      {sponsors.length > 0 && <SponsorsSection sponsors={sponsors} />}
      <InquirySection />
      <SocialMediaSection />
      <CTASection applicationOpen={applicationOpen} champion={champion} />
      <Footer />
    </div>
  )
}

export default function HomeClient() {
  return <HomeClientContent />
}