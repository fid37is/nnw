// ============================================
// FILE: components/payment/PaymentTable.tsx
// ============================================
'use client'

import React, { useState } from 'react'
import { CheckCircle, Clock, AlertCircle, Eye, X, RotateCw } from 'lucide-react'
import { Application } from '@/types/payment'

interface PaymentTableProps {
  applications: Application[]
  onViewDetails: (app: Application) => void
}

export default function PaymentTable({ applications, onViewDetails }: PaymentTableProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
            <CheckCircle size={12} />
            Confirmed
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-semibold">
            <Clock size={12} />
            Pending
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
            <AlertCircle size={12} />
            Unpaid
          </span>
        )
    }
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No applications found matching your filters</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      {app.payment_reference && (
                          <img
                          src={app.payment_reference}
                          alt="Payment proof thumbnail"
                          className="w-10 h-10 object-cover rounded border border-gray-300 cursor-pointer hover:opacity-80 transition"
                          onClick={(e) => {
                            e.stopPropagation()
                            setExpandedImage(app.payment_reference)
                            setRotation(0)
                          }}
                        />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {app.users[0]?.full_name}
                        </p>
                        <p className="text-xs text-gray-500">{app.users[0]?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    <div className="text-sm text-gray-600">
                      {app.payment_status === 'confirmed' && app.payment_confirmed_date ? (
                        <div>
                          <p className="text-green-600 font-semibold">
                            {new Date(app.payment_confirmed_date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400">Confirmed</p>
                        </div>
                      ) : app.payment_submitted_at ? (
                        <div>
                          <p>{new Date(app.payment_submitted_at).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-400">Submitted</p>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">Not submitted</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    <div className="text-sm text-gray-600">
                      {app.payment_method || <span className="text-gray-400 text-xs">N/A</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    {getStatusBadge(app.payment_status)}
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 text-right">
                    <button
                      onClick={() => onViewDetails(app)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-naija-green-100 text-naija-green-700 rounded-lg hover:bg-naija-green-200 transition font-semibold text-xs"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Expansion Modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => {
            setExpandedImage(null)
            setRotation(0)
          }}
        >
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setRotation((prev) => (prev + 90) % 360)
              }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition"
              title="Rotate image"
            >
              <RotateCw size={24} />
            </button>
            <button
              onClick={() => {
                setExpandedImage(null)
                setRotation(0)
              }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition"
              title="Close"
            >
              <X size={24} />
            </button>
          </div>
          <img
            src={expandedImage}
            alt="Payment proof full view"
            className="max-w-full max-h-full object-contain rounded-lg transition-transform duration-300"
            style={{ transform: `rotate(${rotation}deg)` }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}