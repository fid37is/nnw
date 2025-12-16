// ==========================================
// FILE: components/careers/CareersCTA.tsx
// ==========================================

import Link from 'next/link'

export default function CareersCTA() {
  return (
    <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-8 md:p-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't See Your Role?</h2>
        <p className="text-lg text-green-50 mb-8">
          We're always looking for exceptional talent. Send us your CV and tell us how you can contribute to building Nigeria's premier sports entertainment platform.
        </p>
        <Link 
          href="/contact" 
          className="inline-block px-8 py-3 bg-white text-naija-green-600 font-bold rounded-full hover:bg-green-50 transition"
        >
          Contact HR Team
        </Link>
      </div>
    </div>
  )
}