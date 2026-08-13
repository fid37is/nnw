// File: components/sections/nnw/Nav.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import styles from './nnw.module.css'
import { useLogoConfig } from '@/components/context/LogoContext'

// Real site pages - same destinations as app/navbar.tsx, so nothing is lost
// by using this restyled nav on the home page instead of the shared one.
const SITE_LINKS = [
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/participants', label: 'Participants' },
  { href: '/merch', label: 'Shop' },
  { href: '/about', label: 'About' },
]

export default function Nav({ applyLabel = 'Apply Now', sticky = false }: { applyLabel?: string; sticky?: boolean }) {
  const { logoUrl } = useLogoConfig()
  const [navOpen, setNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => pathname === href

  // Text color is set inline (not just via the CSS module class) so it can
  // never render invisible against the dark nav background if a class
  // lookup fails to resolve - belt-and-suspenders after the earlier
  // build-cache issues that caused exactly that symptom.
  const linkStyle = (active: boolean): React.CSSProperties => ({ color: active ? 'var(--gold)' : 'var(--bone)' })
  const loginStyle: React.CSSProperties = { color: 'rgba(var(--bone-rgb),0.75)' }

  // sticky=true is for pages with no Ticker above the nav (matches the
  // participants/merch prototypes, which use a plain sticky nav at top:0
  // instead of the homepage's fixed nav offset by the ticker's height).
  const navPositionStyle: React.CSSProperties = sticky ? { position: 'sticky', top: 0 } : {}

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} style={navPositionStyle}>
      <div className={`${styles.wrap} ${styles['nav-row']}`}>
        <Link href="/" className={styles['logo-lockup']}>
          {logoUrl ? (
            <Image src={logoUrl} alt="NNW" width={48} height={48} className={styles['logo-icon']} priority />
          ) : (
            <Image src="/icon.png" alt="NNW" width={48} height={48} className={styles['logo-icon']} priority />
          )}
          <span className={styles['logo-tag']} style={{ color: 'var(--gold)' }}>A WLA Company</span>
        </Link>
        <div className={styles['nav-links']}>
          {SITE_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className={styles['nav-link']} style={linkStyle(isActive(item.href))}>
              {item.label}
            </Link>
          ))}
          <Link href="/login" className={styles['nav-login']} style={loginStyle}>Login</Link>
          <Link href="/register" className={`${styles.btn} ${styles['btn-gold']}`}>{applyLabel}</Link>
        </div>
        <button className={styles['nav-toggle']} onClick={() => setNavOpen(!navOpen)} aria-label="Toggle menu" style={{ color: 'var(--bone)' }}>
          {navOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {navOpen && (
        <div className={styles['nav-mobile']}>
          {SITE_LINKS.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setNavOpen(false)} className={styles['nav-link']} style={linkStyle(isActive(item.href))}>
              {item.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setNavOpen(false)} className={styles['nav-login']} style={loginStyle}>Login</Link>
          <Link href="/register" className={`${styles.btn} ${styles['btn-gold']}`} style={{ width: 'fit-content' }}>{applyLabel}</Link>
        </div>
      )}
    </nav>
  )
}