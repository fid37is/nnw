'use client'

import Link from 'next/link'
import { ArrowLeft, Handshake, TrendingUp, Globe, DollarSign, Tv, Users, Award, Target } from 'lucide-react'
import Navbar from '../navbar'
import Footer from '../footer'

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-14">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary-700 mb-4 w-fit transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <Handshake size={40} className="text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Partner With Us</h1>
          </div>
          <p className="text-xl text-muted-foreground">Investment & Sponsorship Opportunities</p>
        </div>

        {/* Hero Statement */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-xl p-8 md:p-12 mb-16 shadow-soft">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Africa's Biggest Sports Entertainment Platform</h2>
          <p className="text-lg text-primary-50 leading-relaxed mb-6">
            Naija Ninja Warrior offers unparalleled brand visibility, audience engagement, and investment returns. Partner with us to reach millions of viewers across Nigeria and Africa while supporting a movement that inspires excellence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-3xl font-bold mb-1">220M+</p>
              <p className="text-primary-100 text-sm">Potential Audience Reach</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-3xl font-bold mb-1">70%</p>
              <p className="text-primary-100 text-sm">Youth Under 30 (Prime Demo)</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-3xl font-bold mb-1">6 Zones</p>
              <p className="text-primary-100 text-sm">Nationwide Coverage</p>
            </div>
          </div>
        </div>

        {/* Market Opportunity */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Market Opportunity</h2>
          <div className="card p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-foreground mb-4 text-xl">Why Nigeria?</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-muted-foreground">Fastest-growing entertainment industry in Africa</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-muted-foreground">Booming TV and streaming consumption with massive youth engagement</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-muted-foreground">Over 70% of population under 30 - perfect demographic</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-muted-foreground">First-mover advantage in African fitness entertainment</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-4 text-xl">Proven Global Success</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  American Ninja Warrior and international franchises dominate ratings and attract premium sponsors worldwide. We're bringing this winning formula to Africa's largest market with authentic local flavor.
                </p>
                <div className="bg-muted rounded-lg p-4 border border-border">
                  <p className="text-sm font-semibold text-foreground mb-2">Multi-Platform Distribution</p>
                  <p className="text-xs text-muted-foreground">National TV, DSTV, Netflix, YouTube, and interactive digital platforms</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Streams */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Revenue Streams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: <Tv size={24} />,
                title: 'Broadcast & Streaming', 
                desc: 'Licensing to DSTV, Africa Magic, Netflix, Amazon Prime, and YouTube monetization'
              },
              { 
                icon: <DollarSign size={24} />,
                title: 'Corporate Sponsorships', 
                desc: 'Premium partnerships with telecoms, banks, beverages, and fitness brands'
              },
              { 
                icon: <Users size={24} />,
                title: 'Merchandising', 
                desc: 'Branded jerseys, sportswear, fitness gear, and licensed merchandise'
              },
              { 
                icon: <Award size={24} />,
                title: 'Ticket Sales', 
                desc: 'Live audience tickets for regional competitions and national finals'
              },
              { 
                icon: <Globe size={24} />,
                title: 'Digital Platform', 
                desc: 'Contestant voting, fan subscriptions, and online advertising revenue'
              },
              { 
                icon: <TrendingUp size={24} />,
                title: 'Franchise Expansion', 
                desc: 'Scalable model across Africa with "Africa Ninja Challenge" potential'
              },
            ].map((item, i) => (
              <div key={i} className="card p-6 hover:shadow-medium transition-all">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership Tiers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Partnership Tiers</h2>
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
                highlight: true
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
                ]
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
                ]
              },
            ].map((pkg, i) => (
              <div key={i} className={`card-elevated overflow-hidden hover:shadow-hard transition-all ${pkg.highlight ? 'border-2 border-primary' : 'border-2 border-border'}`}>
                <div className={`${pkg.highlight ? 'bg-primary text-white' : 'bg-muted text-foreground'} p-6`}>
                  <h3 className="font-bold text-2xl mb-2">{pkg.tier}</h3>
                  <p className="text-sm opacity-90">{pkg.investment}</p>
                </div>
                <div className="p-6 bg-card">
                  <ul className="space-y-3">
                    {pkg.benefits.map((benefit, j) => (
                      <li key={j} className="flex gap-2 items-start text-sm text-muted-foreground">
                        <span className="text-primary font-bold mt-0.5">✓</span>
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
          <h2 className="text-3xl font-bold text-foreground mb-8">Investment Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <Target size={20} />,
                title: 'First-Mover Advantage',
                description: 'Be part of pioneering fitness entertainment in Africa with exclusive positioning in an untapped market with massive growth potential.'
              },
              {
                icon: <Users size={20} />,
                title: 'Massive Reach',
                description: 'Access to millions across TV, streaming, and social media platforms with measurable ROI and brand lift metrics.'
              },
              {
                icon: <Award size={20} />,
                title: 'Brand Association',
                description: 'Align with values of excellence, determination, and achievement that resonate with aspirational audiences.'
              },
              {
                icon: <TrendingUp size={20} />,
                title: 'Scalable Growth',
                description: 'Ground floor opportunity in a franchise model designed for continental expansion and increasing returns.'
              }
            ].map((item, i) => (
              <div key={i} className="card p-6 hover:shadow-medium transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-foreground text-lg">{item.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Season 1 Execution Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { phase: 'Phase 1', title: 'Foundation', items: ['Legal setup', 'Branding complete', 'Pilot episode'] },
              { phase: 'Phase 2', title: 'Partnerships', items: ['Secure sponsors', 'Media deals', 'Platform launch'] },
              { phase: 'Phase 3', title: 'Competition', items: ['6 regional events', 'Content production', 'Marketing blitz'] },
              { phase: 'Phase 4', title: 'Growth', items: ['Abuja finale', 'Season wrap', 'Africa expansion'] },
            ].map((item, i) => (
              <div key={i} className="card p-6">
                <p className="text-xs font-semibold text-primary mb-2">{item.phase}</p>
                <h3 className="font-bold text-foreground mb-3">{item.title}</h3>
                <ul className="space-y-2">
                  {item.items.map((subitem, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      {subitem}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-xl p-8 md:p-12 shadow-soft">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Build Something Extraordinary</h2>
            <p className="text-lg text-primary-50 mb-8">
              We invite investors, media partners, and corporate sponsors to collaborate on launching Africa's most exciting sports entertainment platform. Together, we can inspire millions and create lasting value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href="mailto:phyd3lis@gmail.com" className="inline-block px-8 py-3 bg-white text-primary font-bold rounded-full hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl">
                Request Partnership Deck
              </a>
              <Link href="/contact" className="inline-block px-8 py-3 bg-primary-500 text-white font-bold rounded-full hover:bg-primary-400 border-2 border-white transition-all shadow-lg hover:shadow-xl">
                Schedule a Meeting
              </Link>
            </div>
            <div className="pt-8 border-t border-white/20">
              <p className="text-sm text-primary-100 mb-2">Partnership Inquiries</p>
              <p className="font-semibold">Fidelis Agba</p>
              <p className="text-primary-100">phyd3lis@gmail.com | +234 808 595 2266</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}