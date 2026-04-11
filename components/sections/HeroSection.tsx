// File: components/sections/HeroSection.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Clock, Trophy } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLogoConfig } from '../context/LogoContext'

interface Champion { id:string; user_id:string; season_id:string; full_name:string; position:number; photo_url:string|null }
interface Season { id:string; name:string; year:number; application_start_date:string; application_end_date:string; status:string }
interface HeroSectionProps { champion:Champion|null; season:Season|null; isApplicationOpen:boolean }

const ZONES = ['South-South','South-West','South-East','North-Central','North-East','North-West']

// ✅ Reduced from 25 to 8 dots on mobile — fewer animations = faster paint
const DOTS = Array.from({length:8},(_,i)=>({
  w: (((i*7+3)%40)/10)+1,
  h: (((i*11+5)%40)/10)+1,
  l: ((i*17+13)%100),
  t: ((i*23+7)%100),
  dur: (((i*3+2)%40)/10)+3,
  delay: (((i*5+1)%30)/10),
}))

function Countdown({ deadline }: { deadline:string }) {
  const [t,setT] = useState({d:0,h:0,m:0,s:0})
  useEffect(()=>{
    const tick=()=>{
      const diff=new Date(deadline).getTime()-Date.now()
      if(diff<=0){setT({d:0,h:0,m:0,s:0});return}
      setT({d:Math.floor(diff/86400000),h:Math.floor((diff%86400000)/3600000),m:Math.floor((diff%3600000)/60000),s:Math.floor((diff%60000)/1000)})
    }
    tick(); const id=setInterval(tick,1000); return()=>clearInterval(id)
  },[deadline])
  return (
    <div className="flex items-center gap-3">
      <Clock size={13} className="text-naija-green-400 flex-shrink-0"/>
      <div className="flex items-center gap-1.5">
        {([['d',t.d],['h',t.h],['m',t.m],['s',t.s]] as [string,number][]).map(([l,v])=>(
          <div key={l} className="text-center">
            <div className="bg-white/10 border border-white/20 rounded-lg px-2.5 py-1 min-w-[2.4rem]">
              <span className="text-white font-black text-base tabular-nums">{String(v).padStart(2,'0')}</span>
            </div>
            <span className="text-naija-green-400 text-[9px] font-bold uppercase tracking-wider mt-0.5 block">{l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ZoneTicker() {
  const [idx,setIdx]=useState(0)
  useEffect(()=>{ const id=setInterval(()=>setIdx(i=>(i+1)%ZONES.length),2000); return()=>clearInterval(id) },[])
  return (
    <div className="flex items-center gap-2">
      <MapPin size={12} className="text-naija-green-400 flex-shrink-0"/>
      <span className="text-naija-green-300 text-xs font-medium">Competing in:</span>
      <span key={idx} className="text-white text-xs font-black tracking-wide">{ZONES[idx]}</span>
    </div>
  )
}

export default function HeroSection({champion,season,isApplicationOpen}:HeroSectionProps) {
  const [revealed,setRevealed]=useState(false)
  const {logoUrl}=useLogoConfig()
  const hasChampion=champion?.photo_url

  useEffect(()=>{
    const t1=setTimeout(()=>setRevealed(true),4000)
    const t2=setTimeout(()=>setRevealed(false),16000)
    return()=>{clearTimeout(t1);clearTimeout(t2)}
  },[])

  return (
    <section className="relative min-h-[95vh] overflow-hidden bg-gray-950 flex items-center">
      {/* ✅ Simplified backgrounds — removed expensive blur-3xl on mobile */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-naija-green-950/30 to-gray-950"/>
      <div className="absolute inset-0 opacity-[0.025]" style={{backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',backgroundSize:'60px 60px'}}/>
      
      {/* ✅ Blurs hidden on mobile — only shown on lg+ */}
      <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-naija-green-600/8 rounded-full blur-3xl"/>
      <div className="hidden lg:block absolute bottom-0 right-0 w-[500px] h-[350px] bg-naija-green-800/10 rounded-full blur-3xl"/>

      {/* ✅ Fewer dots, hidden on mobile */}
      <div className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none">
        {DOTS.map((d,i)=>(
          <div key={i} className="absolute rounded-full bg-naija-green-400/20"
            style={{width:`${d.w}px`,height:`${d.h}px`,left:`${d.l}%`,top:`${d.t}%`,animation:`pulse ${d.dur}s ease-in-out ${d.delay}s infinite`}}/>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left content */}
          <div className="text-white space-y-7">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-naija-green-600/20 border border-naija-green-500/30 text-naija-green-300 text-xs font-black rounded-full tracking-widest uppercase">
                <span className="w-1.5 h-1.5 bg-naija-green-400 rounded-full animate-pulse"/>
                {season?`Season ${season.year}`:'Coming Soon'}
              </span>
              <ZoneTicker/>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-[0.92] tracking-tight">
              <span className="block text-white">Nigeria's</span>
              <span className="block text-white">Ultimate</span>
              <span className="block bg-gradient-to-r from-naija-green-400 to-naija-green-300 bg-clip-text text-transparent pb-1">Warrior</span>
              <span className="block text-white">Challenge</span>
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              Six zones. One nation. Only the strongest survive. Prove yourself on Africa's most demanding obstacle course.
            </p>

            {isApplicationOpen && season?.application_end_date && (
              <div className="inline-flex flex-col gap-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                <span className="text-naija-green-400 text-xs font-black uppercase tracking-widest">Applications close in</span>
                <Countdown deadline={season.application_end_date}/>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-1">
              <Link href="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-naija-green-700 hover:bg-naija-green-600 text-white font-black text-base rounded-full transition-all duration-300 shadow-lg shadow-naija-green-900/40 hover:scale-105">
                {isApplicationOpen?'Apply Now':'Register Interest'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
              </Link>
              <Link href="/leaderboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-base rounded-full transition-all duration-300">
                View Leaderboard
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {ZONES.map(z=>(
                <span key={z} className="text-xs text-naija-green-400/60 border border-naija-green-800/50 rounded-full px-3 py-1 font-medium">{z}</span>
              ))}
            </div>
          </div>

          {/* Right: champion card — hidden on mobile, saves LCP time */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 bg-naija-green-600/15 rounded-3xl blur-3xl"/>
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              {hasChampion ? (
                <>
                  <Image src={champion.photo_url!} alt={champion.full_name} fill priority className="object-cover"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"/>
                  <div className="absolute top-5 left-5 flex items-center gap-1.5 bg-yellow-500/90 text-white text-xs font-black px-3 py-1.5 rounded-full">
                    <Trophy size={12}/> CHAMPION
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <p className="text-naija-green-400 text-xs font-black tracking-widest uppercase mb-2">Can you beat them?</p>
                    <p className="text-white font-black text-3xl leading-tight">{champion.full_name}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                    <div className="text-[160px] font-black text-white/5 select-none">?</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"/>
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <p className="text-naija-green-400 text-xs font-black tracking-widest uppercase mb-2">Next Champion</p>
                    <p className="text-white font-black text-3xl leading-tight">Could Be You</p>
                    {isApplicationOpen && <p className="text-naija-green-300 text-sm mt-2">Apply now and make history</p>}
                  </div>
                  <div
                    className="absolute inset-0 z-20 flex items-center justify-center origin-top transition-all duration-[2500ms] ease-in-out"
                    style={{
                      transform: revealed ? 'scaleY(0)' : 'scaleY(1)',
                      background: 'linear-gradient(to bottom right, #052e16, #111827, #000)',
                    }}
                  >
                    {Array.from({length:16}).map((_,i)=>(
                      <div key={i} className="absolute left-0 right-0 border-b border-naija-green-800/30" style={{top:`${(i/16)*100}%`}}/>
                    ))}
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="absolute w-72 h-72 rounded-full bg-naija-green-500/20 blur-2xl"/>
                      <div className="absolute w-56 h-56 rounded-full bg-naija-green-400/15 blur-xl"/>
                      {/* ✅ Smaller logo on desktop only — not priority since card is hidden on mobile */}
                      <Image
                        src={logoUrl}
                        alt="NNW"
                        width={280}
                        height={280}
                        className="object-contain drop-shadow-[0_0_40px_rgba(16,192,132,0.6)] relative z-10"
                      />
                      <p className="text-naija-green-400 text-xs font-black tracking-[0.3em] uppercase">Naija Ninja Warrior</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-naija-green-400"/>
        <div className="w-1 h-1 bg-naija-green-400 rounded-full"/>
      </div>
    </section>
  )
}