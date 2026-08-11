// File: components/sections/nnw/StreamSection.tsx
'use client'

import { useState } from 'react'
import { Play, Youtube, Twitch, Users } from 'lucide-react'
import styles from './nnw.module.css'
import { Reveal } from './hooks'
import { STREAM_POSTER, DEMO_HIGHLIGHTS } from './data'
import { extractYouTubeId } from './data'
import { YouTubeVideo } from './types'

export default function StreamSection({ videos }: { videos: YouTubeVideo[] }) {
  const [isLive, setIsLive] = useState(true)
  const [platform, setPlatform] = useState<'youtube' | 'twitch'>('youtube')

  const featuredVideo = videos[0]
  const sideVideos = videos.length ? videos.slice(1, 4) : []
  const highlightCards = sideVideos.length
    ? sideVideos.map((v) => ({ title: v.title, tag: v.category || 'Highlight', img: undefined as string | undefined }))
    : DEMO_HIGHLIGHTS

  return (
    <section id="stream" className={styles.section} style={{ background: 'var(--navy)' }}>
      <div className={styles.wrap}>
        <Reveal>
          <div className={styles.eyebrow}><span className={styles['eyebrow-bar']} style={{ background: 'var(--gold)' }} /><span className={styles['eyebrow-text']} style={{ color: 'var(--gold)' }}>Watch</span></div>
        </Reveal>
        <Reveal delay={60}>
          <h2 className={styles.display} style={{ fontSize: 'clamp(34px,6vw,58px)', color: 'var(--bone)', lineHeight: 0.95, maxWidth: 620 }}>Every round,<br />streamed live.</h2>
        </Reveal>
        <Reveal delay={100}>
          <p style={{ marginTop: 20, maxWidth: 520, color: 'var(--ash)', lineHeight: 1.6 }}>
            Zone rounds stream live on YouTube and Twitch. Between rounds, catch replays
            and highlight cuts right here.
          </p>
        </Reveal>

        <Reveal delay={140}>
          <div className={styles['live-toggle']}>
            <span className={styles.mono} style={{ fontSize: 10, color: 'var(--ash)', textTransform: 'uppercase' }}>Preview:</span>
            <button className={isLive ? styles.active : ''} onClick={() => setIsLive(true)}>Live</button>
            <button className={!isLive ? styles.active : ''} onClick={() => setIsLive(false)}>Offline / Highlights</button>
          </div>
        </Reveal>

        <div className={styles['stream-panel']}>
          <Reveal delay={180}>
            <div>
              <a
                href={featuredVideo ? featuredVideo.youtube_url : undefined}
                target={featuredVideo ? '_blank' : undefined}
                rel={featuredVideo ? 'noopener noreferrer' : undefined}
                className={styles.player}
              >
                <img
                  src={featuredVideo ? `https://img.youtube.com/vi/${extractYouTubeId(featuredVideo.youtube_url)}/hqdefault.jpg` : STREAM_POSTER}
                  alt={featuredVideo ? featuredVideo.title : 'Warrior mid-jump during a live round'}
                />
                {isLive ? (
                  <>
                    <div className={styles['player-badge']}><span className={styles.dot} /><span>Live</span></div>
                    {!featuredVideo && <div className={styles['player-viewers']}><Users size={12} color="var(--bone)" /><span>3,214 watching</span></div>}
                    <button className={styles['play-btn']}><Play size={22} color="var(--bone)" fill="var(--bone)" /></button>
                  </>
                ) : (
                  <>
                    <div className={styles['player-badge']} style={{ background: 'rgba(var(--navy-rgb),0.7)' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ash)' }} /><span>Offline</span></div>
                    <button className={styles['play-btn']}><Play size={22} color="var(--bone)" fill="var(--bone)" /></button>
                  </>
                )}
              </a>
              {!isLive && (
                <div className={styles['offline-note']}>
                  <Play size={13} color="var(--ash)" />
                  <span>Stream is offline - playing latest highlight reel below</span>
                </div>
              )}
              <div className={styles['platform-tabs']}>
                <button className={`${styles['platform-tab']} ${platform === 'youtube' ? styles.active : ''}`} onClick={() => setPlatform('youtube')}><Youtube size={15} /> YouTube</button>
                <button className={`${styles['platform-tab']} ${platform === 'twitch' ? styles.active : ''}`} onClick={() => setPlatform('twitch')}><Twitch size={15} /> Twitch</button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div className={styles['stream-side']}>
              <div className={styles['side-title']}>Highlights</div>
              {highlightCards.map((h) => (
                <div className={styles['highlight-card']} key={h.title}>
                  <div className={styles['highlight-thumb']}>
                    {h.img && <img src={h.img} alt={h.title} />}
                    <Play size={16} color="var(--bone)" />
                  </div>
                  <div>
                    <div className={styles['highlight-title']}>{h.title}</div>
                    <div className={`${styles['highlight-tag']} ${styles.mono}`}>{h.tag}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}