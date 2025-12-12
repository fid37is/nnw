import Link from 'next/link'
import Image from 'next/image'
import { Trophy, Users, User, Crown } from 'lucide-react'

interface Champion {
  id: string
  user_id: string
  season_id: string
  full_name: string
  position: number
  photo_url: string | null
}

interface Runner {
  id: string
  user_id: string
  full_name: string
  position: number
  photo_url: string | null
}

interface TopCompetitorsProps {
  champion: Champion | null
  runners: Runner[]
  seasonStatus?: 'active' | 'ended' | 'upcoming' // Add this prop
}

export default function TopCompetitors({ champion, runners, seasonStatus = 'active' }: TopCompetitorsProps) {
  const medals = ['🥇', '🥈', '🥉']
  const gradients = [
    'from-yellow-400 to-yellow-500',
    'from-gray-300 to-gray-400',
    'from-orange-400 to-orange-500'
  ]

  // Dynamic text based on season status
  const sectionTitle = seasonStatus === 'ended' 
    ? 'Top Leaders'
    : 'Top Competitors'

  const sectionDescription = seasonStatus === 'ended'
    ? 'The champions from the just concluded season'
    : "The leaders in this season's competition"

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-100">
      <div className="mb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          {seasonStatus === 'ended' ? (
            <Crown size={40} className="text-yellow-500" />
          ) : (
            <Trophy size={40} className="text-naija-green-600" />
          )}
          <h2 className="text-4xl md:text-5xl font-black text-naija-green-900">
            {sectionTitle}
          </h2>
        </div>
        <p className="text-gray-600 text-lg">{sectionDescription}</p>
        {seasonStatus === 'ended' && (
          <div className="mt-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold border-2 border-yellow-300">
              <Crown size={18} />
              Season Concluded
            </span>
          </div>
        )}
      </div>

      {champion || runners.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {champion && (
              <CompetitorCard
                competitor={champion}
                medal={medals[0]}
                gradient={gradients[0]}
                index={0}
                isSeasonEnded={seasonStatus === 'ended'}
              />
            )}

            {runners.map((runner, idx) => (
              <CompetitorCard
                key={runner.id}
                competitor={runner}
                medal={medals[idx + 1]}
                gradient={gradients[idx + 1]}
                index={idx + 1}
                isSeasonEnded={seasonStatus === 'ended'}
              />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Users size={22} />
              View Full Leaderboard
            </Link>
          </div>
        </>
      ) : (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-16 text-center">
          <div className="inline-block p-6 bg-white rounded-full shadow-lg mb-6">
            <Trophy size={64} className="text-gray-300" />
          </div>
          <p className="text-2xl text-gray-900 font-bold mb-3">Competition in progress</p>
          <p className="text-gray-600 text-lg">Top competitors will appear here as the season progresses</p>
        </div>
      )}
    </section>
  )
}

interface CompetitorCardProps {
  competitor: { full_name: string; photo_url: string | null }
  medal: string
  gradient: string
  index: number
  isSeasonEnded: boolean
}

function CompetitorCard({ competitor, medal, gradient, index, isSeasonEnded }: CompetitorCardProps) {
  return (
    <div 
      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
        {competitor.photo_url ? (
          <Image
            src={competitor.photo_url}
            alt={competitor.full_name}
            fill
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
            <User size={80} className="text-gray-500" />
          </div>
        )}
        
        <div className={`absolute top-4 left-4 w-16 h-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-4xl shadow-xl border-4 border-white/20 transform group-hover:rotate-12 transition-transform duration-300`}>
          {medal}
        </div>

        {/* Show crown on 1st place if season has ended */}
        {isSeasonEnded && index === 0 && (
          <div className="absolute top-4 right-4 animate-pulse">
            <Crown size={32} className="text-yellow-400 drop-shadow-lg" />
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Show champion badge only if season ended and it's 1st place */}
          {isSeasonEnded && index === 0 && (
            <div className="mb-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/90 text-white text-xs font-bold rounded-full backdrop-blur-sm">
                <Crown size={14} />
                CHAMPION
              </span>
            </div>
          )}
          
          <p className="text-white font-black text-2xl leading-tight line-clamp-2">
            {competitor.full_name}
          </p>
        </div>
      </div>
    </div>
  )
}