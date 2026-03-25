'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import InvestorSidebar from '@/components/investor/InvestorSidebar'
import { FileText, Download, Clock, Shield, ExternalLink, AlertCircle } from 'lucide-react'

interface Document {
  id: string
  title: string
  description: string
  document_type: 'agreement' | 'report' | 'certificate' | 'other'
  file_url: string | null
  created_at: string
  is_public: boolean
}

const typeColor = (t: string) => {
  switch (t) {
    case 'agreement':   return 'bg-blue-100 text-blue-700'
    case 'report':      return 'bg-green-100 text-green-700'
    case 'certificate': return 'bg-purple-100 text-purple-700'
    default:            return 'bg-gray-100 text-gray-600'
  }
}

const typeLabel = (t: string) =>
  t.charAt(0).toUpperCase() + t.slice(1)

export default function InvestorDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => { loadDocuments() }, [])

  const loadDocuments = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/login'; return }

      const { data: userData } = await supabase
        .from('users').select('role').eq('id', session.user.id).single()

      if (userData?.role !== 'investor') {
        window.location.href = '/user/dashboard'; return
      }

      const { data: docs, error } = await supabase
        .from('investor_documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDocuments(docs || [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <InvestorSidebar />
        <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex">
      <InvestorSidebar />
      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="max-w-5xl mx-auto px-4 py-8 lg:p-8">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <FileText size={28} className="text-naija-green-600" />
              <h1 className="text-2xl md:text-3xl font-bold text-naija-green-900">Documents</h1>
            </div>
            <p className="text-gray-500 text-sm">Your investment agreements, quarterly reports, and certificates.</p>
          </div>

          {/* Security note */}
          <div className="flex items-start gap-3 bg-naija-green-50 border border-naija-green-200 rounded-xl p-4 mb-8">
            <Shield size={18} className="text-naija-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-naija-green-800">
              All documents are private to your investor account. Files are hosted securely and only accessible by you and the NNW admin team.
            </p>
          </div>

          {documents.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <AlertCircle size={40} className="text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-gray-700 mb-2">No Documents Yet</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
                Your investment agreement, certificates, and quarterly reports will appear here once your investment is confirmed and documents are uploaded by the admin team.
              </p>
              <p className="text-xs text-gray-400 mt-4">
                Questions? Email{' '}
                <a href="mailto:phyd3lis@gmail.com" className="text-naija-green-600 hover:underline">phyd3lis@gmail.com</a>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {(['agreement', 'certificate', 'report', 'other'] as const).map(type => {
                const typeDocs = documents.filter(d => d.document_type === type)
                if (typeDocs.length === 0) return null
                return (
                  <div key={type}>
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                      {typeLabel(type)}s
                    </h2>
                    <div className="space-y-3">
                      {typeDocs.map(doc => (
                        <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-naija-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText size={20} className="text-naija-green-700" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="font-semibold text-gray-900 text-sm">{doc.title}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor(doc.document_type)}`}>
                                  {typeLabel(doc.document_type)}
                                </span>
                              </div>
                              {doc.description && (
                                <p className="text-xs text-gray-500 leading-relaxed">{doc.description}</p>
                              )}
                              <div className="flex items-center gap-1 mt-1.5">
                                <Clock size={12} className="text-gray-400" />
                                <p className="text-xs text-gray-400">
                                  {new Date(doc.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                          </div>
                          {doc.file_url ? (
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-naija-green-600 text-white text-sm font-semibold rounded-lg hover:bg-naija-green-700 transition flex-shrink-0"
                            >
                              <Download size={15} />
                              Download
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400 italic flex-shrink-0">Processing...</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
