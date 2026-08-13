// File: components/sections/nnw/FormatSection.tsx
'use client'

import React from 'react'
import { MapPin, Trophy } from 'lucide-react'
import styles from './nnw.module.css'
import { Reveal } from './hooks'
import { ROUNDS } from './data'

// NOTE: ROUNDS (zone/date schedule) is static placeholder content - there's no
// `rounds` table in the schema yet. Flag if you want this backed by real data.
export default function FormatSection() {
  return (
    <section id="format" className={styles.section} style={{ background: 'var(--bone)' }}>
      <div className={styles.wrap}>
        <Reveal>
          <div className={styles.eyebrow}><span className={styles['eyebrow-bar']} style={{ background: 'var(--green)' }} /><span className={styles['eyebrow-text']} style={{ color: 'var(--green)' }}>The Format</span></div>
        </Reveal>
        <Reveal delay={60}>
          <h2 className={styles.display} style={{ fontSize: 'clamp(34px,6vw,58px)', lineHeight: 0.95, maxWidth: 680 }}>Six Zones.<br />One Arena.</h2>
        </Reveal>
        <Reveal delay={120}>
          <p style={{ marginTop: 24, maxWidth: 560, color: 'rgba(var(--navy-rgb),0.7)', lineHeight: 1.65 }}>
            Nigeria&apos;s six geopolitical zones compete one at a time, in order, at a single
            fixed venue. Each zone round sends its top 3 forward - six rounds, eighteen
            warriors, narrowed down to a Grand Finale Top 18.
          </p>
        </Reveal>

        <div className={styles['course-desktop']}>
          {ROUNDS.map((z, i) => (
            <React.Fragment key={z.n}>
              <Reveal delay={160 + i * 70}>
                <div className={styles.node}>
                  <div className={styles['node-dot']} />
                  <div className={`${styles['node-round']} ${styles.mono}`}>RND {z.n}</div>
                  <div className={styles['node-zone']}>{z.zone}</div>
                  <div className={styles['node-date']}>{z.date}</div>
                </div>
              </Reveal>
              <div className={styles['dash-line']} />
            </React.Fragment>
          ))}
          <Reveal delay={160 + ROUNDS.length * 70}>
            <div className={styles.node} style={{ width: 140 }}>
              <Trophy size={20} color="var(--gold)" style={{ marginBottom: 14 }} />
              <div className={`${styles['node-round']} ${styles.mono}`} style={{ color: 'var(--gold)' }}>Finale</div>
              <div className={styles['node-zone']} style={{ color: 'var(--green)' }}>Top 18</div>
            </div>
          </Reveal>
        </div>

        <div className={styles['course-mobile']}>
          {ROUNDS.map((z, i) => (
            <div className={styles['m-row']} key={z.n}>
              <div className={styles['m-col']}>
                <div className={styles['node-dot']} style={{ marginBottom: 0 }} />
                <div className={styles['dash-line-v']} />
              </div>
              <Reveal delay={i * 60}>
                <div style={{ paddingBottom: 8 }}>
                  <div className={`${styles['node-round']} ${styles.mono}`}>Round {z.n} · {z.date}</div>
                  <div className={styles['node-zone']} style={{ fontSize: 19 }}>{z.zone}</div>
                </div>
              </Reveal>
            </div>
          ))}
          <div className={styles['m-row']}>
            <Trophy size={16} color="var(--gold)" style={{ marginTop: 2 }} />
            <Reveal>
              <div className={`${styles['node-round']} ${styles.mono}`} style={{ color: 'var(--gold)' }}>Grand Finale</div>
              <div className={styles['node-zone']} style={{ color: 'var(--green)', fontSize: 19 }}>Top 18</div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={200}>
          <div className={styles['venue-card']}>
            <MapPin size={18} color="var(--green)" />
            <span className={styles.mono}>Fixed venue - host arena to be announced, Season 1</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}