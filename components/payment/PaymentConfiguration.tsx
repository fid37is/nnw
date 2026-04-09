// ============================================
// FILE: components/payment/PaymentConfiguration.tsx
// ============================================
'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { DollarSign, CreditCard, Building2, Save, Loader2, AlertCircle } from 'lucide-react'
import { PaymentConfig } from '@/types/payment'

export default function PaymentConfiguration() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [config, setConfig]   = useState<PaymentConfig>({
    payment_amount:   50000,
    paystack_enabled: true,
    transfer_enabled: true,
    account_name:     'NAIJA Star Challenge',
    account_number:   '0123456789',
    bank_name:        'Access Bank',
  })

  useEffect(() => { loadPaymentConfig() }, [])

  const loadPaymentConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_config')
        .select('*')
        .single()
      if (error && error.code !== 'PGRST116') throw error
      if (data) setConfig(data)
    } catch (err) {
      console.error('Error loading payment config:', err)
      toast.error('Failed to load payment configuration')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!config.payment_amount || config.payment_amount <= 0) {
      toast.error('Please enter a valid payment amount'); return
    }
    if (!config.paystack_enabled && !config.transfer_enabled) {
      toast.error('Please enable at least one payment method'); return
    }
    if (config.transfer_enabled && (!config.account_name || !config.account_number || !config.bank_name)) {
      toast.error('Please fill in all bank transfer details'); return
    }
    setSaving(true)
    try {
      const { error } = await supabase
        .from('payment_config')
        .upsert({ id: 1, ...config, updated_at: new Date().toISOString() })
      if (error) throw error
      toast.success('Payment configuration saved successfully!')
    } catch (err) {
      console.error('Error saving config:', err)
      toast.error('Failed to save payment configuration')
    } finally {
      setSaving(false)
    }
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount)

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-naija-green-500 focus:ring-offset-2 ${
        enabled ? 'bg-naija-green-600' : 'bg-gray-300'
      }`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${enabled ? 'left-6' : 'left-1'}`} />
    </button>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin w-10 h-10 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-900 mb-0.5">Payment Setup</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Set the participation fee and choose which payment methods to offer. Accepted applicants will see these options on their dashboard.
          </p>
        </div>
      </div>

      {/* Payment Amount */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-naija-green-600 flex-shrink-0" />
          <h2 className="text-base sm:text-xl font-bold text-gray-900">Payment Amount</h2>
        </div>

        <label className="block text-sm font-semibold text-gray-700 mb-2">Participation Fee (NGN)</label>
        <input
          type="number"
          value={config.payment_amount}
          onChange={e => setConfig({ ...config, payment_amount: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naija-green-500 focus:border-transparent text-base sm:text-lg font-semibold"
          placeholder="50000"
        />
        <p className="text-sm text-gray-500 mt-2">
          Display amount:{' '}
          <span className="font-bold text-naija-green-700">{formatCurrency(config.payment_amount)}</span>
        </p>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-naija-green-600 flex-shrink-0" />
          <h2 className="text-base sm:text-xl font-bold text-gray-900">Payment Methods</h2>
        </div>

        <div className="space-y-3">

          {/* Paystack toggle */}
          <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
            <Toggle
              enabled={config.paystack_enabled}
              onToggle={() => setConfig({ ...config, paystack_enabled: !config.paystack_enabled })}
            />
            <div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5">Paystack Payment</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Enable instant online payment via debit/credit cards. Payments are automatically verified.
              </p>
            </div>
          </div>

          {/* Bank Transfer toggle + fields */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-0">
              <Toggle
                enabled={config.transfer_enabled}
                onToggle={() => setConfig({ ...config, transfer_enabled: !config.transfer_enabled })}
              />
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5">Bank Transfer</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Allow manual bank transfers. Users must upload payment proof for verification.
                </p>
              </div>
            </div>

            {config.transfer_enabled && (
              <div className="space-y-3 pt-4 mt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Account Name</label>
                  <input
                    type="text"
                    value={config.account_name}
                    onChange={e => setConfig({ ...config, account_name: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-naija-green-500 focus:border-transparent"
                    placeholder="NAIJA Star Challenge"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Account Number</label>
                    <input
                      type="text"
                      value={config.account_number}
                      onChange={e => setConfig({ ...config, account_number: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-naija-green-500 focus:border-transparent"
                      placeholder="0123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bank Name</label>
                    <input
                      type="text"
                      value={config.bank_name}
                      onChange={e => setConfig({ ...config, bank_name: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-naija-green-500 focus:border-transparent"
                      placeholder="Access Bank"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gradient-to-br from-naija-green-50 to-white rounded-xl shadow-sm border border-naija-green-200 p-4 sm:p-6">
        <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-4">Preview — User View</h3>
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="text-center mb-4">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Participation Fee</p>
            <p className="text-2xl sm:text-3xl font-bold text-naija-green-700">{formatCurrency(config.payment_amount)}</p>
          </div>

          <div className="space-y-2">
            {config.paystack_enabled && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm font-semibold text-blue-900">Pay with Card (Paystack)</span>
                </div>
              </div>
            )}
            {config.transfer_enabled && (
              <div className="p-3 bg-naija-green-50 border border-naija-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-naija-green-600 flex-shrink-0" />
                  <span className="text-sm font-semibold text-naija-green-900">Bank Transfer</span>
                </div>
              </div>
            )}
            {!config.paystack_enabled && !config.transfer_enabled && (
              <p className="text-center text-gray-500 text-sm py-4">No payment methods enabled</p>
            )}
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto px-6 py-3 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
          ) : (
            <><Save className="w-5 h-5" /> Save Configuration</>
          )}
        </button>
      </div>
    </div>
  )
}