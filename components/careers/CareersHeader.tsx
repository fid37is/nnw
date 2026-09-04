// components/careers/CareersHeader.tsx
import Link from 'next/link'
import { ArrowLeft, Briefcase } from 'lucide-react'

export default function CareersHeader() {
  return (
    <div className="mb-12 pt-36">
      <div className="flex items-center gap-4 mb-3">
        <Briefcase size={40} className="text-nnw-green" />
        <h1 className="text-4xl md:text-5xl font-display uppercase text-nnw-navy">Join Our Team</h1>
      </div>
      <p className="text-xl text-nnw-navy/60">Careers at WLA Entertainment Ltd - Home of Naija Next Warrior</p>
    </div>
  )
}