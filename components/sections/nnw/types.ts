// File: components/sections/nnw/types.ts

export interface Champion {
  id: string
  user_id: string
  season_id: string
  full_name: string
  position: number
  photo_url: string | null
  final_points?: number
}

export interface Runner {
  id: string
  user_id: string
  full_name: string
  position: number
  photo_url: string | null
}

export interface Season {
  id: string
  name: string
  year: number
  application_start_date: string
  application_end_date: string
  status: string
}

export interface YouTubeVideo {
  id: string
  title: string
  youtube_url: string
  description: string
  category: string
  order_position: number
}

export interface Sponsor {
  id: string
  name: string
  logo_url: string
  website_url: string
}

export interface RosterCard {
  bib: string
  name: string
  zone: string
  event: string
  pr: string
  init: string
}

export interface HighlightCard {
  title: string
  tag: string
  img?: string
}