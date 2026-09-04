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

// Keys match the real `color` values stored in the job_categories table —
// only the resulting classes changed, not the mapping itself.
const colorMap = {
  blue: {
    bg: 'bg-nnw-navy/[0.04]',
    border: 'border-nnw-navy/15',
    selectedBorder: 'border-nnw-navy',
    icon: 'bg-nnw-navy/10 text-nnw-navy',
    badge: 'bg-nnw-navy/10 text-nnw-navy'
  },
  purple: {
    bg: 'bg-nnw-ash/10',
    border: 'border-nnw-ash/30',
    selectedBorder: 'border-nnw-ash',
    icon: 'bg-nnw-ash/20 text-nnw-navy',
    badge: 'bg-nnw-ash/20 text-nnw-navy'
  },
  orange: {
    bg: 'bg-nnw-amber/10',
    border: 'border-nnw-amber/30',
    selectedBorder: 'border-nnw-amber',
    icon: 'bg-nnw-amber/15 text-nnw-amber',
    badge: 'bg-nnw-amber/15 text-nnw-amber'
  },
  green: {
    bg: 'bg-nnw-green/5',
    border: 'border-nnw-green/25',
    selectedBorder: 'border-nnw-green',
    icon: 'bg-nnw-green/10 text-nnw-green',
    badge: 'bg-nnw-green/10 text-nnw-green'
  }
}

export default function CategoryCard({ category, jobCount, isSelected, onClick }: CategoryCardProps) {
  const Icon = iconMap[category.icon as keyof typeof iconMap] || Briefcase
  const colors = colorMap[category.color as keyof typeof colorMap] || colorMap.blue

  return (
    <div
      onClick={onClick}
      className={`${colors.bg} rounded-lg p-4 sm:p-6 border-2 cursor-pointer transition-all hover:shadow-lg ${
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

      <h3 className="font-display uppercase text-nnw-navy text-base sm:text-lg mb-2">{category.name}</h3>
      <p className="text-xs sm:text-sm text-nnw-navy/60 leading-relaxed mb-3 sm:mb-4">{category.description}</p>

      <div className="flex items-center text-xs sm:text-sm font-semibold text-nnw-navy/70">
        <span>{isSelected ? 'Hide positions' : 'View positions'}</span>
        <ChevronRight size={14} className="sm:w-4 sm:h-4 ml-1" />
      </div>
    </div>
  )
}