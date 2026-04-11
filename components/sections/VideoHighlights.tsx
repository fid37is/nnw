'use client'

import Link from 'next/link'
import { ArrowRight, Youtube, X, Maximize2, Play } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface YouTubeVideo {
  id: string
  title: string
  youtube_url: string
  description: string
  category: string
  order_position: number
}

interface VideoHighlightsProps {
  videos: YouTubeVideo[]
  extractYouTubeId: (url: string) => string
  youtubeChannelUrl?: string
}

function LazyVideoCard({
  video,
  extractYouTubeId,
  onExpand,
}: {
  video: YouTubeVideo
  extractYouTubeId: (url: string) => string
  onExpand: (video: YouTubeVideo) => void
}) {
  const [playing, setPlaying] = useState(false)
  const videoId = extractYouTubeId(video.youtube_url)
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null

  return (
    <div className="group rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-green-500 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105">
      <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
        {playing ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <>
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={video.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Play size={48} />
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center"
              aria-label={`Play ${video.title}`}
            >
              <div className="w-16 h-16 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110">
                <Play size={24} className="text-white ml-1" fill="white" />
              </div>
            </button>
            {videoId && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onExpand(video)
                }}
                className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black/90 text-white rounded-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                title="Expand video"
              >
                <Maximize2 size={20} />
              </button>
            )}
          </>
        )}
      </div>
      <div className="p-6 bg-white">
        <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-600 transition-colors">
          {video.title}
        </h3>
      </div>
    </div>
  )
}

export default function VideoHighlights({
  videos,
  extractYouTubeId,
  youtubeChannelUrl = 'https://youtube.com/@naijaninjawarrior',
}: VideoHighlightsProps) {
  const [expandedVideo, setExpandedVideo] = useState<YouTubeVideo | null>(null)
  const [sectionVisible, setSectionVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSectionVisible(true)
      },
      { rootMargin: '200px' }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const featuredVideos = videos.slice(0, 6)

  return (
    <div
      ref={sectionRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-100"
    >
      <div className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-naija-green-900 mb-4">
          Event Highlights
        </h2>
        <p className="text-gray-600 text-lg">Watch epic moments from past competitions</p>
      </div>

      {featuredVideos.length > 0 ? (
        <>
          <div
            className={`grid ${
              featuredVideos.length === 1
                ? 'justify-center'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            } gap-8 mb-12`}
          >
            {sectionVisible
              ? featuredVideos.map((video) => (
                  <LazyVideoCard
                    key={video.id}
                    video={video}
                    extractYouTubeId={extractYouTubeId}
                    onExpand={setExpandedVideo}
                  />
                ))
              : featuredVideos.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden border-2 border-gray-100 shadow-lg"
                  >
                    <div className="aspect-video bg-gray-100 animate-pulse" />
                    <div className="p-6 bg-white">
                      <div className="h-5 bg-gray-100 rounded animate-pulse w-3/4" />
                    </div>
                  </div>
                ))}
          </div>

          <div className="text-center space-y-4">
            {videos.length > 6 && (
              <Link
                href="/highlights"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                View All Highlights
                <ArrowRight size={20} />
              </Link>
            )}
            <div className="flex items-center justify-center gap-3">
              <span className="text-gray-500 text-sm">Want more?</span>
              <a
                href={youtubeChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-red-100 text-red-600 font-semibold rounded-full hover:bg-red-50 hover:border-red-200 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Youtube size={18} />
                Subscribe on YouTube
              </a>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-16 text-center">
          <div className="inline-block p-6 bg-white rounded-full shadow-lg mb-6">
            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </div>
          <p className="text-gray-600 text-xl font-semibold mb-4">
            Stay tuned to watch our season highlights
          </p>
          <a
            href={youtubeChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all duration-300"
          >
            <Youtube size={20} />
            Subscribe for Updates
          </a>
        </div>
      )}

      {expandedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setExpandedVideo(null)}
        >
          <div
            className="relative w-full max-w-6xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setExpandedVideo(null)}
              className="absolute top-4 right-4 z-10 p-3 bg-black/70 hover:bg-black text-white rounded-full transition-all hover:scale-110"
            >
              <X size={24} />
            </button>
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(
                  expandedVideo.youtube_url
                )}?autoplay=1&enablejsapi=1`}
                title={expandedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="p-6 bg-gray-900 text-white border-t border-gray-800">
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