'use client'

// File: app/(main)/partners/page.tsx

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, TrendingUp, Globe, DollarSign, Tv, Users, Award, Target, CheckCircle2 } from 'lucide-react'
import styles from '@/components/sections/nnw/nnw.module.css'
import subStyles from '@/components/module/subpage.module.css'
import aStyles from '@/components/module/about.module.css'
import pStyles from '@/components/module/partners.module.css'

const STATS = [
  { value: '220M+', label: 'Potential Audience Reach' },
  { value: '70%', label: 'Youth Under 30 (Prime Demo)' },
  { value: '6 Zones', label: 'Nationwide Coverage' },
]

const WHY_NIGERIA = [
  'Fastest-growing entertainment industry in Africa',
  'Booming TV and streaming consumption with massive youth engagement',
  "Over 70% of population under 30 - the most valuable commercial demographic",
  'First-mover advantage - zero direct competitors in this space',
]

const REVENUE_STREAMS = [
  { icon: <Tv size={22} />, color: 'green', title: 'Broadcast & Streaming', desc: 'Licensing to DSTV, Africa Magic, Netflix, Amazon Prime, and YouTube monetisation' },
  { icon: <DollarSign size={22} />, color: 'gold', title: 'Corporate Sponsorships', desc: 'Premium partnerships with telecoms, banks, beverages, and fitness brands' },
  { icon: <Users size={22} />, color: 'ash', title: 'Merchandising', desc: 'Branded jerseys, sportswear, fitness gear, and licensed merchandise' },
  { icon: <Award size={22} />, color: 'green', title: 'Ticket Sales', desc: 'Live audience tickets for regional competitions and the Grand Finale in Abuja' },
  { icon: <Globe size={22} />, color: 'gold', title: 'Digital Platform', desc: 'Contestant voting, fan subscriptions, and online advertising revenue' },
  { icon: <TrendingUp size={22} />, color: 'ash', title: 'Franchise Expansion', desc: 'Scalable model across Africa under the WLA continental expansion strategy' },
]

const TIERS = [
  {
    tier: 'Title Sponsor', investment: 'Custom Package', highlight: true,
    benefits: ['Exclusive naming rights', 'Prime logo placement on all materials', 'VIP event access across all zones', 'Extensive media coverage', 'Product integration opportunities', 'First right of refusal for future seasons'],
  },
  {
    tier: 'Platinum Partner', investment: 'Premium Tier', highlight: false,
    benefits: ['Category exclusivity', 'Logo on all broadcasts', 'Sponsored segments', 'Social media features', 'Merchandise rights', 'Hospitality packages'],
  },
  {
    tier: 'Gold Partner', investment: 'Standard Tier', highlight: false,
    benefits: ['Logo placement', 'Digital advertising', 'Event signage', 'Social mentions', 'Ticket allocation', 'Brand association'],
  },
]

const WHY_PARTNER = [
  { icon: <Target size={20} />, color: 'green', title: 'First-Mover Positioning', desc: "Be among the founding partners of Africa's first ninja-style sports entertainment platform - with the brand equity that comes from being there from the start." },
  { icon: <Users size={20} />, color: 'gold', title: 'Massive Measurable Reach', desc: 'Access to millions across TV, streaming, and social media with measurable ROI, brand lift metrics, and audience data post-season.' },
  { icon: <Award size={20} />, color: 'ash', title: 'Brand Alignment', desc: 'Associate your brand with strength, resilience, excellence, and Nigerian national pride - values that resonate with an aspirational, upwardly mobile audience.' },
  { icon: <TrendingUp size={20} />, color: 'green', title: 'Long-Term Growth', desc: 'Ground-floor access to a franchise model built for continental expansion. Partners who start with NNW grow with the entire WLA network.' },
]

const PHASES = [
  { phase: 'Phase 1', title: 'Foundation', items: ['WLA incorporated', 'Branding complete', 'Pilot episode'] },
  { phase: 'Phase 2', title: 'Partnerships', items: ['Secure sponsors', 'Media deals', 'Platform launch'] },
  { phase: 'Phase 3', title: 'Competition', items: ['6 regional events', 'Content production', 'Marketing blitz'] },
  { phase: 'Phase 4', title: 'Growth', items: ['Abuja finale', 'Season wrap', 'Africa expansion'] },
]

