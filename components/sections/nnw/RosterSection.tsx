// File: components/sections/nnw/RosterSection.tsx
'use client'

import styles from './nnw.module.css'
import { Reveal } from './hooks'
import { DEMO_ROSTER, initials } from './data'
import { Champion, Runner, RosterCard } from './types'

interface RosterSectionProps {
  champion: Champion | null
  runners: Runner[]
}

export default function RosterSection({ champion, runners }: RosterSectionProps) {
  const cards: RosterCard[] = champion || runners.length
    ? [
        ...(champion ? [{ bib: '001', name: champion.full_name, zone: 'Champion', event: 'Season Champion', pr: champion.final_points ? `${champion.final_points} pts` : '-', init: initials(champion.full_name) }] : []),
        ...runners.map((r, i) => ({ bib: String(i + 2).padStart(3, '0'), name: r.full_name, zone: `Position ${r.position}`, event: '-', pr: '-', init: initials(r.full_name) })),
      ]
    : DEMO_ROSTER.map((r) => ({ ...r, zone: `${r.zone} Zone` }))

  return (
    <section id="roster" className={styles.section} style={{ background: 'var(--bone)' }}>
      <div className={styles.wrap}>
        <Reveal>
          <div className={styles.eyebrow}><span className={styles['eyebrow-bar']} style={{ background: 'var(--green)' }} /><span className={styles['eyebrow-text']} style={{ color: 'var(--green)' }}>Warriors to Watch</span></div>
        </Reveal>
        <Reveal delay={60}>
          <h2 className={styles.display} style={{ fontSize: 'clamp(34px,6vw,58px)', lineHeight: 0.95, maxWidth: 620 }}>Confirmed for<br />Season 1.</h2>
        </Reveal>

        <div className={`${styles.grid} ${styles['grid-4']}`}>
          {cards.map((r, i) => (
            <Reveal key={r.bib} delay={i * 80}>
              <div className={`${styles.card} ${styles.roster}`}>
                <div className={styles['roster-head']}>
                  <span className={styles['roster-init']}>{r.init}</span>
                  <span className={`${styles['roster-bib']} ${styles.mono}`}>BIB {r.bib}</span>
                </div>
                <div className={styles['roster-body']}>
                  <div className={styles['roster-name']}>{r.name}</div>
                  <div className={styles['roster-zone']}>{r.zone}</div>
                  <div className={styles['roster-row']}><span>Best event</span><span>{r.event}</span></div>
                  <div className={`${styles['roster-row']} ${styles.pr}`}><span>PR</span><span>{r.pr}</span></div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}