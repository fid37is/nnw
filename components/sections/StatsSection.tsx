interface StatsSectionProps {
  stats: {
    total: number
    active: number
    eliminated: number
  }
}

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-12 shadow-md">
        <div className="text-center group">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-green-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-600 to-green-800">
              {stats.total}
            </div>
          </div>
          <p className="text-gray-600 font-bold text-lg">Total Warriors</p>
        </div>
        
        <div className="text-center group">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-gray-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-700 to-gray-900">
              {stats.active}
            </div>
          </div>
          <p className="text-gray-600 font-bold text-lg">Competing</p>
        </div>
        
        <div className="text-center group">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-gray-300/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-400 to-gray-600">
              {stats.eliminated}
            </div>
          </div>
          <p className="text-gray-600 font-bold text-lg">Eliminated</p>
        </div>
      </div>
    </section>
  )
}