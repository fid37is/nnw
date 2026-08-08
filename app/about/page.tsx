'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Info, Award, Globe, Target, Users, Building2, ShieldCheck, MapPin, Mail, Phone } from 'lucide-react'
import Navbar from '../navbar'
import Footer from '../footer'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-14">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary-700 mb-4 w-fit transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <Info size={40} className="text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">About Naija Next Warrior</h1>
          </div>
          <p className="text-xl text-muted-foreground">Africa's First Ninja Competition Series · A WLA Entertainment Company</p>
        </div>

        {/* Hero Statement */}
        <div className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Strategy. Strength. Resilience.</h2>
          <p className="text-lg text-primary-50 leading-relaxed">
            Naija Next Warrior is a groundbreaking national fitness and entertainment challenge, adapted from the globally successful Ninja Warrior franchise and tailored for the Nigerian audience. Our competition showcases extraordinary athletes across all 6 geopolitical zones, celebrating the resilience, determination, and warrior spirit of Nigeria.
          </p>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="leading-relaxed mb-4">
              Naija Next Warrior was born from a vision to create a platform where Nigerians can test their physical limits, compete at the highest level, and inspire millions across the continent. We recognised that Nigeria, with its young, vibrant population and growing entertainment industry, was the perfect place to launch Africa's first ninja competition series.
            </p>
            <p className="leading-relaxed">
              The global success of Ninja Warrior franchises worldwide proved that audiences crave authentic displays of human determination and athletic excellence. We're bringing that same excitement to Nigeria while celebrating our unique culture, diversity, and indomitable spirit - under the umbrella of WLA Entertainment Ltd, the company built to take this vision continental.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-muted rounded-xl p-8 border border-border">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="text-primary" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To provide a world-class platform where Nigerians can test their physical abilities, compete at the highest level, and achieve recognition for their warrior spirit and determination. We inspire millions while promoting fitness, perseverance, and national pride.
            </p>
          </div>
          <div className="bg-muted rounded-xl p-8 border border-border">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Globe className="text-primary" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              To build a movement of elite athletes who inspire millions, break barriers, and represent Nigeria on the world stage. Through WLA Entertainment Ltd, we envision expanding across Africa - from Nigeria's NNW to a pan-continental league of warrior competitions.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Target size={24} />,
                title: 'Strategy',
                desc: 'Every great warrior thinks before they act. We build intelligent, sustainable structures for athletes, productions, and business that stand the test of time.',
                color: 'bg-info-100 text-info-600'
              },
              {
                icon: <Award size={24} />,
                title: 'Strength',
                desc: 'Physical and organisational strength define us. From course design to athlete development, we pursue excellence at every level of the competition.',
                color: 'bg-success-100 text-success-600'
              },
              {
                icon: <Users size={24} />,
                title: 'Resilience',
                desc: 'The spirit of the warrior is to get back up. We celebrate grit, perseverance, and the courage to keep going - on the course and in life.',
                color: 'bg-accent-100 text-accent-600'
              },
            ].map((value, i) => (
              <div key={i} className="bg-muted rounded-xl p-6 border border-border">
                <div className={`w-12 h-12 ${value.color} rounded-lg flex items-center justify-center mb-4`}>
                  {value.icon}
                </div>
                <h3 className="font-bold text-foreground mb-2 text-lg">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">What Makes Us Different</h2>
          <div className="bg-gradient-to-br from-info-50 to-accent-50 rounded-xl p-8 border border-info-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-foreground mb-4 text-xl">Nationwide Coverage</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We're not just a Lagos or Abuja event. Our competition spans all 6 geopolitical zones, giving every Nigerian the opportunity to compete and showcase their abilities on a national stage.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-4 text-xl">Cultural Authenticity</h3>
                <p className="text-muted-foreground leading-relaxed">
                  While inspired by the global Ninja Warrior format, we've adapted the competition to reflect Nigerian culture, values, and the unique athletic spirit of our people.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-4 text-xl">Professional Production</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our competition features world-class course design, professional broadcasting, and comprehensive athlete support to ensure every participant has the best possible experience.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-4 text-xl">Continental Expansion</h3>
                <p className="text-muted-foreground leading-relaxed">
                  NNW is the first chapter of a larger story. Through WLA Entertainment Ltd, we are building the infrastructure to bring warrior competitions to every corner of Africa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ══ WLA SECTION ══ */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Building2 size={32} className="text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Powered by WLA Entertainment Ltd</h2>
          </div>

          {/* WLA Banner Card */}
          <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-xl mb-8">

            {/* Dark header with logo */}
            <div className="bg-gray-950 px-8 py-10 flex flex-col sm:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-32 h-32 rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-lg border border-gray-800">
                <Image
                  src="/wla-logo.png"
                  alt="WLA Entertainment Ltd"
                  width={128}
                  height={128}
                  className="object-contain"
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-yellow-400 text-xs font-bold tracking-[0.2em] uppercase mb-1">Umbrella Company</p>
                <h3 className="text-3xl font-black text-white mb-1">WLA Entertainment Ltd</h3>
                <p className="text-gray-400 text-sm mb-4">Warrior League Africa - Building Africa's Sports Entertainment Future</p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-full text-xs font-semibold">
                    <ShieldCheck size={12} />
                    CAC Registered · RC No. 9529867
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    Active · Est. May 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Info strip */}
            <div className="bg-gray-900 px-8 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-800">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Registered Address</p>
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-200 text-sm leading-snug">Flat 7, Progress House, Oduke, Asaba, Delta State, Nigeria</p>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Contact</p>
                <div className="flex flex-col gap-1.5">
                  <a href="mailto:support@naijaninja.net" className="flex items-center gap-2 text-gray-200 text-sm hover:text-yellow-400 transition">
                    <Mail size={13} className="text-yellow-500 flex-shrink-0" />
                    support@naijaninja.net
                  </a>
                  <a href="tel:+2348085952266" className="flex items-center gap-2 text-gray-200 text-sm hover:text-yellow-400 transition">
                    <Phone size={13} className="text-yellow-500 flex-shrink-0" />
                    +234 808 595 2266
                  </a>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Business Scope</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Sports Entertainment · Broadcasting · Franchise Licensing · Talent Management · Digital Platforms
                </p>
              </div>
            </div>
          </div>

          {/* WLA 4-card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted rounded-xl p-6 border border-border">
              <h3 className="font-bold text-foreground text-lg mb-3">The Parent Company</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                WLA Entertainment Ltd (Warrior League Africa) is the registered Nigerian company behind Naija Next Warrior. Incorporated with the Corporate Affairs Commission in May 2026, WLA was purpose-built to own, operate, and grow warrior-format sports entertainment properties across the African continent.
              </p>
            </div>
            <div className="bg-muted rounded-xl p-6 border border-border">
              <h3 className="font-bold text-foreground text-lg mb-3">NNW as the First Franchise</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Naija Next Warrior is the flagship competition under WLA's umbrella - the first in a planned network of regional warrior leagues. NNW sets the gold standard that future franchises across Africa will be built upon.
              </p>
            </div>
            <div className="bg-muted rounded-xl p-6 border border-border">
              <h3 className="font-bold text-foreground text-lg mb-3">The Road to Pan-African</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                WLA's long-term vision is a continental league - with Nigeria (NNW) as the anchor, and future regional competitions like Ghan Next Warrior (GNW) and others expanding across Africa under the WLA banner.
              </p>
            </div>
            <div className="bg-muted rounded-xl p-6 border border-border">
              <h3 className="font-bold text-foreground text-lg mb-3">Legally Backed, Fully Committed</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                With an active CAC registration and a principal business scope spanning sports entertainment, media production, broadcasting, and franchise licensing - WLA Entertainment Ltd is built for the long game.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-primary-foreground rounded-xl p-8 md:p-12 mb-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Movement</h2>
            <p className="text-lg text-primary-50 mb-8">
              Whether you're an aspiring competitor, a fitness enthusiast, or someone looking to support Nigerian excellence, there's a place for you in the Naija Next Warrior community - powered by WLA Entertainment Ltd.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="inline-block px-8 py-3 bg-background text-primary font-bold rounded-full hover:bg-primary-50 transition-all hover:scale-105">
                Apply as Competitor
              </Link>
              <Link href="/contact" className="inline-block px-8 py-3 bg-primary-500 text-primary-foreground font-bold rounded-full hover:bg-primary-400 border-2 border-primary-foreground transition-all hover:scale-105">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
