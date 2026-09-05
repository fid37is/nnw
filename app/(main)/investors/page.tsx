'use client'

// File: app/investors/page.tsx

import Link from 'next/link'
import Image from 'next/image'
import {
  TrendingUp, Target, Users, Globe, Award, DollarSign, Tv,
  ShoppingBag, Smartphone, CheckCircle, ArrowUpRight, ShieldCheck,
  Mail, Phone, FileText,
} from 'lucide-react'
import styles from '@/components/sections/nnw/nnw.module.css'
import subStyles from '@/components/module/subpage.module.css'
import aStyles from '@/components/module/about.module.css'

const HEADLINE_STATS = [
  { value: '220M+', label: 'Addressable Audience' },
  { value: '70%', label: 'Population Under 30' },
  { value: 'Q4 2026', label: 'Season 1 Launch' },
  { value: '6', label: 'Geopolitical Zones' },
]

const INVESTMENT_THESIS = [
  { icon: <Globe size={22} />, color: 'green', title: 'First-Mover Advantage',
    desc: "Zero direct competitors in African ninja-style sports entertainment. NNW enters an untapped market with a proven global format adapted for the world's youngest major economy." },
  { icon: <Users size={22} />, color: 'gold', title: 'Massive Youth Demographic',
    desc: "70% of Nigeria's 220M+ population is under 30 - precisely the demographic that drives streaming, social media engagement, and live event attendance." },
  { icon: <TrendingUp size={22} />, color: 'ash', title: 'Proven Global Model',
    desc: 'American Ninja Warrior generates $100M+ annually. NNW replicates this formula with Nigerian identity and a proprietary tactical obstacle format that does not exist anywhere else globally.' },
  { icon: <Target size={22} />, color: 'green', title: 'Multi-Revenue Architecture',
    desc: 'Broadcasting, sponsorship, ticketing, merchandise, digital platforms, and franchise licensing create diversified, season-on-season compounding revenue streams.' },
]

const MARKET_SIZE = [
  ['Nigeria Entertainment Market', '$7.2B (2024), growing 15% YoY'],
  ['African Fitness Industry', '$2.3B addressable market'],
  ['Sports Broadcasting - Nigeria', '$850M annual market'],
  ['Digital Streaming - Sub-Saharan Africa', '45% annual growth'],
  ['Direct NNW Competitors in Africa', 'Zero - absolute first-mover'],
]

const COMPETITIVE_ADVANTAGE = [
  'Zero direct competitors in African ninja entertainment',
  'Proprietary tactical obstacle format - not replicated globally',
  'Live website, contestant platform, and CAC-registered entity already in place',
  'Scalable franchise model designed for continental expansion under WLA',
]

const REVENUE_STREAMS = [
  { icon: <DollarSign size={20} />, color: 'gold', stream: 'Sponsorships',
    desc: 'Title sponsor, category sponsors (telecoms, banks, beverages, sportswear), and product placement across all events and digital platforms.' },
  { icon: <Tv size={20} />, color: 'green', stream: 'Broadcast & Streaming Rights',
    desc: 'Licensing to DSTV, Africa Magic, Channels TV, Netflix Africa, Amazon Prime Video, and YouTube monetisation.' },
  { icon: <Users size={20} />, color: 'ash', stream: 'Ticket Sales & Live Events',
    desc: '6 zonal events plus Grand Finale in Abuja. Includes vendor booth fees and hospitality packages.' },
  { icon: <CheckCircle size={20} />, color: 'gold', stream: 'Registration Fees',
    desc: 'Free registration for all applicants. Only approved contestants pay a participation token, ensuring commitment and filtering.' },
  { icon: <ShoppingBag size={20} />, color: 'green', stream: 'Merchandise',
    desc: 'Branded apparel, sportswear, accessories, and fitness gear sold online and at all competition events.' },
  { icon: <Smartphone size={20} />, color: 'ash', stream: 'Digital Platform',
    desc: 'Fan subscriptions, in-app advertising, and social media brand deals via the NNW digital platform and channels.' },
  { icon: <Globe size={20} />, color: 'gold', stream: 'Franchise Licensing',
    desc: 'Licensing the NNW format and WLA brand to other African markets under the continental expansion model, from Season 3 onward.' },
]

const PATHS = [
  { label: 'Path A', name: 'Equity Ownership', tag: 'For Lead Investors',
    desc: 'Investor acquires equity in WLA Entertainment Ltd. As the company grows, equity appreciates in value, with returns through profit distributions and, ultimately, an exit event.',
    benefits: ['Pro-rata profit distributions from Season 1 onward', 'Board representation for lead investors', 'Anti-dilution protection in future rounds', 'Priority participation rights in Series B'] },
  { label: 'Path B', name: 'Revenue Share', tag: 'For Smaller Investors',
    desc: 'Investor receives a defined percentage of gross revenue until original capital is recovered, then a reduced ongoing royalty continues - faster capital recovery with lower equity dilution.',
    benefits: ['Revenue share from Season 1 launch', 'Reduced ongoing royalty after capital recovery', 'No board seat or governance obligations', 'Lower minimum commitment than equity path'] },
]

