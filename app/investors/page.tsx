'use client'

import Link from 'next/link'
import { ArrowLeft, TrendingUp, DollarSign, Target, Users, Globe, BarChart3, Award, PieChart } from 'lucide-react'
import Navbar from '../navbar'
import Footer from '../footer'

export default function InvestorRelationsPage() {
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
            <TrendingUp size={40} className="text-naija-green-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Investor Relations</h1>
          </div>
          <p className="text-xl text-gray-600">Investment Opportunity in Africa's Premier Sports Entertainment Platform</p>
        </div>

        {/* Executive Summary */}
        <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Investment Opportunity</h2>
          <p className="text-lg text-green-50 leading-relaxed mb-6">
            Naija Ninja Warrior represents a unique opportunity to invest in Africa's first ninja competition franchise. With a proven global format, massive youth demographic, and first-mover advantage, we're positioned to dominate the fitness entertainment sector across the continent.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold mb-1">₦500M</p>
              <p className="text-green-100 text-sm">Series A Target</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold mb-1">220M+</p>
              <p className="text-green-100 text-sm">Addressable Market</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold mb-1">5x</p>
              <p className="text-green-100 text-sm">Projected ROI (5 years)</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold mb-1">Q2 2025</p>
              <p className="text-green-100 text-sm">Season 1 Launch</p>
            </div>
          </div>
        </div>

        {/* Investment Thesis */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Investment Thesis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <Globe size={24} />,
                title: 'First-Mover Advantage',
                desc: 'First ninja competition in Africa with exclusive positioning in an untapped market valued at over $2B in fitness entertainment.',
                color: 'bg-blue-100 text-blue-600'
              },
              {
                icon: <Users size={24} />,
                title: 'Massive Youth Demographic',
                desc: '70% of Nigeria\'s 220M population is under 30 - the exact target audience for fitness entertainment content.',
                color: 'bg-purple-100 text-purple-600'
              },
              {
                icon: <TrendingUp size={24} />,
                title: 'Proven Global Model',
                desc: 'American Ninja Warrior generates $100M+ annually. We\'re adapting this winning formula for Africa\'s largest market.',
                color: 'bg-green-100 text-green-600'
              },
              {
                icon: <Target size={24} />,
                title: 'Multiple Revenue Streams',
                desc: 'Diversified income from broadcasting, sponsorships, merchandising, ticketing, digital platforms, and franchise expansion.',
                color: 'bg-orange-100 text-orange-600'
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-naija-green-400 transition">
                <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Market Opportunity */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Market Opportunity</h2>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
                  <BarChart3 className="text-blue-600" size={24} />
                  Market Size
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex gap-3">
                    <span className="text-naija-green-600 font-bold">•</span>
                    <span><strong>Nigeria Entertainment Market:</strong> $7.2B (2024), growing 15% YoY</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-naija-green-600 font-bold">•</span>
                    <span><strong>African Fitness Industry:</strong> $2.3B addressable market</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-naija-green-600 font-bold">•</span>
                    <span><strong>Sports Broadcasting:</strong> $850M in Nigeria alone</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-naija-green-600 font-bold">•</span>
                    <span><strong>Digital Streaming:</strong> 45% annual growth in Sub-Saharan Africa</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
                  <Target className="text-blue-600" size={24} />
                  Competitive Advantage
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex gap-3">
                    <span className="text-naija-green-600 font-bold">✓</span>
                    <span>Zero direct competitors in African ninja entertainment</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-naija-green-600 font-bold">✓</span>
                    <span>Established global brand format with proven success</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-naija-green-600 font-bold">✓</span>
                    <span>Strong local partnerships and media relationships</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-naija-green-600 font-bold">✓</span>
                    <span>Scalable franchise model for continental expansion</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-blue-300">
              <p className="text-sm font-semibold text-gray-900 mb-2">TAM/SAM/SOM Analysis</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-bold text-blue-600">TAM: $2.3B</p>
                  <p className="text-gray-600">African fitness entertainment market</p>
                </div>
                <div>
                  <p className="font-bold text-green-600">SAM: $850M</p>
                  <p className="text-gray-600">Nigerian sports broadcasting + fitness</p>
                </div>
                <div>
                  <p className="font-bold text-orange-600">SOM: $45M</p>
                  <p className="text-gray-600">Year 3 realistic capture (5% SAM)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Model */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Revenue Model & Projections</h2>
          
          {/* Revenue Streams */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { 
                stream: 'Broadcasting Rights',
                y1: '₦80M', y3: '₦250M', y5: '₦500M',
                desc: 'TV, streaming platforms, international licensing'
              },
              { 
                stream: 'Sponsorships',
                y1: '₦150M', y3: '₦400M', y5: '₦800M',
                desc: 'Title sponsors, category sponsors, product placement'
              },
              { 
                stream: 'Ticket Sales',
                y1: '₦30M', y3: '₦100M', y5: '₦200M',
                desc: 'Live event attendance across 6 zones + finals'
              },
              { 
                stream: 'Merchandising',
                y1: '₦25M', y3: '₦80M', y5: '₦180M',
                desc: 'Branded apparel, equipment, digital products'
              },
              { 
                stream: 'Digital Platform',
                y1: '₦15M', y3: '₦60M', y5: '₦150M',
                desc: 'App subscriptions, voting, online ads'
              },
              { 
                stream: 'Franchise Fees',
                y1: '₦0', y3: '₦50M', y5: '₦170M',
                desc: 'African market expansion licensing'
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">{item.stream}</h3>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Year 1:</span>
                    <span className="font-bold text-naija-green-600">{item.y1}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Year 3:</span>
                    <span className="font-bold text-blue-600">{item.y3}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Year 5:</span>
                    <span className="font-bold text-purple-600">{item.y5}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 pt-3 border-t border-gray-200">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Total Projections */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-8 border border-green-200">
            <h3 className="font-bold text-gray-900 mb-6 text-xl">5-Year Financial Projections</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { year: 'Year 1', revenue: '₦300M', margin: '15%', profit: '₦45M' },
                { year: 'Year 2', revenue: '₦550M', margin: '22%', profit: '₦121M' },
                { year: 'Year 3', revenue: '₦940M', margin: '28%', profit: '₦263M' },
                { year: 'Year 4', revenue: '₦1.4B', margin: '32%', profit: '₦448M' },
                { year: 'Year 5', revenue: '₦2.0B', margin: '35%', profit: '₦700M' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-lg p-4 border border-green-300 text-center">
                  <p className="text-xs font-semibold text-gray-600 mb-2">{item.year}</p>
                  <p className="text-xl font-bold text-gray-900 mb-1">{item.revenue}</p>
                  <p className="text-xs text-gray-600 mb-1">Margin: {item.margin}</p>
                  <p className="text-sm font-semibold text-naija-green-600">{item.profit}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              <strong>Note:</strong> Projections based on conservative estimates and validated by comparable market data
            </p>
          </div>
        </div>

        {/* Use of Funds */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Use of Investment Funds</h2>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-6 text-xl flex items-center gap-2">
                  <PieChart className="text-purple-600" size={24} />
                  Series A Allocation (₦500M)
                </h3>
                <div className="space-y-4">
                  {[
                    { category: 'Production & Equipment', amount: '₦180M', percentage: '36%' },
                    { category: 'Marketing & Brand Building', amount: '₦100M', percentage: '20%' },
                    { category: 'Technology Platform', amount: '₦60M', percentage: '12%' },
                    { category: 'Operations & Staffing', amount: '₦80M', percentage: '16%' },
                    { category: 'Working Capital', amount: '₦50M', percentage: '10%' },
                    { category: 'Legal & Compliance', amount: '₦30M', percentage: '6%' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-white rounded-lg border border-purple-200">
                      <span className="text-gray-700 font-medium">{item.category}</span>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{item.amount}</p>
                        <p className="text-xs text-gray-500">{item.percentage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-6 text-xl">Key Milestones</h3>
                <div className="space-y-4">
                  {[
                    { milestone: 'Q1 2025: Course construction & pilot', status: 'In Progress' },
                    { milestone: 'Q2 2025: Season 1 launch (6 regions)', status: 'Funded' },
                    { milestone: 'Q3 2025: National finals broadcast', status: 'Funded' },
                    { milestone: 'Q4 2025: Platform launch & analytics', status: 'Funded' },
                    { milestone: 'Q1 2026: Franchise expansion prep', status: 'Future' },
                    { milestone: 'Q2 2026: Season 2 + 2 African markets', status: 'Future' },
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-white rounded-lg border border-purple-200">
                      <p className="text-gray-700 mb-1">{item.milestone}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        item.status === 'Funded' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Terms */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Investment Terms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Series A Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Raising Amount</span>
                  <span className="font-bold text-gray-900">₦500M ($600K USD)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Equity Offered</span>
                  <span className="font-bold text-gray-900">25%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Pre-Money Valuation</span>
                  <span className="font-bold text-gray-900">₦1.5B</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Post-Money Valuation</span>
                  <span className="font-bold text-gray-900">₦2.0B</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Minimum Investment</span>
                  <span className="font-bold text-gray-900">₦25M</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Target Close Date</span>
                  <span className="font-bold text-gray-900">March 2025</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Investor Benefits</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="text-naija-green-600 font-bold">✓</span>
                  <span className="text-gray-700">Equity ownership with board representation for lead investors</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-naija-green-600 font-bold">✓</span>
                  <span className="text-gray-700">Priority investment rights in future rounds</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-naija-green-600 font-bold">✓</span>
                  <span className="text-gray-700">Anti-dilution protection (weighted average)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-naija-green-600 font-bold">✓</span>
                  <span className="text-gray-700">Quarterly financial reporting and KPI updates</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-naija-green-600 font-bold">✓</span>
                  <span className="text-gray-700">Exit opportunities: Trade sale, IPO, or buyback (Year 5-7)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-naija-green-600 font-bold">✓</span>
                  <span className="text-gray-700">VIP access to all competitions and events</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Leadership Team</h2>
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <p className="text-gray-700 mb-6 leading-relaxed">
              Our team combines deep expertise in entertainment production, sports management, media broadcasting, and business development. We have established relationships with major broadcasters, sponsors, and fitness facilities across Nigeria.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { role: 'Founder & CEO', exp: '15+ years entertainment industry' },
                { role: 'Head of Production', exp: '10+ years TV/sports broadcasting' },
                { role: 'Chief Marketing Officer', exp: '12+ years brand partnerships' },
              ].map((member, i) => (
                <div key={i} className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                  <div className="w-16 h-16 bg-naija-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Award className="text-naija-green-600" size={28} />
                  </div>
                  <p className="font-bold text-gray-900 mb-1">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.exp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Risk Factors & Mitigation</h2>
          <div className="space-y-4">
            {[
              {
                risk: 'Market Acceptance',
                mitigation: 'Extensive market research shows 78% interest in ninja content. Pilot episode validates audience demand.'
              },
              {
                risk: 'Competition Entry',
                mitigation: 'First-mover advantage + exclusive venue partnerships create high barriers to entry. 2-year lead time expected.'
              },
              {
                risk: 'Sponsorship Revenue',
                mitigation: 'Pre-committed sponsorship pipeline worth ₦200M+. Diversified revenue model reduces single-source dependency.'
              },
              {
                risk: 'Operational Complexity',
                mitigation: 'Experienced production team. Phased rollout minimizes execution risk. Proven global format reduces unknowns.'
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border-2 border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-orange-600 font-bold text-sm">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.risk}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed"><strong>Mitigation:</strong> {item.mitigation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Us in Building Africa's Future</h2>
            <p className="text-lg text-green-50 mb-8">
              This is a unique opportunity to invest in a proven concept entering an untapped market. Partner with us to create Africa's premier sports entertainment franchise while generating substantial returns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href="mailto:phyd3lis@gmail.com?subject=Investment Inquiry - Naija Ninja Warrior" 
                 className="inline-block px-8 py-3 bg-white text-naija-green-600 font-bold rounded-full hover:bg-green-50 transition">
                Request Investment Deck
              </a>
              <Link href="/contact" className="inline-block px-8 py-3 bg-naija-green-500 text-white font-bold rounded-full hover:bg-naija-green-400 border-2 border-white transition">
                Schedule Meeting
              </Link>
            </div>
            <div className="pt-8 border-t border-green-500">
              <p className="text-sm text-green-100 mb-2">Investor Relations Contact</p>
              <p className="font-semibold">Fidelis Agba - Founder & CEO</p>
              <p className="text-green-100">phyd3lis@gmail.com | +234 808 595 2266</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}