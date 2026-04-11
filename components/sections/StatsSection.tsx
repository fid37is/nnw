// File: components/sections/StatsSection.tsx
'use client'

import { useScrollReveal, useCountUp } from '@/lib/hooks'
import { ShieldCheck } from 'lucide-react'

interface StatsSectionProps {
  stats: { total:number; active:number; eliminated:number }
}

function StatCard({ value, label, color, delay }: { value:number; label:string; color:string; delay:number }) {
  const {ref, visible} = useScrollReveal()
  const count = useCountUp(value, visible)
  return (
    <div ref={ref as any}
      className="text-center"
      style={{opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(32px)', transition:`all 0.7s ease ${delay}ms`}}>
      <span className={`text-6xl md:text-7xl font-black ${color} tabular-nums`}>
        {count.toLocaleString()}
      </span>
      <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-3">{label}</p>
    </div>
  )
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const {ref, visible} = useScrollReveal(0.1)

  return (
    <section ref={ref as any} className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-3xl overflow-hidden border-2 border-gray-100 bg-gradient-to-br from-gray-50 to-white"
          style={{opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(24px)', transition:'all 0.6s ease'}}>
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-naija-green-400 to-transparent"/>

          <div className="relative p-12 grid grid-cols-1 md:grid-cols-3 gap-10 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <StatCard value={stats.total}      label="Total Warriors"  color="text-naija-green-600" delay={0}/>
            <StatCard value={stats.active}     label="Still Competing" color="text-blue-600"         delay={100}/>
            <StatCard value={stats.eliminated} label="Eliminated"      color="text-red-500"          delay={200}/>
          </div>

          {stats.total === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-3xl">
              <div className="text-center px-8">
                <div className="flex items-center justify-center w-12 h-12 bg-naija-green-100 rounded-xl mb-3 mx-auto">
                  <ShieldCheck size={24} className="text-naija-green-600"/>
                </div>
                <p className="font-black text-gray-900 text-xl">Season 1 Loading</p>
                <p className="text-gray-500 text-sm mt-1">Stats will appear once competition begins</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}