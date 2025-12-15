// components/payment/StatsGrid.tsx
'use client'

import React from 'react'

interface StatsGridProps {
  stats: {
    total: number
    awaitingPayment: number
    pendingReview: number
    confirmed: number
    totalConfirmedAmount: number
  }
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-5 gap-3 mb-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <p className="text-xs text-gray-500 mb-1">Total Accepted</p>
        <p className="text-xl font-bold text-naija-green-900">{stats.total}</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-3">
        <p className="text-xs text-gray-500 mb-1">Awaiting Payment</p>
        <p className="text-xl font-bold text-yellow-600">{stats.awaitingPayment}</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-3">
        <p className="text-xs text-gray-500 mb-1">Pending Review</p>
        <p className="text-xl font-bold text-orange-600">{stats.pendingReview}</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-green-200 p-3">
        <p className="text-xs text-gray-500 mb-1">Confirmed</p>
        <p className="text-xl font-bold text-green-600">{stats.confirmed}</p>
      </div>
      <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 rounded-lg shadow-md p-3 text-white">
        <p className="text-xs opacity-90 mb-1">Total Revenue</p>
        <p className="text-lg font-bold">{formatCurrency(stats.totalConfirmedAmount)}</p>
      </div>
    </div>
  )
}