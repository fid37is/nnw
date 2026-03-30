'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useScrollReveal } from '@/lib/hooks'

const FAQS = [
  { q:'How do I apply?',                  a:'Click Apply, fill out your information, and submit. Our team reviews and responds within 3-5 business days.' },
  { q:'What are the age requirements?',    a:'You must be 18 years or older. Nigerian citizenship or residency is required to compete.' },
  { q:'How many competition stages?',      a:'Three stages: Zonal Elimination, Zone Finals, and the Grand Finale in Abuja. Only top performers advance.' },
  { q:'Where can I train?',               a:'Visit our Training Centers page to find certified Ninja training locations near you across Nigeria.' },
  { q:'What if I get eliminated?',         a:'Eliminated participants are recognised on the leaderboard and can apply again for the next season.' },
  { q:'Are there prizes?',                a:'Yes — cash prizes, life-changing endorsement deals, and the title of Naija Ninja Warrior Champion.' },
]

export default function FAQSection() {
  const { ref, visible } = useScrollReveal(0.1)
  const [open, setOpen] = useState<number|null>(null)

  return (
    <section ref={ref as any} className="py-24 bg-gradient-to-br from-naija-green-900 via-naija-green-800 to-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16"
          style={{opacity:visible?1:0,transform:visible?'translateY(0)':'translateY(24px)',transition:'all 0.6s ease'}}>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3">Frequently Asked</h2>
          <p className="text-naija-green-300 text-lg">Everything you need to know before you compete</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq,i)=>(
            <div key={i}
              className="rounded-2xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur"
              style={{opacity:visible?1:0,transform:visible?'translateY(0)':'translateY(24px)',transition:`all 0.5s ease ${i*60}ms`}}>
              <button
                className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-white/5 transition-colors"
                onClick={()=>setOpen(open===i?null:i)}>
                <span className="font-bold text-white text-base">{faq.q}</span>
                <ChevronDown size={18} className={`text-naija-green-400 flex-shrink-0 transition-transform duration-300 ${open===i?'rotate-180':''}`}/>
              </button>
              {open===i && (
                <div className="px-6 pb-6">
                  <p className="text-naija-green-100 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}