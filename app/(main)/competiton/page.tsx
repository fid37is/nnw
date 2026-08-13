'use client'

import Link from 'next/link'
import { ArrowLeft, Trophy, MapPin, Users, Award, Target } from '@/components/ui/icons'

export default function CompetitionPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden pt-32">

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-14">

        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2 text-naija-green-600 hover:text-naija-green-700 mb-4 w-fit">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <Trophy size={40} className="text-naija-green-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Competition Format</h1>
          </div>
          <p className="text-xl text-gray-600">How Naija Next Warrior Works</p>
        </div>

        {/* Overview */}
        <div className="bg-naija-green-600 text-white rounded-xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Earn Recognition, Opportunity, and Rewards Through Strength, Strategy, and Resilience.
          </h2>
          <p className="text-lg text-green-50 leading-relaxed">
            Naija Next Warrior is a multi-stage competition that tests athletes across speed, strength, agility, and mental toughness. Competitors face increasingly difficult obstacle courses, with only the best advancing to the Grand Finale in Abuja - and rewards that reflect excellence at every level.
          </p>
        </div>

        {/* Competition Structure */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Competition Structure</h2>
          <div className="space-y-6">
            {[
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
            ].map((item, i) => (
              <div key={i} className="flex gap-6 p-8 bg-gray-50 rounded-xl border border-gray-200 hover:border-naija-green-300 transition">
                <div className="flex-shrink-0">
                  <div className="text-3xl font-bold text-naija-green-600 mb-4">{item.stage}</div>
                  <div className="w-12 h-12 bg-naija-green-100 rounded-lg flex items-center justify-center text-naija-green-600">
                    {item.icon}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-900 text-2xl mb-3">{item.name}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{item.desc}</p>
                  <div className="flex flex-wrap gap-3">
                    {item.details.map((detail, j) => (
                      <span key={j} className="text-sm bg-white px-3 py-1.5 rounded-full text-gray-700 border border-gray-200">
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Obstacle Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Obstacle Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Speed & Agility',
                desc: 'Obstacles that test reaction time, footwork, and precision movement under timed conditions.',
              },
              {
                title: 'Strength & Endurance',
                desc: 'Physically demanding challenges requiring grip strength, upper body power, and sustained effort.',
              },
              {
                title: 'Balance & Control',
                desc: 'Narrow, unstable, and dynamic surfaces that demand full body control and composure.',
              },
              {
                title: 'Tactical Decision-Making',
                desc: 'Sections of the course where the choices a competitor makes directly determine their outcome.',
              },
              {
                title: 'Dynamic Elements',
                desc: 'Moving and unpredictable components that keep competitors and audiences on edge.',
              },
              {
                title: 'Final Stage',
                desc: 'The closing section of the course - the most demanding, where only the best reach and fewer complete.',
              },
            ].map((obstacle, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-naija-green-400 transition">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{obstacle.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{obstacle.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Judging & Scoring */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Judging & Scoring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-4 text-xl">How We Judge</h3>
              <ul className="space-y-3">
                {[
                  'Competitors are timed from start to finish or until elimination',
                  'Falling or touching water results in immediate elimination',
                  'Furthest distance + fastest time determines advancement',
                  'All decisions are final and reviewed by certified judges',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="text-naija-green-600 font-bold mt-0.5">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-green-50 rounded-xl p-8 border border-green-100">
              <h3 className="font-bold text-gray-900 mb-4 text-xl">Fair Competition</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We maintain the highest standards of fairness and transparency. Multiple camera angles capture every moment, and certified judges review all runs to ensure accurate results.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Athletes compete in age and skill brackets to ensure competitive balance, with special categories for veterans, women, and youth competitors.
              </p>
            </div>
          </div>
        </div>

        {/* Prizes & Recognition */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Prizes & Recognition</h2>
          <p className="text-gray-500 mb-8 text-lg">Every level of the competition is rewarded.</p>

          {/* Reward structure - no figures */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 border border-amber-200 mb-6">
            <div className="space-y-4 mb-8">
              {[
                {
                  icon: <Trophy size={22} className="text-yellow-700" />,
                  bg: 'bg-yellow-400',
                  position: 'Champion',
                  rewards: ['National title & trophy', 'Major cash prize', 'Media feature & brand placement'],
                },
                {
                  icon: <Award size={22} className="text-gray-700" />,
                  bg: 'bg-gray-300',
                  position: 'Runner-Up',
                  rewards: ['Silver medal', 'Cash prize', 'National recognition'],
                },
                {
                  icon: <Award size={22} className="text-orange-800" />,
                  bg: 'bg-orange-300',
                  position: '3rd Place',
                  rewards: ['Bronze medal', 'Cash prize', 'National recognition'],
                },
                {
                  icon: <Target size={22} className="text-naija-green-700" />,
                  bg: 'bg-naija-green-200',
                  position: '4th – 10th Place',
                  rewards: ['Cash prize', 'Finalist certificate', 'NNW platform profile'],
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 bg-white rounded-xl px-6 py-4 border border-amber-100">
                  <div className={`w-11 h-11 ${item.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">{item.position}</p>
                    <p className="text-sm text-gray-500">{item.rewards.join(' · ')}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-5 border-t border-amber-200 text-center">
              <p className="text-gray-500 text-sm">
                Official prize figures will be announced at the start of the competition.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Career Opportunities',
                desc: 'Top performers gain visibility with brands, sporting organisations, and media platforms actively seeking athletic talent.',
              },
              {
                title: 'Sponsorship Pathways',
                desc: 'Outstanding athletes become eligible for NNW sponsorship consideration and long-term partnership opportunities through WLA.',
              },
              {
                title: 'National Recognition',
                desc: 'Every finalist earns a certified NNW credential, competition merchandise, and a profile on the official NNW platform.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-naija-green-600 text-white rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Compete?</h2>
            <p className="text-lg text-green-50 mb-8">
              This is your chance to earn recognition, opportunity, and rewards on a national stage. Register now and prove what you're made of.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register"
                className="inline-block px-8 py-3 bg-white text-naija-green-700 font-bold rounded-full hover:bg-green-50 transition">
                Register Now
              </Link>
              <Link href="/training"
                className="inline-block px-8 py-3 bg-naija-green-500 hover:bg-naija-green-400 text-white font-bold rounded-full border-2 border-white transition">
                Find Training Centers
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}