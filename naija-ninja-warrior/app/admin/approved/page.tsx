'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Download, Filter } from 'lucide-react'

interface ApprovedApplicant {
  id: string
  full_name: string
  email: string
  phone: string
  age: number
  state: string
  geo_zone: string
  physical_fitness: boolean
  submission_date: string
}

export default function ApprovedPage() {
  const [applicants, setApplicants] = useState<ApprovedApplicant[]>([])
  const [filteredApplicants, setFilteredApplicants] = useState<ApprovedApplicant[]>([])
  const [loading, setLoading] = useState(true)
  const [filterState, setFilterState] = useState('')
  const [filterZone, setFilterZone] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const states = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
    'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
    'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
    'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ]

  const zones = ['North Central', 'North East', 'North West', 'South East', 'South South', 'South West']

  useEffect(() => {
    loadApprovedApplicants()
  }, [])

  useEffect(() => {
    let filtered = applicants

    if (filterState) {
      filtered = filtered.filter(a => a.state === filterState)
    }

    if (filterZone) {
      filtered = filtered.filter(a => a.geo_zone === filterZone)
    }

    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredApplicants(filtered)
  }, [applicants, filterState, filterZone, searchTerm])

  const loadApprovedApplicants = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          age,
          state,
          geo_zone,
          physical_fitness,
          submission_date,
          users (
            full_name,
            email,
            phone
          )
        `)
        .eq('status', 'approved')
        .order('submission_date', { ascending: false })

      if (error) throw error

      const formatted = (data || []).map(app => ({
        id: app.id,
        full_name: app.users[0]?.full_name || 'N/A',
        email: app.users[0]?.email || 'N/A',
        phone: app.users[0]?.phone || 'N/A',
        age: app.age,
        state: app.state,
        geo_zone: app.geo_zone,
        physical_fitness: app.physical_fitness,
        submission_date: app.submission_date,
      }))

      setApplicants(formatted)
      setFilteredApplicants(formatted)
    } catch (err) {
      toast.error('Failed to load approved applicants')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const downloadCSV = () => {
    if (filteredApplicants.length === 0) {
      toast.error('No applicants to export')
      return
    }

    const headers = ['Full Name', 'Email', 'Phone', 'Age', 'State', 'Zone', 'Physical Fitness', 'Approved Date']
    const rows = filteredApplicants.map(a => [
      a.full_name,
      a.email,
      a.phone,
      a.age,
      a.state,
      a.geo_zone,
      a.physical_fitness ? 'Yes' : 'No',
      new Date(a.submission_date).toLocaleDateString(),
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `approved-applicants-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success(`Exported ${filteredApplicants.length} applicants`)
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-naija-green-900">Approved Applicants</h1>
              <p className="text-gray-600">Total: {filteredApplicants.length} approved</p>
            </div>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Name or email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <select
                  value={filterState}
                  onChange={e => setFilterState(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                >
                  <option value="">All States</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Zone</label>
                <select
                  value={filterZone}
                  onChange={e => setFilterZone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                >
                  <option value="">All Zones</option>
                  {zones.map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setFilterState('')
                    setFilterZone('')
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full mx-auto"></div>
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600 font-semibold">No approved applicants</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Age</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">State</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Zone</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fitness</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredApplicants.map(applicant => (
                      <tr key={applicant.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3 text-sm text-gray-900">{applicant.full_name}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{applicant.email}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{applicant.phone}</td>
                        <td className="px-6 py-3 text-sm text-gray-900 font-semibold">{applicant.age}</td>
                        <td className="px-6 py-3 text-sm text-gray-900">{applicant.state}</td>
                        <td className="px-6 py-3 text-sm text-gray-900">{applicant.geo_zone}</td>
                        <td className="px-6 py-3 text-sm">
                          <span className={`px-2 py-1 rounded font-semibold ${
                            applicant.physical_fitness
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {applicant.physical_fitness ? '✓ Yes' : '✗ No'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}