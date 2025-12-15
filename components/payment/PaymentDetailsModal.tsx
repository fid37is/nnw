// ============================================
// FILE: components/payment/PaymentDetailsModal.tsx
// ============================================
'use client'

import React from 'react'
import { XCircle, CheckCircle, Send, Loader2, User, Mail, Phone, Calendar, DollarSign, CreditCard, Building2 } from 'lucide-react'
import { Application } from '@/types/payment'

interface PaymentDetailsModalProps {
  application: Application | null
  onClose: () => void
  onConfirm: (id: string) => void
  onRequestVerification: (id: string) => void
  confirming: boolean
  contacting: boolean
}

export default function PaymentDetailsModal({
  application,
  onClose,
  onConfirm,
  onRequestVerification,
  confirming,
  contacting
}: PaymentDetailsModalProps) {
  if (!application) return null

  const user = application.users[0]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
              <p className="text-sm text-gray-600 mt-1">Application ID: {application.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <XCircle size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - User Info */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                  Applicant Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User size={16} className="text-gray-400" />
                    <span className="font-semibold text-gray-900">{user?.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-gray-600">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-gray-600">{user?.phone}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                  Payment Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Accepted Date</p>
                      <p className="text-gray-900 font-semibold">
                        {new Date(application.accepted_date!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {application.payment_submitted_at && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Payment Submitted</p>
                        <p className="text-gray-900 font-semibold">
                          {new Date(application.payment_submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  {application.payment_method && (
                    <div className="flex items-center gap-2 text-sm">
                      {application.payment_method === 'paystack' ? (
                        <CreditCard size={16} className="text-blue-600" />
                      ) : (
                        <Building2 size={16} className="text-green-600" />
                      )}
                      <div>
                        <p className="text-xs text-gray-500">Payment Method</p>
                        <p className="text-gray-900 font-semibold capitalize">
                          {application.payment_method}
                        </p>
                      </div>
                    </div>
                  )}
                  {application.payment_confirmed_date && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500">Confirmed Date</p>
                        <p className="text-green-700 font-semibold">
                          {new Date(application.payment_confirmed_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Current Status</p>
                    {application.payment_status === 'confirmed' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg font-semibold text-sm">
                        <CheckCircle size={14} />
                        Payment Confirmed
                      </span>
                    ) : application.payment_status === 'pending' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-lg font-semibold text-sm">
                        Pending Review
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg font-semibold text-sm">
                        Awaiting Payment
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Payment Proof */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                Payment Proof
              </h3>
              {application.payment_reference ? (
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={application.payment_reference}
                    alt="Payment Proof"
                    className="w-full h-auto"
                  />
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-8 text-center bg-gray-50">
                  <p className="text-gray-500 text-sm">No payment proof submitted yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {application.payment_status !== 'confirmed' && application.payment_reference && (
            <div className="mt-6 flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => onRequestVerification(application.id)}
                disabled={contacting}
                className="px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {contacting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Request Verification
                  </>
                )}
              </button>
              <button
                onClick={() => onConfirm(application.id)}
                disabled={confirming}
                className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {confirming ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Confirm Payment
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
