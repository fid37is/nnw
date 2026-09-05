// File: components/careers/CareersHeader.tsx

import styles from '@/components/sections/nnw/nnw.module.css'
import subStyles from '@/components/module/subpage.module.css'

export default function CareersHeader() {
  return (
    <header className={subStyles.subhero} style={{ paddingTop: 132 }}>
      <span className={styles['ghost-num']} style={{ fontSize: '24vw', top: '-6vw', right: '-6vw' }}>NNW</span>
      <div className={styles.wrap}>
        <div className={subStyles['subhero-badge']}>
          <span className={styles.dot} />
          <span className={styles.mono} style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>We&apos;re Hiring</span>
        </div>
        <h1 className={styles.display}>Join Our<br />Team.</h1>
        <p>Careers at WLA Entertainment Ltd - home of Naija Next Warrior.</p>
      </div>
    </header>
  )
}
