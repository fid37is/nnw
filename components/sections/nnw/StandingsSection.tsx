// File: components/sections/nnw/StandingsSection.tsx
'use client'

import styles from './nnw.module.css'
import { Reveal, MoveIcon } from './hooks'
import { STANDINGS, statusColor, statusBg } from './data'

// NOTE: live standings are static placeholder content - no `standings` table
// in the schema yet. Flag if you want this backed by real round results.
export default function StandingsSection() {
  return (
    <section id="standings" className={styles.section} style={{ background: 'var(--green)' }}>
      <div className={styles.wrap}>
        <Reveal>
          <div className={styles.eyebrow}><span className={styles['eyebrow-bar']} style={{ background: 'var(--bone)' }} /><span className={styles['eyebrow-text']} style={{ color: 'rgba(var(--bone-rgb),0.85)' }}>Round 1 · North Central - Live Standings</span></div>
        </Reveal>
        <Reveal delay={60}>
          <h2 className={styles.display} style={{ fontSize: 'clamp(34px,6vw,58px)', color: 'var(--bone)', lineHeight: 0.95, maxWidth: 620 }}>Top 3 advance<br />to the Finale pool.</h2>
        </Reveal>

        <Reveal delay={120}>
          <div className={styles['standings-wrap']}>
            <div className={styles['standings-head']}>
              <span>#</span><span>Warrior</span><span>Time</span><span style={{ justifySelf: 'end' }}>Status</span>
            </div>
            {STANDINGS.map((row) => (
              <div className={styles['standings-row']} key={row.rank}>
                <div className={styles['rank-cell']}><span className={styles['rank-num']}>{row.rank}</span><MoveIcon move={row.move} /></div>
                <span className={styles['standings-name']}>{row.name}</span>
                <span className={`${styles['standings-time']} ${styles.mono}`}>{row.time}</span>
                <span className={styles['status-pill']} style={{ color: statusColor[row.status], background: statusBg[row.status] }}>{row.status}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}