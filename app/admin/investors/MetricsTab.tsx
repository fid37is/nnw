'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Save, TrendingUp, DollarSign, BarChart2 } from 'lucide-react'
import { Metrics } from './types'

const fmt = (n: number) =>
  n >= 1_000_000
    ? (n / 1_000_000).toFixed(1) + 'M'
    : n >= 1_000
    ? (n / 1_000).toFixed(0) + 'K'
    : n.toString()

interface Props {
  metrics: Metrics
  metricsId: string | null
  onChange: (m: Metrics) => void
  onSaved: (id: string) => void
}

const inputCls =
  'w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition'

const labelCls = 'block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2'

export function MetricsTab({ metrics, metricsId, onChange, onSaved }: Props) {
  const [saving, setSaving] = useState(false)

  const handleFieldChange = (field: string, value: number) => {
    const u = { ...metrics, [field]: value }
    u.total_revenue =
      u.sponsorship_revenue + u.broadcasting_revenue +
      u.ticket_revenue + u.registration_revenue +
      u.merchandise_revenue + u.digital_revenue
    u.net_profit = u.total_revenue - u.total_expenditure
    onChange(u)
  }

  const saveMetrics = async () => {
    setSaving(true)
    try {
      const payload = { ...metrics, updated_at: new Date().toISOString() }
      const { data, error } = metricsId
        ? await supabase.from('investor_metrics').update(payload).eq('id', metricsId).select('id').single()
        : await supabase.from('investor_metrics').insert(payload).select('id').single()
      if (error) throw error
      toast.success('Metrics published to investor dashboards')
      if (data?.id) onSaved(data.id)
    } catch {
      toast.error('Failed to save metrics')
    } finally {
      setSaving(false)
    }
  }

  const summaryCards = [
    { label: 'Total Revenue',  value: metrics.total_revenue,    icon: TrendingUp, accent: '#16a34a', bg: '#f0fdf4', color: '#15803d' },
    { label: 'Expenditure',    value: metrics.total_expenditure, icon: DollarSign, accent: '#ea580c', bg: '#fff7ed', color: '#c2410c' },
    { label: 'Net Profit',     value: metrics.net_profit,        icon: BarChart2,  accent: '#2563eb', bg: '#eff6ff', color: '#1d4ed8' },
  ]

  return (
    <div className="space-y-5">

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {summaryCards.map(({ label, value, icon: Icon, accent, bg, color }) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
                <Icon size={15} style={{ color: accent }} />
              </div>
            </div>
            <p className="text-2xl font-black leading-tight" style={{ color }}>₦{fmt(value)}</p>
          </div>
        ))}
      </div>

      {/* Form panel */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-7">

        {/* Header row */}
        <div className="flex items-start justify-between gap-8 pb-6 mb-7 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Financial Metrics</h2>
            <p className="text-[11px] text-gray-400 mt-1">Visible to all investors on their dashboard.</p>
          </div>
          <div className="shrink-0 w-48">
            <label className={labelCls}>Season</label>
            <input
              className={inputCls}
              value={metrics.season_label}
              onChange={e => onChange({ ...metrics, season_label: e.target.value })}
              placeholder="Season 1 — 2026"
            />
          </div>
        </div>

        {/* Revenue fields + notes — same row, notes stretches to match */}
        <div className="flex gap-8 items-stretch">

          {/* Col 1 */}
          <div className="flex-1 flex flex-col gap-5">
            <p className={labelCls}>Revenue Streams</p>
            <div>
              <label className={labelCls}>Sponsorship (₦)</label>
              <input type="number" className={inputCls} value={metrics.sponsorship_revenue}
                onChange={e => handleFieldChange('sponsorship_revenue', Number(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Broadcasting & Streaming (₦)</label>
              <input type="number" className={inputCls} value={metrics.broadcasting_revenue}
                onChange={e => handleFieldChange('broadcasting_revenue', Number(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Ticket Sales (₦)</label>
              <input type="number" className={inputCls} value={metrics.ticket_revenue}
                onChange={e => handleFieldChange('ticket_revenue', Number(e.target.value))} />
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex-1 flex flex-col gap-5">
            {/* spacer to align with "Revenue Streams" label in col 1 */}
            <p className={labelCls} style={{ visibility: 'hidden' }}>Revenue Streams</p>
            <div>
              <label className={labelCls}>Registration Fees (₦)</label>
              <input type="number" className={inputCls} value={metrics.registration_revenue}
                onChange={e => handleFieldChange('registration_revenue', Number(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Merchandise (₦)</label>
              <input type="number" className={inputCls} value={metrics.merchandise_revenue}
                onChange={e => handleFieldChange('merchandise_revenue', Number(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Digital Platform (₦)</label>
              <input type="number" className={inputCls} value={metrics.digital_revenue}
                onChange={e => handleFieldChange('digital_revenue', Number(e.target.value))} />
            </div>
          </div>

          {/* Col 3 — notes, stretches full height of cols 1+2 */}
          <div className="flex-1 flex flex-col">
            <label className={labelCls}>Notes</label>
            <textarea
              className={`${inputCls} flex-1 resize-none`}
              value={metrics.notes}
              onChange={e => onChange({ ...metrics, notes: e.target.value })}
              placeholder="Any context for investors..."
            />
          </div>

        </div>

        {/* Expenditure + Returns row */}
        <div className="flex gap-8 mt-6 pt-6 border-t border-gray-100">
          <div className="flex-1">
            <label className={labelCls}>Expenditure (₦)</label>
            <input type="number" className={inputCls} value={metrics.total_expenditure}
              onChange={e => handleFieldChange('total_expenditure', Number(e.target.value))} />
          </div>
          <div className="flex-1">
            <label className={labelCls}>Returns to Investors (₦)</label>
            <input type="number" className={inputCls} value={metrics.investor_return}
              onChange={e => onChange({ ...metrics, investor_return: Number(e.target.value) })} />
          </div>
          <div className="flex-1" />
        </div>

        {/* Save — own row, right-aligned */}
        <div className="flex justify-end mt-6 pt-5 border-t border-gray-100">
          <button
            onClick={saveMetrics}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 disabled:opacity-60 transition"
          >
            <Save size={14} />
            {saving ? 'Saving…' : 'Save & Publish'}
          </button>
        </div>

      </div>
    </div>
  )
}