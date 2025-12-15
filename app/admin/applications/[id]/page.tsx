'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Send, CheckCircle, XCircle, Clock, RotateCcw, AlertTriangle } from 'lucide-react'

interface ApplicationDetail {
  id: string
  user_id: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  age: number
  birth_date: string
  physical_fitness: boolean
  state: string
  geo_zone: string
  emergency_contact: string
  emergency_phone: string
  submission_date: string
  video_url: string
  photo_url: string
  is_accepted: boolean
  payment_status: 'unpaid' | 'pending' | 'confirmed'
  accepted_date: string | null
  users: {
    full_name: string
    email: string
    phone: string
  }
}

interface Comment {
  id: string
  application_id: string
  admin_id: string
  comment: string
  created_at: string
}

export default function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const fromParticipants = searchParams.get('from') === 'participants'
  
  const [application, setApplication] = useState<ApplicationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedNewStatus, setSelectedNewStatus] = useState<'pending' | 'under_review' | 'rejected' | null>(null)
  const [showRevokeModal, setShowRevokeModal] = useState(false)

  useEffect(() => {
    if (!id) return

    const loadApplicationDetail = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          window.location.href = '/login'
          return
        }

        // Load application detail with user data
        const { data: appData, error: appError } = await supabase
          .from('applications')
          .select('id, user_id, status, age, birth_date, physical_fitness, state, geo_zone, emergency_contact, emergency_phone, submission_date, video_url, photo_url, is_accepted, payment_status, accepted_date')
          .eq('id', id)
          .single()

        if (appError) {
          console.error('Error fetching application:', appError)
          throw appError
        }

        if (!appData) {
          toast.error('Application not found')
          setLoading(false)
          return
        }

        // Fetch user data separately
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('full_name, email, phone')
          .eq('id', appData.user_id)
          .single()

        if (userError) {
          console.error('Error fetching user:', userError)
          throw userError
        }

        const completeApp: ApplicationDetail = {
          ...appData,
          users: userData || { full_name: 'N/A', email: 'N/A', phone: 'N/A' }
        }

        setApplication(completeApp)

        // Load comments
        const { data: commentsData, error: commentsError } = await supabase
          .from('application_comments')
          .select('*')
          .eq('application_id', id)
          .order('created_at', { ascending: false })

        if (!commentsError) {
          setComments(commentsData || [])
        }
      } catch (err) {
        console.error('Error loading application:', err)
        toast.error('Failed to load application')
      } finally {
        setLoading(false)
      }
    }

    loadApplicationDetail()
  }, [id])

  const handleStatusUpdate = async (newStatus: 'pending' | 'under_review' | 'rejected') => {
    if (!application) return

    setUpdating(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()

      const { error } = await supabase
        .from('applications')
        .update({
          status: newStatus,
          reviewed_by_admin: session?.user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', application.id)

      if (error) throw error

      setApplication({ ...application, status: newStatus })
      const statusLabel = newStatus === 'under_review' ? 'Under Review' : newStatus === 'rejected' ? 'Rejected' : 'Pending'
      toast.success(`Status changed to ${statusLabel}`)
      setShowStatusModal(false)
      setSelectedNewStatus(null)
    } catch (err) {
      console.error('Error updating status:', err)
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const handleAccept = async () => {
    if (!application) return

    setUpdating(true)
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          is_accepted: true,
          status: 'approved',
          accepted_date: new Date().toISOString()
        })
        .eq('id', application.id)

      if (error) throw error

      setApplication({ 
        ...application, 
        is_accepted: true, 
        status: 'approved',
        accepted_date: new Date().toISOString() 
      })
      toast.success('Application accepted! Now go to Messaging Center to send acceptance notification.', { duration: 6000 })
    } catch (err) {
      console.error('Error accepting application:', err)
      toast.error('Failed to accept application')
    } finally {
      setUpdating(false)
    }
  }

  const handleRevokeAcceptance = async () => {
    if (!application) return

    setUpdating(true)
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          is_accepted: false,
          status: 'pending',
          accepted_date: null,
          payment_status: 'unpaid'
        })
        .eq('id', application.id)

      if (error) throw error

      setApplication({ 
        ...application, 
        is_accepted: false, 
        status: 'pending',
        accepted_date: null,
        payment_status: 'unpaid'
      })
      toast.success('Acceptance revoked. Application reset to pending status.')
      setShowRevokeModal(false)
    } catch (err) {
      console.error('Error revoking acceptance:', err)
      toast.error('Failed to revoke acceptance')
    } finally {
      setUpdating(false)
    }
  }

  const handleAddComment = async () => {
    if (!comment.trim() || !application) return

    try {
      const { data: { session } } = await supabase.auth.getSession()

      const { error } = await supabase
        .from('application_comments')
        .insert({
          application_id: application.id,
          admin_id: session?.user.id,
          comment: comment.trim(),
        })

      if (error) throw error

      setComment('')
      toast.success('Comment added')

      // Reload comments
      const { data: commentsData } = await supabase
        .from('application_comments')
        .select('*')
        .eq('application_id', application.id)
        .order('created_at', { ascending: false })

      setComments(commentsData || [])
    } catch (err) {
      console.error('Error adding comment:', err)
      toast.error('Failed to add comment')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-12 h-12 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full"></div>
        </div>
      </main>
    )
  }

  if (!application) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-gray-600">Application not found</p>
          <Link href="/admin/applications" className="text-naija-green-600 hover:text-naija-green-700 font-semibold">
            Back to Applications
          </Link>
        </div>
      </main>
    )
  }

  const getStatusBadge = () => {
    if (application.is_accepted && application.payment_status === 'pending') {
      return 'bg-orange-100 text-orange-800'
    }
    if (application.is_accepted && application.payment_status === 'unpaid') {
      return 'bg-green-100 text-green-800'
    }
    if (application.is_accepted && application.payment_status === 'confirmed') {
      return 'bg-green-100 text-green-800'
    }
    if (application.status === 'rejected') {
      return 'bg-red-100 text-red-800'
    }
    if (application.status === 'under_review') {
      return 'bg-blue-100 text-blue-800'
    }
    return 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = () => {
    if (application.is_accepted && application.payment_status === 'pending') {
      return 'PAYMENT SUBMITTED'
    }
    if (application.is_accepted && application.payment_status === 'unpaid') {
      return 'ACCEPTED - AWAITING PAYMENT'
    }
    if (application.is_accepted && application.payment_status === 'confirmed') {
      return 'PAYMENT CONFIRMED'
    }
    if (application.is_accepted) {
      return 'ACCEPTED'
    }
    return application.status.replace('_', ' ').toUpperCase()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-naija-green-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/admin/applications" className="flex items-center gap-2 text-naija-green-600 hover:text-naija-green-700 font-semibold transition">
            <ArrowLeft size={18} />
            Back to Applications
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-12">
        {/* Applicant Info */}
        <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-naija-green-900 mb-2">
                {application.users.full_name}
              </h1>
              <p className="text-gray-600">{application.users.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Submitted: {new Date(application.submission_date).toLocaleDateString()}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap ${getStatusBadge()}`}>
              {getStatusLabel()}
            </div>
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Age</p>
              <p className="text-gray-900">{application.age} years old</p>
            </div>
            <div>
              <p className="text-gray-600">Birth Date</p>
              <p className="text-gray-900">{new Date(application.birth_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-600">State</p>
              <p className="text-gray-900">{application.state}</p>
            </div>
            <div>
              <p className="text-gray-600">Geo-Political Zone</p>
              <p className="text-gray-900">{application.geo_zone}</p>
            </div>
            <div>
              <p className="text-gray-600">Physical Fitness</p>
              <p className="text-gray-900">{application.physical_fitness ? '✓ Yes' : '✗ No'}</p>
            </div>
            <div>
              <p className="text-gray-600">Emergency Contact</p>
              <p className="text-gray-900">{application.emergency_contact}</p>
            </div>
            <div>
              <p className="text-gray-600">Emergency Phone</p>
              <p className="text-gray-900">{application.emergency_phone}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="text-gray-900">{application.users.phone}</p>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Video */}
          <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-4">
            <h2 className="font-semibold text-gray-900 mb-3">Submission Video</h2>
            {application.video_url ? (
              <video
                src={application.video_url}
                controls
                className="w-full rounded-lg bg-black"
              />
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-600">
                No video uploaded
              </div>
            )}
          </div>

          {/* Photo */}
          <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-4">
            <h2 className="font-semibold text-gray-900 mb-3">Profile Photo</h2>
            {application.photo_url ? (
              <img
                src={application.photo_url}
                alt="Profile"
                className="w-full rounded-lg max-h-96 object-cover"
              />
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-600">
                No photo uploaded
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Only show if NOT from participants tab */}
        {!fromParticipants && (
          <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-4 mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">Manage Application Status</h2>
            
            <div className="flex flex-col gap-3">
              {/* Primary Actions Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    setSelectedNewStatus('under_review')
                    setShowStatusModal(true)
                  }}
                  disabled={updating || (application.status === 'under_review' && !application.is_accepted)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Clock size={18} />
                  Under Review
                </button>
                
                {!application.is_accepted ? (
                  <button
                    onClick={handleAccept}
                    disabled={updating}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                  >
                    <CheckCircle size={18} />
                    Accept
                  </button>
                ) : (
                  <button
                    onClick={() => setShowRevokeModal(true)}
                    disabled={updating}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50"
                  >
                    <RotateCcw size={18} />
                    Revoke
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setSelectedNewStatus('rejected')
                    setShowStatusModal(true)
                  }}
                  disabled={updating || (application.status === 'rejected' && !application.is_accepted)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle size={18} />
                  Reject
                </button>
              </div>

              {/* Reset to Pending */}
              <button
                onClick={() => {
                  setSelectedNewStatus('pending')
                  setShowStatusModal(true)
                }}
                disabled={updating || (application.status === 'pending' && !application.is_accepted)}
                className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw size={18} />
                Reset to Pending
              </button>
            </div>

            {/* Current Status Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
              <p className="text-gray-700">
                <span className="font-semibold">Current Status:</span> {getStatusLabel()}
              </p>
              {application.is_accepted && application.accepted_date && (
                <p className="text-gray-600 text-xs mt-1">
                  Accepted on: {new Date(application.accepted_date).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-4">
          <h2 className="font-semibold text-gray-900 mb-4">Admin Notes</h2>

          {/* Add Comment */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={e => setComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                placeholder="Add a note..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
              />
              <button
                onClick={handleAddComment}
                disabled={!comment.trim()}
                className="px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                <Send size={16} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No notes yet</p>
            ) : (
              comments.map(c => (
                <div key={c.id} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">{c.comment}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Status Change Confirmation Modal */}
      {showStatusModal && selectedNewStatus && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Status Change</h3>
                <p className="text-gray-600 text-sm">
                  {application.is_accepted && selectedNewStatus !== 'pending' ? (
                    <>This will change the status but <strong>keep the accepted flag</strong>. To fully revoke acceptance, use the "Revoke" button instead.</>
                  ) : (
                    <>Are you sure you want to change this application's status to <strong className="capitalize">{selectedNewStatus.replace('_', ' ')}</strong>?</>
                  )}
                </p>
                {selectedNewStatus === 'rejected' && application.is_accepted && (
                  <p className="text-orange-600 text-sm font-semibold mt-2">
                    ⚠️ The applicant will remain accepted but status will show rejected. Consider using "Revoke" if you want to fully reverse the acceptance.
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleStatusUpdate(selectedNewStatus)}
                disabled={updating}
                className="flex-1 px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Confirm'}
              </button>
              <button
                onClick={() => {
                  setShowStatusModal(false)
                  setSelectedNewStatus(null)
                }}
                disabled={updating}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Acceptance Confirmation Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Revoke Acceptance</h3>
                <p className="text-gray-600 text-sm mb-3">
                  This will completely revoke the acceptance and reset the application to pending status. This action will:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Remove accepted status</li>
                  <li>Reset to pending status</li>
                  <li>Reset payment status to unpaid</li>
                  <li>Clear acceptance date</li>
                </ul>
                <p className="text-red-600 text-sm font-semibold mt-3">
                  ⚠️ This action should be used carefully as it resets all acceptance-related data.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRevokeAcceptance}
                disabled={updating}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
              >
                {updating ? 'Revoking...' : 'Yes, Revoke'}
              </button>
              <button
                onClick={() => setShowRevokeModal(false)}
                disabled={updating}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}