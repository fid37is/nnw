'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import Navbar from './navbar'
import Footer from './footer'
import HeroSection from '../components/sections/HeroSection'
import StatsSection from '../components/sections/StatsSection'
import ZoneMapSection from '../components/sections/ZoneMapSection'
import CompetitionProcessSection from '../components/sections/CompetionProcessSection'
import VideoHighlights from '../components/sections/VideoHighlights'
import TopCompetitors from '../components/sections/TopCompetitors'
import SponsorsSection from '../components/sections/SponsorsSection'
import FAQSection from '../components/sections/FAQSection'
import InquirySection from '../components/sections/InquirySection'
import SocialMediaSection from '../components/sections/SocialMediaSection'
import CTASection from '../components/sections/CTASection'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Champion     { id:string; user_id:string; season_id:string; full_name:string; position:number; photo_url:string|null; final_points?:number }
interface Runner       { id:string; user_id:string; full_name:string; position:number; photo_url:string|null }
interface Season       { id:string; name:string; year:number; application_start_date:string; application_end_date:string; status:string }
interface YouTubeVideo { id:string; title:string; youtube_url:string; description:string; category:string; order_position:number }
interface Sponsor      { id:string; name:string; logo_url:string; website_url:string }

// ─── Loading state shape — each section tracks its own readiness ──────────────
// This lets us render each section the moment its data arrives instead of
// waiting for the slowest query to finish before showing anything.
interface LoadingState {
  critical: boolean   // hero + navbar (above the fold — must be fast)
  stats:    boolean   // competitor counts
  media:    boolean   // videos + sponsors (heaviest, loaded last)
}

// ─── YouTube URL parser (unchanged) ──────────────────────────────────────────
const extractYouTubeId = (url: string): string => {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) { const m = url.match(p); if (m) return m[1] }
  return ''
}

