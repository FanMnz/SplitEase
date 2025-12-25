'use client'

import React from 'react'
import MuxPlayer from '@mux/mux-player-react'
import { motion } from 'framer-motion'

interface AnnouncementHeroProps {
  playbackId: string
  title: string
  highlight?: string
  subtitle?: string
  ctaLabel?: string
  onCtaClick?: () => void
  secondaryCtaLabel?: string
  onSecondaryCtaClick?: () => void
  badgeLabel?: string
  badgeIcon?: string
  poster?: string
}

const AnnouncementHero: React.FC<AnnouncementHeroProps> = ({
  playbackId,
  title,
  highlight,
  subtitle,
  ctaLabel,
  onCtaClick,
  secondaryCtaLabel,
  onSecondaryCtaClick,
  badgeLabel,
  badgeIcon,
  poster
}) => {
  return (
    <section className="relative w-screen h-screen overflow-hidden">
      <MuxPlayer
        className="absolute inset-0 w-full h-full"
        playbackId={playbackId}
        streamType="on-demand"
        muted
        autoPlay
        loop
        playsInline
        poster={poster}
        style={{
          width: '100%',
          height: '100%',
          // Ensure the internal media element covers the container (no letterboxing)
          ['--media-object-fit' as any]: 'cover',
          ['--media-object-position' as any]: 'center'
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />

      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          {badgeLabel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 bg-white/15 text-white rounded-full text-sm font-medium mb-6 backdrop-blur"
            >
              {badgeIcon && <span className="mr-2">{badgeIcon}</span>}
              {badgeLabel}
            </motion.div>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold text-white drop-shadow"
          >
            {title}
          </motion.h1>
          {highlight && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="text-4xl md:text-6xl font-extrabold"
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 drop-shadow">
                {highlight}
              </span>
            </motion.div>
          )}
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
          {(ctaLabel || secondaryCtaLabel) && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              {ctaLabel && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  onClick={onCtaClick}
                  className="inline-flex items-center px-6 py-3 rounded-full bg-white/90 hover:bg-white text-gray-900 font-semibold shadow-lg backdrop-blur"
                >
                  {ctaLabel}
                </motion.button>
              )}
              {secondaryCtaLabel && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  onClick={onSecondaryCtaClick}
                  className="inline-flex items-center px-6 py-3 rounded-full bg-white/80 hover:bg-white text-gray-900 font-semibold shadow-lg backdrop-blur"
                >
                  {secondaryCtaLabel}
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default AnnouncementHero
