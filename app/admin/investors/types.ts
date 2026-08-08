// app/admin/investors/types.ts
// Shared types across all investor management components

export interface InvestorUser {
    id: string
    full_name: string
    email: string
    role: string
    investor_status: 'active' | 'revoked'
    must_change_password: boolean
    created_at: string
    profile: InvestorProfile | null
  }
  
  export interface InvestorProfile {
    id?: string
    user_id: string
    investment_amount: number
    investment_structure: 'equity' | 'revenue_share' | 'sponsorship'
    equity_percentage: number | null
    investment_date: string
    notes: string
  }
  
  export interface Metrics {
    id?: string
    season_label: string
    total_revenue: number
    sponsorship_revenue: number
    broadcasting_revenue: number
    ticket_revenue: number
    registration_revenue: number
    merchandise_revenue: number
    digital_revenue: number
    total_expenditure: number
    net_profit: number
    investor_return: number
    notes: string
  }
  
  export interface MilestoneRow {
    id?: string
    title: string
    target_date: string
    status: 'completed' | 'in_progress' | 'planned' | 'future'
    notes: string
    sort_order: number
  }
  
  export interface DocumentRow {
    id?: string
    title: string
    description: string
    document_type: 'agreement' | 'report' | 'certificate' | 'other'
    file_url: string
    is_public: boolean
    created_at?: string
    updated_at?: string
  }
  
  export const emptyMetrics: Metrics = {
    season_label: 'Season 1 — 2026',
    total_revenue: 0,
    sponsorship_revenue: 0,
    broadcasting_revenue: 0,
    ticket_revenue: 0,
    registration_revenue: 0,
    merchandise_revenue: 0,
    digital_revenue: 0,
    total_expenditure: 0,
    net_profit: 0,
    investor_return: 0,
    notes: '',
  }
  
  // Shared input / label class helpers
  export const ic = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500'
  export const lc = 'block text-xs font-semibold text-gray-700 mb-1.5'