// ==========================================
// FILE: components/careers/CategoryCard.tsx
// ==========================================

import { Briefcase, Video, Settings, TrendingUp, ChevronRight } from 'lucide-react'
import type { JobCategory } from '@/data/jobsData'

interface CategoryCardProps {
  category: JobCategory
  jobCount: number
  isSelected: boolean
  onClick: () => void
}

const iconMap = {
  briefcase: Briefcase,
  video: Video,
  settings: Settings,
  'trending-up': TrendingUp,
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    selectedBorder: 'border-blue-500',
    icon: 'bg-blue-100 text-blue-600',
    badge: 'bg-blue-100 text-blue-700'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    selectedBorder: 'border-purple-500',
    icon: 'bg-purple-100 text-purple-600',
    badge: 'bg-purple-100 text-purple-700'
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    selectedBorder: 'border-orange-500',
    icon: 'bg-orange-100 text-orange-600',
    badge: 'bg-orange-100 text-orange-700'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    selectedBorder: 'border-green-500',
    icon: 'bg-green-100 text-green-600',
    badge: 'bg-green-100 text-green-700'
  }
}

export default function CategoryCard({ category, jobCount, isSelected, onClick }: CategoryCardProps) {
  const Icon = iconMap[category.icon as keyof typeof iconMap] || Briefcase
  const colors = colorMap[category.color as keyof typeof colorMap] || colorMap.blue

  return (
    <div
      onClick={onClick}
      className={`${colors.bg} rounded-xl p-6 border-2 cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? colors.selectedBorder + ' shadow-lg' : colors.border
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${colors.icon} rounded-lg flex items-center justify-center`}>
          <Icon size={24} />
        </div>
        <span className={`px-3 py-1 ${colors.badge} rounded-full text-sm font-semibold`}>
          {jobCount} {jobCount === 1 ? 'Position' : 'Positions'}
        </span>
      </div>
      
      <h3 className="font-bold text-gray-900 text-lg mb-2">{category.name}</h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">{category.description}</p>
      
      <div className="flex items-center text-sm font-semibold text-gray-700">
        <span>{isSelected ? 'Hide positions' : 'View positions'}</span>
        <ChevronRight size={16} className="ml-1" />
      </div>
    </div>
  )
}