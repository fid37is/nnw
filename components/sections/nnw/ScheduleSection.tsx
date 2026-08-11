// File: components/sections/nnw/ScheduleSection.tsx
'use client'

import { MapPin } from 'lucide-react'
import styles from './nnw.module.css'
import { Reveal } from './hooks'
import { ROUNDS } from './data'

export default function ScheduleSection() {
  return (
    <section className={styles.section} style={{ background: 'var(--navy)' }}>
      <div className={styles.wrap}>
        <Reveal>
          <div className={styles.eyebrow}><span className={styles['eyebrow-bar']} style={{ background: 'var(--gold)' }} /><span className={styles['eyebrow-text']} style={{ color: 'var(--gold)' }}>Season 1 Schedule</span></div>
        </Reveal>
        <Reveal delay={60}>
          <h2 className={styles.display} style={{ fontSize: 'clamp(34px,6vw,58px)', color: 'var(--bone)', lineHeight: 0.95, maxWidth: 620 }}>Same arena.<br />Six rounds.</h2>
        </Reveal>
        <div className={`${styles.grid} ${styles['grid-3']}`}>
          {ROUNDS.map((r, i) => (
            <Reveal key={r.n} delay={i * 70}>
              <div className={styles['round-card']}>
                <div>
                  <div className={styles['round-eyebrow']}>Round {r.n} of 06</div>
                  <div className={styles['round-zone']}>{r.zone}</div>
                  <div className={styles['round-date']}>{r.date}, 2027</div>
                </div>
                <MapPin size={16} color="rgba(var(--bone-rgb),0.4)" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}