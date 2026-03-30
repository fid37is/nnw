'use client'

import { useEffect, useState } from 'react'
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

export default function Home() {
  const [champion, setChampion]   = useState<Champion|null>(null)
  const [runners,  setRunners]    = useState<Runner[]>([])
  const [season,   setSeason]     = useState<Season|null>(null)
  const [loading,  setLoading]    = useState(true)
  const [stats,    setStats]      = useState({ total:0, active:0, eliminated:0 })
  const [videos,   setVideos]     = useState<YouTubeVideo[]>([])
  const [sponsors, setSponsors]   = useState<Sponsor[]>([])

  useEffect(()=>{ loadData() },[])

  const extractYouTubeId = (url:string):string => {
    const patterns=[/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/]
    for(const p of patterns){ const m=url.match(p); if(m) return m[1] }
    return ''
  }

  const loadData = async () => {
    try {
      const {data:seasonData}  = await supabase.from('seasons').select('id,name,year,status,application_start_date,application_end_date').order('year',{ascending:false}).limit(1).single()
      const {data:sponsorData} = await supabase.from('sponsors').select('*').order('created_at',{ascending:false})
      const {data:videoData}   = await supabase.from('youtube_videos').select('*').order('order_position',{ascending:true})

      if(seasonData) setSeason(seasonData)
      setSponsors(sponsorData||[])
      setVideos(videoData||[])

      if(!seasonData){ setLoading(false); return }

      const {data:championData} = await supabase.from('champions').select('*').eq('season_id',seasonData.id).eq('position',1).single()
      if(championData) setChampion({id:championData.id,user_id:championData.user_id,season_id:championData.season_id,full_name:championData.full_name,position:championData.position,photo_url:championData.photo_url,final_points:championData.final_points})

      const {data:runnersData} = await supabase.from('champions').select('*').eq('season_id',seasonData.id).in('position',[2,3]).order('position',{ascending:true})
      if(runnersData) setRunners(runnersData.map((r:any)=>({id:r.id,user_id:r.user_id,full_name:r.full_name,position:r.position,photo_url:r.photo_url})))

      const {count:total}     = await supabase.from('applications').select('id',{count:'exact'}).eq('season_id',seasonData.id).eq('status','approved')
      const {count:eliminated} = await supabase.from('applications').select('id',{count:'exact'}).eq('season_id',seasonData.id).eq('status','approved').eq('is_eliminated',true)
      setStats({total:total||0, active:(total||0)-(eliminated||0), eliminated:eliminated||0})
    } catch(err){ console.error('Failed to load data:',err) }
    finally { setLoading(false) }
  }

  const isApplicationOpen = () => {
    if(!season) return false
    const today = new Date().toISOString().split('T')[0]
    return today >= season.application_start_date && today <= season.application_end_date
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar isApplicationOpen={isApplicationOpen()}/>

      {loading ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-950">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin w-12 h-12 border-4 border-naija-green-800 border-t-naija-green-400 rounded-full"/>
            <p className="text-naija-green-400 text-sm font-medium">Loading...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Application status banner */}
          {season && (
            <div className={`${isApplicationOpen()?'bg-naija-green-600':'bg-gray-800'} text-white text-center text-xs font-bold py-2.5 tracking-wide mt-20`}>
              {isApplicationOpen()
                ? `🟢 Applications Open · Deadline: ${new Date(season.application_end_date).toLocaleDateString('en-NG',{day:'numeric',month:'long',year:'numeric'})}`
                : '🔴 Applications Closed · Next season opening soon — Register to be notified'}
            </div>
          )}

          <HeroSection champion={champion} season={season} isApplicationOpen={isApplicationOpen()}/>
          <StatsSection stats={stats}/>
          <ZoneMapSection isApplicationOpen={isApplicationOpen()}/>
          <CompetitionProcessSection isApplicationOpen={isApplicationOpen()}/>
          <VideoHighlights videos={videos} extractYouTubeId={extractYouTubeId}/>
          <TopCompetitors champion={champion} runners={runners}/>
          <SponsorsSection sponsors={sponsors}/>
          <FAQSection/>
          <InquirySection/>
          <SocialMediaSection/>
          <CTASection champion={champion} isApplicationOpen={isApplicationOpen()}/>
          <Footer/>
        </>
      )}
    </main>
  )
}