// ==========================================
// FILE: components/careers/CareersHero.tsx
// ==========================================

import { Heart, TrendingUp, Users } from 'lucide-react'

export default function CareersHero() {
  return (
    <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-8 md:p-12 mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Be Part of Something Legendary</h2>
      <p className="text-lg text-green-50 leading-relaxed mb-6">
        We're launching Nigeria's first ninja warrior competition series and looking for talented, passionate individuals to join our founding team. This is your opportunity to be part of history and help create a movement that will inspire millions across Africa.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <Heart className="mb-2" size={28} />
          <p className="font-bold mb-1">Ground Floor Opportunity</p>
          <p className="text-green-100 text-sm">Join us at the start of something big</p>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <TrendingUp className="mb-2" size={28} />
          <p className="font-bold mb-1">Rapid Growth</p>
          <p className="text-green-100 text-sm">Grow your career as we expand</p>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <Users className="mb-2" size={28} />
          <p className="font-bold mb-1">Dynamic Team</p>
          <p className="text-green-100 text-sm">Work with passionate creators</p>
        </div>
      </div>
    </div>
  )
}