// File: components/sections/nnw/GallerySection.tsx
'use client'

import styles from './nnw.module.css'
import { Reveal } from './hooks'
import { GALLERY } from './data'

// Reference/stand-in photography (Unsplash) - swap for real Season 1 event
// coverage as rounds happen. No Supabase table backs this yet.
export default function GallerySection() {
  return (
    <section className={styles.section} style={{ background: 'var(--bone)' }}>
      <div className={styles.wrap}>
        <Reveal>
          <div className={styles.eyebrow}><span className={styles['eyebrow-bar']} style={{ background: 'var(--green)' }} /><span className={styles['eyebrow-text']} style={{ color: 'var(--green)' }}>Inside the Arena</span></div>
        </Reveal>
        <Reveal delay={60}>
          <h2 className={styles.display} style={{ fontSize: 'clamp(34px,6vw,58px)', lineHeight: 0.95, maxWidth: 620 }}>This is what<br />competition feels like.</h2>
        </Reveal>
        <Reveal delay={100}>
          <p style={{ marginTop: 20, maxWidth: 520, color: 'rgba(var(--navy-rgb),0.65)', lineHeight: 1.6 }}>
            A packed venue, a warrior mid-clear, a crowd that doesn&apos;t sit down. Reference
            photography below - swap in real Season 1 coverage as rounds happen.
          </p>
        </Reveal>

        <div className={styles['gallery-grid']}>
          {GALLERY.map((g, i) => (
            <Reveal key={g.img} delay={i * 60}>
              <div className={`${styles['gallery-item']} ${g.tall ? '' : styles.short}`}>
                <img src={g.img} alt={g.caption} loading="lazy" />
                <span className={styles['gallery-caption']}>{g.caption}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}