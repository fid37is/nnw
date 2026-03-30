'use client'

import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import { useScrollReveal } from '@/lib/hooks'

interface Champion { id:string; user_id:string; season_id:string; full_name:string; position:number; photo_url:string|null }
interface CTASectionProps { champion:Champion|null; isApplicationOpen:boolean }

export default function CTASection({ champion, isApplicationOpen }: CTASectionProps) {
  const { ref, visible } = useScrollReveal(0.15)

  return (
    <section ref={ref as any} className="py-24 bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden"
          style={{opacity:visible?1:0, transform:visible?'scale(1)':'scale(0.96)', transition:'all 0.8s ease'}}>
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-naija-green-800 via-naija-green-900 to-gray-950"/>
          <div className="absolute inset-0 opacity-[0.04]"
            style={{backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-naija-green-500/10 rounded-full blur-3xl"/>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-naija-green-400/8 rounded-full blur-3xl"/>

          {/* Diagonal accent */}
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-naija-green-600/10 to-transparent"
            style={{clipPath:'polygon(40% 0, 100% 0, 100% 100%, 0% 100%)'}}/>

          <div className="relative text-center px-8 sm:px-16 md:px-24 py-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-naija-green-400/10 border border-naija-green-500/30 text-naija-green-300 text-xs font-black rounded-full tracking-widest uppercase mb-8">
              <Zap size={12}/> Your Time Is Now
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6">
              {isApplicationOpen ? (
                <>Ready to{' '}<span className="bg-gradient-to-r from-naija-green-400 to-naija-green-300 bg-clip-text text-transparent">Compete?</span></>
              ) : (
                <>The Next{' '}<span className="bg-gradient-to-r from-naija-green-400 to-naija-green-300 bg-clip-text text-transparent">Season</span>{' '}Awaits</>
              )}
            </h2>

            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
              {isApplicationOpen
                ? (champion ? `Can you dethrone ${champion.full_name}? Join warriors from all 6 zones and prove yourself.` : 'Be the first to claim the champion title. Apply now and make history.')
                : 'Applications are currently closed. Register now to be first in line when Season 1 opens.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register"
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-naija-green-800 font-black text-lg rounded-full hover:bg-naija-green-50 transition-all duration-300 shadow-2xl hover:scale-105">
                {isApplicationOpen ? 'Apply Now' : 'Register for Updates'}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
              </Link>
              <Link href="/about"
                className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-lg rounded-full transition-all duration-300">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}