const MILESTONES = [
  { m: 'WLA Entertainment Ltd incorporated - CAC registered', s: 'Completed', d: 'May 2026' },
  { m: 'Trademark strategy & IP protection finalised', s: 'Planned', d: 'Q2 2026' },
  { m: 'Series A close & partner agreements signed', s: 'Planned', d: 'Q3 2026' },
  { m: 'Course construction & pilot episode', s: 'Planned', d: 'Q3 2026' },
  { m: 'Season 1 launch across 6 zones', s: 'Planned', d: 'Q4 2026' },
  { m: 'National Finals broadcast - Abuja', s: 'Planned', d: 'Q4 2026' },
  { m: 'Franchise expansion prep - Africa', s: 'Future', d: 'Q1 2027' },
  { m: 'Season 2 + new African markets', s: 'Future', d: 'Q2 2027' },
]

const PORTAL_FEATURES = [
  'Live financial metrics - revenue, expenditure, returns by stream',
  'Operational metrics - contestants, event progress, ticket sales',
  'Season milestone tracker with live status updates',
  'Secure document library - agreements, reports, certificates',
  'Quarterly financial reports (downloadable PDF)',
  'Direct communication channel with the founding team',
]

export default function InvestorsPage() {
  return (
    <>

      {/* Header */}
      <header className={subStyles.subhero} style={{ paddingTop: 132 }}>
        <span className={styles['ghost-num']} style={{ fontSize: '24vw', top: '-6vw', right: '-6vw' }}>NNW</span>
        <div className={styles.wrap}>
          <div className={subStyles['subhero-badge']}>
            <span className={styles.dot} />
            <span className={styles.mono} style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>Series A Open</span>
          </div>
          <h1 className={styles.display}>Investor<br />Relations.</h1>
          <p>Investment opportunity in Africa&apos;s premier sports entertainment platform.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 24, maxWidth: 620, marginTop: 44, paddingTop: 26, borderTop: '1px solid var(--line-dark)' }}>
            {HEADLINE_STATS.map((s) => (
              <div key={s.label}>
                <div className={styles['stat-label']}>{s.label}</div>
                <div className={styles['stat-value']}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Executive Summary */}
      <section className={aStyles['a-section']} style={{ background: 'var(--bone)', paddingBottom: 0 }}>
        <div className={styles.wrap}>
          <div className={aStyles.statement}>
            <h2>A Scalable, Multi-Revenue Business</h2>
            <p>
              Naija Next Warrior (NNW) is Nigeria&apos;s first national-scale physical challenge competition
              franchise, operated by WLA Entertainment Ltd. Running across all six geopolitical zones with a
              Grand Finale in Abuja, NNW combines live sports entertainment, digital media, and cultural identity
              into a scalable, multi-revenue business built for both local dominance and continental expansion.
            </p>
          </div>
        </div>
      </section>

      {/* Company & Leadership - grouped together: who the entity is, who runs it */}
      <section className={aStyles['a-section']} style={{ background: 'var(--bone)' }}>
        <div className={styles.wrap}>
          <div className={aStyles['wla-header']}>
            <ShieldCheck size={28} color="var(--green)" />
            <h2 className={`${styles.display} ${aStyles['a-section-title']}`} style={{ marginBottom: 0 }}>Parent Company &amp; Legal Entity</h2>
          </div>

          <div className={aStyles['wla-banner']}>
            <div className={aStyles['wla-top']}>
              <div className={aStyles['wla-logo-box']}>
                <Image src="/wla-logo.png" alt="WLA Entertainment Ltd" width={100} height={100} style={{ objectFit: 'contain' }} />
              </div>
              <div>
                <div className={aStyles['wla-eyebrow']}>Parent Company &amp; Legal Entity</div>
                <div className={aStyles['wla-name']}>WLA Entertainment Ltd</div>
                <div className={aStyles['wla-tag']}>Naija Next Warrior is the flagship property of WLA Entertainment Ltd - a CAC-registered company built to own, operate, and expand warrior-format sports entertainment across Africa.</div>
                <div className={aStyles['wla-badge-row']}>
                  <span className={`${aStyles['wla-badge']} ${aStyles.gold}`}><ShieldCheck size={12} /> CAC Registered · RC No. 9529867</span>
                  <span className={`${aStyles['wla-badge']} ${aStyles.green}`}><span className={styles.dot} style={{ width: 6, height: 6 }} /> Incorporated May 2026</span>
                </div>
                <a
                  href="https://warriorsleague.africa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.btn} ${styles['btn-ghost']}`}
                  style={{ marginTop: 20, padding: '10px 20px', fontSize: 11.5 }}
                >
                  Visit warriorsleague.africa <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>

          <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: 18, textTransform: 'uppercase', margin: '40px 0 18px' }}>Leadership</h3>
          <div className={aStyles['a-card']}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(11,92,46,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Award size={30} color="var(--green)" />
              </div>
              <div style={{ flex: 1, minWidth: 240 }}>
                <h3 style={{ fontSize: 20 }}>Fidelis Agba</h3>
                <p style={{ color: 'var(--green)', fontWeight: 700, fontSize: 13.5, margin: '2px 0 12px' }}>Founder &amp; CEO - WLA Entertainment Ltd</p>
                <p style={{ marginBottom: 14 }}>
                  Founder of WLA Entertainment Ltd and creator of the Naija Next Warrior franchise, including the proprietary tactical obstacle format. Responsible for brand development, IP strategy, platform architecture, investor relations, and overall business direction.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['Brand Strategy', 'Franchise Development', 'IP Ownership', 'Investor Relations', 'Platform Development'].map((s) => (
                    <span key={s} className={styles.mono} style={{ fontSize: 10.5, textTransform: 'uppercase', background: 'rgba(11,92,46,0.1)', color: 'var(--green)', padding: '5px 11px', borderRadius: 20 }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Thesis */}
      <section className={aStyles['a-section']} style={{ background: 'var(--navy)', paddingTop: 36 }}>
        <div className={styles.wrap}>
          <h2 className={`${styles.display} ${aStyles['a-section-title']}`} style={{ color: 'var(--bone)' }}>Investment Thesis</h2>
          <div className={aStyles['a-grid-2']}>
            {INVESTMENT_THESIS.map((item) => (
              <div key={item.title} className={aStyles['a-card']}>
                <div className={`${aStyles['a-card-icon']} ${aStyles[item.color]}`}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className={aStyles['a-section']} style={{ background: 'var(--bone)' }}>
        <div className={styles.wrap}>
          <h2 className={`${styles.display} ${aStyles['a-section-title']}`}>Market Opportunity</h2>
          <div style={{ background: 'rgba(11,92,46,0.04)', border: '1px solid rgba(11,92,46,0.15)', borderRadius: 3, padding: 36 }}>
            <div className={aStyles['a-grid-2']} style={{ gap: 28 }}>
              <div>
                <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: 16, textTransform: 'uppercase', color: 'var(--navy)', marginBottom: 4 }}>Market Size</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {MARKET_SIZE.map(([l, v]) => (
                    <li key={l} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(var(--navy-rgb),0.7)' }}>
                      <span style={{ color: 'var(--green)', flexShrink: 0 }}>•</span>
                      <span><strong style={{ color: 'var(--navy)' }}>{l}:</strong> {v}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: 16, textTransform: 'uppercase', color: 'var(--navy)', marginBottom: 4 }}>Competitive Advantage</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {COMPETITIVE_ADVANTAGE.map((item) => (
                    <li key={item} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(var(--navy-rgb),0.7)' }}>
                      <CheckCircle size={15} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <p style={{ marginTop: 20, fontSize: 12.5, color: 'rgba(var(--navy-rgb),0.45)', fontStyle: 'italic' }}>
            Full TAM/SAM/SOM sizing and 5-year financial model are included in the investment deck.
          </p>
        </div>
      </section>

      {/* Revenue Model */}
      <section className={aStyles['a-section']} style={{ background: 'var(--bone)', paddingTop: 0 }}>
        <div className={styles.wrap}>
          <h2 className={`${styles.display} ${aStyles['a-section-title']}`} style={{ marginBottom: 8 }}>Revenue Model</h2>
          <p style={{ color: 'rgba(var(--navy-rgb),0.6)', fontSize: 14.5, marginBottom: 36 }}>Seven distinct, compounding income streams across all seasons.</p>

          <div className={aStyles['a-grid-3']}>
            {REVENUE_STREAMS.map((item) => (
              <div key={item.stream} className={aStyles['a-card']}>
                <div className={`${aStyles['a-card-icon']} ${aStyles[item.color]}`}>{item.icon}</div>
                <h3>{item.stream}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 24, fontSize: 12.5, color: 'rgba(var(--navy-rgb),0.45)', fontStyle: 'italic' }}>
            Year-by-year revenue, margin, and profit projections are included in the investment deck.
          </p>
        </div>
      </section>

      {/* How Investors Earn Returns */}
      <section className={aStyles['a-section']} style={{ background: 'var(--navy)' }}>
        <div className={styles.wrap}>
          <h2 className={`${styles.display} ${aStyles['a-section-title']}`} style={{ color: 'var(--bone)', marginBottom: 8 }}>How Investors Earn Returns</h2>
          <p style={{ color: 'var(--ash)', fontSize: 14.5, marginBottom: 32 }}>
            Two structured pathways, governed by formal agreements prepared by legal counsel. Exact terms -
            valuation, equity offered, minimum investment, and revenue-share percentages - are shared in the
            investment deck upon request.
          </p>

          <div className={aStyles['a-grid-2']}>
            {PATHS.map((p) => (
              <div key={p.label} className={aStyles['a-card']}>
                <span className={styles.mono} style={{ fontSize: 10.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--green)' }}>{p.label} · {p.tag}</span>
                <h3 style={{ marginTop: 6 }}>{p.name}</h3>
                <p style={{ marginBottom: 14 }}>{p.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {p.benefits.map((b) => (
                    <li key={b} style={{ display: 'flex', gap: 8, fontSize: 12.5 }}>
                      <CheckCircle size={14} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Investor Portal - grouped here since it's part of how the deal is tracked, not a separate topic */}
          <div className={aStyles['a-card']} style={{ marginTop: 20 }}>
            <h3>Investor Portal Access</h3>
            <p style={{ marginBottom: 14 }}>
              Once your investment is confirmed, you receive secure access to the NNW Investor Portal - a
              dedicated dashboard providing real-time visibility into your investment.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {PORTAL_FEATURES.map((item) => (
                <li key={item} style={{ display: 'flex', gap: 9, fontSize: 13 }}>
                  <CheckCircle size={15} color="var(--green)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ color: 'rgba(var(--navy-rgb),0.65)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p style={{ marginTop: 24, fontSize: 13, color: 'var(--ash)' }}>
            Looking to partner as a brand or sponsor instead? Visit{' '}
            <Link href="/partners" style={{ color: 'var(--gold)', fontWeight: 600 }}>Partners &amp; Sponsors</Link>.
          </p>
        </div>
      </section>

      {/* Roadmap - placed right before the CTA as the natural "what's next" beat */}
      <section className={aStyles['a-section']} style={{ background: 'var(--bone)' }}>
        <div className={styles.wrap}>
          <h2 className={`${styles.display} ${aStyles['a-section-title']}`}>Key Milestones</h2>
          <div className={aStyles['a-grid-2']}>
            {MILESTONES.map((item) => (
              <div key={item.m} className={aStyles['a-card']} style={{ padding: 20 }}>
                <p style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 8, color: 'var(--navy)' }}>{item.m}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={styles.mono} style={{
                    fontSize: 10, textTransform: 'uppercase', padding: '3px 9px', borderRadius: 20, fontWeight: 700,
                    background: item.s === 'Completed' ? 'rgba(11,92,46,0.12)' : item.s === 'Planned' ? 'rgba(219,164,35,0.15)' : 'rgba(var(--navy-rgb),0.06)',
                    color: item.s === 'Completed' ? 'var(--green)' : item.s === 'Planned' ? 'var(--amber)' : 'rgba(var(--navy-rgb),0.5)',
                  }}>{item.s}</span>
                  <span style={{ fontSize: 11.5, color: 'rgba(var(--navy-rgb),0.45)' }}>{item.d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.section} style={{ background: 'var(--bone)' }}>
        <div className={styles.wrap}>
          <div className={styles['cta-card']}>
            <span className={styles['ghost-num']} style={{ fontSize: '18vw', bottom: '-8vw', right: '-2vw' }}>NNW</span>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div className={styles['cta-title']}>Ready to Invest in Africa&apos;s Future?</div>
              <p className={styles['cta-sub']}>
                Request the full investment deck for deal structure, valuation, 5-year financial projections,
                and complete risk disclosures - shared directly with prospective investors.
              </p>
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--line-dark)' }}>
                <p style={{ color: 'var(--ash)', fontSize: 12.5, marginBottom: 2 }}>Investor Relations - WLA Entertainment Ltd</p>
                <p style={{ color: 'var(--bone)', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Fidelis Agba - Founder &amp; CEO</p>
                <p style={{ color: 'var(--ash)', fontSize: 12.5, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={12} /> fidelis@warriorsleague.africa</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={12} /> +234 808 595 2266</span>
                </p>
              </div>
            </div>
            <div className={styles['cta-btns']}>
              <a href="mailto:legal@naijaninja.net?subject=Investment Deck Request - NNW / WLA Entertainment" className={`${styles.btn} ${styles['btn-gold']}`}>Request Investment Deck <FileText size={16} /></a>
              <Link href="/contact" className={`${styles.btn} ${styles['btn-ghost']}`}>Schedule a Meeting</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}