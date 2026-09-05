'use client'

// File: app/(main)/competition/page.tsx

import Link from 'next/link'
import { ArrowLeft, Trophy, MapPin, Users, Award, Target } from 'lucide-react'

const STAGES = [
  {
    stage: '01',
    name: 'Regional Qualifiers',
    icon: <MapPin size={24} />,
    desc: "Six regional competitions across Nigeria's geopolitical zones. Athletes compete on challenging obstacle courses with timed runs. Top performers from each region advance to the semi-finals.",
    details: ['Duration: 2–3 days per region', 'Top 20 competitors advance', 'Obstacles: 6–8 challenges'],
  },
  {
    stage: '02',
    name: 'Semi-Finals',
    icon: <Users size={24} />,
    desc: 'Top regional performers compete in more advanced courses testing agility, upper body strength, and mental determination. Only the elite move forward to represent their regions.',
    details: ['Duration: 1 week', 'Top 30 competitors advance', 'Obstacles: 10–12 challenges'],
  },
  {
    stage: '03',
    name: 'Grand Finale',
    icon: <Award size={24} />,
    desc: "The ultimate showdown in Abuja. Nigeria's best ninja warriors face the most difficult course for championship glory, national recognition, and life-changing rewards.",
    details: ['Duration: 3 days', 'Final 30 competitors', 'Obstacles: 15+ challenges', 'Live broadcast nationwide'],
  },
]

const OBSTACLE_CATEGORIES = [
  { title: 'Speed & Agility', desc: 'Obstacles that test reaction time, footwork, and precision movement under timed conditions.' },
  { title: 'Strength & Endurance', desc: 'Physically demanding challenges requiring grip strength, upper body power, and sustained effort.' },
  { title: 'Balance & Control', desc: 'Narrow, unstable, and dynamic surfaces that demand full body control and composure.' },
  { title: 'Tactical Decision-Making', desc: 'Sections of the course where the choices a competitor makes directly determine their outcome.' },
  { title: 'Dynamic Elements', desc: 'Moving and unpredictable components that keep competitors and audiences on edge.' },
  { title: 'Final Stage', desc: 'The closing section of the course - the most demanding, where only the best reach and fewer complete.' },
]

const JUDGING = [
  'Competitors are timed from start to finish or until elimination',
  'Falling or touching water results in immediate elimination',
  'Furthest distance + fastest time determines advancement',
  'All decisions are final and reviewed by certified judges',
]

const REWARDS = [
  { icon: <Trophy size={22} />, color: 'bg-nnw-gold text-nnw-navy', position: 'Champion', rewards: ['National title & trophy', 'Major cash prize', 'Media feature & brand placement'] },
  { icon: <Award size={22} />, color: 'bg-nnw-ash text-nnw-navy', position: 'Runner-Up', rewards: ['Silver medal', 'Cash prize', 'National recognition'] },
  { icon: <Award size={22} />, color: 'bg-nnw-amber text-nnw-bone', position: '3rd Place', rewards: ['Bronze medal', 'Cash prize', 'National recognition'] },
  { icon: <Target size={22} />, color: 'bg-nnw-green/15 text-nnw-green', position: '4th – 10th Place', rewards: ['Cash prize', 'Finalist certificate', 'NNW platform profile'] },
]

const OPPORTUNITIES = [
  { title: 'Career Opportunities', desc: 'Top performers gain visibility with brands, sporting organisations, and media platforms actively seeking athletic talent.' },
  { title: 'Sponsorship Pathways', desc: 'Outstanding athletes become eligible for NNW sponsorship consideration and long-term partnership opportunities through WLA.' },
  { title: 'National Recognition', desc: 'Every finalist earns a certified NNW credential, competition merchandise, and a profile on the official NNW platform.' },
]

