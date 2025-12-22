'use client'

import React from 'react'
import MuxPlayer from '@mux/mux-player-react'

interface BackgroundVideoProps {
  playbackId: string
  poster?: string
  overlayGradient?: boolean
  className?: string
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  playbackId,
  poster,
  overlayGradient = true,
  className = ''
}) => {
  return (
    <div className={`relative w-full h-[60vh] lg:h-[80vh] overflow-hidden ${className}`}>
      {/* Video */}
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

      {/* Overlay */}
      {overlayGradient && (
        <div className="absolute inset-0 bg-black/30" />
      )}

      {/* Reduce motion fallback (handled by browser autoplay policy via muted/playsInline) */}
    </div>
  )
}

export default BackgroundVideo
