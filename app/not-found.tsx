// File: app/not-found.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ArrowLeft, Home, Trophy } from 'lucide-react'

const DOTS = Array.from({ length: 12 }, (_, i) => ({
  w: (((i * 7 + 3) % 40) / 10) + 1,
  h: (((i * 11 + 5) % 40) / 10) + 1,
  l: ((i * 17 + 13) % 100),
  t: ((i * 23 + 7) % 100),
  dur: (((i * 3 + 2) % 40) / 10) + 3,
  delay: (((i * 5 + 1) % 30) / 10),
}))

const OBSTACLE_STAGES = [
  { name: 'Quintuple Steps',  cleared: true  },
  { name: 'Rolling Log',      cleared: true  },
  { name: 'Spider Climb',     cleared: false },
  { name: 'Warped Wall',      cleared: false },
  { name: 'This Page',        cleared: false },
]

export default function NotFound() {
  const [mounted, setMounted] = useState(false)
  const [activeStage, setActiveStage] = useState(0)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setActiveStage(prev => (prev + 1) % OBSTACLE_STAGES.length)
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center overflow-hidden relative px-4">

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-naija-green-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-naija-green-800/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating dots */}
      {mounted && (
        <div className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none">
          {DOTS.map((d, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-naija-green-400/20"
              style={{
                width: `${d.w}px`, height: `${d.h}px`,
                left: `${d.l}%`, top: `${d.t}%`,
                animation: `pulse ${d.dur}s ease-in-out ${d.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-naija-green-500/20 rounded-full blur-xl" />
            <Image
              src="https://res.cloudinary.com/lordefid/image/upload/v1774595053/NNW_kxgtcf.png"
              alt="Naija Ninja Warrior"
              width={80}
              height={80}
              className="relative rounded-xl drop-shadow-[0_0_20px_rgba(16,192,132,0.4)]"
            />
          </div>
        </div>

        {/* 404 number */}
        <div className="relative mb-2">
          <p className="text-[120px] sm:text-[160px] font-black leading-none text-white/5 select-none absolute inset-0 flex items-center justify-center">
            404
          </p>
          <p className="text-[120px] sm:text-[160px] font-black leading-none bg-gradient-to-r from-naija-green-400 to-naija-green-300 bg-clip-text text-transparent relative">
            404
          </p>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
          You fell off the course.
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          This page doesn't exist. Even our toughest warriors couldn't find it.
        </p>

        {/* Obstacle course progress */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-10 text-left max-w-sm mx-auto">
          <p className="text-naija-green-400 text-xs font-black tracking-widest uppercase mb-4 flex items-center gap-2">
            <Trophy size={12} />
            Course Progress
          </p>
          <div className="space-y-2">
            {OBSTACLE_STAGES.map((stage, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                  i === activeStage ? 'bg-naija-green-600/20 border border-naija-green-500/30' : ''
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black ${
                  stage.cleared
                    ? 'bg-naija-green-500 text-white'
                    : i === activeStage
                    ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                    : 'bg-white/10 text-white/30'
                }`}>
                  {stage.cleared ? '✓' : i === activeStage ? '✕' : '·'}
                </div>
                <span className={`text-sm font-semibold ${
                  stage.cleared
                    ? 'text-gray-400 line-through'
                    : i === activeStage
                    ? 'text-white'
                    : 'text-white/30'
                }`}>
                  {stage.name}
                </span>
                {i === activeStage && !stage.cleared && (
                  <span className="ml-auto text-xs text-red-400 font-bold">FAILED</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-naija-green-700 hover:bg-naija-green-600 text-white font-black text-base rounded-full transition-all duration-300 shadow-lg shadow-naija-green-900/40 hover:scale-105"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-base rounded-full transition-all duration-300"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Brand tagline */}
        <p className="mt-12 text-naija-green-400/40 text-xs font-black tracking-[0.3em] uppercase">
          Naija Ninja Warrior
        </p>
      </div>
    </div>
  )
}