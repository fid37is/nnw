// File: app/not-found.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Home, ArrowLeft } from 'lucide-react'

const ROASTS = [
  "You can't even find a webpage. The warped wall must be terrifying for you.",
  "Bro got lost on the internet. The obstacle course would destroy you.",
  "This URL doesn't exist. Neither does your Next career, apparently.",
  "404. That's also your ranking on our leaderboard. Coincidence? No.",
  "You typed a wrong URL. Our competitors fail obstacles. You? The internet.",
  "Even our eliminated contestants found the exit. You found neither.",
]

// Arena is 448px wide (max-w-md = 28rem = 448px)
// Wall sits at x=310px. Next runs from x=20 → x=265 → hits → falls
type Phase = 'run' | 'jump' | 'fall' | 'splat' | 'recover'

const PX: Record<Phase, number> = {
  run:     20,   // starts far left
  jump:    255,  // leaps toward wall
  fall:    285,  // overshoots slightly then drops
  splat:   285,  // stays where it fell
  recover: 200,  // staggers back
}

const TRANS: Record<Phase, string> = {
  run:     'left 1.2s linear',
  jump:    'left 0.65s ease-out',
  fall:    'left 0.15s ease-in',
  splat:   'none',
  recover: 'left 0.8s ease-out',
}

const LABEL: Record<Phase, string> = {
  run:     '▶  Approaching obstacle...',
  jump:    '↑  Attempting the Warped Wall',
  fall:    '↘  Going down...',
  splat:   '💀  DNF — Did Not Finish',
  recover: '↩  Getting up... maybe',
}

