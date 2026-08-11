// File: components/sections/nnw/hooks.tsx
'use client'

import { useEffect, useRef, useState, RefObject } from 'react'
import { ChevronUp, ChevronDown, Minus } from 'lucide-react'

export const useReveal = (): [RefObject<HTMLDivElement | null>, boolean] => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

export const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(26px)',
        transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export const useCountUp = (target: number, start: boolean, duration = 1500): number => {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf: number
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, target, duration])
  return val
}

export const useCountdown = (targetDate: number) => {
  const [t, setT] = useState(() => Math.max(0, targetDate - Date.now()))
  useEffect(() => {
    const id = setInterval(() => setT(Math.max(0, targetDate - Date.now())), 1000)
    return () => clearInterval(id)
  }, [targetDate])
  return {
    d: Math.floor(t / 86400000),
    h: Math.floor((t % 86400000) / 3600000),
    m: Math.floor((t % 3600000) / 60000),
    s: Math.floor((t % 60000) / 1000),
  }
}

export const pad2 = (n: number) => String(n).padStart(2, '0')

// Colors are passed as CSS var() strings by callers - never hardcode a hex here.
export const MoveIcon = ({ move }: { move: string }) => {
  if (move === 'up') return <ChevronUp size={14} color="var(--green)" />
  if (move === 'down') return <ChevronDown size={14} color="var(--ash)" />
  return <Minus size={14} color="var(--ash)" />
}