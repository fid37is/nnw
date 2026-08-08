'use client'

// File: components/sections/HeroSection.tsx
//
// Hydration fix (unchanged from before):
// Never toggle DOM node count based on a mounted/client-only flag.
// mounted still exists here — it only drives an opacity fade-in, not structure.

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Season { id:string; name:string; year:number; application_start_date:string; application_end_date:string; status:string }
interface HeroSectionProps { season:Season|null; isApplicationOpen:boolean }

const ZONES = ['South-South','South-West','South-East','North-Central','North-East','North-West']

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
            <div className="bg-white/10 border border-white/20 rounded-lg px-2.5 py-1 min-w-[2.4rem] backdrop-blur-sm">
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

export default function HeroSection({season,isApplicationOpen}:HeroSectionProps) {
  const [mounted,setMounted]=useState(false)
  useEffect(()=>{ setMounted(true) },[])

  return (
    <section className="relative min-h-[95vh] overflow-hidden bg-gray-950 flex items-center">

      {/* Background photo — replace src with your actual asset path */}
      <div className="absolute inset-0">
        <Image
          src="/obstacle-hero.png"
          alt="Nigeria Ninja Warrior competitor mid-obstacle at the Lagos 2026 Championships"
          fill
          priority
          className="object-cover"
          style={{ objectPosition: '38% 30%' }}
        />
      </div>

      {/* Left-to-right scrim: dark/opaque behind text, fades to fully transparent
          so the right side of the image reads bright and untouched. */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, rgba(3,7,18,0.96) 0%, rgba(3,7,18,0.92) 26%, rgba(3,7,18,0.68) 44%, rgba(3,7,18,0.28) 60%, rgba(3,7,18,0) 74%)'
        }}
        aria-hidden="true"
      />

      {/* Slim bottom fade so the scroll indicator stays legible against the crowd/banners */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div
          className="text-white space-y-7 max-w-xl transition-opacity duration-500"
          style={{ opacity: mounted ? 1 : 0.001 }}
        >
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

          <p className="text-gray-300 text-lg leading-relaxed max-w-md">
            Six zones. One nation. Only the strongest survive. Prove yourself on Africa's most demanding obstacle course.
          </p>

          {isApplicationOpen && season?.application_end_date && (
            <div className="inline-flex flex-col gap-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-sm">
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
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-base rounded-full transition-all duration-300 backdrop-blur-sm">
              View Leaderboard
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {ZONES.map(z=>(
              <span key={z} className="text-xs text-naija-green-400/70 border border-naija-green-800/50 rounded-full px-3 py-1 font-medium bg-gray-950/40">{z}</span>
            ))}
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