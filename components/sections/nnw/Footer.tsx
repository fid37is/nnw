// File: components/sections/nnw/Footer.tsx
'use client'

import Image from 'next/image'
import styles from './nnw.module.css'
import { useLogoConfig } from '@/components/context/LogoContext'

export default function Footer() {
  const { logoUrl } = useLogoConfig()
  return (
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        <div className={styles['footer-top']}>
          <div>
            <div className={styles['logo-lockup']} style={{ marginBottom: 4 }}>
              <Image src={logoUrl || '/icon.png'} alt="NNW" width={40} height={40} className={styles['logo-icon']} />
              <span className={styles['logo-tag']} style={{ color: 'var(--gold)' }}>A WLA Company</span>
            </div>
            <p className={styles['footer-desc']}>Nigeria&apos;s Next Warrior is the flagship competition of WLA Entertainment — Warriors League Africa.</p>
          </div>
          <div className={styles['footer-cols']}>
            <div>
              <div className={styles['footer-col-title']}>Competition</div>
              <div className={styles['footer-links']}>
                <a href="#format">Format</a><a href="#gauntlet">The Gauntlet</a><a href="#standings">Standings</a>
              </div>
            </div>
            <div>
              <div className={styles['footer-col-title']}>Season 1</div>
              <div className={styles['footer-links']}>
                <a href="#stream">Watch Live</a><a href="#roster">Roster</a><a href="/register">Apply</a>
              </div>
            </div>
            <div>
              <div className={styles['footer-col-title']}>WLA</div>
              <div className={styles['footer-links']}>
                <a href="/about">About WLA</a><a href="/partners">Franchise</a><a href="/careers">Careers</a>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['footer-bottom']}>
          <span>© {new Date().getFullYear()} WLA Entertainment Limited. All rights reserved.</span>
          <span>Nigeria&apos;s Next Warrior™</span>
        </div>
      </div>
    </footer>
  )
}