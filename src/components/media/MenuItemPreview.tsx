'use client'

import React, { useState } from 'react'
import MuxPlayer from '@mux/mux-player-react'
import { motion } from 'framer-motion'

interface MenuItemPreviewProps {
  name: string
  price: number
  description?: string
  muxPlaybackId?: string
  posterUrl?: string
  onAdd?: () => void
}

const MenuItemPreview: React.FC<MenuItemPreviewProps> = ({
  name,
  price,
  description,
  muxPlaybackId,
  posterUrl,
  onAdd
}) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-48">
        {muxPlaybackId ? (
          <MuxPlayer
            playbackId={muxPlaybackId}
            streamType="on-demand"
            muted
            autoPlay={hovered}
            loop
            playsInline
            poster={posterUrl}
            style={{
              width: '100%',
              height: '100%',
              ['--media-object-fit' as any]: 'cover',
              ['--media-object-position' as any]: 'center'
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            No preview
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg drop-shadow">{name}</h3>
            {description && (
              <p className="text-white/90 text-sm line-clamp-1">{description}</p>
            )}
          </div>
          <div className="px-3 py-1.5 rounded-full bg-white/90 text-gray-900 font-semibold shadow">€{price.toFixed(2)}</div>
        </div>
      </div>

      <div className="p-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onAdd}
          className="w-full py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-black transition"
        >
          Add to Order
        </motion.button>
      </div>
    </div>
  )
}

export default MenuItemPreview
