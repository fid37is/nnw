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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 glass rounded-3xl p-12 shadow-md">
        <div className="text-center group">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative text-6xl md:text-7xl font-black text-primary">
              {stats.total}
            </div>
          </div>
          <p className="text-muted-foreground font-bold text-lg">Total Warriors</p>
        </div>
        
        <div className="text-center group">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-success/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative text-6xl md:text-7xl font-black text-success">
              {stats.active}
            </div>
          </div>
          <p className="text-muted-foreground font-bold text-lg">Competing</p>
        </div>
        
        <div className="text-center group">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-destructive/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative text-6xl md:text-7xl font-black text-destructive/70">
              {stats.eliminated}
            </div>
          </div>
          <p className="text-muted-foreground font-bold text-lg">Eliminated</p>
        </div>
      </div>
    </section>
  )
}