// File: components/sections/nnw/Hero.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Play } from 'lucide-react'
import styles from './nnw.module.css'
import { Reveal, useReveal, useCountUp, useCountdown, pad2 } from './hooks'
import { Season } from './types'

// Real photo, static import — lives in the repo (e.g. src/assets or public/images),
// so Next optimizes it and infers width/height automatically. No remotePatterns
// entry needed since this isn't a remote URL. Adjust the path to wherever you
// actually drop the file.
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
  const zonesN = useCountUp(6, statsVisible) // structural constant — 6 geopolitical zones
  const prize = useCountUp(25, statsVisible) // no prize-pool field in the schema yet — placeholder
  const { d, h, m, s } = useCountdown(countdownTarget)

  return (
    <header className={styles.hero} style={{ position: 'relative' }}>
      {/* Background photo — real image now, via next/image fill. objectPosition
          nudged right-of-center so the leap/action stays visible in the bright
          zone rather than getting buried under the scrim. */}
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

      {/* Radial vignette anchored to the bottom-left corner, not a flat bottom band.
          Content (badge, h1, sub, CTAs, stats) all lives bottom-left in .hero-inner,
          so this is opaque exactly there and fades out before it reaches the
          top-right — which is where the scoreboard sits and where the photo should
          read bright and untouched. Single gradient does both jobs the old
          full-width bottom scrim couldn't. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'radial-gradient(130% 130% at 6% 100%, rgba(var(--navy-rgb),0.97) 0%, rgba(var(--navy-rgb),0.9) 24%, rgba(var(--navy-rgb),0.55) 42%, rgba(var(--navy-rgb),0.16) 60%, rgba(var(--navy-rgb),0) 76%)',
        }}
      />

      <div className={styles['hero-grid']} style={{ zIndex: 2 }} />
      {/* hero-shear dropped for this version — its gold diagonal tint fought with
          the photo's natural color in the now-visible right side. Ghost number
          and speed-lines kept; both are subtle enough (opacity 0.045–0.35) to add
          texture without dulling the image. */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2 }}>
        <div className={styles['speed-line']} style={{ top: '18%', animationDelay: '0s' }} />
        <div className={styles['speed-line']} style={{ top: '36%', animationDelay: '1.3s' }} />
        <div className={styles['speed-line']} style={{ top: '56%', animationDelay: '2.6s' }} />
        <div className={styles['speed-line']} style={{ top: '72%', animationDelay: '3.9s' }} />
      </div>
      <span className={styles['ghost-num']} style={{ fontSize: '44vw', top: '-6vw', right: '-10vw', zIndex: 2 }}>06</span>

      {/* Only shown once a real season has loaded — no fabricated countdown or
          status when we don't actually know it. */}
      {season && (
        <div className={styles.scoreboard} style={{ zIndex: 10 }}>
          <span className={styles.mono} style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--ash)', textTransform: 'uppercase', marginBottom: 8 }}>
            {applicationOpen ? 'Applications close in' : 'Applications open in'}
          </span>
          <span className={styles.mono} style={{ fontSize: 30, color: 'var(--bone)', fontWeight: 600 }}>{d}d {pad2(h)}:{pad2(m)}:{pad2(s)}</span>
        </div>
      )}

      <div className={`${styles.wrap} ${styles['hero-inner']}`} style={{ position: 'relative', zIndex: 10 }}>
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
            Six geopolitical zones. One fixed arena. Every zone battles it out in turn —
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
    </header>
  )
}