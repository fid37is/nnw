// File: components/sections/nnw/SocialMediaSection.tsx
'use client'

import styles from './nnw.module.css'
import { Reveal } from './hooks'
import { SOCIAL } from './data'

export default function SocialMediaSection() {
  return (
    <section className={styles.section} style={{ background: 'var(--navy)' }}>
      <div className={styles.wrap}>
        <Reveal>
          <div className={styles.eyebrow}><span className={styles['eyebrow-bar']} style={{ background: 'var(--gold)' }} /><span className={styles['eyebrow-text']} style={{ color: 'var(--gold)' }}>Stay Connected</span></div>
        </Reveal>
        <Reveal delay={60}>
          <h2 className={styles.display} style={{ fontSize: 'clamp(34px,6vw,58px)', color: 'var(--bone)', lineHeight: 0.95, maxWidth: 620 }}>Follow the<br />Movement.</h2>
        </Reveal>

        <div className={styles['social-grid']}>
          {SOCIAL.map((s, i) => (
            <Reveal key={s.name} delay={i * 60}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className={styles['social-card']}>
                <svg width={22} height={22} viewBox="0 0 24 24" fill="var(--ash)"><path d={s.svg} /></svg>
                <div>
                  <div className={styles['social-name']}>{s.name}</div>
                  <div className={styles['social-handle']}>{s.handle}</div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}