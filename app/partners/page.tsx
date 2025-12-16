'use client'

import Link from 'next/link'
import { ArrowLeft, Handshake, TrendingUp, Globe, DollarSign, Tv, Users, Award, Target } from 'lucide-react'
import Navbar from '../navbar'
import Footer from '../footer'

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-14">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2 text-naija-green-600 hover:text-naija-green-700 mb-4 w-fit">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <Handshake size={40} className="text-naija-green-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Partner With Us</h1>
          </div>
          <p className="text-xl text-gray-600">Investment & Sponsorship Opportunities</p>
        </div>

        {/* Hero Statement */}
        <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Africa's Biggest Sports Entertainment Platform</h2>
          <p className="text-lg text-green-50 leading-relaxed mb-6">
            Naija Ninja Warrior offers unparalleled brand visibility, audience engagement, and investment returns. Partner with us to reach millions of viewers across Nigeria and Africa while supporting a movement that inspires excellence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold mb-1">220M+</p>
              <p className="text-green-100 text-sm">Potential Audience Reach</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold mb-1">70%</p>
              <p className="text-green-100 text-sm">Youth Under 30 (Prime Demo)</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold mb-1">6 Zones</p>
              <p className="text-green-100 text-sm">Nationwide Coverage</p>
            </div>
          </div>
        </div>

        {/* Market Opportunity */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Market Opportunity</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-xl">Why Nigeria?</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-naija-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Fastest-growing entertainment industry in Africa</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-naija-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Booming TV and streaming consumption with massive youth engagement</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-naija-green-600 font-bold">✓</span>
                    <span className="text-gray-700">Over 70% of population under 30 - perfect demographic</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-naija-green-600 font-bold">✓</span>
                    <span className="text-gray-700">First-mover advantage in African fitness entertainment</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-xl">Proven Global Success</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  American Ninja Warrior and international franchises dominate ratings and attract premium sponsors worldwide. We're bringing this winning formula to Africa's largest market with authentic local flavor.
                </p>
                <div className="bg-white rounded-lg p-4 border border-blue-300">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Multi-Platform Distribution</p>
                  <p className="text-xs text-gray-600">National TV, DSTV, Netflix, YouTube, and interactive digital platforms</p>
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
              { 
                icon: <Tv size={24} />,
                title: 'Broadcast & Streaming', 
                desc: 'Licensing to DSTV, Africa Magic, Netflix, Amazon Prime, and YouTube monetization',
                color: 'bg-purple-100 text-purple-600'
              },
              { 
                icon: <DollarSign size={24} />,
                title: 'Corporate Sponsorships', 
                desc: 'Premium partnerships with telecoms, banks, beverages, and fitness brands',
                color: 'bg-green-100 text-green-600'
              },
              { 
                icon: <Users size={24} />,
                title: 'Merchandising', 
                desc: 'Branded jerseys, sportswear, fitness gear, and licensed merchandise',
                color: 'bg-blue-100 text-blue-600'
              },
              { 
                icon: <Award size={24} />,
                title: 'Ticket Sales', 
                desc: 'Live audience tickets for regional competitions and national finals',
                color: 'bg-orange-100 text-orange-600'
              },
              { 
                icon: <Globe size={24} />,
                title: 'Digital Platform', 
                desc: 'Contestant voting, fan subscriptions, and online advertising revenue',
                color: 'bg-indigo-100 text-indigo-600'
              },
              { 
                icon: <TrendingUp size={24} />,
                title: 'Franchise Expansion', 
                desc: 'Scalable model across Africa with "Africa Ninja Challenge" potential',
                color: 'bg-red-100 text-red-600'
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
                <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
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
                benefits: [
                  'Exclusive naming rights',
                  'Prime logo placement on all materials',
                  'VIP event access',
                  'Extensive media coverage',
                  'Product integration opportunities',
                  'First right of refusal for future seasons'
                ],
                color: 'from-yellow-500 to-orange-500'
              },
              {
                tier: 'Platinum Partner',
                investment: 'Premium Tier',
                benefits: [
                  'Category exclusivity',
                  'Logo on all broadcasts',
                  'Sponsored segments',
                  'Social media features',
                  'Merchandise rights',
                  'Hospitality packages'
                ],
                color: 'from-gray-400 to-gray-500'
              },
              {
                tier: 'Gold Partner',
                investment: 'Standard Tier',
                benefits: [
                  'Logo placement',
                  'Digital advertising',
                  'Event signage',
                  'Social mentions',
                  'Ticket allocation',
                  'Brand association'
                ],
                color: 'from-amber-400 to-yellow-600'
              },
            ].map((pkg, i) => (
              <div key={i} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-xl transition">
                <div className={`bg-gradient-to-r ${pkg.color} text-white p-6`}>
                  <h3 className="font-bold text-2xl mb-2">{pkg.tier}</h3>
                  <p className="text-sm opacity-90">{pkg.investment}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {pkg.benefits.map((benefit, j) => (
                      <li key={j} className="flex gap-2 items-start text-sm text-gray-700">
                        <span className="text-naija-green-600 font-bold mt-0.5">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Highlights */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Investment Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-naija-green-600 rounded-lg flex items-center justify-center">
                  <Target className="text-white" size={20} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">First-Mover Advantage</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Be part of pioneering fitness entertainment in Africa with exclusive positioning in an untapped market with massive growth potential.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="text-white" size={20} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Massive Reach</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Access to millions across TV, streaming, and social media platforms with measurable ROI and brand lift metrics.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Award className="text-white" size={20} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Brand Association</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Align with values of excellence, determination, and achievement that resonate with aspirational audiences.
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-white" size={20} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Scalable Growth</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Ground floor opportunity in a franchise model designed for continental expansion and increasing returns.
              </p>
            </div>
          </div>
        </div>

        {/* Roadmap */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Season 1 Execution Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { phase: 'Phase 1', title: 'Foundation', items: ['Legal setup', 'Branding complete', 'Pilot episode'] },
              { phase: 'Phase 2', title: 'Partnerships', items: ['Secure sponsors', 'Media deals', 'Platform launch'] },
              { phase: 'Phase 3', title: 'Competition', items: ['6 regional events', 'Content production', 'Marketing blitz'] },
              { phase: 'Phase 4', title: 'Growth', items: ['Abuja finale', 'Season wrap', 'Africa expansion'] },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <p className="text-xs font-semibold text-naija-green-600 mb-2">{item.phase}</p>
                <h3 className="font-bold text-gray-900 mb-3">{item.title}</h3>
                <ul className="space-y-2">
                  {item.items.map((subitem, j) => (
                    <li key={j} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-naija-green-600 rounded-full"></span>
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
              We invite investors, media partners, and corporate sponsors to collaborate on launching Africa's most exciting sports entertainment platform. Together, we can inspire millions and create lasting value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href="mailto:phyd3lis@gmail.com" className="inline-block px-8 py-3 bg-white text-naija-green-600 font-bold rounded-full hover:bg-green-50 transition">
                Request Partnership Deck
              </a>
              <Link href="/contact" className="inline-block px-8 py-3 bg-naija-green-500 text-white font-bold rounded-full hover:bg-naija-green-400 border-2 border-white transition">
                Schedule a Meeting
              </Link>
            </div>
            <div className="pt-8 border-t border-green-500">
              <p className="text-sm text-green-100 mb-2">Partnership Inquiries</p>
              <p className="font-semibold">Fidelis Agba</p>
              <p className="text-green-100">phyd3lis@gmail.com | +234 808 595 2266</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}