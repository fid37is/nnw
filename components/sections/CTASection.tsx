import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Champion {
  id: string
  user_id: string
  season_id: string
  full_name: string
  position: number
  photo_url: string | null
}

interface CTASectionProps {
  champion: Champion | null
  isApplicationOpen: boolean
}

export default function CTASection({ champion, isApplicationOpen }: CTASectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-100">
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-3xl p-12 md:p-20 text-center text-white shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-6">Ready to Compete?</h2>
          {isApplicationOpen ? (
            <>
              <p className="text-lg md:text-xl text-green-50 mb-10 max-w-3xl mx-auto leading-relaxed">
                {champion
                  ? `Can you dethrone ${champion.full_name}? Join hundreds of warriors and prove yourself.`
                  : 'Be the first to claim the champion title. Apply now and make history.'}
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-green-700 font-black text-lg rounded-xl hover:bg-green-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 whitespace-nowrap"
              >
                Apply Now
                <ArrowRight size={24} />
              </Link>
            </>
          ) : (
            <>
              <p className="text-lg md:text-xl text-green-50 mb-10 max-w-3xl mx-auto leading-relaxed">
                Applications are currently closed. Stay tuned for the next season or register to get updates about future competitions.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-green-700 font-black text-lg rounded-full hover:bg-green-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 whitespace-nowrap"
              >
                Register for Updates
                <ArrowRight size={24} />
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  )
}