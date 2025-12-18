// ==========================================
// FILE: components/careers/CategoryCard.tsx
// Updated to use JobCategory type from database
// ==========================================

import { Briefcase, Video, Settings, TrendingUp, ChevronRight } from 'lucide-react'

interface JobCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  display_order: number
}

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
      className={`${colors.bg} rounded-xl p-4 sm:p-6 border-2 cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? colors.selectedBorder + ' shadow-lg' : colors.border
      }`}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colors.icon} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} className="sm:w-6 sm:h-6" />
        </div>
        <span className={`px-2.5 sm:px-3 py-1 ${colors.badge} rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ml-2`}>
          {jobCount} {jobCount === 1 ? 'Position' : 'Positions'}
        </span>
      </div>
      
      <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2">{category.name}</h3>
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3 sm:mb-4">{category.description}</p>
      
      <div className="flex items-center text-xs sm:text-sm font-semibold text-gray-700">
        <span>{isSelected ? 'Hide positions' : 'View positions'}</span>
        <ChevronRight size={14} className="sm:w-4 sm:h-4 ml-1" />
      </div>
    </div>
  )
}