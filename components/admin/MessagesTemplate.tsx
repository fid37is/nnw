// File: components/admin/MessageTemplates.tsx
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Loader2, X, Copy, Edit2, Trash2, Plus } from 'lucide-react'

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

export default function MessageTemplates({ templates, onTemplateUse, onTemplatesChange }: MessageTemplatesProps) {
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null)
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    title: '',
    content: '',
    template_type: 'acceptance' as 'acceptance' | 'approval' | 'rejection' | 'general',
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
        toast.success('Template updated successfully')
      } else {
        const { error } = await supabase
          .from('message_templates')
          .insert([templateFormData])

        if (error) throw error
        toast.success('Template created successfully')
      }

      setTemplateFormData({
        name: '',
        title: '',
        content: '',
        template_type: 'acceptance',
      })
      setEditingTemplate(null)
      setShowTemplateForm(false)
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
      toast.success('Template deleted successfully')
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
      template_type: template.template_type as any,
    })
    setShowTemplateForm(true)
  }

  const handleCancelEdit = () => {
    setShowTemplateForm(false)
    setEditingTemplate(null)
    setTemplateFormData({
      name: '',
      title: '',
      content: '',
      template_type: 'acceptance',
    })
  }

  return (
    <>
      {/* Template Form */}
      <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {editingTemplate ? 'Edit Template' : 'Create New Template'}
          </h2>
          {showTemplateForm && (
            <button
              onClick={handleCancelEdit}
              className="p-1 hover:bg-gray-100 rounded transition"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {showTemplateForm ? (
          <form onSubmit={handleSaveTemplate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Template Name</label>
                <input
                  type="text"
                  value={templateFormData.name}
                  onChange={e => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                  placeholder="e.g., Acceptance - Standard"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Template Type</label>
                <select
                  value={templateFormData.template_type}
                  onChange={e => setTemplateFormData({ ...templateFormData, template_type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm"
                >
                  <option value="acceptance">Acceptance Message</option>
                  <option value="approval">Approval Message</option>
                  <option value="rejection">Rejection Message</option>
                  <option value="general">General Message</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message Title</label>
              <input
                type="text"
                value={templateFormData.title}
                onChange={e => setTemplateFormData({ ...templateFormData, title: e.target.value })}
                placeholder="e.g., Your Application Has Been Accepted!"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message Content</label>
              <textarea
                value={templateFormData.content}
                onChange={e => setTemplateFormData({ ...templateFormData, content: e.target.value })}
                placeholder="Write your template message here..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">You can edit this further before sending</p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingTemplate ? 'Update Template' : 'Create Template'
                )}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowTemplateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition"
          >
            <Plus size={18} />
            Create New Template
          </button>
        )}
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600">No templates created yet</p>
          </div>
        ) : (
          templates.map(template => (
            <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {template.template_type === 'acceptance' && 'Acceptance Message'}
                    {template.template_type === 'approval' && 'Approval Message'}
                    {template.template_type === 'rejection' && 'Rejection Message'}
                    {template.template_type === 'general' && 'General Message'}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-1">Title:</p>
                <p className="text-sm text-gray-900 font-medium mb-3">{template.title}</p>
                <p className="text-xs font-semibold text-gray-700 mb-1">Preview:</p>
                <p className="text-xs text-gray-600 line-clamp-3">{template.content}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onTemplateUse(template)}
                  className="flex-1 px-3 py-2 bg-naija-green-100 text-naija-green-700 rounded-lg hover:bg-naija-green-200 transition flex items-center justify-center gap-1 text-xs font-semibold"
                >
                  <Copy size={14} />
                  Use Template
                </button>
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition flex items-center justify-center gap-1 text-xs font-semibold"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center justify-center gap-1 text-xs font-semibold"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}