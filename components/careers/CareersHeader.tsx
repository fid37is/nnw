// ==========================================
// FILE: components/careers/CareersHeader.tsx
// ==========================================

import Link from 'next/link'
import { ArrowLeft, Briefcase } from 'lucide-react'

export default function CareersHeader() {
  return (
    <div className="mb-12">
      <Link href="/" className="flex items-center gap-2 text-naija-green-600 hover:text-naija-green-700 mb-4 w-fit">
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>
      <div className="flex items-center gap-4 mb-3">
        <Briefcase size={40} className="text-naija-green-600" />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Join Our Team</h1>
      </div>
      <p className="text-xl text-gray-600">Help Us Build Africa's Premier Ninja Warrior Competition</p>
    </div>
  )
}