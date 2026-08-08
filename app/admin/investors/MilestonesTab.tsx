'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Save, X, CheckCircle, Clock, Circle, Calendar } from 'lucide-react'
import { MilestoneRow, ic, lc } from './types'

const STATUS_META: Record<MilestoneRow['status'], { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
  completed:   { label: 'Completed',   bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-200',  icon: <CheckCircle size={12} /> },
  in_progress: { label: 'In Progress', bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-200',   icon: <Clock size={12} /> },
  planned:     { label: 'Planned',     bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: <Calendar size={12} /> },
  future:      { label: 'Future',      bg: 'bg-gray-100',   text: 'text-gray-600',   border: 'border-gray-200',   icon: <Circle size={12} /> },
}

interface Props {
  milestones: MilestoneRow[]
  onReload: () => Promise<void>
}

export function MilestonesTab({ milestones, onReload }: Props) {
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editMilestone, setEditMilestone] = useState<MilestoneRow | null>(null)

  const openNew = () => {
    setEditMilestone({
      title: '', target_date: '', status: 'planned',
      notes: '', sort_order: milestones.length + 1,
    })
    setShowForm(true)
  }

  const saveMilestone = async () => {
    if (!editMilestone) return
    setSaving(true)
    try {
      const { error } = editMilestone.id
        ? await supabase.from('investor_milestones')
            .update({ ...editMilestone, updated_at: new Date().toISOString() })
            .eq('id', editMilestone.id)
        : await supabase.from('investor_milestones').insert(editMilestone)
      if (error) throw error
      toast.success('Milestone saved')
      setShowForm(false); setEditMilestone(null)
      await onReload()
    } catch {
      toast.error('Failed to save milestone')
    } finally {
      setSaving(false)
    }
  }

  const deleteMilestone = async (id: string) => {
    if (!confirm('Delete this milestone?')) return
    await supabase.from('investor_milestones').delete().eq('id', id)
    toast.success('Deleted')
    await onReload()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-naija-green-600 text-white rounded-lg text-sm font-bold hover:bg-naija-green-700 transition"
        >
          <Plus size={15} /> Add Milestone
        </button>
      </div>

      {milestones.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center shadow-sm">
          <Calendar size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No milestones yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {milestones.map((m, i) => {
            const meta = STATUS_META[m.status]
            return (
              <div
                key={m.id}
                className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-gray-50 transition"
                style={{ borderBottom: i < milestones.length - 1 ? '1px solid #F3F4F6' : 'none' }}
              >
                {/* Left: sort order indicator */}
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 mt-0.5">
                  {m.sort_order}
                </div>

                {/* Middle: content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-gray-900 text-sm">{m.title}</p>
                    <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-semibold ${meta.bg} ${meta.text} ${meta.border}`}>
                      {meta.icon} {meta.label}
                    </span>
                  </div>
                  {m.target_date && (
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(m.target_date).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}
                    </p>
                  )}
                  {m.notes && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{m.notes}</p>}
                </div>

                {/* Right: actions */}
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => { setEditMilestone(m); setShowForm(true) }}
                    className="p-2 text-gray-400 hover:text-naija-green-600 hover:bg-naija-green-50 rounded-lg transition"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => m.id && deleteMilestone(m.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Form Modal */}
      {showForm && editMilestone && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">{editMilestone.id ? 'Edit' : 'Add'} Milestone</h3>
              <button onClick={() => { setShowForm(false); setEditMilestone(null) }}><X size={20} /></button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className={lc}>Title *</label>
                <input className={ic} value={editMilestone.title}
                  placeholder="e.g. Series A Close"
                  onChange={e => setEditMilestone({ ...editMilestone, title: e.target.value })} />
              </div>
              <div>
                <label className={lc}>Target Date</label>
                <input type="date" className={ic} value={editMilestone.target_date}
                  onChange={e => setEditMilestone({ ...editMilestone, target_date: e.target.value })} />
              </div>
              <div>
                <label className={lc}>Status</label>
                <select className={ic} value={editMilestone.status}
                  onChange={e => setEditMilestone({ ...editMilestone, status: e.target.value as any })}>
                  <option value="planned">Planned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="future">Future</option>
                </select>
              </div>
              <div>
                <label className={lc}>Sort Order</label>
                <input type="number" className={ic} value={editMilestone.sort_order}
                  onChange={e => setEditMilestone({ ...editMilestone, sort_order: Number(e.target.value) })} />
              </div>
              <div>
                <label className={lc}>Notes</label>
                <textarea rows={2} className={ic} value={editMilestone.notes}
                  placeholder="Additional details..."
                  onChange={e => setEditMilestone({ ...editMilestone, notes: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveMilestone} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-naija-green-600 text-white rounded-xl font-bold text-sm hover:bg-naija-green-700 disabled:opacity-60">
                <Save size={15} />{saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => { setShowForm(false); setEditMilestone(null) }}
                className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}