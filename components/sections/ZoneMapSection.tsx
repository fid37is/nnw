'use client'

import Link from 'next/link'
import { ArrowRight, MapPin, Trophy } from 'lucide-react'
import { useScrollReveal } from '@/lib/hooks'

const ZONES = [
  { name:'South-South',  states:'Cross River, Rivers, Delta, Bayelsa, Akwa Ibom, Edo,', color:'from-teal-600 to-cyan-700',           num:'01', contestants:'Coming Soon' },
  { name:'South-West',   states:'Lagos, Ogun, Oyo, Osun, Ondo, Ekiti',                 color:'from-emerald-600 to-naija-green-700', num:'02', contestants:'Coming Soon' },
  { name:'South-East',   states:'Anambra, Imo, Enugu, Abia, Ebonyi',                   color:'from-naija-green-700 to-green-800',   num:'03', contestants:'Coming Soon' },
  { name:'North-Central',states:'FCT, Niger, Kwara, Kogi, Benue, Plateau, Nasarawa',   color:'from-amber-600 to-orange-700',        num:'04', contestants:'Coming Soon' },
  { name:'North-West',   states:'Kano, Jigawa, Katsina, Sokoto, Kebbi, Zamfara',       color:'from-orange-600 to-red-700',          num:'05', contestants:'Coming Soon' },
  { name:'North-East',   states:'Bauchi, Borno, Adamawa, Gombe, Taraba, Yobe',         color:'from-purple-700 to-indigo-800',       num:'06', contestants:'Coming Soon' },
]

export default function ZoneMapSection({ isApplicationOpen = false }: { isApplicationOpen?: boolean }) {
  const { ref, visible } = useScrollReveal(0.1)

  return (
    <section ref={ref as any} className="py-24 bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16"
          style={{opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(24px)', transition:'all 0.6s ease'}}>
          <span className="inline-block text-naija-green-400 text-xs font-black tracking-widest uppercase mb-4 px-4 py-2 border border-naija-green-800/50 rounded-full">
            The Arena
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mt-3">
            6 Zones.<br/>
            <span className="bg-gradient-to-r from-naija-green-400 to-naija-green-300 bg-clip-text text-transparent">
              One Champion.
            </span>
          </h2>
          <p className="text-gray-400 text-lg mt-4 max-w-xl mx-auto">
            Compete in your geopolitical zone. Zone winners advance to the Grand Finale in Abuja.
          </p>
        </div>

        {/* Zone grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ZONES.map((zone, i) => (
            <div key={zone.name}
              className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-naija-green-600/40 transition-all duration-500 cursor-default"
              style={{opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(40px)', transition:`all 0.7s ease ${i*80}ms`}}>
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${zone.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}/>
              <div className="absolute inset-0 bg-gray-900/80"/>

              {/* Content */}
              <div className="relative p-7">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-naija-green-400/60"/>
                    <span className="text-naija-green-400/60 text-xs font-black tracking-widest">ZONE {zone.num}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-600 bg-gray-800 px-2.5 py-1 rounded-full">
                    {zone.contestants}
                  </span>
                </div>
                <h3 className="text-white font-black text-xl mb-2 group-hover:text-naija-green-300 transition-colors">
                  {zone.name}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">{zone.states}</p>

                {/* Animated underline */}
                <div className={`h-0.5 bg-gradient-to-r ${zone.color} mt-5 w-0 group-hover:w-full transition-all duration-500 rounded-full`}/>
              </div>
            </div>
          ))}
        </div>

        {/* Grand finale banner */}
        <div className="mt-8 relative rounded-2xl overflow-hidden border border-naija-green-800/40"
          style={{opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(24px)', transition:'all 0.7s ease 600ms'}}>
          <div className="absolute inset-0 bg-gradient-to-r from-naija-green-900/80 via-gray-900/90 to-naija-green-900/80"/>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 p-8">
            <div className="text-center md:text-left">
              <p className="text-naija-green-400 text-xs font-black tracking-widest uppercase mb-1">Season Finale</p>
              <p className="text-white font-black text-2xl">Grand Finale — Abuja, FCT</p>
              <p className="text-gray-400 text-sm mt-1">All 6 zone winners compete for the ultimate title</p>
            </div>
            <div className="flex items-center gap-2 text-3xl flex-shrink-0">
              
            </div>
          </div>
        </div>

        {isApplicationOpen && (
          <div className="text-center mt-12"
            style={{opacity:visible?1:0, transition:'all 0.6s ease 700ms'}}>
            <Link href="/register"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-naija-green-600 hover:bg-naija-green-500 text-white font-black rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-naija-green-900/40">
              Represent Your Zone
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}