export default function CompetitionPage() {
  return (
    <>
      <header className="relative overflow-hidden bg-gradient-to-br from-nnw-navy via-nnw-navy to-nnw-green pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-2 mb-4">
          </div>
          <div className="flex items-center gap-4 mb-3">
            <Trophy size={36} className="text-nnw-gold" />
            <h1 className="font-display uppercase text-4xl md:text-6xl text-nnw-bone leading-none">Competition Format.</h1>
          </div>
          <p className="text-nnw-ash text-lg max-w-xl">How Naija Next Warrior works — from regional qualifiers to the Grand Finale.</p>
        </div>
      </header>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Overview */}
        <div className="bg-gradient-to-br from-nnw-navy to-nnw-green text-nnw-bone rounded-lg p-8 md:p-12 mb-16">
          <h2 className="font-display uppercase text-3xl md:text-4xl mb-4 leading-tight">
            Earn Recognition, Opportunity, and Rewards Through Strength, Strategy, and Resilience.
          </h2>
          <p className="text-lg text-nnw-ash leading-relaxed">
            Naija Next Warrior is a multi-stage competition that tests athletes across speed, strength, agility, and mental toughness. Competitors face increasingly difficult obstacle courses, with only the best advancing to the Grand Finale in Abuja - and rewards that reflect excellence at every level.
          </p>
        </div>

        {/* Competition Structure */}
        <div className="mb-16">
          <h2 className="font-display uppercase text-3xl text-nnw-navy mb-8">Competition Structure</h2>
          <div className="space-y-6">
            {STAGES.map((item, i) => (
              <div key={i} className="flex gap-6 p-8 bg-nnw-navy/[0.02] rounded-lg border border-nnw-navy/10 hover:border-nnw-green/40 transition">
                <div className="flex-shrink-0">
                  <div className="font-display text-3xl text-nnw-green mb-4">{item.stage}</div>
                  <div className="w-12 h-12 bg-nnw-green/10 rounded-lg flex items-center justify-center text-nnw-green">
                    {item.icon}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-display uppercase text-nnw-navy text-2xl mb-3">{item.name}</h3>
                  <p className="text-nnw-navy/65 mb-4 leading-relaxed">{item.desc}</p>
                  <div className="flex flex-wrap gap-3">
                    {item.details.map((detail, j) => (
                      <span key={j} className="text-sm bg-white px-3 py-1.5 rounded-full text-nnw-navy/70 border border-nnw-navy/10 font-mono">
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Obstacle Categories */}
        <div className="mb-16">
          <h2 className="font-display uppercase text-3xl text-nnw-navy mb-8">Obstacle Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OBSTACLE_CATEGORIES.map((obstacle, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border-2 border-nnw-navy/10 hover:border-nnw-green/40 transition">
                <h3 className="font-display uppercase text-nnw-navy mb-3 text-lg">{obstacle.title}</h3>
                <p className="text-sm text-nnw-navy/60 leading-relaxed">{obstacle.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Judging & Scoring */}
        <div className="mb-16">
          <h2 className="font-display uppercase text-3xl text-nnw-navy mb-8">Judging &amp; Scoring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-nnw-navy/[0.03] rounded-lg p-8 border border-nnw-navy/10">
              <h3 className="font-display uppercase text-nnw-navy mb-4 text-xl">How We Judge</h3>
              <ul className="space-y-3">
                {JUDGING.map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="text-nnw-green font-bold mt-0.5">✓</span>
                    <span className="text-nnw-navy/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-nnw-green/5 rounded-lg p-8 border border-nnw-green/15">
              <h3 className="font-display uppercase text-nnw-navy mb-4 text-xl">Fair Competition</h3>
              <p className="text-nnw-navy/70 leading-relaxed mb-4">
                We maintain the highest standards of fairness and transparency. Multiple camera angles capture every moment, and certified judges review all runs to ensure accurate results.
              </p>
              <p className="text-nnw-navy/70 leading-relaxed">
                Athletes compete in age and skill brackets to ensure competitive balance, with special categories for veterans, women, and youth competitors.
              </p>
            </div>
          </div>
        </div>

        {/* Prizes & Recognition */}
        <div className="mb-16">
          <h2 className="font-display uppercase text-3xl text-nnw-navy mb-3">Prizes &amp; Recognition</h2>
          <p className="text-nnw-navy/50 mb-8 text-lg">Every level of the competition is rewarded.</p>

          <div className="bg-gradient-to-br from-nnw-gold/10 to-nnw-amber/10 rounded-lg p-8 border border-nnw-gold/25 mb-6">
            <div className="space-y-4 mb-8">
              {REWARDS.map((item, i) => (
                <div key={i} className="flex items-center gap-5 bg-white rounded-lg px-6 py-4 border border-nnw-gold/20">
                  <div className={`w-11 h-11 ${item.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display uppercase text-nnw-navy">{item.position}</p>
                    <p className="text-sm text-nnw-navy/50">{item.rewards.join(' · ')}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-5 border-t border-nnw-gold/25 text-center">
              <p className="text-nnw-navy/50 text-sm font-mono">
                Official prize figures will be announced at the start of the competition.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OPPORTUNITIES.map((item, i) => (
              <div key={i} className="bg-nnw-navy/[0.02] rounded-lg p-6 border border-nnw-navy/10">
                <h3 className="font-display uppercase text-nnw-navy mb-2 text-base">{item.title}</h3>
                <p className="text-sm text-nnw-navy/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-nnw-navy to-nnw-green text-nnw-bone rounded-lg p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display uppercase text-3xl md:text-4xl mb-4">Ready to Compete?</h2>
            <p className="text-lg text-nnw-ash mb-8">
              This is your chance to earn recognition, opportunity, and rewards on a national stage. Register now and prove what you&apos;re made of.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="inline-block px-8 py-3 bg-nnw-gold text-nnw-navy font-mono text-sm tracking-wider uppercase font-bold rounded hover:bg-nnw-gold-soft transition">
                Register Now
              </Link>
              <Link href="/training" className="inline-block px-8 py-3 border-2 border-nnw-bone/40 text-nnw-bone font-mono text-sm tracking-wider uppercase font-bold rounded hover:bg-nnw-bone/10 transition">
                Find Training Centers
              </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}