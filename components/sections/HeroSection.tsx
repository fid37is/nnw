import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, User } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Champion {
  id: string
  user_id: string
  season_id: string
  full_name: string
  position: number
  photo_url: string | null
}

interface Season {
  id: string
  name: string
  year: number
  application_start_date: string
  application_end_date: string
  status: string
}

interface HeroSectionProps {
  champion: Champion | null
  season: Season | null
  isApplicationOpen: boolean
}

export default function HeroSection({ champion, season, isApplicationOpen }: HeroSectionProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  
  useEffect(() => {
    const revealTimer = setTimeout(() => {
      setIsRevealed(true)
      
      // After 12 seconds, fold back down
      const hideTimer = setTimeout(() => {
        setIsRevealed(false)
      }, 12000)
      
      return () => clearTimeout(hideTimer)
    }, 5000)
    
    return () => clearTimeout(revealTimer)
  }, [isRevealed])
  
  // Check if there's a real champion (from champions table)
  const isChampion = champion && champion.photo_url
  
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div className="inline-block px-4 py-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-green-200 text-sm font-bold rounded-full">
              SEASON {season?.year}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              Test Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-200">
                Limits
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-green-100 leading-relaxed max-w-xl">
              Nigeria's premier physical competition. Compete against the best, push your boundaries, and claim your place in history.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {isApplicationOpen && (
                <Link
                  href="/register"
                  className="group px-8 py-4 bg-white text-green-900 font-bold rounded-xl hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Apply Now
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              <Link
                href="/leaderboard"
                className="px-8 py-4 bg-green-500/10 backdrop-blur-sm border-2 border-green-400/30 text-white font-bold rounded-xl hover:bg-green-500/20 transition-all duration-300 text-center"
              >
                View Leaderboard
              </Link>
            </div>
          </div>

          {/* Right Content - Champion with Curtain Blind */}
          <div className="relative flex items-center justify-center min-h-[600px]">
            {/* Champion Image - Always visible, behind the curtain */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl">
                  {isChampion ? (
                    <>
                      <Image
                        src={champion.photo_url!}
                        alt={champion.full_name}
                        fill
                        loading="eager"
                        priority
                        className="object-cover object-center"
                      />
                      
                      {/* Trophy badge */}
                      <div className="absolute top-6 left-6 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 flex items-center justify-center text-4xl shadow-xl border-4 border-white/20 animate-bounce">
                        🏆
                      </div>
                      
                      {/* Overlay gradient */}
                      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                      
                      {/* Champion info */}
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <p className="text-xs font-bold text-yellow-400 mb-3 tracking-widest">REIGNING CHAMPION</p>
                        <p className="text-white font-black text-3xl leading-tight">
                          {champion.full_name}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black">
                        <div className="text-[200px] text-white/5 font-black">?</div>
                      </div>
                      
                      {/* Animated particles */}
                      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '300ms' }}></div>
                      <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '700ms' }}></div>
                      
                      {/* Overlay gradient */}
                      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                      
                      {/* Next champion info */}
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <p className="text-xs font-bold text-green-400 mb-3 tracking-widest">NEXT CHAMPION</p>
                        <p className="text-white font-black text-3xl leading-tight mb-3">
                          Could Be You
                        </p>
                        {isApplicationOpen && (
                          <p className="text-sm text-green-300 font-medium">Apply now and make history</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Curtain Blind - Pulls up and bunches/shrinks at top */}
            <div 
              className="absolute inset-0 flex flex-col overflow-visible transition-all duration-[2000ms] ease-in-out"
              style={{
                transform: isRevealed ? 'translateY(-100%)' : 'translateY(0)',
                height: isRevealed ? '15%' : '100%',
                transformOrigin: 'top',
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-green-800/95 via-green-900/95 to-black/95 backdrop-blur-sm rounded-3xl shadow-2xl">
                {/* Horizontal slats for realistic blind texture */}
                <div className="absolute inset-0 flex flex-col rounded-3xl overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i}
                      className="flex-1 border-b border-green-700/20"
                      style={{
                        background: i % 2 === 0 
                          ? 'linear-gradient(to bottom, rgba(22, 101, 52, 0.3), rgba(20, 83, 45, 0.4))' 
                          : 'linear-gradient(to bottom, rgba(20, 83, 45, 0.4), rgba(22, 101, 52, 0.3))',
                      }}
                    />
                  ))}
                </div>
                
                {/* Text on curtain - scales down when pulled up */}
                <div 
                  className="relative z-10 transition-all duration-[2000ms]"
                  style={{
                    transform: isRevealed ? 'scale(0.15)' : 'scale(1)',
                    opacity: isRevealed ? 0.6 : 1,
                  }}
                >
                  <h2 className="text-7xl md:text-9xl font-black text-white leading-[0.9] text-center px-4">
                    <div>NAIJA</div>
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-200">NINJA</div>
                    <div>WARRIOR</div>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}