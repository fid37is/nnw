'use client'

// File: app/about/page.tsx

import Link from 'next/link'
import Image from 'next/image'
import { Target, Globe, Award, Users, Building2, ShieldCheck, MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react'
import styles from '@/components/sections/nnw/nnw.module.css'
import subStyles from '@/components/module/subpage.module.css'
import aStyles from '@/components/module/about.module.css'

const CORE_VALUES = [
  {
    icon: <Target size={22} />,
    color: 'green',
    title: 'Strategy',
    desc: 'Every great warrior thinks before they act. We build intelligent, sustainable structures for athletes, productions, and business that stand the test of time.',
  },
  {
    icon: <Award size={22} />,
    color: 'gold',
    title: 'Strength',
    desc: 'Physical and organisational strength define us. From course design to athlete development, we pursue excellence at every level of the competition.',
  },
  {
    icon: <Users size={22} />,
    color: 'ash',
    title: 'Resilience',
    desc: 'The spirit of the warrior is to get back up. We celebrate grit, perseverance, and the courage to keep going - on the course and in life.',
  },
]

const DIFFERENTIATORS = [
  {
    title: 'Nationwide Coverage',
    desc: "We're not just a Lagos or Abuja event. Our competition spans all 6 geopolitical zones, giving every Nigerian the opportunity to compete and showcase their abilities on a national stage.",
  },
  {
    title: 'Cultural Authenticity',
    desc: "While inspired by the global Ninja Warrior format, we've adapted the competition to reflect Nigerian culture, values, and the unique athletic spirit of our people.",
  },
  {
    title: 'Professional Production',
    desc: 'Our competition features world-class course design, professional broadcasting, and comprehensive athlete support to ensure every participant has the best possible experience.',
  },
  {
    title: 'Continental Expansion',
    desc: 'NNW is the first chapter of a larger story. Through WLA Entertainment Ltd, we are building the infrastructure to bring warrior competitions to every corner of Africa.',
  },
]

const WLA_CARDS = [
  {
    title: 'The Parent Company',
    desc: 'WLA Entertainment Ltd (Warrior League Africa) is the registered Nigerian company behind Naija Next Warrior. Incorporated with the Corporate Affairs Commission in May 2026, WLA was purpose-built to own, operate, and grow warrior-format sports entertainment properties across the African continent.',
  },
  {
    title: 'NNW as the First Franchise',
    desc: "Naija Next Warrior is the flagship competition under WLA's umbrella - the first in a planned network of regional warrior leagues. NNW sets the gold standard that future franchises across Africa will be built upon.",
  },
  {
    title: 'The Road to Pan-African',
    desc: "WLA's long-term vision is a continental league - with Nigeria (NNW) as the anchor, and future regional competitions like Ghana Next Warrior (GNW) and others expanding across Africa under the WLA banner.",
  },
  {
    title: 'Legally Backed, Fully Committed',
    desc: 'With an active CAC registration and a principal business scope spanning sports entertainment, media production, broadcasting, and franchise licensing - WLA Entertainment Ltd is built for the long game.',
  },
]

export default function AboutPage() {
  return (
    <>

      <header className={subStyles.subhero} style={{ paddingTop: 132 }}>
        <span className={styles['ghost-num']} style={{ fontSize: '24vw', top: '-6vw', right: '-6vw' }}>NNW</span>
        <div className={styles.wrap}>
          <div className={subStyles['subhero-badge']}>
            <span className={styles.dot} />
            <span className={styles.mono} style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>A WLA Company</span>
          </div>
          <h1 className={styles.display}>About Nigeria&apos;s<br />Next Warrior.</h1>
          <p>Africa&apos;s first ninja competition series - a WLA Entertainment Ltd company.</p>
        </div>
      </header>

      {/* Strategy. Strength. Resilience. */}
      <section className={aStyles['a-section']} style={{ background: 'var(--bone)', paddingBottom: 0 }}>
        <div className={styles.wrap}>
          <div className={aStyles.statement}>
            <h2>Strategy. Strength. Resilience.</h2>
            <p>
              Naija Next Warrior is a groundbreaking national fitness and entertainment challenge, adapted from the
              globally successful Ninja Warrior franchise and tailored for the Nigerian audience. Our competition
              showcases extraordinary athletes across all 6 geopolitical zones, celebrating the resilience,
              determination, and warrior spirit of Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className={aStyles['a-section']} style={{ background: 'var(--bone)' }}>
        <div className={styles.wrap}>
          <h2 className={`${styles.display} ${aStyles['a-section-title']}`}>Our Story</h2>
          <p style={{ color: 'rgba(var(--navy-rgb),0.65)', fontSize: 15, lineHeight: 1.75, maxWidth: 760, marginBottom: 16 }}>
            Naija Next Warrior was born from a vision to create a platform where Nigerians can test their physical
            limits, compete at the highest level, and inspire millions across the continent. We recognised that
            Nigeria, with its young, vibrant population and growing entertainment industry, was the perfect place
            to launch Africa&apos;s first ninja competition series.
          </p>
          <p style={{ color: 'rgba(var(--navy-rgb),0.65)', fontSize: 15, lineHeight: 1.75, maxWidth: 760 }}>
            The global success of Ninja Warrior franchises worldwide proved that audiences crave authentic displays
            of human determination and athletic excellence. We&apos;re bringing that same excitement to Nigeria while
            celebrating our unique culture, diversity, and indomitable spirit - under the umbrella of WLA
            Entertainment Ltd, the company built to take this vision continental.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={aStyles['a-section']} style={{ background: 'var(--bone)', paddingTop: 0 }}>
        <div className={styles.wrap}>
          <div className={aStyles['a-grid-2']}>
            <div className={aStyles['a-card']}>
              <div className={`${aStyles['a-card-icon']} ${aStyles.green}`}><Target size={22} /></div>
              <h3>Our Mission</h3>
              <p>
                To provide a world-class platform where Nigerians can test their physical abilities, compete at the
                highest level, and achieve recognition for their warrior spirit and determination. We inspire
                millions while promoting fitness, perseverance, and national pride.
              </p>
            </div>
            <div className={aStyles['a-card']}>
              <div className={`${aStyles['a-card-icon']} ${aStyles.gold}`}><Globe size={22} /></div>
              <h3>Our Vision</h3>
              <p>
                To build a movement of elite athletes who inspire millions, break barriers, and represent Nigeria on
                the world stage. Through WLA Entertainment Ltd, we envision expanding across Africa - from Nigeria&apos;s
                NNW to a pan-continental league of warrior competitions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className={aStyles['a-section']} style={{ background: 'var(--navy)', paddingTop: 0 }}>
        <div className={styles.wrap}>
          <h2 className={`${styles.display} ${aStyles['a-section-title']}`} style={{ color: 'var(--bone)' }}>Our Core Values</h2>
          <div className={aStyles['a-grid-3']}>
            {CORE_VALUES.map((v) => (
              <div key={v.title} className={aStyles['a-card']}>
                <div className={`${aStyles['a-card-icon']} ${aStyles[v.color]}`}>{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className={aStyles['a-section']} style={{ background: 'var(--navy)', paddingTop: 0 }}>
        <div className={styles.wrap}>
          <h2 className={`${styles.display} ${aStyles['a-section-title']}`} style={{ color: 'var(--bone)' }}>What Makes Us Different</h2>
          <div className={aStyles.differentiators}>
            <div className={aStyles['a-grid-2']} style={{ gap: 28 }}>
              {DIFFERENTIATORS.map((d) => (
                <div key={d.title}>
                  <h3>{d.title}</h3>
                  <p>{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WLA Entertainment Ltd */}
      <section className={aStyles['a-section']} style={{ background: 'var(--bone)' }}>
        <div className={styles.wrap}>
          <div className={aStyles['wla-header']}>
            <Building2 size={28} color="var(--green)" />
            <h2 className={`${styles.display} ${aStyles['a-section-title']}`} style={{ marginBottom: 0 }}>Powered by WLA Entertainment Ltd</h2>
          </div>

          <div className={aStyles['wla-banner']}>
            <div className={aStyles['wla-top']}>
              <div className={aStyles['wla-logo-box']}>
                <Image src="/wla-logo.png" alt="WLA Entertainment Ltd" width={100} height={100} style={{ objectFit: 'contain' }} />
              </div>
              <div>
                <div className={aStyles['wla-eyebrow']}>Umbrella Company</div>
                <div className={aStyles['wla-name']}>WLA Entertainment Ltd</div>
                <div className={aStyles['wla-tag']}>Warrior League Africa - Building Africa&apos;s Sports Entertainment Future</div>
                <div className={aStyles['wla-badge-row']}>
                  <span className={`${aStyles['wla-badge']} ${aStyles.gold}`}><ShieldCheck size={12} /> CAC Registered · RC No. 9529867</span>
                  <span className={`${aStyles['wla-badge']} ${aStyles.green}`}><span className={styles.dot} style={{ width: 6, height: 6 }} /> Active · Est. May 2026</span>
                </div>
              </div>
            </div>

            <div className={aStyles['wla-strip']}>
              <div>
                <div className={aStyles['wla-strip-label']}>Registered Address</div>
                <div className={aStyles['wla-strip-row']}>
                  <MapPin size={14} color="var(--gold)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span className={aStyles['wla-strip-text']}>Flat 7, Progress House, Oduke, Asaba, Delta State, Nigeria</span>
                </div>
              </div>
              <div>
                <div className={aStyles['wla-strip-label']}>Contact</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <a href="mailto:hello@warriorsleague.africa" className={aStyles['wla-strip-text']}><Mail size={13} color="var(--gold)" /> hello@warriorsleague.africa</a>
                  <a href="tel:+2348085952266" className={aStyles['wla-strip-text']}><Phone size={13} color="var(--gold)" /> +234 808 595 2266</a>
                </div>
              </div>
              <div>
                <div className={aStyles['wla-strip-label']}>Business Scope</div>
                <span className={aStyles['wla-strip-text']}>Sports Entertainment · Broadcasting · Franchise Licensing · Talent Management · Digital Platforms</span>
              </div>
            </div>
          </div>

          <div className={aStyles['a-grid-2']}>
            {WLA_CARDS.map((c) => (
              <div key={c.title} className={aStyles['a-card']}>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - reuses the same .cta-card component as the home page */}
      <section className={styles.section} style={{ background: 'var(--bone)' }}>
        <div className={styles.wrap}>
          <div className={styles['cta-card']}>
            <span className={styles['ghost-num']} style={{ fontSize: '18vw', bottom: '-8vw', right: '-2vw' }}>NNW</span>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div className={styles['cta-title']}>Join the Movement</div>
              <p className={styles['cta-sub']}>
                Whether you&apos;re an aspiring competitor, a fitness enthusiast, or someone looking to support
                Nigerian excellence, there&apos;s a place for you in the Naija Next Warrior community - powered by
                WLA Entertainment Ltd.
              </p>
            </div>
            <div className={styles['cta-btns']}>
              <Link href="/register" className={`${styles.btn} ${styles['btn-gold']}`}>Apply as Competitor <ArrowUpRight size={16} /></Link>
              <Link href="/contact" className={`${styles.btn} ${styles['btn-ghost']}`}>Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}