// ─── Tiny reusable skeleton shimmer ──────────────────────────────────────────
// Keeps "loading" states visually consistent without third-party deps.
function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 ${className}`}
      aria-hidden="true"
    />
  )
}

// ─── Above-the-fold skeleton shown only until critical data is ready ──────────
// Mirrors the rough shape of HeroSection so there's zero layout shift on load.
function HeroSkeleton() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6 px-4">
      <Skeleton className="h-3 w-32 bg-gray-800" />
      <Skeleton className="h-10 w-72 bg-gray-800" />
      <Skeleton className="h-5 w-96 max-w-full bg-gray-800" />
      <div className="flex gap-3 mt-4">
        <Skeleton className="h-11 w-36 bg-gray-700 rounded-full" />
        <Skeleton className="h-11 w-36 bg-gray-700 rounded-full" />
      </div>
    </div>
  )
}

// ─── Section-level skeleton used for below-the-fold sections ─────────────────
function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="py-16 px-4 max-w-6xl mx-auto space-y-4" aria-hidden="true">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function Home() {
  const [champion, setChampion] = useState<Champion | null>(null)
  const [runners,  setRunners]  = useState<Runner[]>([])
  const [season,   setSeason]   = useState<Season | null>(null)
  const [stats,    setStats]    = useState({ total: 0, active: 0, eliminated: 0 })
  const [videos,   setVideos]   = useState<YouTubeVideo[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])

  // Granular loading flags — false = still loading, true = data ready
  const [loadingState, setLoadingState] = useState<LoadingState>({
    critical: true,
    stats:    true,
    media:    true,
  })

  // ── isApplicationOpen: pure computation, no state needed ─────────────────
  // Recalculating from `season` is cheap; keeping it as state adds unnecessary
  // syncing bugs. useCallback avoids re-creating the function on every render.
  const isApplicationOpen = useCallback((): boolean => {
    if (!season) return false
    const today = new Date().toISOString().split('T')[0]
    return today >= season.application_start_date && today <= season.application_end_date
  }, [season])

  // ── Data loading strategy ──────────────────────────────────────────────────
  // Split into three waves, ordered by user-visibility priority:
  //
  // WAVE 1 — Critical (above the fold): season + champion podium
  //   Unblocks the hero render immediately. ~2 fast DB reads.
  //
  // WAVE 2 — Stats: competitor counts
  //   Three count queries. Runs in parallel with Wave 1 via Promise.all.
  //   Displayed in a section just below the hero.
  //
  // WAVE 3 — Media (heaviest): videos + sponsors
  //   These fetch the most rows and are furthest down the page, so the user
  //   will have scrolled by the time they're needed. Fire last.
  //
  // All waves run concurrently at the top level — they don't block each other.
  // Each wave updates its own slice of state so React can paint incrementally.

  useEffect(() => {
    let cancelled = false  // prevents state updates if the component unmounts

    // ── Wave 1: Critical above-the-fold data ────────────────────────────────
    const loadCritical = async () => {
      try {
        const { data: seasonData } = await supabase
          .from('seasons')
          .select('id,name,year,status,application_start_date,application_end_date')
          .order('year', { ascending: false })
          .limit(1)
          .single()

        if (cancelled) return

        if (seasonData) {
          setSeason(seasonData)

          // Champion + runners can only be fetched once we have a season id.
          // Run them in parallel — they're independent of each other.
          const [{ data: championData }, { data: runnersData }] = await Promise.all([
            supabase
              .from('champions')
              .select('*')
              .eq('season_id', seasonData.id)
              .eq('position', 1)
              .single(),
            supabase
              .from('champions')
              .select('*')
              .eq('season_id', seasonData.id)
              .in('position', [2, 3])
              .order('position', { ascending: true }),
          ])

          if (cancelled) return

          if (championData) {
            setChampion({
              id:           championData.id,
              user_id:      championData.user_id,
              season_id:    championData.season_id,
              full_name:    championData.full_name,
              position:     championData.position,
              photo_url:    championData.photo_url,
              final_points: championData.final_points,
            })
          }

          if (runnersData) {
            setRunners(runnersData.map((r: any) => ({
              id:        r.id,
              user_id:   r.user_id,
              full_name: r.full_name,
              position:  r.position,
              photo_url: r.photo_url,
            })))
          }

          // ── Wave 2: Stats (runs after season id is known) ────────────────
          // Deliberately NOT awaited here — fires concurrently while Wave 1
          // finishes painting, then updates stats when ready.
          loadStats(seasonData.id)
        }
      } catch (err) {
        console.error('Critical load failed:', err)
      } finally {
        if (!cancelled) setLoadingState(prev => ({ ...prev, critical: false }))
      }
    }

    // ── Wave 2: Stats queries ────────────────────────────────────────────────
    const loadStats = async (seasonId: string) => {
      try {
        // All three count queries in a single Promise.all — no waterfall.
        const [{ count: total }, { count: eliminated }] = await Promise.all([
          supabase
            .from('applications')
            .select('id', { count: 'exact', head: true })  // head:true = no row data, just count
            .eq('season_id', seasonId)
            .eq('status', 'approved'),
          supabase
            .from('applications')
            .select('id', { count: 'exact', head: true })
            .eq('season_id', seasonId)
            .eq('status', 'approved')
            .eq('is_eliminated', true),
        ])

        if (!cancelled) {
          setStats({
            total:     total     || 0,
            active:    (total || 0) - (eliminated || 0),
            eliminated: eliminated || 0,
          })
        }
      } catch (err) {
        console.error('Stats load failed:', err)
      } finally {
        if (!cancelled) setLoadingState(prev => ({ ...prev, stats: false }))
      }
    }

    // ── Wave 3: Media — videos + sponsors ───────────────────────────────────
    // These are the heaviest queries (most rows) and live furthest down the
    // page. We use `requestIdleCallback` (with a setTimeout fallback) so the
    // browser prioritises painting the hero before spending network budget here.
    const loadMedia = () => {
      const run = async () => {
        try {
          const [{ data: sponsorData }, { data: videoData }] = await Promise.all([
            supabase.from('sponsors').select('*').order('created_at', { ascending: false }),
            supabase.from('youtube_videos').select('*').order('order_position', { ascending: true }),
          ])

          if (!cancelled) {
            setSponsors(sponsorData || [])
            setVideos(videoData   || [])
          }
        } catch (err) {
          console.error('Media load failed:', err)
        } finally {
          if (!cancelled) setLoadingState(prev => ({ ...prev, media: false }))
        }
      }

      // Defer until the browser is idle so it doesn't compete with first paint.
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(run, { timeout: 3000 })
      } else {
        // Safari / older browsers fallback — small delay is enough
        setTimeout(run, 200)
      }
    }

    // Fire all three waves. Wave 1 and Wave 3 start simultaneously;
    // Wave 2 starts as soon as Wave 1 has the season id.
    loadCritical()
    loadMedia()

    // Cleanup: prevent stale state updates if component unmounts mid-fetch
    return () => { cancelled = true }
  }, []) // empty deps — runs once on mount

  // ── Derived: are we still waiting for above-the-fold content? ────────────
  const heroReady = !loadingState.critical

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar always renders immediately — no data dependency */}
      <Navbar isApplicationOpen={isApplicationOpen()} />

      {/* ── Above-the-fold: show skeleton until critical wave is done ───── */}
      {!heroReady ? (
        <HeroSkeleton />
      ) : (
        <>
          {/* Application status banner */}
          {season && (
            <div
              className={`${
                isApplicationOpen() ? 'bg-naija-green-600' : 'bg-gray-800'
              } text-white text-center text-xs font-bold py-2.5 tracking-wide mt-20`}
            >
              {isApplicationOpen()
                ? `🟢 Applications Open · Deadline: ${new Date(
                    season.application_end_date
                  ).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}`
                : '🔴 Applications Closed · Next season opening soon — Register to be notified'}
            </div>
          )}

          {/* Hero — renders as soon as critical wave finishes */}
          <HeroSection
            champion={champion}
            season={season}
            isApplicationOpen={isApplicationOpen()}
          />

          {/* Stats — show skeleton until stats wave is done */}
          {loadingState.stats ? (
            <SectionSkeleton rows={3} />
          ) : (
            <StatsSection stats={stats} />
          )}

          {/* These sections need no async data — render immediately */}
          <ZoneMapSection        isApplicationOpen={isApplicationOpen()} />
          <CompetitionProcessSection isApplicationOpen={isApplicationOpen()} />

          {/* Media sections — skeleton until media wave is done */}
          {loadingState.media ? (
            <SectionSkeleton rows={3} />
          ) : (
            <VideoHighlights
              videos={videos}
              extractYouTubeId={extractYouTubeId}
            />
          )}

          {/* TopCompetitors uses champion/runners from critical wave — already ready */}
          <TopCompetitors champion={champion} runners={runners} />

          {/* Sponsors — part of media wave */}
          {loadingState.media ? (
            <SectionSkeleton rows={4} />
          ) : (
            <SponsorsSection sponsors={sponsors} />
          )}

          {/* Static sections — no data, render immediately */}
          <FAQSection />
          <InquirySection />
          <SocialMediaSection />

          {/* CTA uses champion from critical wave — already ready */}
          <CTASection champion={champion} isApplicationOpen={isApplicationOpen()} />

          <Footer />
        </>
      )}
    </main>
  )
}