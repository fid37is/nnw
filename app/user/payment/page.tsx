'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Building2, Upload, CheckCircle, AlertCircle, Loader2, ArrowLeft, Copy, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthConfig } from '@/components/context/AuthContext'

interface PaymentConfig {
  payment_amount: number
  paystack_enabled: boolean
  transfer_enabled: boolean
  account_name: string
  account_number: string
  bank_name: string
}

interface User {
  id: string
  email: string
  full_name: string
  phone: string
}

// Extend Window interface for PaystackPop
declare global {
  interface Window {
    PaystackPop: any
  }
}

export default function UserPaymentPage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'transfer' | null>(null)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const { logoUrl } = useAuthConfig()
  const [config, setConfig] = useState<PaymentConfig>({
    payment_amount: 50000,
    paystack_enabled: true,
    transfer_enabled: true,
    account_name: 'NAIJA Star Challenge',
    account_number: '0123456789',
    bank_name: 'Access Bank'
  })

  // Load Paystack inline script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    loadPaymentConfig()
    loadUserApplication()
  }, [])

  const loadUserApplication = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        window.location.href = '/login'
        return
      }

      // Get user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (userError) throw userError
      setUser(userData)

      // Get user's accepted application
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select('id, is_accepted, is_participant, payment_status')
        .eq('user_id', session.user.id)
        .single()

      if (appError) throw appError

      if (!appData.is_accepted) {
        toast.error('You need to be accepted first')
        setTimeout(() => {
          window.location.href = '/user/dashboard'
        }, 2000)
        return
      }

      if (appData.is_participant) {
        toast.info('Payment already completed')
        setTimeout(() => {
          window.location.href = '/user/dashboard'
        }, 2000)
        return
      }

      if (appData) {
        setApplicationId(appData.id)
      }
    } catch (err) {
      console.error('Error loading application:', err)
      toast.error('Failed to load your application')
    }
  }

  const loadPaymentConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_config')
        .select('*')
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      
      if (data) {
        setConfig(data)
      }
    } catch (err) {
      console.error('Error loading payment config:', err)
      toast.error('Failed to load payment configuration')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(null), 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      
      setProofFile(file)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setProofPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePaystackPayment = () => {
    if (!applicationId || !user) {
      toast.error('Application not found')
      return
    }

    if (!window.PaystackPop) {
      toast.error('Payment system not loaded. Please refresh the page.')
      return
    }

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: config.payment_amount * 100, // Convert to kobo
      currency: 'NGN',
      ref: `NAIJA-${Date.now()}`,
      metadata: {
        custom_fields: [
          {
            display_name: "Participant Name",
            variable_name: "participant_name",
            value: user.full_name
          },
          {
            display_name: "Phone Number",
            variable_name: "phone_number",
            value: user.phone
          }
        ]
      },
      callback: async (response: any) => {
        setSubmitting(true)
        try {
          // Update application with payment info
          const { error } = await supabase
            .from('applications')
            .update({
              payment_status: 'confirmed',
              payment_method: 'paystack',
              payment_reference: response.reference,
              payment_submitted_at: new Date().toISOString(),
              payment_confirmed_date: new Date().toISOString()
            })
            .eq('id', applicationId)

          if (error) throw error

          toast.success('Payment successful! Your payment has been confirmed.')
          setTimeout(() => {
            window.location.href = '/user/dashboard'
          }, 2000)
        } catch (err) {
          console.error('Payment error:', err)
          toast.error('Payment received but failed to update records. Contact support.')
        } finally {
          setSubmitting(false)
        }
      },
      onClose: () => {
        toast.info('Payment cancelled')
      }
    })

    handler.openIframe()
  }

  const handleTransferSubmit = async () => {
    if (!proofFile) {
      toast.error('Please upload payment proof')
      return
    }

    if (!applicationId) {
      toast.error('Application not found')
      return
    }

    setSubmitting(true)
    try {
      // Upload proof to Supabase storage
      const fileExt = proofFile.name.split('.').pop()
      const fileName = `${applicationId}-${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, proofFile)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName)

      // Update application
      const { error } = await supabase
        .from('applications')
        .update({
          payment_status: 'pending',
          payment_method: 'transfer',
          payment_reference: publicUrl,
          payment_submitted_at: new Date().toISOString()
        })
        .eq('id', applicationId)

      if (error) throw error

      toast.success('Payment proof submitted! Admin will verify your payment shortly.')
      setTimeout(() => {
        window.location.href = '/user/dashboard'
      }, 2000)
    } catch (err) {
      console.error('Submission error:', err)
      toast.error('Failed to submit payment proof. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logoUrl}
                alt="Naija Ninja Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="font-bold text-lg text-green-900">Naija Ninja</span>
            </Link>
          </div>
        </nav>
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="animate-spin w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logoUrl}
              alt="Naija Ninja Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="font-bold text-lg text-green-900">Naija Ninja</span>
          </Link>
          <Link href="/user/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition">
            <ArrowLeft size={18} />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Complete Your Payment
          </h1>
          <p className="text-gray-600">
            Choose your preferred payment method to complete your participation
          </p>
        </div>

        {/* Payment Amount Card */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-8 text-white text-center mb-8">
          <p className="text-sm font-semibold mb-2 opacity-90">Participation Fee</p>
          <p className="text-5xl font-bold mb-2">{formatCurrency(config.payment_amount)}</p>
          <p className="text-sm opacity-75">One-time payment to confirm your participation</p>
        </div>

        {!paymentMethod ? (
          /* Payment Method Selection */
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Payment Method</h2>
            
            {config.paystack_enabled && (
              <button
                onClick={() => setPaymentMethod('paystack')}
                className="w-full p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Pay with Card (Paystack)</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Instant payment via debit/credit card. Automatically verified.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-green-600 font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      Instant Confirmation
                    </div>
                  </div>
                </div>
              </button>
            )}

            {config.transfer_enabled && (
              <button
                onClick={() => setPaymentMethod('transfer')}
                className="w-full p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:shadow-lg transition group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
                    <Building2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Bank Transfer</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Transfer to our bank account and upload payment proof.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-orange-600 font-semibold">
                      <AlertCircle className="w-4 h-4" />
                      Requires Verification (24-48 hours)
                    </div>
                  </div>
                </div>
              </button>
            )}

            {!config.paystack_enabled && !config.transfer_enabled && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                <p className="text-yellow-800 font-semibold">
                  Payment methods are currently unavailable. Please contact support.
                </p>
              </div>
            )}
          </div>
        ) : paymentMethod === 'paystack' ? (
          /* Paystack Payment */
          <div className="bg-white rounded-xl shadow-lg p-8">
            <button
              onClick={() => setPaymentMethod(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Choose different method
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Paystack Payment</h2>
              <p className="text-gray-600">You will be redirected to Paystack to complete your payment</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Amount to pay:</span>
                <span className="text-2xl font-bold text-gray-900">{formatCurrency(config.payment_amount)}</span>
              </div>
              <p className="text-sm text-gray-500">Secure payment powered by Paystack</p>
            </div>

            <button
              onClick={handlePaystackPayment}
              disabled={submitting}
              className="w-full px-6 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Proceed to Payment
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 Secured by Paystack - Your payment information is encrypted
            </p>
          </div>
        ) : (
          /* Bank Transfer */
          <div className="bg-white rounded-xl shadow-lg p-8">
            <button
              onClick={() => setPaymentMethod(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Choose different method
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Bank Transfer</h2>
              <p className="text-gray-600">Transfer {formatCurrency(config.payment_amount)} to the account below</p>
            </div>

            {/* Bank Details */}
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Account Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Bank Name</p>
                    <p className="font-bold text-gray-900">{config.bank_name}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(config.bank_name, 'bank')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    {copied === 'bank' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Account Number</p>
                    <p className="font-bold text-gray-900 text-lg">{config.account_number}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(config.account_number, 'account')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    {copied === 'account' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Account Name</p>
                    <p className="font-bold text-gray-900">{config.account_name}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(config.account_name, 'name')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    {copied === 'name' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="font-bold text-green-700 text-lg">{formatCurrency(config.payment_amount)}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(config.payment_amount.toString(), 'amount')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    {copied === 'amount' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Upload Proof */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Upload Payment Proof <span className="text-red-500">*</span>
              </label>
              
              {proofPreview ? (
                <div className="relative">
                  <img src={proofPreview} alt="Payment proof" className="w-full rounded-lg border border-gray-200" />
                  <button
                    onClick={() => {
                      setProofFile(null)
                      setProofPreview(null)
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 cursor-pointer transition">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-900 mb-1">Click to upload payment proof</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <button
              onClick={handleTransferSubmit}
              disabled={!proofFile || submitting}
              className="w-full px-6 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Submit Payment Proof
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Your payment will be verified by our team within 24-48 hours
            </p>
          </div>
        )}
      </div>
    </div>
  )
}