'use client'

// File: app/leaderboard/page.tsx

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Trophy, User, Crown } from 'lucide-react'
import styles from '@/components/sections/nnw/nnw.module.css'
import subStyles from '@/components/module/subpage.module.css'
import lStyles from '@/components/module/leaderboard.module.css'

interface LeaderboardEntry {
  rank: number
  application_id: string
  user_id: string
  full_name: string
  preferred_name: string | null
  profile_photo: string | null
  total_points: number
  stages_completed: number
}

interface Season {
  id: string
  name: string
  year: number
  status: string
}

const rankBadgeClass = (rank: number) => {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return 'default'
}

const getMedalEmoji = (rank: number) => {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return null
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSeasons()
  }, [])

  useEffect(() => {
    if (selectedSeasonId) {
      loadLeaderboard()
    }
  }, [selectedSeasonId])

  const loadSeasons = async () => {
    try {
      const { data, error } = await supabase
        .from('seasons')
        .select('id, name, year, status')
        .order('year', { ascending: false })

      if (error) throw error
      setSeasons(data || [])
      if (data && data.length > 0) {
        setSelectedSeasonId(data[0].id)
      }
    } catch (err) {
      console.error('Failed to load seasons:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadLeaderboard = async () => {
    try {
      // Get ONLY active (non-eliminated) applications
      const { data: applications, error: appsError } = await supabase
        .from('applications')
        .select('id, user_id, photo_url, status, is_eliminated')
        .eq('season_id', selectedSeasonId)
        .eq('status', 'approved')
        .eq('is_eliminated', false)

      if (appsError) throw appsError

      if (!applications || applications.length === 0) {
        setLeaderboard([])
        return
      }

      const applicationIds = applications.map(app => app.id)
      const userIds = [...new Set(applications.map(app => app.user_id))]

      // Get all completed performances
      const { data: perfData, error: perfError } = await supabase
        .from('stage_performances')
        .select('application_id, points, status')
        .in('application_id', applicationIds)
        .eq('status', 'completed')

      if (perfError) throw perfError

      // Get user data with preferred names
      const { data: usersData } = await supabase
        .from('users')
        .select('id, full_name, preferred_name')
        .in('id', userIds)

      const usersMap = new Map()
      usersData?.forEach((user: any) => {
        usersMap.set(user.id, user)
      })

      // Create app to user mapping
      const appToUserMap = new Map()
      applications.forEach(app => {
        appToUserMap.set(app.id, {
          user_id: app.user_id,
          photo_url: app.photo_url
        })
      })

      // Calculate total points and stages completed per participant
      const participantStats = new Map()

      perfData?.forEach((perf: any) => {
        const appInfo = appToUserMap.get(perf.application_id)
        if (!appInfo) return

        const appId = perf.application_id

        if (!participantStats.has(appId)) {
          participantStats.set(appId, {
            application_id: appId,
            user_id: appInfo.user_id,
            total_points: perf.points || 0,
            stages_completed: 1,
            photo_url: appInfo.photo_url
          })
        } else {
          const stats = participantStats.get(appId)
          stats.total_points += (perf.points || 0)
          stats.stages_completed += 1
        }
      })

      // Convert to array and sort by total points (highest first)
      const entries = Array.from(participantStats.values())
        .map((stats: any) => {
          const user = usersMap.get(stats.user_id)
          return {
            application_id: stats.application_id,
            user_id: stats.user_id,
            full_name: user?.full_name || 'Unknown',
            preferred_name: user?.preferred_name || null,
            profile_photo: stats.photo_url || null,
            total_points: stats.total_points,
            stages_completed: stats.stages_completed
          }
        })
        .sort((a, b) => b.total_points - a.total_points)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }))

      setLeaderboard(entries)
    } catch (err) {
      console.error('Failed to load leaderboard:', err)
      setLeaderboard([])
    }
  }

  const getDisplayName = (entry: LeaderboardEntry) => {
    return entry.preferred_name || entry.full_name
  }

  const currentSeason = seasons.find(s => s.id === selectedSeasonId)
  const isSeasonEnded = currentSeason?.status === 'completed' || currentSeason?.status === 'ended'

  return (
    <>

      <header className={subStyles.subhero} style={{ paddingTop: 132 }}>
        <span className={styles['ghost-num']} style={{ fontSize: '24vw', top: '-6vw', right: '-6vw' }}>01</span>
        <div className={styles.wrap}>
          <div className={subStyles['subhero-badge']}>
            <Trophy size={16} color="var(--gold)" />
            <span className={styles.mono} style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>
              {currentSeason ? `${currentSeason.name} ${currentSeason.year}` : 'Season 1'} · Live Rankings
            </span>
          </div>
          <h1 className={styles.display}>Leaderboard.</h1>
          <p>Live rankings — active competitors only, updated after every completed stage.</p>
        </div>
      </header>

      <section style={{ padding: '48px 0 96px' }}>
        <div className={styles.wrap}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '96px 0' }}>
              <div className={styles.dot} style={{ width: 32, height: 32 }} />
            </div>
          ) : (
            <>
              {isSeasonEnded && (
                <div className={lStyles['ended-banner']}>
                  <div className={lStyles['ended-crown-row']}>
                    <Crown size={32} color="var(--gold)" />
                    <h2 className={`${styles.display} ${lStyles['ended-title']}`}>Season Concluded!</h2>
                    <Crown size={32} color="var(--gold)" />
                  </div>
                  <p className={lStyles['ended-sub']}>
                    {currentSeason?.name} {currentSeason?.year} has ended. The competition is complete!
                  </p>
                  <Link href="/hall-of-fame" className={`${styles.btn} ${styles['btn-gold']}`}>
                    <Trophy size={16} /> View Hall of Fame
                  </Link>
                  <div className={lStyles['ended-note']}>See the champions and final standings from all completed seasons</div>
                </div>
              )}

              {seasons.length > 1 && !isSeasonEnded && (
                <div style={{ marginBottom: 32 }}>
                  <select className={subStyles['season-select']} value={selectedSeasonId} onChange={e => setSelectedSeasonId(e.target.value)}>
                    {seasons.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} {s.year} {(s.status === 'completed' || s.status === 'ended') && '(Ended)'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {!isSeasonEnded && (
                leaderboard.length === 0 ? (
                  <div className={lStyles['l-empty']}>
                    <Trophy size={40} style={{ opacity: 0.3 }} />
                    <p>No active competitors yet — check back soon for rankings</p>
                  </div>
                ) : (
                  <div className={lStyles['l-grid']}>
                    {leaderboard.map((entry) => (
                      <div key={entry.application_id} className={lStyles['l-card']}>
                        {entry.profile_photo ? (
                          <img src={entry.profile_photo} alt={getDisplayName(entry)} />
                        ) : (
                          <div className={lStyles['l-card-noimg']}><User size={40} color="rgba(var(--bone-rgb),0.5)" /></div>
                        )}

                        <div className={`${lStyles['rank-badge']} ${lStyles[rankBadgeClass(entry.rank)]}`}>
                          {getMedalEmoji(entry.rank) || entry.rank}
                        </div>

                        <div className={lStyles['points-badge']}>
                          <span>{entry.total_points} pts</span>
                        </div>

                        <div className={lStyles['l-card-info']}>
                          <div className={lStyles['l-card-name']}>{getDisplayName(entry)}</div>
                          <div className={lStyles['l-card-stages']}>{entry.stages_completed} stages</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}