// File: components/sections/nnw/RewardsSection.tsx
'use client'

import styles from './nnw.module.css'
import { Reveal } from './hooks'
import { REWARDS } from './data'

export default function RewardsSection() {
  return (
    <section id="rewards" className={styles.section} style={{ background: 'var(--bone)' }}>
      <div className={styles.wrap}>
        <Reveal>
          <div className={styles.eyebrow}><span className={styles['eyebrow-bar']} style={{ background: 'var(--green)' }} /><span className={styles['eyebrow-text']} style={{ color: 'var(--green)' }}>Rewards Ladder</span></div>
        </Reveal>
        <Reveal delay={60}>
          <h2 className={styles.display} style={{ fontSize: 'clamp(34px,6vw,58px)', lineHeight: 0.95, maxWidth: 620 }}>Every step up<br />is earned.</h2>
        </Reveal>

        <div className={`${styles.grid} ${styles['grid-2']}`} style={{ gridTemplateColumns: '1fr' }}>
          {REWARDS.map((r, i) => (
            <Reveal key={r.tier} delay={i * 90}>
              <div className={`${styles.card} ${styles['reward-card']}`}>
                <span className={`${styles['reward-tier']} ${styles.mono}`}>{r.tier}</span>
                <span className={styles['reward-name']}>{r.name}</span>
                <div style={{ flex: 1 }}>
                  <p className={styles['reward-detail']}>{r.detail}</p>
                  <div className={styles['reward-bar-track']}><div className={styles['reward-bar-fill']} style={{ width: `${r.pct}%` }} /></div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}