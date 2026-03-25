'use client'

import Link from 'next/link'
import {
  ArrowLeft, TrendingUp, Target, Users, Globe,
  BarChart3, Award, PieChart, DollarSign, Tv,
  ShoppingBag, Smartphone, CheckCircle, AlertTriangle, ArrowRight
} from 'lucide-react'
import Navbar from '../navbar'
import Footer from '../footer'

export default function InvestorRelationsPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-14">

        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2 text-naija-green-600 hover:text-naija-green-700 mb-4 w-fit transition-colors">
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
          <p className="text-lg text-green-50 leading-relaxed mb-8">
            Naija Ninja Warrior (NNW) is Nigeria's first national-scale physical challenge competition franchise.
            Operating across all six geopolitical zones with a Grand Finale in Abuja, NNW combines live sports
            entertainment, digital media, and cultural identity into a scalable, multi-revenue business built
            for both local dominance and continental expansion.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '₦500M',   label: 'Series A Target' },
              { value: '220M+',   label: 'Addressable Audience' },
              { value: '70%',     label: 'Population Under 30' },
              { value: 'Q4 2026', label: 'Season 1 Launch' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                <p className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-green-100 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Thesis */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Investment Thesis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: <Globe size={24}/>, title: 'First-Mover Advantage',
                desc: "Zero direct competitors in African ninja-style sports entertainment. NNW enters an untapped market with a proven global format adapted for the world's youngest major economy." },
              { icon: <Users size={24}/>, title: 'Massive Youth Demographic',
                desc: "70% of Nigeria's 220M+ population is under 30 — precisely the demographic that drives streaming, social media engagement, and live event attendance." },
              { icon: <TrendingUp size={24}/>, title: 'Proven Global Model',
                desc: "American Ninja Warrior generates $100M+ annually. NNW replicates this formula with Nigerian identity and a proprietary tactical obstacle format that does not exist anywhere else globally." },
              { icon: <Target size={24}/>, title: 'Multi-Revenue Architecture',
                desc: "Broadcasting, sponsorship, ticketing, merchandise, digital platforms, and franchise licensing create diversified, season-on-season compounding revenue streams." },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-naija-green-400 transition">
                <div className="w-12 h-12 bg-naija-green-100 text-naija-green-700 rounded-lg flex items-center justify-center mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Market Opportunity */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Market Opportunity</h2>
          <div className="bg-naija-green-50 rounded-xl p-8 border border-naija-green-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
                  <BarChart3 className="text-naija-green-600" size={24}/>Market Size
                </h3>
                <ul className="space-y-3 text-gray-700">
                  {[
                    ['Nigeria Entertainment Market','$7.2B (2024), growing 15% YoY'],
                    ['African Fitness Industry','$2.3B addressable market'],
                    ['Sports Broadcasting — Nigeria','$850M annual market'],
                    ['Digital Streaming — Sub-Saharan Africa','45% annual growth'],
                    ['Direct NNW Competitors in Africa','Zero — absolute first-mover'],
                  ].map(([l,v],i)=>(
                    <li key={i} className="flex gap-3">
                      <span className="text-naija-green-600 font-bold flex-shrink-0">•</span>
                      <span><strong>{l}:</strong> {v}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
                  <Target className="text-naija-green-600" size={24}/>Competitive Advantage
                </h3>
                <ul className="space-y-3 text-gray-700">
                  {[
                    'Zero direct competitors in African ninja entertainment',
                    'Proprietary tactical equipment-based obstacle format — not replicated globally',
                    'Live website, contestant platform, and trademark already in place',
                    'Scalable franchise model designed for continental expansion',
                  ].map((item,i)=>(
                    <li key={i} className="flex gap-3">
                      <span className="text-naija-green-600 font-bold flex-shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-naija-green-200">
              <p className="text-sm font-semibold text-gray-900 mb-3">TAM / SAM / SOM Analysis</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {[
                  ['TAM: $2.3B','African fitness entertainment market'],
                  ['SAM: $850M','Nigerian sports broadcasting + fitness'],
                  ['SOM: $45M','Year 3 realistic capture (5% of SAM)'],
                ].map(([val,desc],i)=>(
                  <div key={i}>
                    <p className="font-bold text-lg text-naija-green-700">{val}</p>
                    <p className="text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Streams */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Revenue Model</h2>
          <p className="text-gray-600 mb-8">Seven distinct, compounding income streams across all seasons.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { icon:<DollarSign size={22}/>, stream:'Sponsorships', tag:'Strongest Early Earner',
                y1:'₦150M', y3:'₦400M', y5:'₦800M',
                desc:'Title sponsor, category sponsors (telecoms, banks, beverages, sportswear), and product placement across all events and digital platforms.' },
              { icon:<Tv size={22}/>, stream:'Broadcast & Streaming Rights', tag:'Long-Term Value Driver',
                y1:'₦80M', y3:'₦250M', y5:'₦500M',
                desc:'Licensing to DSTV, Africa Magic, Channels TV, Netflix Africa, Amazon Prime Video, and YouTube monetisation.' },
              { icon:<Users size={22}/>, stream:'Ticket Sales & Live Events', tag:'Direct Cash Flow',
                y1:'₦85M', y3:'₦150M', y5:'₦200M',
                desc:'6 zonal events (2,000 avg. attendees at ₦5,000) plus Grand Finale in Abuja (5,000 attendees). Includes vendor booth fees.' },
              { icon:<CheckCircle size={22}/>, stream:'Registration Fees', tag:'Scalable Income',
                y1:'₦30M', y3:'₦55M', y5:'₦80M',
                desc:'Free registration for all applicants. Only approved contestants pay a participation token (₦5,000–₦10,000), ensuring commitment and filtering.' },
              { icon:<ShoppingBag size={22}/>, stream:'Merchandise', tag:'Brand Equity Converted',
                y1:'₦20M', y3:'₦80M', y5:'₦180M',
                desc:'Branded apparel, sportswear, accessories, and fitness gear sold online and at all competition events.' },
              { icon:<Smartphone size={22}/>, stream:'Digital Platform', tag:'Growing Year-on-Year',
                y1:'₦15M', y3:'₦60M', y5:'₦150M',
                desc:'Fan subscriptions, in-app advertising, and social media brand deals via the NNW digital platform and channels.' },
              { icon:<Globe size={22}/>, stream:'Franchise Licensing', tag:'Season 3+ Expansion',
                y1:'—', y3:'₦50M', y5:'₦170M',
                desc:'Licensing the NNW format and brand to other African markets under the "Africa Ninja Challenge" model.' },
            ].map((item,i)=>(
              <div key={i} className="bg-white rounded-xl p-6 border-2 border-gray-200 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-naija-green-100 text-naija-green-700 rounded-lg flex items-center justify-center">{item.icon}</div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-naija-green-100 text-naija-green-700">{item.tag}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{item.stream}</h3>
                <div className="space-y-2 mb-3">
                  {[['Year 1',item.y1],['Year 3',item.y3],['Year 5',item.y5]].map(([yr,val])=>(
                    <div key={yr} className="flex justify-between text-sm">
                      <span className="text-gray-500">{yr}:</span>
                      <span className="font-bold text-naija-green-700">{val}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 pt-3 border-t border-gray-100 leading-relaxed mt-auto">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* 5-Year Projection Table */}
          <div className="bg-naija-green-50 rounded-xl p-8 border border-naija-green-200">
            <h3 className="font-bold text-gray-900 mb-6 text-xl">5-Year Financial Projections</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-naija-green-700 text-white">
                    {['Revenue Stream','Year 1','Year 2','Year 3','Year 4','Year 5'].map((h,i)=>(
                      <th key={i} className={`px-4 py-3 font-semibold ${i===0?'text-left':'text-center'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Broadcasting & Streaming','₦80M','₦150M','₦250M','₦380M','₦500M'],
                    ['Sponsorships','₦150M','₦260M','₦400M','₦580M','₦800M'],
                    ['Ticket Sales & Events','₦85M','₦110M','₦150M','₦175M','₦200M'],
                    ['Registration Fees','₦30M','₦40M','₦55M','₦65M','₦80M'],
                    ['Merchandise','₦20M','₦35M','₦80M','₦120M','₦180M'],
                    ['Digital Platform','₦15M','₦35M','₦60M','₦100M','₦150M'],
                    ['Franchise Licensing','—','—','₦50M','₦120M','₦170M'],
                  ].map((row,i)=>(
                    <tr key={i} className={i%2===0?'bg-white':'bg-naija-green-50'}>
                      {row.map((cell,j)=>(
                        <td key={j} className={`px-4 py-3 ${j===0?'font-medium text-gray-700 text-left':'text-center font-semibold text-naija-green-700'}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-gray-900 text-white font-bold">
                    {['TOTAL REVENUE','₦380M','₦630M','₦1.045B','₦1.540B','₦2.080B'].map((c,i)=>(
                      <td key={i} className={`px-4 py-3 ${i===0?'text-left':'text-center'}`}>{c}</td>
                    ))}
                  </tr>
                  <tr className="bg-naija-green-100 text-naija-green-800 font-bold">
                    {['Net Margin %','12%','19%','26%','31%','35%'].map((c,i)=>(
                      <td key={i} className={`px-4 py-3 ${i===0?'text-left':'text-center'}`}>{c}</td>
                    ))}
                  </tr>
                  <tr className="bg-naija-green-700 text-white font-bold">
                    {['Net Profit','₦46M','₦120M','₦272M','₦477M','₦728M'].map((c,i)=>(
                      <td key={i} className={`px-4 py-3 ${i===0?'text-left':'text-center'}`}>{c}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-600 mt-4 text-center italic">
              Projections based on conservative estimates. Franchise licensing commences Year 3. These figures are not a guarantee of returns.
            </p>
          </div>
        </div>

        {/* How Investors Earn Returns */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">How Investors Earn Returns</h2>
          <p className="text-gray-600 mb-8">Three clearly structured pathways, governed by formal agreements prepared by legal counsel.</p>

          {/* Path A */}
          <div className="mb-6 rounded-xl overflow-hidden border-2 border-gray-200">
            <div className="bg-naija-green-700 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-naija-green-200 uppercase tracking-wider">Path A</span>
                <h3 className="text-xl font-bold">Equity Ownership</h3>
              </div>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Recommended for Lead Investors</span>
            </div>
            <div className="p-6 bg-white">
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Investor acquires equity in NNW Entertainment Limited. As the company grows, equity appreciates in value. Returns come through profit distributions and, ultimately, an exit event.
              </p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-naija-green-700 text-white">
                      {['Investment Amount','Equity Offered','Pre-Money Valuation','Post-Money Valuation','Minimum Investment'].map((h,i)=>(
                        <th key={i} className="px-4 py-3 text-center font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-naija-green-50">
                      {['₦500M (Series A)','25%','₦1.5B','₦2.0B','₦25M'].map((c,i)=>(
                        <td key={i} className="px-4 py-3 text-center font-bold text-naija-green-700">{c}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <h4 className="font-bold text-gray-900 mb-3 text-sm">Investor Benefits:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  ['Profit Distributions','Pro-rata share of net profit from Season 1 onwards, paid quarterly.'],
                  ['Board Representation','Lead investors (₦50M+) receive a board seat and full financial reporting.'],
                  ['Anti-Dilution Protection','Weighted-average clause protects equity percentage in future rounds.'],
                  ['Priority Rights','First right of participation in Series B and all future investment rounds.'],
                  ['Exit Opportunities','Trade sale, acquisition by a media group, or IPO targeted for Year 5–7.'],
                  ['VIP Access','Complimentary VIP access to all competitions and Grand Finale events.'],
                ].map(([title,desc],i)=>(
                  <div key={i} className="flex gap-3 p-3 bg-naija-green-50 rounded-lg border border-naija-green-200">
                    <span className="text-naija-green-600 font-bold flex-shrink-0 mt-0.5">✓</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{title}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Path B */}
          <div className="mb-6 rounded-xl overflow-hidden border-2 border-gray-200">
            <div className="bg-naija-green-600 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-naija-green-100 uppercase tracking-wider">Path B</span>
                <h3 className="text-xl font-bold">Revenue Share</h3>
              </div>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Preferred for Smaller Investors</span>
            </div>
            <div className="p-6 bg-white">
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Investor receives a defined percentage of gross revenue until original capital is recovered, then a reduced ongoing royalty continues. Faster capital recovery with lower equity dilution.
              </p>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-naija-green-600 text-white">
                      {['Phase','Revenue Share','Duration','Trigger'].map((h,i)=>(
                        <th key={i} className="px-4 py-3 text-left font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-naija-green-50">
                      <td className="px-4 py-3 font-bold text-naija-green-700">Capital Recovery</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">30% of gross revenue</td>
                      <td className="px-4 py-3 text-gray-700">Until full capital returned</td>
                      <td className="px-4 py-3 text-gray-700">From Season 1 launch</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-bold text-naija-green-700">Ongoing Royalty</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">10% of gross revenue</td>
                      <td className="px-4 py-3 text-gray-700">Perpetual / 7-year cap</td>
                      <td className="px-4 py-3 text-gray-700">After capital recovered</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-naija-green-50 border border-naija-green-200 rounded-lg p-4 text-sm text-gray-700 italic">
                <strong>Example:</strong> An investor commits ₦100M. Under 30% revenue share on Year 1 projected revenue of ₦380M, the investor receives ₦114M in Year 1 — fully recovering capital with a 14% return in the first year alone, before the ongoing royalty phase begins.
              </div>
            </div>
          </div>

          {/* Path C */}
          <div className="mb-6 rounded-xl overflow-hidden border-2 border-gray-200">
            <div className="bg-gray-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Path C</span>
                <h3 className="text-xl font-bold">Sponsorship ROI</h3>
              </div>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">For Corporate Brand Partners</span>
            </div>
            <div className="p-6 bg-white">
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Corporate sponsors do not receive financial dividends. Their return is measured in brand value, market penetration, and competitive positioning — through the most concentrated access to Nigeria's youth demographic available in any single entertainment platform.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-900 text-white">
                      {['ROI Category','What the Sponsor Receives','Estimated Value'].map((h,i)=>(
                        <th key={i} className={`px-4 py-3 font-semibold ${i<2?'text-left':'text-center'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Media Impressions','TV + streaming + social media combined reach across all platforms','50M – 200M impressions'],
                      ['Brand Association','Alignment with strength, resilience, and Nigerian national excellence','Intangible / high value'],
                      ['Youth Market Access','Direct exposure to the 18–35 demographic across all 6 geopolitical zones','Core buying demographic'],
                      ['Category Exclusivity','No competitor brand in your category for the entire season','Significant competitive edge'],
                      ['Naming Rights','Title sponsor receives brand name embedded in the show title itself','Equivalent to ₦200M+ media buy'],
                      ['Data & Analytics','Audience data, engagement metrics, and brand lift reports post-season','Strategic market intelligence'],
                    ].map((row,i)=>(
                      <tr key={i} className={i%2===0?'bg-white':'bg-gray-50'}>
                        <td className="px-4 py-3 font-bold text-gray-800 text-sm">{row[0]}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm">{row[1]}</td>
                        <td className="px-4 py-3 text-center font-semibold text-naija-green-700 text-sm">{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ROI Summary */}
          <div className="bg-naija-green-50 rounded-xl p-8 border border-naija-green-200">
            <h3 className="font-bold text-gray-900 mb-6 text-xl">Projected Investor ROI at a Glance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-naija-green-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    {['Scenario','Investment','Structure','Year 1 Return','5-Year Return','5-Year ROI'].map((h,i)=>(
                      <th key={i} className="px-4 py-3 text-center font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Lead Investor','₦100M','25% Equity','₦11.5M dividend','₦182M cumulative','182%'],
                    ['Mid Investor','₦50M','10% Equity','₦4.6M dividend','₦72.8M cumulative','146%'],
                    ['Revenue Partner','₦100M','30% Rev Share','₦114M (recovery)','Capital + royalties','140%+'],
                    ['Title Sponsor','₦50M+','Naming Rights','Media equivalent','Brand equity growth','Non-financial'],
                  ].map((row,i)=>(
                    <tr key={i} className={i%2===0?'bg-white':'bg-naija-green-50'}>
                      {row.map((cell,j)=>(
                        <td key={j} className={`px-4 py-3 text-center ${j===0?'font-bold text-gray-900':j===5?'font-bold text-naija-green-700':'text-gray-700'}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3 italic text-center">
              * ROI projections based on conservative 5-year model and do not constitute a guarantee of investment returns.
            </p>
          </div>
        </div>

        {/* Use of Funds */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Use of Investment Funds</h2>
          <div className="bg-naija-green-50 rounded-xl p-8 border border-naija-green-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-6 text-xl flex items-center gap-2">
                  <PieChart className="text-naija-green-600" size={24}/>Series A Allocation (₦500M)
                </h3>
                <div className="space-y-3">
                  {[
                    {c:'Production & Course Build',a:'₦180M',p:'36%',d:'Obstacle design, construction (portable/reusable), event staging across 6 zones'},
                    {c:'Marketing & Brand Building',a:'₦100M',p:'20%',d:'Campaign launch, influencer partnerships, PR and nationwide awareness'},
                    {c:'Operations & Logistics',a:'₦80M',p:'16%',d:'Transportation, crew, event management and staffing across all zones'},
                    {c:'Technology Platform',a:'₦60M',p:'12%',d:'Website, mobile app and streaming platform integration'},
                    {c:'Working Capital',a:'₦50M',p:'10%',d:'Operational buffer, emergency reserve and contestant welfare fund'},
                    {c:'Legal & Compliance',a:'₦30M',p:'6%',d:'Legal counsel, insurance, regulatory compliance and IP protection'},
                  ].map((item,i)=>(
                    <div key={i} className="p-3 bg-white rounded-lg border border-naija-green-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-800 font-semibold text-sm">{item.c}</span>
                        <span className="font-bold text-gray-900 text-sm flex-shrink-0 ml-2">{item.a} <span className="text-xs text-gray-500">({item.p})</span></span>
                      </div>
                      <p className="text-xs text-gray-500">{item.d}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-6 text-xl">Key Milestones</h3>
                <div className="space-y-3">
                  {[
                    {m:'LLC incorporation & legal setup complete',s:'Planned',d:'Q2 2026'},
                    {m:'Trademark strategy & IP protection finalised',s:'Planned',d:'Q2 2026'},
                    {m:'Series A close & partner agreements signed',s:'Planned',d:'Q3 2026'},
                    {m:'Course construction & pilot episode',s:'Planned',d:'Q3 2026'},
                    {m:'Season 1 launch across 6 zones',s:'Planned',d:'Q4 2026'},
                    {m:'National Finals broadcast — Abuja',s:'Planned',d:'Q4 2026'},
                    {m:'Franchise expansion prep — Africa',s:'Future',d:'Q1 2027'},
                    {m:'Season 2 + 2 new African markets',s:'Future',d:'Q2 2027'},
                  ].map((item,i)=>(
                    <div key={i} className="p-3 bg-white rounded-lg border border-naija-green-200">
                      <p className="text-gray-700 text-sm font-medium mb-1">{item.m}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.s==='Planned'?'bg-naija-green-100 text-naija-green-700':'bg-gray-100 text-gray-600'}`}>{item.s}</span>
                        <span className="text-xs text-gray-500">{item.d}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investor Portal */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Series A Terms & Investor Portal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border-2 border-naija-green-200">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Deal Structure</h3>
              <div className="space-y-3 text-sm">
                {[
                  ['Raising Amount','₦500M (~$300K–$350K USD)'],
                  ['Equity Offered','25%'],
                  ['Pre-Money Valuation','₦1.5B'],
                  ['Post-Money Valuation','₦2.0B'],
                  ['Minimum Investment','₦25M'],
                  ['Target Close Date','Q3 2026'],
                  ['Legal Entity','NNW Entertainment Limited (in incorporation)'],
                ].map(([l,v],i)=>(
                  <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-600">{l}</span>
                    <span className="font-bold text-gray-900 text-right ml-4">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Investor Portal Access</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Upon completing their investment, all investors receive secure access to the NNW Investor Portal — a dedicated dashboard providing real-time visibility into their investment.
              </p>
              <ul className="space-y-2 text-sm">
                {[
                  'Live financial metrics — revenue, expenditure, returns by stream',
                  'Operational metrics — contestants, event progress, ticket sales',
                  'Season milestone tracker with live status updates',
                  'Secure document library — agreements, reports, certificates',
                  'Quarterly financial reports (downloadable PDF)',
                  'Direct communication channel with the founding team',
                ].map((item,i)=>(
                  <li key={i} className="flex gap-2 text-gray-700">
                    <span className="text-naija-green-600 font-bold flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Leadership */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Leadership</h2>
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-20 h-20 bg-naija-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="text-naija-green-600" size={36}/>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Fidelis Agba</h3>
                <p className="text-naija-green-600 font-semibold mb-4">Founder & CEO — NNW Entertainment Limited</p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Creator of the Naija Ninja Warrior franchise concept, including the proprietary tactical equipment-based obstacle format. Responsible for brand development, IP strategy, platform architecture, investor relations, and overall business direction. NNW is built from the ground up to be Nigeria's first nationally scaled ninja competition — with the ambition to expand across the African continent.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Brand Strategy','Franchise Development','IP Ownership','Investor Relations','Platform Development'].map((s,i)=>(
                    <span key={i} className="text-xs bg-naija-green-100 text-naija-green-800 px-3 py-1 rounded-full font-medium">{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Advisory and operational team</strong> will be assembled upon close of Series A, drawing from Nigeria's entertainment production, sports management, media broadcasting, and digital technology sectors. Investor input on team composition is welcomed.
              </p>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Risk Factors & Mitigation</h2>
          <div className="space-y-4">
            {[
              {risk:'Market Acceptance', desc:'Ninja-style competition is a new format for Nigerian audiences.',
               mitigation:'Strong youth appetite for athletic entertainment. Pilot episode strategy validates audience demand before full rollout. Social media pre-launch campaign builds audience ahead of Season 1.'},
              {risk:'Sponsorship Revenue', desc:'Reliance on corporate sponsors in an uncertain economic environment.',
               mitigation:'Diversified sponsor target list across telecoms, banks, FMCG, and sportswear. Revenue-share model reduces sponsor risk. Multiple partnership tiers lower the barrier to entry.'},
              {risk:'Operational Complexity', desc:'Running events across 6 geopolitical zones is logistically demanding.',
               mitigation:'Phased rollout — zones run sequentially, not simultaneously. Portable and reusable course design reduces per-zone cost. Experienced production partners contracted before Season 1.'},
              {risk:'Broadcaster Negotiations', desc:'Securing TV deals before Season 1 content is delivered is challenging.',
               mitigation:'Live platform, trademark, and social presence demonstrate credibility. Pilot episode provides content for broadcaster conversations. Digital-first launch reduces dependency on traditional TV.'},
              {risk:'Regulatory & Legal', desc:'NBC compliance, data protection (NDPR), and event liability exposure.',
               mitigation:'Legal counsel being retained for LLC incorporation, contestant waivers, and NBC compliance review. NDPR-compliant data handling on the digital platform from day one.'},
            ].map((item,i)=>(
              <div key={i} className="bg-white rounded-lg p-6 border-2 border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-naija-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="text-naija-green-600" size={16}/>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{item.risk}</h3>
                    <p className="text-sm text-gray-500 mb-2 italic">{item.desc}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <strong className="text-naija-green-700">Mitigation:</strong> {item.mitigation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Invest in Africa's Future?</h2>
            <p className="text-lg text-green-50 mb-8 leading-relaxed">
              NNW is a first-mover opportunity in a proven global format entering an untapped market.
              Contact us directly to receive the full investment deck and begin the conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href="mailto:phyd3lis@gmail.com?subject=Investment Inquiry - Naija Ninja Warrior"
                 className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-naija-green-600 font-bold rounded-full hover:bg-green-50 transition shadow-lg">
                Request Investment Deck <ArrowRight size={16}/>
              </a>
              <Link href="/contact"
                className="inline-block px-8 py-3 bg-naija-green-500 text-white font-bold rounded-full hover:bg-naija-green-400 border-2 border-white transition shadow-lg">
                Schedule a Meeting
              </Link>
            </div>
            <div className="pt-8 border-t border-green-500 text-sm">
              <p className="text-green-100 mb-1">Investor Relations Contact</p>
              <p className="font-bold text-lg mb-1">Fidelis Agba — Founder & CEO</p>
              <p className="text-green-100">
                phyd3lis@gmail.com &nbsp;|&nbsp; Mobile: +234 703 826 4911 &nbsp;|&nbsp; WhatsApp: +234 808 595 2266
              </p>
              <p className="text-green-200 mt-2 text-xs">
                naijaninja.net/investors &nbsp;|&nbsp; naijaninja.net/partners
              </p>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </main>
  )
}