// File: components/sections/nnw/Footer.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'
import styles from './nnw.module.css'
import { useLogoConfig } from '@/components/context/LogoContext'
import { SOCIAL } from './data'

export default function Footer() {
  const { logoUrl } = useLogoConfig()

  return (
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        <div className={styles['footer-top']}>
          <div className={styles['footer-desc-col']}>
            <div className={styles['logo-lockup']} style={{ marginBottom: 4 }}>
              <Image src={logoUrl || '/icon.png'} alt="NNW" width={40} height={40} className={styles['logo-icon']} />
              <span className={styles['logo-tag']} style={{ color: 'var(--gold)' }}>Naija Next Warrior®</span>
            </div>
            <p className={styles['footer-desc']}>
              Africa&apos;s first ninja competition series. Test your strength, speed, and spirit.
            </p>
            <div className={styles['footer-social-row']}>
              {SOCIAL.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name} className={styles['footer-social-icon']}>
                  <svg width={15} height={15} viewBox="0 0 24 24" fill="rgba(var(--bone-rgb),0.85)"><path d={s.svg} /></svg>
                </a>
              ))}
            </div>
          </div>

          <div className={styles['footer-cols']}>
            <div>
              <div className={styles['footer-col-title']}>Quick Links</div>
              <div className={styles['footer-links']}>
                <Link href="/">Home</Link>
                <Link href="/about">About Us</Link>
                <Link href="/competition">Competition Format</Link>
                <Link href="/training">Training Centers</Link>
                <Link href="/register">Register</Link>
              </div>
            </div>
            <div>
              <div className={styles['footer-col-title']}>Company</div>
              <div className={styles['footer-links']}>
                <Link href="/partners">Partners &amp; Sponsors</Link>
                <Link href="/investors">Investor Relations</Link>
                <Link href="/careers">Careers</Link>
                <Link href="/contact">Contact Us</Link>
              </div>
            </div>
            <div>
              <div className={styles['footer-col-title']}>Legal &amp; Support</div>
              <div className={styles['footer-links']}>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms &amp; Conditions</Link>
                <Link href="/faq">FAQ</Link>
              </div>
              <div className={styles['footer-contact']}>
                <a href="mailto:support@naijaninja.net"><Mail size={14} /> support@naijaninja.net</a>
                <a href="tel:+2348085952266"><Phone size={14} /> +234 808 595 2266</a>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['footer-bottom']}>
          <span>© {new Date().getFullYear()} Naija Next Warrior. All rights reserved.</span>
          <span>A WLA Entertainment Company · RC No. 9529867</span>
        </div>
      </div>
    </footer>
  )
}