// ==========================================
// FILE: app/careers/page.tsx
// MAIN PAGE - Imports all components
// ==========================================

'use client'

import Navbar from '../navbar'
import Footer from '../footer'
import CareersHeader from '@/components/careers/CareersHeader'
import CareersHero from '@/components/careers/CareersHero'
import JobsList from '@/components/careers/Joblist'
import WhyJoinSection from '@/components/careers/WhyJoinSection'
import CareersCTA from '@/components/careers/CareersCTA'

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-20">
        <CareersHeader />
        <CareersHero />
        <JobsList />
        <WhyJoinSection />
        <CareersCTA />
      </div>

      <Footer />
    </main>
  )
}