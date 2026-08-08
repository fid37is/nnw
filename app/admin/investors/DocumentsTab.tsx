'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import {
  Plus, Edit2, Trash2, Save, X, Upload,
  ExternalLink, RefreshCw, FileText,
} from 'lucide-react'
import { DocumentRow, ic, lc } from './types'

const TYPE_BADGE: Record<string, { bg: string; text: string }> = {
  agreement:   { bg: 'bg-blue-100',   text: 'text-blue-700' },
  report:      { bg: 'bg-green-100',  text: 'text-green-700' },
  certificate: { bg: 'bg-purple-100', text: 'text-purple-700' },
  other:       { bg: 'bg-gray-100',   text: 'text-gray-600' },
}

interface Props {
  documents: DocumentRow[]
  onReload: () => Promise<void>
}

export function DocumentsTab({ documents, onReload }: Props) {
  const [saving, setSaving]         = useState(false)
  const [uploadingDoc, setUploadingDoc] = useState(false)
  const [showForm, setShowForm]     = useState(false)
  const [editDoc, setEditDoc]       = useState<DocumentRow | null>(null)
  const fileInputRef                = useRef<HTMLInputElement>(null)

  const openNew = () => {
    setEditDoc({ title: '', description: '', document_type: 'other', file_url: '', is_public: false })
    setShowForm(true)
  }

  const handleDocFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editDoc) return
    if (fileInputRef.current) fileInputRef.current.value = ''
    setUploadingDoc(true)
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`
      const { error: uploadError } = await supabase.storage
        .from('investor-documents')
        .upload(path, file, { upsert: false, contentType: file.type })
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage.from('investor-documents').getPublicUrl(path)
      setEditDoc(prev => prev ? { ...prev, file_url: publicUrl } : prev)
      toast.success('File uploaded successfully')
    } catch (err: any) {
      toast.error(err?.message || 'Upload failed — check bucket name and RLS policies')
    } finally {
      setUploadingDoc(false)
    }
  }

  const saveDocument = async () => {
    if (!editDoc) return
    if (!editDoc.title.trim()) { toast.error('Title is required'); return }
    setSaving(true)
    try {
      const payload = {
        title:         editDoc.title.trim(),
        description:   editDoc.description || null,
        document_type: editDoc.document_type,
        file_url:      editDoc.file_url || null,
        is_public:     editDoc.is_public,
        updated_at:    new Date().toISOString(),
      }
      const { error } = editDoc.id
        ? await supabase.from('investor_documents').update(payload).eq('id', editDoc.id)
        : await supabase.from('investor_documents').insert(payload)
      if (error) throw error
      toast.success('Document saved')
      setShowForm(false); setEditDoc(null)
      await onReload()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save document')
    } finally {
      setSaving(false)
    }
  }

  const deleteDocument = async (id: string) => {
    if (!confirm('Delete this document?')) return
    await supabase.from('investor_documents').delete().eq('id', id)
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
          <Plus size={15} /> Add Document
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center shadow-sm">
          <FileText size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {documents.map((d, i) => {
            const badge = TYPE_BADGE[d.document_type] ?? TYPE_BADGE.other
            return (
              <div
                key={d.id}
                className="flex items-start justify-between gap-3 px-5 py-4 hover:bg-gray-50 transition"
                style={{ borderBottom: i < documents.length - 1 ? '1px solid #F3F4F6' : 'none' }}
              >
                {/* Icon */}
                <div className="w-9 h-9 rounded-xl bg-naija-green-50 border border-naija-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText size={15} className="text-naija-green-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="font-semibold text-gray-900 text-sm truncate">{d.title}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${badge.bg} ${badge.text}`}>
                      {d.document_type}
                    </span>
                    {d.is_public && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-green-100 text-green-700">
                        Visible to investors
                      </span>
                    )}
                  </div>
                  {d.description && (
                    <p className="text-xs text-gray-500 line-clamp-1">{d.description}</p>
                  )}
                  {d.file_url && (
                    <a
                      href={d.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-naija-green-600 hover:underline mt-1"
                    >
                      <ExternalLink size={10} /> View file
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => { setEditDoc(d); setShowForm(true) }}
                    className="p-2 text-gray-400 hover:text-naija-green-600 hover:bg-naija-green-50 rounded-lg transition"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => d.id && deleteDocument(d.id)}
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
      {showForm && editDoc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md">
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{editDoc.id ? 'Edit' : 'Add'} Document</h3>
              <button onClick={() => { setShowForm(false); setEditDoc(null) }}><X size={20} /></button>
            </div>
            <div className="p-5 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
              <div>
                <label className={lc}>Title *</label>
                <input className={ic} value={editDoc.title}
                  placeholder="e.g. Investment Agreement Q1 2026"
                  onChange={e => setEditDoc({ ...editDoc, title: e.target.value })} />
              </div>
              <div>
                <label className={lc}>Description</label>
                <textarea rows={2} className={ic} value={editDoc.description}
                  placeholder="Brief description for investors..."
                  onChange={e => setEditDoc({ ...editDoc, description: e.target.value })} />
              </div>
              <div>
                <label className={lc}>Document Type</label>
                <select className={ic} value={editDoc.document_type}
                  onChange={e => setEditDoc({ ...editDoc, document_type: e.target.value as any })}>
                  <option value="agreement">Agreement</option>
                  <option value="report">Report</option>
                  <option value="certificate">Certificate</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className={lc}>File</label>
                <input
                  ref={fileInputRef} type="file" className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.webp"
                  onChange={handleDocFileUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingDoc}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-3 mb-2 border-2 border-dashed rounded-lg text-sm font-medium transition ${
                    uploadingDoc
                      ? 'border-naija-green-300 bg-naija-green-50 text-naija-green-600 cursor-not-allowed'
                      : 'border-gray-300 text-gray-600 hover:border-naija-green-400 hover:bg-naija-green-50 cursor-pointer'
                  }`}
                >
                  {uploadingDoc
                    ? <><RefreshCw size={15} className="animate-spin" /> Uploading…</>
                    : <><Upload size={15} /> Upload from computer</>
                  }
                </button>
                <p className="text-xs text-gray-400 mb-2">
                  PDF, Word, Excel, PowerPoint, images · or paste a URL below
                </p>
                <input
                  className={ic}
                  value={editDoc.file_url}
                  placeholder="https://… (auto-filled after upload)"
                  onChange={e => setEditDoc({ ...editDoc, file_url: e.target.value })}
                />
                {editDoc.file_url && (
                  <a href={editDoc.file_url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 mt-1.5 text-xs text-naija-green-600 hover:underline truncate">
                    <ExternalLink size={11} />
                    <span className="truncate">{editDoc.file_url}</span>
                  </a>
                )}
              </div>
              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-xs font-semibold text-gray-700">Visible to investors</p>
                  <p className="text-xs text-gray-400 mt-0.5">Show on investor dashboards</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditDoc({ ...editDoc, is_public: !editDoc.is_public })}
                  className={`relative rounded-full transition-colors ${editDoc.is_public ? 'bg-naija-green-500' : 'bg-gray-300'}`}
                  style={{ minWidth: '2.5rem', height: '1.375rem' }}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${editDoc.is_public ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
            <div className="flex gap-3 p-5 sm:p-6 border-t border-gray-100">
              <button onClick={saveDocument} disabled={saving || uploadingDoc}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-naija-green-600 text-white rounded-xl font-bold text-sm hover:bg-naija-green-700 disabled:opacity-60 transition">
                <Save size={15} />{saving ? 'Saving...' : 'Save Document'}
              </button>
              <button onClick={() => { setShowForm(false); setEditDoc(null) }}
                className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}