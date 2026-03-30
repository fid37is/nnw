'use client'

import Link from 'next/link'
import { Handshake } from 'lucide-react'
import { useScrollReveal } from '@/lib/hooks'

interface Sponsor { id:string; name:string; logo_url:string; website_url:string }
interface SponsorsSectionProps { sponsors: Sponsor[] }

export default function SponsorsSection({ sponsors }: SponsorsSectionProps) {
  const { ref, visible } = useScrollReveal(0.1)

  return (
    <section ref={ref as any} className="py-20 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14"
          style={{opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(24px)', transition:'all 0.6s ease'}}>
          <p className="text-gray-400 text-xs font-black tracking-widest uppercase mb-3">Powered By</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">Our Partners & Sponsors</h2>
        </div>

        {sponsors.length > 0 ? (
          /* Marquee ticker */
          <div className="relative"
            style={{opacity:visible?1:0, transition:'all 0.7s ease 100ms'}}>
            {/* Left / right fade masks */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"/>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"/>

            <div className="flex gap-8 overflow-hidden">
              {/* Double the list for seamless loop */}
              {[...sponsors, ...sponsors].map((sponsor, i) => (
                <a key={`${sponsor.id}-${i}`}
                  href={sponsor.website_url} target="_blank" rel="noopener noreferrer"
                  className="group flex-shrink-0 flex items-center justify-center gap-3 px-8 py-5 bg-gray-50 hover:bg-naija-green-50 border-2 border-gray-100 hover:border-naija-green-300 rounded-2xl transition-all duration-300 min-w-[180px]"
                  style={{animation:`marquee-scroll ${sponsors.length * 4}s linear infinite`}}>
                  {sponsor.logo_url && (
                    <img src={sponsor.logo_url} alt={sponsor.name}
                      className="max-h-10 max-w-[100px] object-contain grayscale group-hover:grayscale-0 transition-all duration-300"/>
                  )}
                  <span className="font-bold text-gray-600 group-hover:text-naija-green-700 text-sm whitespace-nowrap">{sponsor.name}</span>
                </a>
              ))}
            </div>

            <style jsx>{`
              @keyframes marquee-scroll {
                from { transform: translateX(0); }
                to   { transform: translateX(-50%); }
              }
            `}</style>
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl"
            style={{opacity:visible?1:0, transition:'all 0.6s ease 100ms'}}>
            <div className="flex items-center justify-center w-14 h-14 bg-naija-green-100 rounded-2xl mb-4 mx-auto"><Handshake size={28} className="text-naija-green-600"/></div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Become a Founding Sponsor</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8 text-sm leading-relaxed">
              Partner with Naija Ninja Warrior and reach millions of passionate viewers across Nigeria and Africa.
              First-mover sponsorship packages available now.
            </p>
            <Link href="/partners"
              className="inline-flex items-center px-8 py-3.5 bg-naija-green-600 text-white font-bold rounded-full hover:bg-naija-green-700 transition-all duration-300 hover:scale-105">
              View Partnership Opportunities
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}