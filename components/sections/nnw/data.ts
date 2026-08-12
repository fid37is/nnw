// File: components/sections/nnw/data.ts
//
// Static content that has no matching Supabase table yet (round schedule, obstacle
// stats, live standings, reward tiers). Flagged individually where used — ask if
// you want these backed by real tables (e.g. a `rounds` or `standings` table).

import { RosterCard, HighlightCard, Season } from './types'

export const HERO_IMG = 'https://images.unsplash.com/photo-1779831910104-9ddc66d221f5?auto=format&fit=crop&w=1800&q=75'
export const MERCH_HERO_IMG = 'https://images.unsplash.com/photo-1773355579207-4bc7a0915e74?auto=format&fit=crop&w=1800&q=70'
export const AUTH_IMG = 'https://images.unsplash.com/photo-1779831910154-a5dacd10daa0?auto=format&fit=crop&w=1200&q=75'
export const STREAM_POSTER = 'https://images.unsplash.com/photo-1506534067239-9e2fabb3a863?auto=format&fit=crop&w=1400&q=75'

// Reference event/competition photography — stand-ins for real NNW event coverage
export const GALLERY = [
  { img: 'https://images.unsplash.com/photo-1779831910154-a5dacd10daa0?auto=format&fit=crop&w=1000&q=75', caption: 'Mid-run, an athlete clears a barrier under competition pressure', tall: true },
  { img: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=75', caption: 'The crowd, fully in it', tall: false },
  { img: 'https://images.unsplash.com/photo-1506534067239-9e2fabb3a863?auto=format&fit=crop&w=1000&q=75', caption: 'Two warriors, one obstacle, a split-second gap', tall: false },
  { img: 'https://images.unsplash.com/photo-1705593973313-75de7bf95b56?auto=format&fit=crop&w=1000&q=75', caption: 'A packed arena watching every clear and every fall', tall: true },
  { img: 'https://images.unsplash.com/photo-1623438744990-f47414813a29?auto=format&fit=crop&w=1000&q=75', caption: 'Hands up the moment a warrior lands it', tall: false },
  { img: 'https://images.unsplash.com/photo-1574602904324-a9ac0fe65331?auto=format&fit=crop&w=1000&q=75', caption: 'Zone rounds, standing room only', tall: false },
]

export const ROUNDS = [
  { n: '01', zone: 'North Central', date: 'Mar 14' },
  { n: '02', zone: 'North East', date: 'Apr 04' },
  { n: '03', zone: 'North West', date: 'Apr 25' },
  { n: '04', zone: 'South East', date: 'May 16' },
  { n: '05', zone: 'South South', date: 'Jun 06' },
  { n: '06', zone: 'South West', date: 'Jun 27' },
]

export const OBSTACLE_META = [
  { name: 'Baobab Climb', desc: 'A leaning, tapered ascent that punishes bad grip early.', icon: 'Mountain', clear: 41, avg: '38s' },
  { name: 'Delta Crossing', desc: 'Unstable floating platforms across open water.', icon: 'Waves', clear: 56, avg: '52s' },
  { name: 'Iron Gate', desc: "A rotating barrier timed to the warrior's rhythm, not theirs.", icon: 'ShieldCheck', clear: 63, avg: '29s' },
  { name: 'Savannah Sprint', desc: 'Flat-out speed off uneven, sand-shifted ground.', icon: 'Wind', clear: 78, avg: '22s' },
  { name: "Warrior's Wall", desc: 'The final 5-metre vertical. Most runs end here.', icon: 'Flame', clear: 19, avg: '1m 04s' },
  { name: 'Live Wire', desc: 'Precision rope and ring work under a closing clock.', icon: 'Zap', clear: 47, avg: '45s' },
] as const

export const STANDINGS = [
  { rank: 1, name: 'Emeka Nwosu', time: '1:49.7', status: 'ADVANCING', move: 'up' },
  { rank: 2, name: 'Chidera Obi', time: '1:58.4', status: 'ADVANCING', move: 'same' },
  { rank: 3, name: 'Aisha Bello', time: '2:04.1', status: 'ADVANCING', move: 'up' },
  { rank: 4, name: 'Tari Amadi', time: '2:11.6', status: 'PENDING', move: 'down' },
  { rank: 5, name: 'Yusuf Danladi', time: '2:19.0', status: 'PENDING', move: 'same' },
  { rank: 6, name: 'Blessing Etim', time: '—', status: 'ELIMINATED', move: 'down' },
] as const

export const REWARDS = [
  { tier: '01', name: 'Zone Finalist', detail: 'Top 20 per zone round advance with kit, media feature & ranking points.', pct: 25 },
  { tier: '02', name: 'Zone Top 3', detail: 'Three from every zone round punch a seeded ticket to the Grand Finale pool.', pct: 50 },
  { tier: '03', name: 'Grand Finale Top 10', detail: 'Finalists share the raise-funded tier of the season prize pool.', pct: 75 },
  { tier: '04', name: "Nigeria's Next Warrior", detail: 'Season champion takes the sponsor-funded grand prize and the title.', pct: 100 },
]

// Fallback only — shown before Supabase data loads, or when a season has no champion/runners yet.
export const DEMO_ROSTER: RosterCard[] = [
  { bib: '014', name: 'Chidera Obi', zone: 'South West', event: "Warrior's Wall", pr: '1:58.4', init: 'CO' },
  { bib: '032', name: 'Aisha Bello', zone: 'North West', event: 'Delta Crossing', pr: '2:04.1', init: 'AB' },
  { bib: '007', name: 'Emeka Nwosu', zone: 'South East', event: 'Iron Gate', pr: '1:49.7', init: 'EN' },
  { bib: '051', name: 'Tari Amadi', zone: 'South South', event: 'Savannah Sprint', pr: '2:11.6', init: 'TA' },
]

// Fallback only — replaced by real `youtube_videos` rows once loaded.
export const DEMO_HIGHLIGHTS: HighlightCard[] = [
  { title: 'North Central — Zone Round Recap', tag: '8:24', img: 'https://images.unsplash.com/photo-1779831910085-d476ba0834b4?auto=format&fit=crop&w=300&q=70' },
  { title: "Top 5 Warrior's Wall Attempts", tag: '5:10', img: 'https://images.unsplash.com/photo-1730097248340-8d45cb8259f8?auto=format&fit=crop&w=300&q=70' },
  { title: 'Iron Gate: Best Clears So Far', tag: '6:47', img: 'https://images.unsplash.com/photo-1779831910069-3d65829e34e9?auto=format&fit=crop&w=300&q=70' },
]

export const statusColor: Record<string, string> = {
  ADVANCING: 'var(--status-advancing)',
  PENDING: 'var(--status-pending)',
  ELIMINATED: 'var(--status-eliminated)',
}
export const statusBg: Record<string, string> = {
  ADVANCING: 'var(--status-advancing-bg)',
  PENDING: 'var(--status-pending-bg)',
  ELIMINATED: 'var(--status-eliminated-bg)',
}

export const SOCIAL = [
  { name: 'X (Twitter)', handle: '@officialnnw', url: 'https://x.com/officialnnw', svg: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { name: 'Instagram', handle: '@naijaninjawarrior', url: 'https://instagram.com/naijaninjawarrior', svg: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { name: 'TikTok', handle: '@naijaninjawarrior', url: 'https://tiktok.com/@naijaninjawarrior', svg: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z' },
  { name: 'LinkedIn', handle: 'naijaninjawarrior', url: 'https://linkedin.com/company/naijaninjawarrior', svg: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  { name: 'Facebook', handle: 'naijaninjawarrior', url: 'https://facebook.com/naijaninjawarrior', svg: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  { name: 'WhatsApp', handle: 'Official Channel', url: 'https://whatsapp.com/channel/0029VbC22T75fM5jemSqUI0E', svg: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' },
]

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT',
]

export const STATE_TO_ZONE: Record<string, string> = {
  Abia: 'South-East', Anambra: 'South-East', Ebonyi: 'South-East', Enugu: 'South-East', Imo: 'South-East',
  'Akwa Ibom': 'South-South', Bayelsa: 'South-South', 'Cross River': 'South-South', Delta: 'South-South', Edo: 'South-South', Rivers: 'South-South',
  Ekiti: 'South-West', Lagos: 'South-West', Ogun: 'South-West', Ondo: 'South-West', Osun: 'South-West', Oyo: 'South-West',
  Benue: 'North-Central', FCT: 'North-Central', Kogi: 'North-Central', Kwara: 'North-Central', Nasarawa: 'North-Central', Niger: 'North-Central', Plateau: 'North-Central',
  Adamawa: 'North-East', Bauchi: 'North-East', Borno: 'North-East', Gombe: 'North-East', Taraba: 'North-East', Yobe: 'North-East',
  Jigawa: 'North-West', Kaduna: 'North-West', Kano: 'North-West', Katsina: 'North-West', Kebbi: 'North-West', Sokoto: 'North-West', Zamfara: 'North-West',
}

export const initials = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('')

export const extractYouTubeId = (url: string): string => {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) { const m = url.match(p); if (m) return m[1] }
  return ''
}

export const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']

export const passwordStrength = (v: string): number => {
  let score = 0
  if (v.length >= 8) score++
  if (/[A-Z]/.test(v)) score++
  if (/[0-9]/.test(v)) score++
  if (/[^A-Za-z0-9]/.test(v)) score++
  return score
}

export const isApplicationOpen = (season: Season | null): boolean => {
  if (!season) return false
  const today = new Date().toISOString().split('T')[0]
  return today >= season.application_start_date && today <= season.application_end_date
}