export default function PartnersPage() {
  return (
    <>
      <header className={subStyles.subhero} style={{ paddingTop: 150 }}>
        <span className={styles['ghost-num']} style={{ fontSize: '24vw', top: '-6vw', right: '-6vw' }}>₦</span>
        <div className={styles.wrap}>
          <div className={subStyles['subhero-badge']}>
            <TrendingUp size={16} color="var(--gold)" />
            <span className={styles.mono} style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>Sponsorship &amp; Partnership</span>
          </div>
          <h1 className={styles.display}>Partner With Us.</h1>
          <p>Sponsorship &amp; partnership opportunities - NNW &amp; WLA Entertainment.</p>
        </div>
      </header>

      <section className={aStyles['a-section']} style={{ background: 'var(--bone)' }}>
        <div className={styles.wrap}>
          {/* WLA Parent Banner */}
          <div className={aStyles['wla-banner']} style={{ marginBottom: 40 }}>
            <div className={aStyles['wla-top']}>
              <div className={aStyles['wla-logo-box']}>
                <Image src="/wla-logo.png" alt="WLA Entertainment Ltd" width={80} height={80} style={{ objectFit: 'contain' }} />
              </div>
              <div>
                <div className={aStyles['wla-eyebrow']}>Operated by</div>
                <div className={aStyles['wla-name']}>WLA Entertainment Ltd</div>
                <div className={aStyles['wla-tag']}>A WLA Entertainment Company · RC No. 9529867</div>
                <p style={{ color: 'rgba(var(--bone-rgb),0.8)', fontSize: 13.5, maxWidth: 520, marginTop: 8 }}>
                  All partnerships and sponsorship agreements are entered into with WLA Entertainment Ltd, the
                  registered operator of Naija Next Warrior.
                </p>
              </div>
            </div>
          </div>

          {/* Hero Statement */}
          <div className={aStyles.statement} style={{ marginBottom: 0 }}>
            <h2>Join Africa&apos;s Biggest Sports Entertainment Platform</h2>
            <p>
              Naija Next Warrior offers unparalleled brand visibility, audience engagement, and market access.
              Partner with WLA Entertainment to reach millions of viewers across Nigeria and Africa while aligning
              your brand with excellence, resilience, and national pride.
            </p>
            <div className={pStyles['stat-grid']}>
              {STATS.map((s) => (
                <div key={s.label} className={pStyles['stat-box']}>
                  <div className={pStyles['stat-box-value']}>{s.value}</div>
                  <div className={pStyles['stat-box-label']}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className={aStyles['a-section']} style={{ background: 'var(--bone)', paddingTop: 0 }}>
        <div className={styles.wrap}>
          <h2 className={`${styles.display} ${aStyles['a-section-title']}`}>Market Opportunity</h2>
          <div className={aStyles['a-grid-2']}>
            <div className={aStyles['a-card']}>
              <h3>Why Nigeria?</h3>
              <ul className={pStyles.checklist}>
                {WHY_NIGERIA.map((item) => (
                  <li key={item}><CheckCircle2 size={15} color="var(--green)" /> {item}</li>
                ))}
              </ul>
            </div>
            <div className={aStyles['a-card']}>
              <h3>Proven Global Model</h3>
              <p>
                Ninja Warrior franchises dominate ratings and attract premium sponsors worldwide. WLA
                Entertainment is bringing this winning format to Africa&apos;s largest market with an authentic
                Nigerian identity and a proprietary competition format that does not exist anywhere else globally.
              </p>
              <div className={pStyles['highlight-box']}>
                <p>Multi-Platform Distribution</p>
                <p>National TV, DSTV, streaming platforms, YouTube, and the NNW digital platform</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Streams */}
      <section className={aStyles['a-section']} style={{ background: 'var(--navy)', paddingTop: 0 }}>
        <div className={styles.wrap}>
          <h2 className={`${styles.display} ${aStyles['a-section-title']}`} style={{ color: 'var(--bone)' }}>Revenue Streams</h2>
          <div className={aStyles['a-grid-3']}>
            {REVENUE_STREAMS.map((r) => (
              <div key={r.title} className={aStyles['a-card']}>
                <div className={`${aStyles['a-card-icon']} ${aStyles[r.color]}`}>{r.icon}</div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Tiers */}
      <section className={aStyles['a-section']} style={{ background: 'var(--bone)' }}>
        <div className={styles.wrap}>
          <h2 className={`${styles.display} ${aStyles['a-section-title']}`}>Partnership Tiers</h2>
          <div className={aStyles['a-grid-3']}>
            {TIERS.map((t) => (
              <div key={t.tier} className={`${pStyles['tier-card']} ${t.highlight ? pStyles.highlight : ''}`}>
                <div className={pStyles['tier-head']}>
                  <h3>{t.tier}</h3>
                  <span>{t.investment}</span>
                </div>
                <div className={pStyles['tier-body']}>
                  <ul>
                    {t.benefits.map((b) => (
                      <li key={b}><CheckCircle2 size={14} color="var(--green)" /> {b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className={aStyles['a-section']} style={{ background: 'var(--bone)', paddingTop: 0 }}>
        <div className={styles.wrap}>
          <h2 className={`${styles.display} ${aStyles['a-section-title']}`}>Why Partner with WLA Entertainment</h2>
          <div className={aStyles['a-grid-2']}>
            {WHY_PARTNER.map((w) => (
              <div key={w.title} className={aStyles['a-card']}>
                <div className={`${aStyles['a-card-icon']} ${aStyles[w.color]}`}>{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Season 1 Execution Plan */}
      <section className={aStyles['a-section']} style={{ background: 'var(--bone)', paddingTop: 0 }}>
        <div className={styles.wrap}>
          <h2 className={`${styles.display} ${aStyles['a-section-title']}`}>Season 1 Execution Plan</h2>
          <div className={pStyles['phase-grid']}>
            {PHASES.map((p) => (
              <div key={p.phase} className={pStyles['phase-card']}>
                <div className={pStyles['phase-label']}>{p.phase}</div>
                <div className={pStyles['phase-title']}>{p.title}</div>
                <ul className={pStyles['phase-items']}>
                  {p.items.map((it) => (
                    <li key={it}><span className={pStyles['phase-dot']} /> {it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.section} style={{ background: 'var(--bone)' }}>
        <div className={styles.wrap}>
          <div className={styles['cta-card']} style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span className={styles['ghost-num']} style={{ fontSize: '18vw', bottom: '-8vw', right: '-2vw' }}>WLA</span>
            <div style={{ position: 'relative', zIndex: 2, maxWidth: 640 }}>
              <div className={styles['cta-title']} style={{ maxWidth: 'none' }}>Let&apos;s Build Something Extraordinary</div>
              <p className={styles['cta-sub']} style={{ maxWidth: 'none', margin: '16px auto 0' }}>
                We invite media partners and corporate sponsors to collaborate on launching Africa&apos;s most
                exciting sports entertainment platform - operated by WLA Entertainment Ltd.
              </p>
              <div className={styles['cta-btns']} style={{ justifyContent: 'center', marginTop: 28 }}>
                <a href="mailto:legal@naijaninja.net?subject=Partnership Inquiry - NNW / WLA Entertainment" className={`${styles.btn} ${styles['btn-gold']}`}>
                  Request Partnership Deck
                </a>
                <Link href="/contact" className={`${styles.btn} ${styles['btn-ghost']}`}>Schedule a Meeting</Link>
              </div>
              <div className={pStyles['cta-contact']}>
                <p>Partnership Inquiries - WLA Entertainment Ltd</p>
                <strong>Fidelis Agba - Founder &amp; CEO</strong>
                <p style={{ marginTop: 4 }}>fidelis@warriorsleague.africa &nbsp;|&nbsp; +234 808 595 2266</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}