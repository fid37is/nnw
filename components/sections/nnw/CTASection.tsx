// File: components/sections/nnw/CTASection.tsx
'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import styles from './nnw.module.css'
import { Reveal } from './hooks'
import { Champion } from './types'

interface CTASectionProps {
  applicationOpen: boolean
  champion: Champion | null
}

export default function CTASection({ applicationOpen, champion }: CTASectionProps) {
  return (
    <section className={styles.section} style={{ background: 'var(--bone)' }}>
      <div className={styles.wrap}>
        <Reveal>
          <div className={styles['cta-card']}>
            <span className={styles['ghost-num']} style={{ fontSize: '18vw', bottom: '-8vw', right: '-2vw' }}>NNW</span>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div className={styles['cta-title']}>Think you can clear the gauntlet?</div>
              <p className={styles['cta-sub']}>
                {applicationOpen
                  ? (champion ? `Can you dethrone ${champion.full_name}? Applications are reviewed on a rolling basis.` : 'Applications are open and reviewed on a rolling basis.')
                  : 'Applications are currently closed - register now to be first in line for the next window.'}
              </p>
            </div>
            <div className={styles['cta-btns']}>
              <Link href="/register" className={`${styles.btn} ${styles['btn-gold']}`}>
                {applicationOpen ? 'Apply as a Warrior' : 'Register for Updates'} <ArrowUpRight size={16} />
              </Link>
              <Link href="/partners" className={`${styles.btn} ${styles['btn-ghost']}`}>Partner with NNW</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}