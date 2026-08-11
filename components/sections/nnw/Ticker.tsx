// File: components/sections/nnw/Ticker.tsx
'use client'

import React from 'react'
import styles from './nnw.module.css'

export default function Ticker({ items }: { items: string[] }) {
  return (
    <div className={styles.ticker}>
      <div className={styles['ticker-live']}>
        <span className={styles.dot} />
        <span className={styles.mono} style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--bone)', textTransform: 'uppercase' }}>Live</span>
      </div>
      <div className={styles['ticker-scroll']}>
        <div className={styles['ticker-track']}>
          {[...Array(2)].map((_, r) => (
            <React.Fragment key={r}>
              {items.map((t) => <span key={t + r} className={styles['ticker-item']}>{t}</span>)}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}