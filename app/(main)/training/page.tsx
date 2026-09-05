'use client'

// File: app/training/page.tsx

import Link from 'next/link'
import { Dumbbell, Users, Award, Mail, ArrowUpRight, CheckCircle } from 'lucide-react'
import styles from '@/components/sections/nnw/nnw.module.css'
import subStyles from '@/components/module/subpage.module.css'
import aStyles from '@/components/module/about.module.css'

const FEATURES = [
  { icon: <Users size={22} />, color: 'green', title: 'Expert Coaches', desc: 'Certified trainers with competition experience.' },
  { icon: <Dumbbell size={22} />, color: 'gold', title: 'Full Equipment', desc: 'Competition-grade obstacles and training gear.' },
  { icon: <Award size={22} />, color: 'ash', title: 'Structured Programs', desc: 'From beginner to elite competition preparation.' },
]

const PROGRAMS = [
  { title: 'Beginner Program', duration: '8 weeks',
    desc: 'Build foundational strength, learn basic ninja techniques, and develop proper form.',
    includes: ['3 sessions per week', 'Basic obstacle training', 'Strength fundamentals', 'Flexibility work'] },
  { title: 'Competition Prep', duration: '12 weeks',
    desc: 'Intensive training designed specifically for competition readiness and peak performance.',
    includes: ['5 sessions per week', 'Advanced obstacles', 'Competition simulation', 'Mental preparation'] },
  { title: 'Youth Development', duration: 'Ongoing',
    desc: 'Age-appropriate training for young athletes (13-17) focusing on skill development and character.',
    includes: ['2-3 sessions per week', 'Age-appropriate obstacles', 'Supervised training', 'Character building'] },
  { title: 'Elite Athlete', duration: 'Custom',
    desc: 'Personalized programming for advanced competitors seeking championship-level performance.',
    includes: ['Custom schedule', 'One-on-one coaching', 'Video analysis', 'Nutrition planning'] },
]

const FIRST_VISIT = [
  'Facility tour and safety orientation',
  'Fitness assessment and goal setting',
  'Introduction to basic obstacles',
  'Personalized training plan development',
]

const WHAT_TO_BRING = [
  'Comfortable athletic wear',
  'Proper training shoes (no sandals)',
  'Water bottle and towel',
  'Positive attitude and determination',
]

export default function TrainingPage() {
  return (
    <>

      {/* Header */}
      <header className={subStyles.subhero} style={{ paddingTop: 132 }}>
        <span className={styles['ghost-num']} style={{ fontSize: '24vw', top: '-6vw', right: '-6vw' }}>NNW</span>
        <div className={styles.wrap}>
          <div className={subStyles['subhero-badge']}>
            <span className={styles.dot} />
            <span className={styles.mono} style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>Certified Facilities</span>
          </div>
          <h1 className={styles.display}>Training<br />Centers.</h1>
          <p>Official NNW certified facilities across Nigeria.</p>
        </div>
      </header>

      {/* Train Like a Warrior */}
      <section className={aStyles['a-section']} style={{ background: 'var(--bone)', paddingBottom: 0 }}>
        <div className={styles.wrap}>
          <div className={aStyles.statement}>
            <h2>Train Like a Warrior</h2>
            <p>
              NNW is building a nationwide network of certified training centers - purpose-built for
              ninja-style competition prep, strength development, and athletic excellence. Each facility
              will feature competition-grade obstacles, professional coaching, and structured programs for
              all levels.
            </p>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className={aStyles['a-section']} style={{ background: 'var(--bone)' }}>
        <div className={styles.wrap}>
          <div className={aStyles['a-grid-3']}>
            {FEATURES.map((f) => (
              <div key={f.title} className={aStyles['a-card']}>
                <div className={`${aStyles['a-card-icon']} ${aStyles[f.color]}`}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find a Center - coming soon */}
      <section className={aStyles['a-section']} style={{ background: 'var(--bone)', paddingTop: 0 }}>
        <div className={styles.wrap}>
          <h2 className={`${styles.display} ${aStyles['a-section-title']}`}>Find a Center Near You</h2>
          <div style={{ background: 'rgba(11,92,46,0.03)', border: '1px solid var(--line)', borderRadius: 3, padding: '56px 32px', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 10, background: 'rgba(11,92,46,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Dumbbell size={26} color="var(--green)" />
            </div>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>Locations Being Confirmed</h3>
            <p style={{ maxWidth: 480, margin: '0 auto 28px' }}>
              Official NNW training centers are currently being certified across all six geopolitical zones.
              Locations will be published as they are confirmed.
            </p>
            <a href="mailto:training@naijaninja.net" className={`${styles.btn} ${styles['btn-gold']}`}>
              <Mail size={16} /> Get Notified When Available
            </a>
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section className={aStyles['a-section']} style={{ background: 'var(--navy)', paddingTop: 0 }}>
        <div className={styles.wrap}>
          <h2 className={`${styles.display} ${aStyles['a-section-title']}`} style={{ color: 'var(--bone)' }}>Training Programs</h2>
          <div className={aStyles['a-grid-2']}>
            {PROGRAMS.map((p) => (
              <div key={p.title} className={aStyles['a-card']}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
                  <h3 style={{ marginBottom: 0 }}>{p.title}</h3>
                  <span className={styles.mono} style={{ fontSize: 10.5, textTransform: 'uppercase', color: 'var(--green)', background: 'rgba(11,92,46,0.1)', padding: '4px 11px', borderRadius: 20, flexShrink: 0 }}>{p.duration}</span>
                </div>
                <p style={{ marginBottom: 16 }}>{p.desc}</p>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
                  <p className={styles.mono} style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(var(--navy-rgb),0.4)', marginBottom: 10 }}>Includes</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {p.includes.map((item) => (
                      <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'rgba(var(--navy-rgb),0.65)' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className={aStyles['a-section']} style={{ background: 'var(--bone)' }}>
        <div className={styles.wrap}>
          <h2 className={`${styles.display} ${aStyles['a-section-title']}`}>What to Expect</h2>
          <div className={aStyles['a-grid-2']}>
            <div className={aStyles['a-card']}>
              <h3>Your First Visit</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {FIRST_VISIT.map((item, i) => (
                  <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span className={styles.mono} style={{ color: 'var(--green)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{i + 1}.</span>
                    <span style={{ fontSize: 14, color: 'rgba(var(--navy-rgb),0.65)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={aStyles['a-card']}>
              <h3>What to Bring</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {WHAT_TO_BRING.map((item) => (
                  <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <CheckCircle size={15} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 14, color: 'rgba(var(--navy-rgb),0.65)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.section} style={{ background: 'var(--bone)' }}>
        <div className={styles.wrap}>
          <div className={styles['cta-card']}>
            <span className={styles['ghost-num']} style={{ fontSize: '18vw', bottom: '-8vw', right: '-2vw' }}>NNW</span>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div className={styles['cta-title']}>Start Your Journey</div>
              <p className={styles['cta-sub']}>
                Register for the competition while we finalise training center locations. Our team will
                keep you updated as facilities come online near you.
              </p>
            </div>
            <div className={styles['cta-btns']}>
              <Link href="/register" className={`${styles.btn} ${styles['btn-gold']}`}>Register for Competition <ArrowUpRight size={16} /></Link>
              <Link href="/contact" className={`${styles.btn} ${styles['btn-ghost']}`}>Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
