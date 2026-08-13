'use client'

// File: app/(main)/layout.tsx

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import styles from '@/components/sections/nnw/nnw.module.css'
import Ticker from '@/components/sections/nnw/Ticker'
import Nav from '@/components/sections/nnw/Nav'
import Footer from '@/components/sections/nnw/Footer'
import { isApplicationOpen } from '@/components/sections/nnw/data'
import { Season } from '@/components/sections/nnw/types'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [season, setSeason] = useState<Season | null>(null)
  const [waitingCount, setWaitingCount] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        const [seasonRes, waitingRes] = await Promise.all([
          supabase.from('seasons').select('id,name,year,status,application_start_date,application_end_date')
            .order('year', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('waiting_list').select('*', { count: 'exact', head: true }),
        ])

        if (seasonRes.error) console.error('seasons query failed:', seasonRes.error)
        else if (seasonRes.data) setSeason(seasonRes.data)

        if (waitingRes.error) console.error('waiting_list count failed:', waitingRes.error)
        else setWaitingCount(waitingRes.count ?? 0)
      } catch (err) {
        console.error('Layout data load error:', err)
      }
    }
    load()
  }, [])

  const applicationOpen = isApplicationOpen(season)

  const tickerItems = [
    season
      ? (applicationOpen
          ? `APPLICATIONS OPEN · DEADLINE ${new Date(season.application_end_date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}`
          : 'APPLICATIONS CLOSED · NEXT SEASON OPENING SOON')
      : "NIGERIA'S NEXT WARRIOR · STAY TUNED FOR SEASON DATES",
    season ? `${season.name.toUpperCase()} · ${season.year}` : 'A WLA COMPANY · SIX ZONES · ONE ARENA',
    waitingCount > 0 ? `${waitingCount} ON THE WAITING LIST` : 'JOIN THE WAITING LIST FOR UPDATES',
    'GRAND FINALE VENUE ANNOUNCEMENT SOON',
  ]

  return (
    <div className={styles.nnw}>
      <Ticker items={tickerItems} />
      <Nav applyLabel={applicationOpen ? 'Apply Now' : 'Get Notified'} />
      {children}
      <Footer />
    </div>
  )
}