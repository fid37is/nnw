'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Youtube, X, Maximize2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface YouTubeVideo {
  id: string
  title: string
  youtube_url: string
  description: string
  category: string
  order_position: number
}

// Helper function to extract YouTube video ID
function extractYouTubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : ''
}

export default function HighlightsPage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [expandedVideo, setExpandedVideo] = useState<YouTubeVideo | null>(null)
  const youtubeChannelUrl = 'https://youtube.com/@naijaninjawarrior'

  useEffect(() => {
    async function fetchVideos() {
      const { data } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('order_position', { ascending: true })
      
      setVideos(data || [])
      setLoading(false)
    }
    
    fetchVideos()
  }, [])

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(videos.map(v => v.category)))]
  
  // Filter videos by category
  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(v => v.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-green-200 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-black mb-4">Event Highlights</h1>
          <p className="text-xl text-green-100 max-w-2xl">
            Watch epic moments, incredible performances, and unforgettable challenges from Naija Ninja Warrior competitions
          </p>
          
          {/* YouTube Channel Link */}
          <a
            href={youtubeChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Youtube size={24} />
            Subscribe to Our Channel
          </a>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Videos Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading videos...</p>
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((video) => {
              const videoId = extractYouTubeId(video.youtube_url)
              const isExpanded = expandedVideo?.id === video.id
              
              return (
                <div 
                  key={video.id} 
                  className="group rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-green-500 transition-all duration-300 shadow-lg hover:shadow-2xl bg-white"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                    {videoId && !isExpanded ? (
                      <>
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                        {/* Expand Button Overlay */}
                        <button
                          onClick={() => setExpandedVideo(video)}
                          className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black/90 text-white rounded-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                          title="Expand video"
                        >
                          <Maximize2 size={20} />
                        </button>
                      </>
                    ) : isExpanded ? (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-gray-400">
                        <p className="text-sm">Playing in expanded view...</p>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    {video.category && (
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-3">
                        {video.category.toUpperCase()}
                      </span>
                    )}
                    <h3 className="font-black text-gray-900 text-lg mb-2 group-hover:text-green-600 transition-colors">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-16 text-center">
            <div className="inline-block p-6 bg-white rounded-full shadow-lg mb-6">
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
            <p className="text-gray-600 text-xl font-semibold mb-4">
              {selectedCategory === 'all' 
                ? 'No videos available yet' 
                : `No videos in ${selectedCategory} category`}
            </p>
            <p className="text-gray-500">Stay tuned for amazing highlights coming soon!</p>
          </div>
        )}
      </div>

      {/* Expanded Video Modal */}
      {expandedVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-200"
          onClick={() => setExpandedVideo(null)}
        >
          <div 
            className="relative w-full max-w-6xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setExpandedVideo(null)}
              className="absolute top-4 right-4 z-10 p-3 bg-black/70 hover:bg-black text-white rounded-full transition-all hover:scale-110"
            >
              <X size={24} />
            </button>

            {/* Video Player */}
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${extractYouTubeId(expandedVideo.youtube_url)}?autoplay=1&enablejsapi=1`}
                title={expandedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Video Info */}
            <div className="p-6 bg-gray-900 text-white border-t border-gray-800">
              {expandedVideo.category && (
                <span className="inline-block px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full mb-3">
                  {expandedVideo.category.toUpperCase()}
                </span>
              )}
              <h3 className="text-2xl font-black mb-2">{expandedVideo.title}</h3>
              {expandedVideo.description && (
                <p className="text-gray-300 leading-relaxed">{expandedVideo.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}