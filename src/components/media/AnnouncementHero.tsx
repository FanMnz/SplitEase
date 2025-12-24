'use client'

import React from 'react'
import MuxPlayer from '@mux/mux-player-react'
import { motion } from 'framer-motion'

interface AnnouncementHeroProps {
  playbackId: string
  title: string
  subtitle?: string
  ctaLabel?: string
  onCtaClick?: () => void
  poster?: string
}

const AnnouncementHero: React.FC<AnnouncementHeroProps> = ({
  playbackId,
  title,
  subtitle,
  ctaLabel,
  onCtaClick,
  poster
}) => {
  return (
    <section className="relative w-screen h-screen overflow-hidden">
      <MuxPlayer
        className="absolute inset-0 w-full h-full object-cover"
        playbackId={playbackId}
        streamType="on-demand"
        muted
        autoPlay
        loop
        playsInline
        poster={poster}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />

      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold text-white drop-shadow"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-4 text-lg md:text-2xl text-white/90"
            >
              {subtitle}
            </motion.p>
          )}
          {ctaLabel && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onClick={onCtaClick}
              className="mt-8 inline-flex items-center px-6 py-3 rounded-full bg-white/90 hover:bg-white text-gray-900 font-semibold shadow-lg backdrop-blur"
            >
              {ctaLabel}
            </motion.button>
          )}
        </div>
      </div>
    </section>
  )
}

export default AnnouncementHero
