import { useEffect, useState } from 'react'

interface MediaConfig {
  announcement: {
    playbackId: string
    poster: string
  }
  background: {
    playbackId: string
    poster: string
  }
  items: {
    [key: string]: {
      playbackId: string
      poster: string
    }
  }
}

const STORAGE_KEY = 'splitease_media_config'
const DEFAULT_CONFIG: MediaConfig = {
  announcement: {
    playbackId: "Xim02Gq6G1ygLS00zHobgjiMXuq1gwAv01DBaLR5pxgMkg",
    poster: "https://via.placeholder.com/1600x900?text=Announcement+Hero",
  },
  background: {
    playbackId: "iIJzzdGotO2vFbTvx8COXRc01Gq2thhL8YbjVMptniTk",
    poster: "https://image.mux.com/iIJzzdGotO2vFbTvx8COXRc01Gq2thhL8YbjVMptniTk/poster.jpg",
  },
  items: {
    grilledSalmon: {
      playbackId: "mux_demo_salmon_001",
      poster: "https://via.placeholder.com/800x600?text=Grilled+Salmon",
    },
    ribeyeSteak: {
      playbackId: "mux_demo_steak_002",
      poster: "https://via.placeholder.com/800x600?text=Ribeye+Steak",
    },
    mushroomRisotto: {
      playbackId: "mux_demo_risotto_003",
      poster: "https://via.placeholder.com/800x600?text=Mushroom+Risotto",
    },
    tiramisu: {
      playbackId: "mux_demo_tiramisu_004",
      poster: "https://via.placeholder.com/800x600?text=Tiramisu",
    },
  },
};

export function useMediaConfig(): MediaConfig {
  const [config, setConfig] = useState<MediaConfig>(DEFAULT_CONFIG)

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          setConfig(JSON.parse(stored))
        } catch (error) {
          console.error('Failed to load media config from storage:', error)
          setConfig(DEFAULT_CONFIG)
        }
      }
    }
  }, [])

  // Return config - will update after useEffect runs on client
  return config
}

export function getMediaConfigSync(): MediaConfig {
  if (typeof window === 'undefined') {
    return DEFAULT_CONFIG
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (error) {
      console.error('Failed to parse media config:', error)
      return DEFAULT_CONFIG
    }
  }
  return DEFAULT_CONFIG
}
