// File: components/sections/nnw/GauntletSection.tsx
'use client'

import { Mountain, Waves, ShieldCheck, Wind, Flame, Zap } from 'lucide-react'
import styles from './nnw.module.css'
import { Reveal } from './hooks'
import { OBSTACLE_META } from './data'

const ICONS = { Mountain, Waves, ShieldCheck, Wind, Flame, Zap } as const

// NOTE: obstacle clear-rate/avg-time stats are static placeholder content -
// no `obstacles` table in the schema yet. Flag if you want this data-driven.
export default function GauntletSection() {
  return (
    <section id="gauntlet" className={styles.section} style={{ background: 'var(--navy)', overflow: 'hidden' }}>
      <span className={styles['ghost-num']} style={{ fontSize: '32vw', bottom: '-14vw', left: '-8vw' }}>06</span>
      <div className={styles.wrap} style={{ position: 'relative' }}>
        <Reveal>
          <div className={styles.eyebrow}><span className={styles['eyebrow-bar']} style={{ background: 'var(--gold)' }} /><span className={styles['eyebrow-text']} style={{ color: 'var(--gold)' }}>The Gauntlet</span></div>
        </Reveal>
        <Reveal delay={60}>
          <h2 className={styles.display} style={{ fontSize: 'clamp(34px,6vw,58px)', color: 'var(--bone)', lineHeight: 0.95, maxWidth: 620 }}>Built from<br />Nigeria&apos;s own ground.</h2>
        </Reveal>

        <div className={`${styles.grid} ${styles['grid-3']}`}>
          {OBSTACLE_META.map((o, i) => {
            const Icon = ICONS[o.icon as keyof typeof ICONS]
            return (
              <Reveal key={o.name} delay={i * 70}>
                <div className={`${styles.card} ${styles.obstacle}`}>
                  <div className={styles['obstacle-photo']}>
                    <Icon size={30} color="rgba(var(--bone-rgb),0.55)" strokeWidth={1.4} />
                    <span className={styles['obstacle-photo-num']}>0{i + 1}</span>
                  </div>
                  <div className={styles['obstacle-body']}>
                    <div className={styles['obstacle-top']}>
                      <div className={styles['obstacle-name']} style={{ marginBottom: 0 }}>{o.name}</div>
                      <span className={styles.mono} style={{ fontSize: 11, color: 'var(--ash)' }}>0{i + 1}/06</span>
                    </div>
                    <p className={styles['obstacle-desc']}>{o.desc}</p>
                    <div className={styles['obstacle-stat-row']}><span>Clear rate</span><span>{o.clear}%</span></div>
                    <div className={styles['bar-track']}><div className={styles['bar-fill']} style={{ width: `${o.clear}%` }} /></div>
                    <div className={styles['obstacle-stat-row']}><span>Avg. clear time</span><span>{o.avg}</span></div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}