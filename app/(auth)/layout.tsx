'use client'

// File: app/(auth)/layout.tsx

import Link from 'next/link'
import Image from 'next/image'
import styles from '@/components/sections/nnw/nnw.module.css'
import aStyles from '@/components/module/auth.module.css'
import { useLogoConfig } from '@/components/context/LogoContext'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { logoUrl } = useLogoConfig()

  return (
    <div className={styles.nnw}>
      {/* Real top nav — same structural role as the original layout's <nav>:
          sticky, full-width, logo + wordmark linking home. Restyled, not
          replaced. This is the single place the logo renders on auth pages. */}
      <nav className={aStyles['auth-nav']}>
        <Link href="/" className={aStyles['auth-nav-logo']}>
          {logoUrl ? (
            <Image src={logoUrl} alt="NNW" width={44} height={44} style={{ borderRadius: 4 }} />
          ) : (
            <span className="main" style={{ fontFamily: "'Anton', sans-serif", fontSize: 24, color: 'var(--navy)' }}>NNW</span>
          )}
          <span className="tag" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: 'var(--green)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Next Warrior</span>
        </Link>
      </nav>

      <div className={aStyles['auth-shell']}>
        {/* LEFT BRAND PANEL — desktop only. Pure gradient/pattern, no external
            photo dependency (a prior placeholder image URL here turned out to
            be unverified and unreliable — removed rather than risk another
            broken/wrong image). */}
        <div className={aStyles['auth-left']}>
          <span className={styles['ghost-num']} style={{ fontSize: '26vw', bottom: '-8vw', left: '-6vw' }}>06</span>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <div className={styles['speed-line']} style={{ top: '28%' }} />
            <div className={styles['speed-line']} style={{ top: '62%', animationDelay: '3s' }} />
          </div>
          <div className={aStyles['auth-left-edge']} />
          <div className={aStyles['auth-left-content']}>
            <div className={aStyles['brand-badge']}>
              <span className={styles.dot} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>Season 1 · Live</span>
            </div>
            <div>
              <h1 className={`${styles.display} ${aStyles['brand-headline']}`}>Welcome back,<br />Warrior.</h1>
              <p className={aStyles['brand-sub']}>Six geopolitical zones. One fixed arena. The search for Nigeria&apos;s Next Warrior.</p>
              <div className={aStyles['brand-stats']}>
                <div>
                  <div className={aStyles['brand-stat-label']}>Zones</div>
                  <div className={aStyles['brand-stat-value']}>6</div>
                </div>
                <div>
                  <div className={aStyles['brand-stat-label']}>Warriors</div>
                  <div className={aStyles['brand-stat-value']}>500+</div>
                </div>
                <div>
                  <div className={aStyles['brand-stat-label']}>Prize pool</div>
                  <div className={aStyles['brand-stat-value']} style={{ color: 'var(--gold)' }}>₦25M+</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM COLUMN */}
        <div className={aStyles['auth-right']}>
          <div className={aStyles['form-frame']}>
            <span className={`${aStyles.corner} ${aStyles.tl}`} />
            <span className={`${aStyles.corner} ${aStyles.tr}`} />
            <span className={`${aStyles.corner} ${aStyles.bl}`} />
            <span className={`${aStyles.corner} ${aStyles.br}`} />
            <div className={aStyles['form-inner']}>
              {children}
            </div>
          </div>
        </div>

        <div className={aStyles['footer-mini']}>
          <span>Powered by WLA · Warrior League Africa</span>
        </div>
      </div>
    </div>
  )
}