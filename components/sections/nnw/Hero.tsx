'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Play } from 'lucide-react'
import styles from './nnw.module.css'
import { Reveal, useReveal, useCountUp, useCountdown, pad2 } from './hooks'
import { Season } from './types'
import heroPhoto from '@/public/obstacle-hero.png'

interface HeroProps {
  season: Season | null
  applicationOpen: boolean
  countdownTarget: number
  warriorsTotal: number
}

export default function Hero({ season, applicationOpen, countdownTarget, warriorsTotal }: HeroProps) {
  const [statsRef, statsVisible] = useReveal()
  const warriors = useCountUp(warriorsTotal || 500, statsVisible)
  const zonesN = useCountUp(6, statsVisible)
  const prize = useCountUp(25, statsVisible)
  const { d, h, m, s } = useCountdown(countdownTarget)

  return (
    <header className={styles.hero} style={{ position: 'relative' }}>
      <div className={styles['hero-photo']} style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        <Image
          src={heroPhoto}
          alt="Nigeria Ninja Warrior competitor mid-obstacle at the Lagos 2026 Championships"
          fill
          priority
          sizes="100vw"
          quality={90}
          style={{ objectFit: 'cover', objectPosition: '68% 32%' }}
        />
      </div>

      <div className={styles['hero-grid']} style={{ zIndex: 2 }} />
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
        <div className={styles['speed-line']} style={{ top: '18%', animationDelay: '0s' }} />
        <div className={styles['speed-line']} style={{ top: '36%', animationDelay: '1.3s' }} />
        <div className={styles['speed-line']} style={{ top: '56%', animationDelay: '2.6s' }} />
        <div className={styles['speed-line']} style={{ top: '72%', animationDelay: '3.9s' }} />
      </div>
      <span className={styles['ghost-num']} style={{ fontSize: '44vw', top: '-6vw', right: '-10vw', zIndex: 2 }}>06</span>

      {season && (
        <div className={styles.scoreboard} style={{ zIndex: 10 }}>
          <span className={styles.mono} style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--ash)', textTransform: 'uppercase', marginBottom: 8 }}>
            {applicationOpen ? 'Applications close in' : 'Applications open in'}
          </span>
          <span className={styles.mono} style={{ fontSize: 30, color: 'var(--bone)', fontWeight: 600 }}>{d}d {pad2(h)}:{pad2(m)}:{pad2(s)}</span>
        </div>
      )}

      <div className={`${styles.wrap} ${styles['hero-inner']}`} style={{ position: 'relative', zIndex: 10 }}>
        <div className={styles['hero-panel']}>
          <Reveal>
            <div className={styles['hero-badge']}>
              <span className={styles.dot} />
              <span className={styles.mono} style={{ fontSize: 12, letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase' }}>
                {season ? `${season.name} · ${season.year} · Applications ${applicationOpen ? 'Open' : 'Closed'}` : "Nigeria's Next Warrior · Details Coming Soon"}
              </span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className={`${styles.h1} ${styles.display}`}>Nigeria&apos;s<br />Next Warrior</h1>
          </Reveal>
          <Reveal delay={160}>
            <p className={styles['hero-sub']}>
              Six geopolitical zones. One fixed arena. Every zone battles it out in turn -
              only their best three move forward, until a nation&apos;s worth of warriors
              becomes a Grand Finale Top 10.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className={styles['hero-ctas']}>
              <Link href="/register" className={`${styles.btn} ${styles['btn-gold']}`}>
                {applicationOpen ? 'Apply as a Warrior' : 'Register for Updates'} <ArrowRight size={16} />
              </Link>
              <a href="#stream" className={`${styles.btn} ${styles['btn-ghost']}`} style={{ color: 'var(--bone)' }}>
                <Play size={14} color="var(--bone)" /> Watch Live
              </a>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div ref={statsRef} className={styles['hero-stats']}>
              <div>
                <div className={styles['stat-label']}>Zones</div>
                <div className={styles['stat-value']}>{zonesN}</div>
              </div>
              <div>
                <div className={styles['stat-label']}>Warriors</div>
                <div className={styles['stat-value']}>{warriors}+</div>
              </div>
              <div>
                <div className={styles['stat-label']}>Prize pool</div>
                <div className={`${styles['stat-value']} ${styles.gold}`}>₦{prize}M+</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </header>
  )
}