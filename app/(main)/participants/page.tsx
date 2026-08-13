// File: app/participants/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Search, User, X } from 'lucide-react'
import styles from '@/components/sections/nnw/nnw.module.css'
import subStyles from '@/components/module/subpage.module.css'
import pStyles from '@/components/module/participants.module.css'

interface Participant {
  id: string
  user_id: string
  full_name: string
  preferred_name: string | null
  photo_url: string | null
  age: number
  state: string
  geo_zone: string | null
  is_eliminated: boolean
  eliminated_at: string | null
}

interface ParticipantStats {
  ranking: number | null
  total_points: number
  challenges_completed: number
  challenges_won: number
  best_time: number | null
  average_points: number
  elimination_date?: string | null
}

interface Season {
  id: string
  name: string
  year: number
  status: string
}

type DerivedStatus = 'active' | 'advancing' | 'eliminated'

const ZONES = ['North Central', 'North East', 'North West', 'South East', 'South South', 'South West']

const fmtTime = (sec: number | null) => {
  if (sec === null || sec === undefined) return '—'
  const m = Math.floor(sec / 60)
  const s = (sec % 60).toFixed(1).padStart(4, '0')
  return `${m}:${s}`
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [bestTimes, setBestTimes] = useState<Map<string, number>>(new Map())
  const [seasons, setSeasons] = useState<Season[]>([])
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | DerivedStatus>('All')
  const [zoneFilter, setZoneFilter] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'time' | 'name'>('time')
  const [loading, setLoading] = useState(true)
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
  const [participantStats, setParticipantStats] = useState<ParticipantStats | null>(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [syncClock, setSyncClock] = useState('00:00:00')

  useEffect(() => { loadSeasons() }, [])
  useEffect(() => { if (selectedSeasonId) loadParticipants() }, [selectedSeasonId])

  // Live clock, same as the prototype's `tickClock()` — purely a "this page
  // is live" indicator, not tied to any actual data refresh.
  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, '0')
    const tick = () => {
      const now = new Date()
      setSyncClock(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const loadSeasons = async () => {
    try {
      const { data, error } = await supabase
        .from('seasons')
        .select('id, name, year, status')
        .order('year', { ascending: false })

      if (error) throw error
      setSeasons(data || [])
      if (data && data.length > 0) setSelectedSeasonId(data[0].id)
    } catch (err) {
      console.error('Failed to load seasons:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadParticipants = async () => {
    setLoading(true)
    try {
      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select('id, user_id, status, photo_url, age, state, geo_zone, is_eliminated, eliminated_at')
        .eq('season_id', selectedSeasonId)
        .eq('status', 'approved')

      if (appsError) throw appsError

      if (!appsData || appsData.length === 0) {
        setParticipants([])
        setBestTimes(new Map())
        setLoading(false)
        return
      }

      const userIds = [...new Set(appsData.map(app => app.user_id))]
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, full_name, preferred_name')
        .in('id', userIds)

      if (usersError) throw usersError

      const usersMap = new Map()
      usersData?.forEach((user: any) => usersMap.set(user.id, user))

      const allParticipants: Participant[] = appsData.map((app: any) => {
        const user = usersMap.get(app.user_id)
        return {
          id: app.id,
          user_id: app.user_id,
          full_name: user?.full_name || 'Unknown',
          preferred_name: user?.preferred_name || null,
          photo_url: app.photo_url || null,
          age: app.age,
          state: app.state,
          geo_zone: app.geo_zone || null,
          is_eliminated: app.is_eliminated || false,
          eliminated_at: app.eliminated_at || null,
        }
      })

      setParticipants(allParticipants)

      // Bulk best-time fetch: same `stage_performances` table already used for
      // the per-participant modal, just queried for every application in this
      // season at once instead of one at a time. Powers the fastest-times
      // strip, time sort, and the derived "advancing" status below — all real
      // data, no new tables or schema.
      const { data: perfData, error: perfError } = await supabase
        .from('stage_performances')
        .select('application_id, time_seconds, status')
        .eq('status', 'completed')
        .in('application_id', allParticipants.map(p => p.id))

      if (perfError) {
        console.error('Failed to load stage_performances for best times:', perfError)
      } else {
        const times = new Map<string, number>()
        perfData?.forEach((perf: any) => {
          if (perf.time_seconds == null) return
          const current = times.get(perf.application_id)
          if (current === undefined || perf.time_seconds < current) {
            times.set(perf.application_id, perf.time_seconds)
          }
        })
        setBestTimes(times)
      }
    } catch (err) {
      console.error('Failed to load participants:', err)
      setParticipants([])
      setBestTimes(new Map())
    } finally {
      setLoading(false)
    }
  }

  // Derived status: eliminated participants keep that status. Among the rest,
  // the top 3 fastest per zone (matching the "top 3 per zone advance" rule
  // used across the rest of the site) are "advancing"; everyone else is
  // "active". This replaces the prototype's fabricated advancing flag with
  // something computed from real recorded times.
  const statusByParticipant = useMemo(() => {
    const map = new Map<string, DerivedStatus>()
    const byZone = new Map<string, Participant[]>()

    participants.forEach(p => {
      if (p.is_eliminated) { map.set(p.id, 'eliminated'); return }
      const zone = p.geo_zone || 'Unassigned'
      if (!byZone.has(zone)) byZone.set(zone, [])
      byZone.get(zone)!.push(p)
    })

    byZone.forEach(zoneParticipants => {
      const timed = zoneParticipants
        .filter(p => bestTimes.has(p.id))
        .sort((a, b) => bestTimes.get(a.id)! - bestTimes.get(b.id)!)
      const advancingIds = new Set(timed.slice(0, 3).map(p => p.id))
      zoneParticipants.forEach(p => map.set(p.id, advancingIds.has(p.id) ? 'advancing' : 'active'))
    })

    return map
  }, [participants, bestTimes])

  const fastestSix = useMemo(() => {
    return participants
      .filter(p => bestTimes.has(p.id))
      .sort((a, b) => bestTimes.get(a.id)! - bestTimes.get(b.id)!)
      .slice(0, 6)
  }, [participants, bestTimes])

  const filteredParticipants = useMemo(() => {
    let list = participants.filter(p => {
      if (zoneFilter !== 'All' && p.geo_zone !== zoneFilter) return false
      if (statusFilter !== 'All' && statusByParticipant.get(p.id) !== statusFilter) return false
      if (searchTerm) {
        const displayName = p.preferred_name || p.full_name
        if (!displayName.toLowerCase().includes(searchTerm.toLowerCase())) return false
      }
      return true
    })

    if (sortBy === 'time') {
      list = list.slice().sort((a, b) => {
        const ta = bestTimes.get(a.id)
        const tb = bestTimes.get(b.id)
        if (ta === undefined && tb === undefined) return 0
        if (ta === undefined) return 1
        if (tb === undefined) return -1
        return ta - tb
      })
    } else {
      list = list.slice().sort((a, b) => (a.preferred_name || a.full_name).localeCompare(b.preferred_name || b.full_name))
    }

    return list
  }, [participants, zoneFilter, statusFilter, searchTerm, sortBy, bestTimes, statusByParticipant])

  const loadParticipantStats = async (participant: Participant) => {
    setModalLoading(true)
    setSelectedParticipant(participant)

    try {
      const { data: performances, error: perfError } = await supabase
        .from('stage_performances')
        .select('points, time_seconds, position, competition_stage_id, completed_at, status')
        .eq('application_id', participant.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })

      if (perfError) throw perfError

      const totalPoints = performances?.reduce((sum, p) => sum + (p.points || 0), 0) || 0
      const challengesCompleted = performances?.length || 0
      const challengesWon = performances?.filter(p => p.position === 1).length || 0
      const validTimes = performances?.filter(p => p.time_seconds).map(p => p.time_seconds) || []
      const bestTime = validTimes.length > 0 ? Math.min(...validTimes) : null
      const averagePoints = challengesCompleted > 0 ? Math.round(totalPoints / challengesCompleted) : 0

      const { data: allPerformances } = await supabase
        .from('stage_performances')
        .select('application_id, points')
        .eq('status', 'completed')
        .in('application_id', participants.map(p => p.id))

      const scoreMap = new Map<string, number>()
      allPerformances?.forEach((perf: any) => {
        const current = scoreMap.get(perf.application_id) || 0
        scoreMap.set(perf.application_id, current + (perf.points || 0))
      })
      const sortedScores = Array.from(scoreMap.entries()).sort((a, b) => b[1] - a[1])
      const ranking = sortedScores.findIndex(([id]) => id === participant.id) + 1

      setParticipantStats({
        ranking: ranking > 0 ? ranking : null,
        total_points: totalPoints,
        challenges_completed: challengesCompleted,
        challenges_won: challengesWon,
        best_time: bestTime,
        average_points: averagePoints,
        elimination_date: participant.eliminated_at,
      })
    } catch (err) {
      console.error('Failed to load participant stats:', err)
      setParticipantStats({ ranking: null, total_points: 0, challenges_completed: 0, challenges_won: 0, best_time: null, average_points: 0 })
    } finally {
      setModalLoading(false)
    }
  }

  const closeModal = () => { setSelectedParticipant(null); setParticipantStats(null) }
  const getDisplayName = (p: Participant) => p.preferred_name || p.full_name
  const initials = (name: string) => name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  const activeCount = participants.filter(p => statusByParticipant.get(p.id) === 'active').length
  const advancingCount = participants.filter(p => statusByParticipant.get(p.id) === 'advancing').length
  const eliminatedCount = participants.filter(p => p.is_eliminated).length

  return (
    <>

      <header className={subStyles.subhero} style={{ paddingTop: 150 }}>
        <span className={styles['ghost-num']} style={{ fontSize: '24vw', top: '-6vw', right: '-6vw' }}>24</span>
        <div className={styles.wrap}>
          <div className={subStyles['subhero-badge']}>
            <span className={styles.dot} />
            <span className={styles.mono} style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>
              {seasons.find(s => s.id === selectedSeasonId)?.name || 'Season 1'} · Live Roster
            </span>
          </div>
          <h1 className={styles.display}>All Participants.</h1>
          <p>Every confirmed warrior across all six zones — status and best run time, updated as each round happens.</p>
          <div className={subStyles['sync-row']}>
            <span className={styles.dot} style={{ width: 5, height: 5 }} />
            <span>Last sync: <strong>{syncClock}</strong></span>
          </div>

          {seasons.length > 1 && (
            <div style={{ marginTop: 22, position: 'relative', zIndex: 2 }}>
              <select className={subStyles['season-select']} value={selectedSeasonId} onChange={(e) => setSelectedSeasonId(e.target.value)}>
                {seasons.map((season) => (
                  <option key={season.id} value={season.id}>{season.name} ({season.year})</option>
                ))}
              </select>
            </div>
          )}

          <div className={subStyles['subhero-stats']} style={{ gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: 720 }}>
            <div>
              <div className={subStyles['hstat-label']}>Total</div>
              <div className={subStyles['hstat-value']}>{participants.length}</div>
            </div>
            <div>
              <div className={subStyles['hstat-label']}>Active</div>
              <div className={`${subStyles['hstat-value']} ${subStyles.gold}`}>{activeCount}</div>
            </div>
            <div>
              <div className={subStyles['hstat-label']}>Advancing</div>
              <div className={`${subStyles['hstat-value']} ${subStyles.green}`}>{advancingCount}</div>
            </div>
            <div>
              <div className={subStyles['hstat-label']}>Eliminated</div>
              <div className={`${subStyles['hstat-value']} ${subStyles.muted}`}>{eliminatedCount}</div>
            </div>
          </div>
        </div>
      </header>

      {fastestSix.length > 0 && (
        <section className={pStyles['fastest-section']}>
          <div className={styles.wrap}>
            <div className={pStyles['fastest-title']}>
              <span className={styles.dot} style={{ background: 'var(--bone)' }} />
              <span className={styles.mono} style={{ fontSize: 11.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(var(--bone-rgb),0.85)' }}>Fastest Times — All Zones</span>
            </div>
            <div className={pStyles['fastest-row']}>
              {fastestSix.map((p, i) => (
                <div key={p.id} className={`${pStyles['fastest-card']} ${i === 0 ? pStyles.rank1 : ''}`}>
                  <div className={pStyles['fastest-rank']}>RANK {String(i + 1).padStart(2, '0')}</div>
                  <div className={pStyles['fastest-name']}>{getDisplayName(p)}</div>
                  <div className={pStyles['fastest-zone']}>{p.geo_zone || p.state}</div>
                  <div className={pStyles['fastest-time']}>{fmtTime(bestTimes.get(p.id) ?? null)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className={pStyles['p-controls']}>
        <div className={styles.wrap}>
          <div className={pStyles['p-controls-row']}>
            <div className={pStyles['p-search-wrap']}>
              <Search size={15} className={pStyles['p-search-icon']} />
              <input type="text" placeholder="Search by name…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <select className={pStyles['sort-select']} value={sortBy} onChange={(e) => setSortBy(e.target.value as 'time' | 'name')}>
              <option value="time">Sort: Best Time</option>
              <option value="name">Sort: Name A–Z</option>
            </select>
          </div>
          <div className={pStyles['p-controls-row']} style={{ marginTop: 12 }}>
            <div className={pStyles['p-chip-row']}>
              {['All', ...ZONES].map(z => (
                <button key={z} onClick={() => setZoneFilter(z)} className={`${pStyles['p-chip']} ${zoneFilter === z ? pStyles.active : ''}`}>
                  {z === 'All' ? 'All Zones' : z}
                </button>
              ))}
            </div>
          </div>
          <div className={pStyles['p-controls-row']} style={{ marginTop: 10 }}>
            <div className={pStyles['p-chip-row']}>
              {(['All', 'active', 'advancing', 'eliminated'] as const).map(status => (
                <button key={status} onClick={() => setStatusFilter(status)} className={`${pStyles['p-chip']} ${statusFilter === status ? pStyles.active : ''}`}>
                  {status === 'All' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className={pStyles['p-result-count']}>Showing {filteredParticipants.length} of {participants.length} participants</div>
        </div>
      </div>

      <section style={{ padding: '40px 0 96px' }}>
        <div className={styles.wrap}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
              <div className={styles.dot} style={{ width: 32, height: 32 }} />
            </div>
          ) : filteredParticipants.length === 0 ? (
            <div className={pStyles['p-empty']}>
              <Search size={30} style={{ opacity: 0.4 }} />
              <p>{participants.length === 0 ? 'No approved participants for this season yet' : 'No participants match your filters'}</p>
            </div>
          ) : (
            <div className={pStyles['p-grid']}>
              {filteredParticipants.map((p) => {
                const status = statusByParticipant.get(p.id) || 'active'
                const time = bestTimes.get(p.id) ?? null
                return (
                  <div
                    key={p.id}
                    onClick={() => loadParticipantStats(p)}
                    className={`${pStyles['p-card']} ${pStyles.clickable} ${status === 'eliminated' ? pStyles.eliminated : ''}`}
                  >
                    <div className={`${pStyles['p-avatar']} ${pStyles[status]}`}>
                      {p.photo_url ? <img src={p.photo_url} alt={getDisplayName(p)} /> : initials(getDisplayName(p))}
                    </div>
                    <div className={pStyles['p-info']}>
                      <div className={pStyles['p-top-row']}>
                        <div>
                          <div className={pStyles['p-name']}>{getDisplayName(p)}</div>
                          <div className={pStyles['p-sub']}>Age {p.age} · {p.state}</div>
                        </div>
                        <span className={styles['status-pill']} style={{
                          color: status === 'advancing' ? 'var(--status-advancing)' : status === 'eliminated' ? 'var(--status-eliminated)' : 'var(--status-pending)',
                          background: status === 'advancing' ? 'var(--status-advancing-bg)' : status === 'eliminated' ? 'var(--status-eliminated-bg)' : 'var(--status-pending-bg)',
                        }}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>
                      <div className={pStyles['p-meta-row']}>
                        <span className={pStyles['p-zone']}>{p.geo_zone || p.state}</span>
                        <span className={`${pStyles['p-time']} ${time === null ? pStyles.dim : ''}`}>{fmtTime(time)}</span>
                      </div>
                      {p.is_eliminated && p.eliminated_at && (
                        <div className={pStyles['p-elim-note']}>
                          Eliminated {new Date(p.eliminated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {selectedParticipant && (
        <div className={pStyles['p-modal-backdrop']} onClick={closeModal}>
          <div className={pStyles['p-modal']} onClick={(e) => e.stopPropagation()}>
            {modalLoading ? (
              <div style={{ padding: 64, display: 'flex', justifyContent: 'center' }}>
                <div className={styles.dot} style={{ width: 32, height: 32 }} />
              </div>
            ) : (
              <>
                <div className={pStyles['p-modal-photo']}>
                  {selectedParticipant.photo_url ? (
                    <img src={selectedParticipant.photo_url} alt={getDisplayName(selectedParticipant)} />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={80} color="rgba(var(--bone-rgb),0.5)" />
                    </div>
                  )}
                  <button onClick={closeModal} className={pStyles['p-modal-close']}><X size={20} /></button>
                  <div className={pStyles['p-modal-photo-info']}>
                    <div className={pStyles['p-modal-name']}>{getDisplayName(selectedParticipant)}</div>
                    <div className={pStyles['p-modal-meta']}>
                      Age {selectedParticipant.age} · {selectedParticipant.state}
                      {selectedParticipant.geo_zone && ` · ${selectedParticipant.geo_zone}`}
                    </div>
                  </div>
                </div>

                <div className={pStyles['p-modal-body']}>
                  <div className={pStyles['p-modal-title']}>Competition Statistics</div>

                  <div className={pStyles['p-stat-grid']}>
                    <div className={pStyles['p-stat-box']}>
                      <div className={pStyles['p-stat-box-value']}>{participantStats?.ranking || 'N/A'}</div>
                      <div className={pStyles['p-stat-box-label']}>Ranking</div>
                    </div>
                    <div className={pStyles['p-stat-box']}>
                      <div className={pStyles['p-stat-box-value']}>{participantStats?.total_points || 0}</div>
                      <div className={pStyles['p-stat-box-label']}>Total Points</div>
                    </div>
                    <div className={pStyles['p-stat-box']}>
                      <div className={pStyles['p-stat-box-value']}>{participantStats?.average_points || 0}</div>
                      <div className={pStyles['p-stat-box-label']}>Avg Points</div>
                    </div>
                  </div>
                  <div className={pStyles['p-stat-grid']}>
                    <div className={pStyles['p-stat-box']}>
                      <div className={pStyles['p-stat-box-value']}>{participantStats?.challenges_completed || 0}</div>
                      <div className={pStyles['p-stat-box-label']}>Completed</div>
                    </div>
                    <div className={pStyles['p-stat-box']}>
                      <div className={pStyles['p-stat-box-value']}>{participantStats?.challenges_won || 0}</div>
                      <div className={pStyles['p-stat-box-label']}>Won</div>
                    </div>
                    <div className={pStyles['p-stat-box']}>
                      <div className={pStyles['p-stat-box-value']} style={{ fontSize: 18 }}>{fmtTime(participantStats?.best_time ?? null)}</div>
                      <div className={pStyles['p-stat-box-label']}>Best Time</div>
                    </div>
                  </div>

                  {selectedParticipant.is_eliminated && participantStats?.elimination_date && (
                    <div className={pStyles['p-elim-box']}>
                      Eliminated on {new Date(participantStats.elimination_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  )}

                  <div style={{ marginTop: 14 }}>
                    <div className={pStyles['p-detail-row']}><span>Name</span><span>{getDisplayName(selectedParticipant)}</span></div>
                    <div className={pStyles['p-detail-row']}><span>Age</span><span>{selectedParticipant.age}</span></div>
                    <div className={pStyles['p-detail-row']}><span>State</span><span>{selectedParticipant.state}</span></div>
                    {selectedParticipant.geo_zone && (
                      <div className={pStyles['p-detail-row']}><span>Region</span><span>{selectedParticipant.geo_zone}</span></div>
                    )}
                  </div>

                  <button onClick={closeModal} className={`${styles.btn} ${styles['btn-gold']} ${styles['form-submit']}`}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}