export default function NotFound() {
  const [mounted, setMounted]           = useState(false)
  const [phase, setPhase]               = useState<Phase>('run')
  const [roastIndex, setRoastIndex]     = useState(0)
  const [roastVisible, setRoastVisible] = useState(true)
  const [showBonk, setShowBonk]         = useState(false)

  useEffect(() => {
    setMounted(true)

    const runCycle = () => {
      setPhase('run')
      setShowBonk(false)
      setTimeout(() => setPhase('jump'),                          1200)
      setTimeout(() => setPhase('fall'),                          2000)
      setTimeout(() => { setPhase('splat'); setShowBonk(true) }, 2250)
      setTimeout(() => setShowBonk(false),                        3300)
      setTimeout(() => setPhase('recover'),                       3700)
      setTimeout(runCycle,                                        5400)
    }
    runCycle()

    const t = setInterval(() => {
      setRoastVisible(false)
      setTimeout(() => { setRoastIndex(i => (i + 1) % ROASTS.length); setRoastVisible(true) }, 350)
    }, 4000)

    return () => clearInterval(t)
  }, [])

  const isSplat = phase === 'splat'
  const isJump  = phase === 'jump'
  const isFall  = phase === 'fall'
  const color   = isSplat ? '#ef4444' : '#10c084'

  const svgTransform =
    isJump ? 'translateY(-30px) rotate(-10deg)' :
    isFall ? 'translateY(6px) rotate(42deg)'    :
    isSplat ? 'translateY(2px) rotate(90deg)'   : 'none'

  return (
    <div className="h-screen bg-gray-950 flex flex-col items-center justify-center overflow-hidden relative px-4 select-none">

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.035]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',
        backgroundSize: '48px 48px',
      }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-naija-green-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto text-center">

        {/* Logo */}
        <div className="flex justify-center mb-2">
          <Image src="https://res.cloudinary.com/lordefid/image/upload/v1774595053/NNW_kxgtcf.png"
            alt="NNW" width={44} height={44} className="rounded-lg opacity-75" />
        </div>

        {/* 404 */}
        <p className="text-[96px] sm:text-[112px] font-black leading-none bg-gradient-to-b from-naija-green-400 to-naija-green-700 bg-clip-text text-transparent">
          404
        </p>

        <h1 className="text-xl sm:text-2xl font-black text-white -mt-2 mb-1 tracking-tight">
          You fell off the course.
        </h1>

        {/* ── ARENA ── fixed 448px wide to match max-w-md */}
        <div
          className="relative my-4 bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden"
          style={{ height: 112, width: '100%' }}
        >
          {/* Ground line */}
          <div className="absolute left-0 right-0 h-px bg-naija-green-900" style={{ bottom: 32 }} />

          {/* Wall — fixed pixel position from left */}
          <div className="absolute bg-naija-green-900 border border-naija-green-700 rounded-t-sm"
            style={{ bottom: 32, left: 310, width: 22, height: 58 }} />
          {/* Shadow wall */}
          <div className="absolute bg-naija-green-900/50 border border-naija-green-800/40 rounded-t-sm"
            style={{ bottom: 32, left: 336, width: 14, height: 38 }} />
          {/* Wall label */}
          <div className="absolute text-[8px] font-black tracking-widest text-naija-green-600/60 uppercase"
            style={{ bottom: 92, left: 304 }}>
            Wall
          </div>

          {/* ── Next — pixel positioned ── */}
          {mounted && (
            <div
              className="absolute"
              style={{
                bottom: 32,
                left: PX[phase],
                transition: TRANS[phase],
              }}
            >
              <svg width="26" height="50" viewBox="0 0 26 50"
                style={{
                  transform: svgTransform,
                  transition: 'transform 0.3s ease',
                  filter: isSplat
                    ? 'drop-shadow(0 0 8px rgba(239,68,68,0.9))'
                    : isJump
                    ? 'drop-shadow(0 0 6px rgba(16,192,132,0.6))'
                    : 'none',
                }}
              >
                {/* Head */}
                <circle cx="13" cy="7" r="6" fill={color} />
                {/* Headband */}
                <rect x="7" y="4" width="12" height="2" rx="1" fill="white" opacity="0.3" />
                {/* Eyes */}
                {isSplat ? (
                  <>
                    <text x="7"  y="9" fontSize="5" fill="white" fontWeight="bold">×</text>
                    <text x="14" y="9" fontSize="5" fill="white" fontWeight="bold">×</text>
                  </>
                ) : (
                  <>
                    <circle cx="10.5" cy="6.5" r="1.2" fill="white" />
                    <circle cx="15.5" cy="6.5" r="1.2" fill="white" />
                  </>
                )}
                {/* Mouth */}
                {isSplat
                  ? <path d="M9 11 Q13 9 17 11"  stroke="white" strokeWidth="1" fill="none" strokeLinecap="round" />
                  : isJump
                  ? <path d="M9 10 Q13 13 17 10" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round" />
                  : <path d="M9 10 Q13 12 17 10" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round" />
                }
                {/* Body */}
                <line x1="13" y1="13" x2="13" y2="31" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
                {/* Arms */}
                {isJump ? (
                  <>
                    <line x1="13" y1="18" x2="2"  y2="11" stroke={color} strokeWidth="2" strokeLinecap="round" />
                    <line x1="13" y1="18" x2="24" y2="11" stroke={color} strokeWidth="2" strokeLinecap="round" />
                  </>
                ) : isSplat ? (
                  <>
                    <line x1="13" y1="18" x2="0"  y2="23" stroke={color} strokeWidth="2" strokeLinecap="round" />
                    <line x1="13" y1="18" x2="26" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <line x1="13" y1="18" x2="3"  y2="24" stroke={color} strokeWidth="2" strokeLinecap="round" />
                    <line x1="13" y1="18" x2="23" y2="24" stroke={color} strokeWidth="2" strokeLinecap="round" />
                  </>
                )}
                {/* Legs */}
                {isSplat ? (
                  <>
                    <line x1="13" y1="31" x2="1"  y2="44" stroke={color} strokeWidth="2" strokeLinecap="round" />
                    <line x1="13" y1="31" x2="25" y2="38" stroke={color} strokeWidth="2" strokeLinecap="round" />
                  </>
                ) : phase === 'run' ? (
                  <>
                    <line x1="13" y1="31" x2="6"  y2="46" stroke={color} strokeWidth="2" strokeLinecap="round" />
                    <line x1="13" y1="31" x2="20" y2="45" stroke={color} strokeWidth="2" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <line x1="13" y1="31" x2="7"  y2="46" stroke={color} strokeWidth="2" strokeLinecap="round" />
                    <line x1="13" y1="31" x2="19" y2="46" stroke={color} strokeWidth="2" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </div>
          )}

          {/* BONK — fixed just left of wall */}
          {showBonk && (
            <div className="absolute pointer-events-none" style={{ bottom: 38, left: 276 }}>
              <div className="text-base animate-bounce leading-none">💥</div>
              <div className="text-[9px] text-red-400 font-black tracking-wider mt-0.5 animate-pulse">BONK!</div>
            </div>
          )}

          {/* Phase label */}
          <div className="absolute top-2 left-3">
            <span className="text-[9px] font-black tracking-widest uppercase"
              style={{ color: isSplat ? '#f87171' : '#10c08460' }}>
              {LABEL[phase]}
            </span>
          </div>
        </div>

        {/* Rotating roast */}
        <div className="h-10 flex items-center justify-center mb-4 px-2">
          <p className="text-sm text-gray-300 italic leading-snug transition-opacity duration-300"
            style={{ opacity: roastVisible ? 1 : 0 }}>
            "{ROASTS[roastIndex]}"
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <Link href="/"
            className="flex items-center justify-center gap-2 w-40 py-3 bg-naija-green-700 hover:bg-naija-green-600 text-white font-black text-sm rounded-full transition-all duration-200 hover:scale-105 shadow-lg shadow-naija-green-900/50"
          >
            <Home size={15} />
            Back to Home
          </Link>
          <button onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 w-40 py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-sm rounded-full transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft size={15} />
            Go Back
          </button>
        </div>

        <p className="mt-5 text-naija-green-400/30 text-[10px] font-black tracking-[0.25em] uppercase">
          Naija Next Warrior · A WLA Entertainment Company
        </p>
      </div>
    </div>
  )
}