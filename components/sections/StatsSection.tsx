interface StatsSectionProps {
  stats: {
    total: number
    active: number
    eliminated: number
  }
  waitingCount?: number
  isApplicationOpen?: boolean
}

export default function StatsSection({ stats, waitingCount = 0, isApplicationOpen = false }: StatsSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="glass rounded-3xl p-8 md:p-12 shadow-md">

        {/* Pre-season: show waiting list count prominently */}
        {!isApplicationOpen && waitingCount > 0 && (
          <div className="text-center mb-10">
            <p className="text-sm font-bold text-naija-green-600 tracking-widest uppercase mb-2">
              Season 1 — Building Momentum
            </p>
            <div className="text-6xl md:text-8xl font-black text-naija-green-600">
              {waitingCount.toLocaleString()}
            </div>
            <p className="text-muted-foreground font-bold text-lg mt-2">
              Warriors on the waiting list
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Across all 6 geopolitical zones — and growing.
            </p>
          </div>
        )}

        {/* Divider if both sections showing */}
        {!isApplicationOpen && waitingCount > 0 && stats.total > 0 && (
          <div className="border-t border-border mb-10" />
        )}

        {/* Active season stats */}
        {stats.total > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        )}

        {/* Empty pre-season, no signups yet */}
        {!isApplicationOpen && waitingCount === 0 && stats.total === 0 && (
          <div className="text-center py-4">
            <p className="text-4xl md:text-6xl font-black text-primary mb-2">Season 1</p>
            <p className="text-muted-foreground font-bold text-lg">Coming Soon - Across All 6 Zones</p>
          </div>
        )}

      </div>
    </section>
  )
}