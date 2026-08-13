'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, TrendingUp, Globe, DollarSign, Tv, Users, Award, Target } from '@/components/ui/icons'

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden pt-32">

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-14">

        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2 text-naija-green-600 hover:text-naija-green-700 mb-4 w-fit transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <TrendingUp size={40} className="text-naija-green-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Partner With Us</h1>
          </div>
          <p className="text-xl text-gray-600">Sponsorship & Partnership Opportunities - NNW & WLA Entertainment</p>
        </div>

        {/* WLA Parent Banner */}
        <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-lg mb-10">
          <div className="bg-gray-950 px-6 py-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-gray-800">
              <Image src="/wla-logo.png" alt="WLA Entertainment Ltd" width={80} height={80} className="object-contain" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-0.5">Operated by</p>
              <h2 className="text-xl font-black text-white mb-1">WLA Entertainment Ltd</h2>
              <p className="text-gray-400 text-xs mb-2">A WLA Entertainment Company · RC No. 9529867</p>
              <p className="text-gray-300 text-sm">All partnerships and sponsorship agreements are entered into with WLA Entertainment Ltd, the registered operator of Naija Next Warrior.</p>
            </div>
          </div>
        </div>

        {/* Hero Statement */}
        <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Africa's Biggest Sports Entertainment Platform</h2>
          <p className="text-lg text-green-50 leading-relaxed mb-6">
            Naija Next Warrior offers unparalleled brand visibility, audience engagement, and market access. Partner with WLA Entertainment to reach millions of viewers across Nigeria and Africa while aligning your brand with excellence, resilience, and national pride.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              { value: '220M+', label: 'Potential Audience Reach' },
              { value: '70%',   label: 'Youth Under 30 (Prime Demo)' },
              { value: '6 Zones', label: 'Nationwide Coverage' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-green-100 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Market Opportunity */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Market Opportunity</h2>
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-xl">Why Nigeria?</h3>
                <ul className="space-y-3">
                  {[
                    'Fastest-growing entertainment industry in Africa',
                    'Booming TV and streaming consumption with massive youth engagement',
                    'Over 70% of population under 30 - the most valuable commercial demographic',
                    'First-mover advantage - zero direct competitors in this space',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-naija-green-600 font-bold flex-shrink-0">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-xl">Proven Global Model</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Ninja Warrior franchises dominate ratings and attract premium sponsors worldwide. WLA Entertainment is bringing this winning format to Africa's largest market with an authentic Nigerian identity and a proprietary competition format that does not exist anywhere else globally.
                </p>
                <div className="bg-naija-green-50 rounded-lg p-4 border border-naija-green-200">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Multi-Platform Distribution</p>
                  <p className="text-xs text-gray-600">National TV, DSTV, streaming platforms, YouTube, and the NNW digital platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Streams */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Revenue Streams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Tv size={24} />, title: 'Broadcast & Streaming',
                desc: 'Licensing to DSTV, Africa Magic, Netflix, Amazon Prime, and YouTube monetisation' },
              { icon: <DollarSign size={24} />, title: 'Corporate Sponsorships',
                desc: 'Premium partnerships with telecoms, banks, beverages, and fitness brands' },
              { icon: <Users size={24} />, title: 'Merchandising',
                desc: 'Branded jerseys, sportswear, fitness gear, and licensed merchandise' },
              { icon: <Award size={24} />, title: 'Ticket Sales',
                desc: 'Live audience tickets for regional competitions and the Grand Finale in Abuja' },
              { icon: <Globe size={24} />, title: 'Digital Platform',
                desc: 'Contestant voting, fan subscriptions, and online advertising revenue' },
              { icon: <TrendingUp size={24} />, title: 'Franchise Expansion',
                desc: 'Scalable model across Africa under the WLA continental expansion strategy' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-naija-green-400 transition">
                <div className="w-12 h-12 bg-naija-green-100 text-naija-green-700 rounded-lg flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership Tiers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Partnership Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                tier: 'Title Sponsor',
                investment: 'Custom Package',
                highlight: true,
                benefits: [
                  'Exclusive naming rights',
                  'Prime logo placement on all materials',
                  'VIP event access across all zones',
                  'Extensive media coverage',
                  'Product integration opportunities',
                  'First right of refusal for future seasons',
                ],
              },
              {
                tier: 'Platinum Partner',
                investment: 'Premium Tier',
                highlight: false,
                benefits: [
                  'Category exclusivity',
                  'Logo on all broadcasts',
                  'Sponsored segments',
                  'Social media features',
                  'Merchandise rights',
                  'Hospitality packages',
                ],
              },
              {
                tier: 'Gold Partner',
                investment: 'Standard Tier',
                highlight: false,
                benefits: [
                  'Logo placement',
                  'Digital advertising',
                  'Event signage',
                  'Social mentions',
                  'Ticket allocation',
                  'Brand association',
                ],
              },
            ].map((pkg, i) => (
              <div key={i} className={`rounded-xl overflow-hidden border-2 ${pkg.highlight ? 'border-naija-green-500' : 'border-gray-200'}`}>
                <div className={`${pkg.highlight ? 'bg-naija-green-600 text-white' : 'bg-gray-50 text-gray-900'} p-6`}>
                  <h3 className="font-bold text-2xl mb-1">{pkg.tier}</h3>
                  <p className={`text-sm ${pkg.highlight ? 'text-green-100' : 'text-gray-500'}`}>{pkg.investment}</p>
                </div>
                <div className="p-6 bg-white">
                  <ul className="space-y-3">
                    {pkg.benefits.map((benefit, j) => (
                      <li key={j} className="flex gap-2 items-start text-sm text-gray-600">
                        <span className="text-naija-green-600 font-bold mt-0.5 flex-shrink-0">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Partner */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Partner with WLA Entertainment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <Target size={20} />,
                title: 'First-Mover Positioning',
                desc: 'Be among the founding partners of Africa\'s first ninja-style sports entertainment platform - with the brand equity that comes from being there from the start.',
              },
              {
                icon: <Users size={20} />,
                title: 'Massive Measurable Reach',
                desc: 'Access to millions across TV, streaming, and social media with measurable ROI, brand lift metrics, and audience data post-season.',
              },
              {
                icon: <Award size={20} />,
                title: 'Brand Alignment',
                desc: 'Associate your brand with strength, resilience, excellence, and Nigerian national pride - values that resonate with an aspirational, upwardly mobile audience.',
              },
              {
                icon: <TrendingUp size={20} />,
                title: 'Long-Term Growth',
                desc: 'Ground-floor access to a franchise model built for continental expansion. Partners who start with NNW grow with the entire WLA network.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-naija-green-400 transition">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-naija-green-100 text-naija-green-700 rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Plan */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Season 1 Execution Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { phase: 'Phase 1', title: 'Foundation', items: ['WLA incorporated', 'Branding complete', 'Pilot episode'] },
              { phase: 'Phase 2', title: 'Partnerships', items: ['Secure sponsors', 'Media deals', 'Platform launch'] },
              { phase: 'Phase 3', title: 'Competition', items: ['6 regional events', 'Content production', 'Marketing blitz'] },
              { phase: 'Phase 4', title: 'Growth', items: ['Abuja finale', 'Season wrap', 'Africa expansion'] },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-xs font-semibold text-naija-green-600 mb-2 uppercase tracking-wide">{item.phase}</p>
                <h3 className="font-bold text-gray-900 mb-3">{item.title}</h3>
                <ul className="space-y-2">
                  {item.items.map((subitem, j) => (
                    <li key={j} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-naija-green-600 rounded-full flex-shrink-0" />
                      {subitem}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Build Something Extraordinary</h2>
            <p className="text-lg text-green-50 mb-8">
              We invite media partners and corporate sponsors to collaborate on launching Africa's most exciting sports entertainment platform - operated by WLA Entertainment Ltd.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href="mailto:legal@naijaninja.net?subject=Partnership Inquiry - NNW / WLA Entertainment"
                className="inline-block px-8 py-3 bg-white text-naija-green-700 font-bold rounded-full hover:bg-green-50 transition shadow-lg">
                Request Partnership Deck
              </a>
              <Link href="/contact"
                className="inline-block px-8 py-3 bg-naija-green-500 text-white font-bold rounded-full hover:bg-naija-green-400 border-2 border-white transition shadow-lg">
                Schedule a Meeting
              </Link>
            </div>
            <div className="pt-8 border-t border-white/20 text-sm">
              <p className="text-green-100 mb-1">Partnership Inquiries - WLA Entertainment Ltd</p>
              <p className="font-bold text-lg mb-1">Fidelis Agba - Founder & CEO</p>
              <p className="text-green-100">legal@naijaninja.net &nbsp;|&nbsp; +234 808 595 2266</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}