'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Plus, Edit2, Trash2, ShoppingBag, Users, Film, X } from 'lucide-react'

interface MerchItem {
  id: string
  name: string
  price: number
  category: string
  rating: number
  in_stock: boolean
  image_url: string
}

interface Sponsor {
  id: string
  name: string
  logo_url: string
  website_url: string
}

interface YouTubeVideo {
  id: string
  title: string
  youtube_url: string
  description: string
  category: string
  order_position: number
}

interface Season {
  id: string
  name: string
  year: number
}

export default function MerchSponsorsVideosPage() {
  const [activeTab, setActiveTab] = useState<'merch' | 'sponsors' | 'videos'>('merch')
  const [merchItems, setMerchItems] = useState<MerchItem[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [loading, setLoading] = useState(true)
  const [showMerchForm, setShowMerchForm] = useState(false)
  const [showSponsorForm, setShowSponsorForm] = useState(false)
  const [showVideoForm, setShowVideoForm] = useState(false)
  const [editingMerchId, setEditingMerchId] = useState<string | null>(null)
  const [editingSponsorId, setEditingSponsorId] = useState<string | null>(null)
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{isOpen: boolean, id: string | null, name: string, type: 'merch' | 'sponsor' | 'video' | null}>({
    isOpen: false,
    id: null,
    name: '',
    type: null,
  })

  const [merchFormData, setMerchFormData] = useState({
    name: '',
    price: 0,
    category: 'shirts',
    rating: 5,
    in_stock: true,
    image_url: '',
  })

  const [sponsorFormData, setSponsorFormData] = useState({
    name: '',
    logo_url: '',
    website_url: '',
  })

  const [videoFormData, setVideoFormData] = useState({
    title: '',
    youtube_url: '',
    description: '',
    category: 'highlight',
    order_position: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = '/login'
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (userData?.role !== 'admin') {
        toast.error('Unauthorized access')
        window.location.href = '/user/dashboard'
        return
      }

      const { data: seasonData } = await supabase
        .from('seasons')
        .select('id, name, year')
        .order('year', { ascending: false })

      setSeasons(seasonData || [])

      const { data: merchData, error: merchError } = await supabase
        .from('merch_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (merchError) throw merchError
      setMerchItems(merchData || [])

      const { data: sponsorData, error: sponsorError } = await supabase
        .from('sponsors')
        .select('*')
        .order('created_at', { ascending: false })

      if (sponsorError) throw sponsorError
      setSponsors(sponsorData || [])

      const { data: videoData, error: videoError } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('order_position', { ascending: true })

      if (videoError) throw videoError
      setVideos(videoData || [])
    } catch (err) {
      console.error('Error loading data:', err)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const extractYouTubeId = (url: string): string => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    
    return url.length === 11 ? url : ''
  }

  const getYouTubeThumbnail = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  const handleSaveMerch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!merchFormData.name || merchFormData.price <= 0 || !merchFormData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoadingId('merch-save')
    try {
      if (editingMerchId) {
        const { error } = await supabase
          .from('merch_items')
          .update(merchFormData)
          .eq('id', editingMerchId)

        if (error) throw error
        toast.success('Merch item updated successfully!')
      } else {
        const { error } = await supabase
          .from('merch_items')
          .insert([merchFormData])

        if (error) throw error
        toast.success('Merch item created successfully!')
      }

      resetMerchForm()
      loadData()
    } catch (err) {
      console.error('Error saving merch:', err)
      toast.error('Failed to save merch item')
    } finally {
      setLoadingId(null)
    }
  }

  const resetMerchForm = () => {
    setMerchFormData({
      name: '',
      price: 0,
      category: 'shirts',
      rating: 5,
      in_stock: true,
      image_url: '',
    })
    setEditingMerchId(null)
    setShowMerchForm(false)
  }

  const handleDeleteMerch = (id: string, name: string) => {
    setDeleteDialog({
      isOpen: true,
      id,
      name,
      type: 'merch',
    })
  }

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id || !deleteDialog.type) return

    setLoadingId(deleteDialog.id)
    try {
      if (deleteDialog.type === 'merch') {
        const { error } = await supabase
          .from('merch_items')
          .delete()
          .eq('id', deleteDialog.id)
        if (error) throw error
      } else if (deleteDialog.type === 'sponsor') {
        const { error } = await supabase
          .from('sponsors')
          .delete()
          .eq('id', deleteDialog.id)
        if (error) throw error
      } else if (deleteDialog.type === 'video') {
        const { error } = await supabase
          .from('youtube_videos')
          .delete()
          .eq('id', deleteDialog.id)
        if (error) throw error
      }

      toast.success(`${deleteDialog.name} deleted successfully!`)
      setDeleteDialog({ isOpen: false, id: null, name: '', type: null })
      loadData()
    } catch (err) {
      console.error('Error deleting:', err)
      toast.error(`Failed to delete ${deleteDialog.name}`)
    } finally {
      setLoadingId(null)
    }
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, id: null, name: '', type: null })
  }

  const handleSaveSponsor = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!sponsorFormData.name || !sponsorFormData.logo_url || !sponsorFormData.website_url) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoadingId('sponsor-save')
    try {
      if (editingSponsorId) {
        const { error } = await supabase
          .from('sponsors')
          .update(sponsorFormData)
          .eq('id', editingSponsorId)

        if (error) throw error
        toast.success('Sponsor updated successfully!')
      } else {
        const { error } = await supabase
          .from('sponsors')
          .insert([sponsorFormData])

        if (error) throw error
        toast.success('Sponsor created successfully!')
      }

      resetSponsorForm()
      loadData()
    } catch (err) {
      console.error('Error saving sponsor:', err)
      toast.error('Failed to save sponsor')
    } finally {
      setLoadingId(null)
    }
  }

  const resetSponsorForm = () => {
    setSponsorFormData({
      name: '',
      logo_url: '',
      website_url: '',
    })
    setEditingSponsorId(null)
    setShowSponsorForm(false)
  }

  const handleDeleteSponsor = (id: string, name: string) => {
    setDeleteDialog({
      isOpen: true,
      id,
      name,
      type: 'sponsor',
    })
  }

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!videoFormData.title || !videoFormData.youtube_url || !videoFormData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoadingId('video-save')
    try {
      if (editingVideoId) {
        const { error } = await supabase
          .from('youtube_videos')
          .update(videoFormData)
          .eq('id', editingVideoId)

        if (error) throw error
        toast.success('Video updated successfully!')
      } else {
        const { error } = await supabase
          .from('youtube_videos')
          .insert([videoFormData])

        if (error) throw error
        toast.success('Video added successfully!')
      }

      resetVideoForm()
      loadData()
    } catch (err) {
      console.error('Error saving video:', err)
      toast.error('Failed to save video')
    } finally {
      setLoadingId(null)
    }
  }

  const resetVideoForm = () => {
    setVideoFormData({
      title: '',
      youtube_url: '',
      description: '',
      category: 'highlight',
      order_position: 0,
    })
    setEditingVideoId(null)
    setShowVideoForm(false)
  }

  const handleDeleteVideo = (id: string, name: string) => {
    setDeleteDialog({
      isOpen: true,
      id,
      name,
      type: 'video',
    })
  }

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full"></div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-naija-green-900">Merch, Sponsors & Videos</h1>
            <p className="text-gray-600">Manage shop items, sponsors, and YouTube content</p>
          </div>

          <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('merch')}
              className={`px-4 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === 'merch'
                  ? 'text-naija-green-600 border-naija-green-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} />
                Merch Items
              </div>
            </button>
            <button
              onClick={() => setActiveTab('sponsors')}
              className={`px-4 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === 'sponsors'
                  ? 'text-naija-green-600 border-naija-green-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={20} />
                Sponsors
              </div>
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === 'videos'
                  ? 'text-naija-green-600 border-naija-green-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Film size={20} />
                Videos
              </div>
            </button>
          </div>

          {/* MERCH TAB */}
          {activeTab === 'merch' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Merch Items ({merchItems.length})</h2>
                <button
                  onClick={() => {
                    setShowMerchForm(true)
                    setEditingMerchId(null)
                    setMerchFormData({
                      name: '',
                      price: 0,
                      category: 'shirts',
                      rating: 5,
                      in_stock: true,
                      image_url: '',
                    })
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold"
                >
                  <Plus size={20} />
                  Add Item
                </button>
              </div>

              {showMerchForm && (
                <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-6 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-naija-green-900">
                      {editingMerchId ? 'Edit Merch Item' : 'Create New Merch Item'}
                    </h3>
                    <button onClick={resetMerchForm} className="p-1 hover:bg-gray-100 rounded transition">
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveMerch} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
                        <input
                          type="text"
                          value={merchFormData.name}
                          onChange={e => setMerchFormData({ ...merchFormData, name: e.target.value })}
                          placeholder="e.g., Classic Tee"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₦)</label>
                        <input
                          type="number"
                          value={merchFormData.price}
                          onChange={e => setMerchFormData({ ...merchFormData, price: parseInt(e.target.value) })}
                          placeholder="4500"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                        <select
                          value={merchFormData.category}
                          onChange={e => setMerchFormData({ ...merchFormData, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                        >
                          <option value="shirts">Shirts</option>
                          <option value="caps">Caps</option>
                          <option value="shorts">Shorts</option>
                          <option value="hoodies">Hoodies</option>
                          <option value="accessories">Accessories</option>
                          <option value="bags">Bags</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (1-5)</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          step="0.1"
                          value={merchFormData.rating}
                          onChange={e => setMerchFormData({ ...merchFormData, rating: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                        <input
                          type="url"
                          value={merchFormData.image_url}
                          onChange={e => setMerchFormData({ ...merchFormData, image_url: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Status</label>
                        <select
                          value={merchFormData.in_stock ? 'true' : 'false'}
                          onChange={e => setMerchFormData({ ...merchFormData, in_stock: e.target.value === 'true' })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                        >
                          <option value="true">In Stock</option>
                          <option value="false">Out of Stock</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={loadingId === 'merch-save'}
                        className="px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loadingId === 'merch-save' && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>}
                        {editingMerchId ? 'Update' : 'Create'} Item
                      </button>
                      <button
                        type="button"
                        onClick={resetMerchForm}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rating</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {merchItems.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                            No merch items yet
                          </td>
                        </tr>
                      ) : (
                        merchItems.map(item => (
                          <tr key={item.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                            <td className="px-6 py-3 text-sm text-gray-600 capitalize">{item.category}</td>
                            <td className="px-6 py-3 text-sm font-semibold text-gray-900">₦{item.price.toLocaleString()}</td>
                            <td className="px-6 py-3 text-sm text-gray-600">⭐ {item.rating}</td>
                            <td className="px-6 py-3 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                item.in_stock
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {item.in_stock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-sm flex gap-2">
                              <button
                                onClick={() => {
                                  setMerchFormData({
                                    name: item.name,
                                    price: item.price,
                                    category: item.category,
                                    rating: item.rating,
                                    in_stock: item.in_stock,
                                    image_url: item.image_url,
                                  })
                                  setEditingMerchId(item.id)
                                  setShowMerchForm(true)
                                }}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition flex items-center gap-1 text-xs font-semibold"
                              >
                                <Edit2 size={14} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteMerch(item.id, item.name)}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition flex items-center gap-1 text-xs font-semibold"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SPONSORS TAB */}
          {activeTab === 'sponsors' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Sponsors ({sponsors.length})</h2>
                <button
                  onClick={() => {
                    setShowSponsorForm(true)
                    setEditingSponsorId(null)
                    setSponsorFormData({
                      name: '',
                      logo_url: '',
                      website_url: '',
                    })
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold"
                >
                  <Plus size={20} />
                  Add Sponsor
                </button>
              </div>

              {showSponsorForm && (
                <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-6 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-naija-green-900">
                      {editingSponsorId ? 'Edit Sponsor' : 'Add New Sponsor'}
                    </h3>
                    <button onClick={resetSponsorForm} className="p-1 hover:bg-gray-100 rounded transition">
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveSponsor} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Sponsor Name</label>
                      <input
                        type="text"
                        value={sponsorFormData.name}
                        onChange={e => setSponsorFormData({ ...sponsorFormData, name: e.target.value })}
                        placeholder="e.g., Nike"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Logo URL</label>
                      <input
                        type="url"
                        value={sponsorFormData.logo_url}
                        onChange={e => setSponsorFormData({ ...sponsorFormData, logo_url: e.target.value })}
                        placeholder="https://example.com/logo.png"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Website URL</label>
                      <input
                        type="url"
                        value={sponsorFormData.website_url}
                        onChange={e => setSponsorFormData({ ...sponsorFormData, website_url: e.target.value })}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={loadingId === 'sponsor-save'}
                        className="px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loadingId === 'sponsor-save' && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>}
                        {editingSponsorId ? 'Update' : 'Add'} Sponsor
                      </button>
                      <button
                        type="button"
                        onClick={resetSponsorForm}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sponsors.length === 0 ? (
                  <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <p className="text-gray-600 font-semibold">No sponsors yet</p>
                  </div>
                ) : (
                  sponsors.map(sponsor => (
                    <div key={sponsor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                      <div className="mb-4 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {sponsor.logo_url ? (
                          <img
                            src={sponsor.logo_url}
                            alt={sponsor.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">No logo</span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{sponsor.name}</h3>
                      <a
                        href={sponsor.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-naija-green-600 hover:text-naija-green-700 mb-4 block truncate"
                      >
                        {sponsor.website_url}
                      </a>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSponsorFormData({
                              name: sponsor.name,
                              logo_url: sponsor.logo_url,
                              website_url: sponsor.website_url,
                            })
                            setEditingSponsorId(sponsor.id)
                            setShowSponsorForm(true)
                          }}
                          className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition flex items-center justify-center gap-1 text-sm font-semibold"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSponsor(sponsor.id, sponsor.name)}
                          className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition flex items-center justify-center gap-1 text-sm font-semibold"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* VIDEOS TAB */}
          {activeTab === 'videos' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">YouTube Videos ({videos.length})</h2>
                <button
                  onClick={() => {
                    setShowVideoForm(true)
                    setEditingVideoId(null)
                    setVideoFormData({
                      title: '',
                      youtube_url: '',
                      description: '',
                      category: 'highlight',
                      order_position: 0,
                    })
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold"
                >
                  <Plus size={20} />
                  Add Video
                </button>
              </div>

              {showVideoForm && (
                <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-6 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-naija-green-900">
                      {editingVideoId ? 'Edit Video' : 'Add New Video'}
                    </h3>
                    <button onClick={resetVideoForm} className="p-1 hover:bg-gray-100 rounded transition">
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveVideo} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Video Title</label>
                        <input
                          type="text"
                          value={videoFormData.title}
                          onChange={e => setVideoFormData({ ...videoFormData, title: e.target.value })}
                          placeholder="e.g., Finals Showdown"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube URL</label>
                        <input
                          type="url"
                          value={videoFormData.youtube_url}
                          onChange={e => setVideoFormData({ ...videoFormData, youtube_url: e.target.value })}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea
                          value={videoFormData.description}
                          onChange={e => setVideoFormData({ ...videoFormData, description: e.target.value })}
                          placeholder="Brief description of the video..."
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                        <select
                          value={videoFormData.category}
                          onChange={e => setVideoFormData({ ...videoFormData, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                        >
                          <option value="highlight">Highlight</option>
                          <option value="tutorial">Tutorial</option>
                          <option value="event">Event</option>
                          <option value="training">Training</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
                        <input
                          type="number"
                          value={videoFormData.order_position}
                          onChange={e => setVideoFormData({ ...videoFormData, order_position: parseInt(e.target.value) })}
                          placeholder="0"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">Lower numbers display first</p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={loadingId === 'video-save'}
                        className="px-4 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loadingId === 'video-save' && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>}
                        {editingVideoId ? 'Update' : 'Add'} Video
                      </button>
                      <button
                        type="button"
                        onClick={resetVideoForm}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.length === 0 ? (
                  <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <p className="text-gray-600 font-semibold">No videos yet</p>
                  </div>
                ) : (
                  videos.map(video => (
                    <div key={video.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{video.description}</p>

                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded capitalize">
                            {video.category}
                          </span>
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                            Order: {video.order_position}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 mb-3 truncate">{video.youtube_url}</p>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setVideoFormData({
                                title: video.title,
                                youtube_url: video.youtube_url,
                                description: video.description,
                                category: video.category,
                                order_position: video.order_position,
                              })
                              setEditingVideoId(video.id)
                              setShowVideoForm(true)
                            }}
                            className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition flex items-center justify-center gap-1 text-sm font-semibold"
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(video.id, video.title)}
                            className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition flex items-center justify-center gap-1 text-sm font-semibold"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}