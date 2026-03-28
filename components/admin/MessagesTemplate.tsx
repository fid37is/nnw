// File: components/admin/MessageTemplates.tsx
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Loader2, X, Copy, Edit2, Trash2, Plus, FileText } from 'lucide-react'

interface MessageTemplate {
  id: string
  name: string
  title: string
  content: string
  template_type: 'acceptance' | 'approval' | 'rejection' | 'general'
  created_at: string
}

interface MessageTemplatesProps {
  templates: MessageTemplate[]
  onTemplateUse: (template: MessageTemplate) => void
  onTemplatesChange: () => void
}

const TYPE_STYLES: Record<string, string> = {
  acceptance: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  approval:   'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  rejection:  'bg-red-50 text-red-700 ring-1 ring-red-200',
  general:    'bg-gray-100 text-gray-600',
}

const TYPE_LABELS: Record<string, string> = {
  acceptance: 'Acceptance',
  approval:   'Approval',
  rejection:  'Rejection',
  general:    'General',
}

export default function MessageTemplates({ templates, onTemplateUse, onTemplatesChange }: MessageTemplatesProps) {
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null)
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    title: '',
    content: '',
    template_type: 'general' as 'acceptance' | 'approval' | 'rejection' | 'general',
  })

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!templateFormData.name || !templateFormData.title || !templateFormData.content) {
      toast.error('All fields are required')
      return
    }

    setSaving(true)
    try {
      if (editingTemplate) {
        const { error } = await supabase
          .from('message_templates')
          .update({
            name: templateFormData.name,
            title: templateFormData.title,
            content: templateFormData.content,
            template_type: templateFormData.template_type,
          })
          .eq('id', editingTemplate.id)

        if (error) throw error
        toast.success('Template updated')
      } else {
        const { error } = await supabase
          .from('message_templates')
          .insert([templateFormData])

        if (error) throw error
        toast.success('Template created')
      }

      handleCancelEdit()
      onTemplatesChange()
    } catch (err) {
      console.error('Error saving template:', err)
      toast.error('Failed to save template')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const { error } = await supabase
        .from('message_templates')
        .delete()
        .eq('id', templateId)

      if (error) throw error
      toast.success('Template deleted')
      onTemplatesChange()
    } catch (err) {
      console.error('Error deleting template:', err)
      toast.error('Failed to delete template')
    }
  }

  const handleEditTemplate = (template: MessageTemplate) => {
    setEditingTemplate(template)
    setTemplateFormData({
      name: template.name,
      title: template.title,
      content: template.content,
      template_type: template.template_type,
    })
    setShowTemplateForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setShowTemplateForm(false)
    setEditingTemplate(null)
    setTemplateFormData({ name: '', title: '', content: '', template_type: 'general' })
  }

  return (
    <div className="space-y-6">

      {/* ── Inline form (shown when creating / editing) ── */}
      {showTemplateForm && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50">
            <span className="text-sm font-semibold text-gray-700">
              {editingTemplate ? 'Edit Template' : 'New Template'}
            </span>
            <button
              onClick={handleCancelEdit}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSaveTemplate} className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Template Name</label>
                <input
                  type="text"
                  value={templateFormData.name}
                  onChange={e => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                  placeholder="e.g., Acceptance – Standard"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-naija-green-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Type</label>
                <select
                  value={templateFormData.template_type}
                  onChange={e => setTemplateFormData({ ...templateFormData, template_type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-naija-green-500 text-sm"
                >
                  <option value="acceptance">Acceptance</option>
                  <option value="approval">Approval</option>
                  <option value="rejection">Rejection</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Subject / Title</label>
              <input
                type="text"
                value={templateFormData.title}
                onChange={e => setTemplateFormData({ ...templateFormData, title: e.target.value })}
                placeholder="e.g., Your Application Has Been Accepted!"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-naija-green-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Message Body</label>
              <textarea
                value={templateFormData.content}
                onChange={e => setTemplateFormData({ ...templateFormData, content: e.target.value })}
                placeholder="Write your template message here…"
                rows={6}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-naija-green-500 text-sm resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">You can edit this further before sending</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-naija-green-600 hover:bg-naija-green-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {saving
                  ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                  : editingTemplate ? 'Update Template' : 'Save Template'
                }
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Templates list header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">
            {templates.length} template{templates.length !== 1 ? 's' : ''}
          </h2>
        </div>
        {!showTemplateForm && (
          <button
            onClick={() => setShowTemplateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-naija-green-600 hover:bg-naija-green-700 text-white text-sm font-semibold rounded-lg transition shadow-sm"
          >
            <Plus size={15} />
            New Template
          </button>
        )}
      </div>

      {/* ── Templates grid ── */}
      {templates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <FileText size={20} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-500">No templates yet</p>
          <p className="text-xs text-gray-400 mt-1">Create one to speed up your messaging</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {templates.map(template => (
            <div
              key={template.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-naija-green-200 hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              {/* Card header */}
              <div className="px-5 pt-4 pb-3 border-b border-gray-50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 leading-snug truncate">{template.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{template.title}</p>
                  </div>
                  <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_STYLES[template.template_type]}`}>
                    {TYPE_LABELS[template.template_type]}
                  </span>
                </div>
              </div>

              {/* Preview */}
              <div className="px-5 py-3 flex-1">
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-4">{template.content}</p>
              </div>

              {/* Actions */}
              <div className="px-5 py-3 border-t border-gray-50 flex items-center gap-2">
                <button
                  onClick={() => onTemplateUse(template)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-naija-green-50 hover:bg-naija-green-100 text-naija-green-700 text-xs font-semibold rounded-lg transition"
                >
                  <Copy size={13} />
                  Use
                </button>
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition"
                >
                  <Edit2 size={13} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}