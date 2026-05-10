// components/careers/WhyJoinSection.tsx
import { Globe, Award, Users, TrendingUp } from '@/components/ui/icons'

const benefits = [
  {
    icon: Globe,
    title: 'Pioneer a Movement',
    desc: "Be part of launching Nigeria's first ninja competition series under WLA Entertainment Ltd - and help shape the future of sports entertainment across Africa.",
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Award,
    title: 'Make Real Impact',
    desc: 'Your work will inspire millions of Nigerians to pursue fitness, overcome challenges, and achieve their potential.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Users,
    title: 'Diverse Team',
    desc: 'Work alongside passionate professionals from entertainment, sports, media, and technology backgrounds across Nigeria.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    desc: 'As WLA Entertainment expands, early team members will have exceptional opportunities for advancement and leadership across the company.',
    color: 'bg-orange-100 text-orange-600',
  },
]

export default function WhyJoinSection() {
  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Join WLA Entertainment?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((benefit, i) => {
          const Icon = benefit.icon
          return (
            <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className={`w-12 h-12 ${benefit.color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">{benefit.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{benefit.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}