// ============================================
// FILE: types/payment.ts
// ============================================
export interface UserData {
  full_name: string
  email: string
  phone: string
}

export interface Application {
  id: string
  user_id: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  submission_date: string
  age: number
  state: string
  season_id: string
  is_accepted: boolean
  payment_status: 'unpaid' | 'pending' | 'confirmed'
  payment_reference: string | null
  payment_submitted_at: string | null
  is_participant: boolean
  accepted_date: string | null
  payment_method?: string
  payment_confirmed_date?: string | null
  users: UserData[]
}

export interface PaymentConfig {
  payment_amount: number
  paystack_enabled: boolean
  transfer_enabled: boolean
  account_name: string
  account_number: string
  bank_name: string
}

export interface PaymentStats {
  total: number
  awaitingPayment: number
  pendingReview: number
  confirmed: number
}