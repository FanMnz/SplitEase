'use client'

import React, { useState, useEffect } from 'react'
import { Save, RotateCcw, Eye, Copy, Check } from 'lucide-react'

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
    playbackId: 'mux_demo_announcement_12345',
    poster: 'https://via.placeholder.com/1600x900?text=Announcement+Hero'
  },
  background: {
    playbackId: 'mux_demo_background_67890',
    poster: 'https://via.placeholder.com/1600x900?text=Background+Video'
  },
  items: {
    grilledSalmon: {
      playbackId: 'mux_demo_salmon_001',
      poster: 'https://via.placeholder.com/800x600?text=Grilled+Salmon'
    },
    ribeyeSteak: {
      playbackId: 'mux_demo_steak_002',
      poster: 'https://via.placeholder.com/800x600?text=Ribeye+Steak'
    },
    mushroomRisotto: {
      playbackId: 'mux_demo_risotto_003',
      poster: 'https://via.placeholder.com/800x600?text=Mushroom+Risotto'
    },
    tiramisu: {
      playbackId: 'mux_demo_tiramisu_004',
      poster: 'https://via.placeholder.com/800x600?text=Tiramisu'
    }
  }
}

export default function MediaConfigPage() {
  const [config, setConfig] = useState<MediaConfig>(DEFAULT_CONFIG)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<string[]>(['announcement', 'background'])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setConfig(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to load config from storage:', error)
      }
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    if (window.confirm('Reset all media config to defaults?')) {
      setConfig(DEFAULT_CONFIG)
      localStorage.removeItem(STORAGE_KEY)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const handleUpdateField = (section: string, field: string, value: string) => {
    setConfig(prev => {
      if (section === 'items') {
        const [itemKey, itemField] = field.split('.')
        return {
          ...prev,
          items: {
            ...prev.items,
            [itemKey]: {
              ...prev.items[itemKey],
              [itemField]: value
            }
          }
        }
      }
      return {
        ...prev,
        [section]: {
          ...prev[section as keyof MediaConfig],
          [field]: value
        }
      }
    })
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Media Configuration</h1>
          <p className="text-gray-600">
            Manage Mux playback IDs and poster images for your restaurant media
          </p>
        </div>

        {/* Status Messages */}
        {saved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Configuration saved successfully!</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Announcement Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={() => toggleSection('announcement')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <h2 className="text-xl font-semibold text-gray-900">Announcement Hero Video</h2>
              <div className={`transform transition-transform ${expandedSections.includes('announcement') ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </button>

            {expandedSections.includes('announcement') && (
              <div className="border-t border-gray-200 px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mux Playback ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={config.announcement.playbackId}
                      onChange={(e) => handleUpdateField('announcement', 'playbackId', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Ds00sSvF021OikYIPZHp02OilLEnFQ2IFe"
                    />
                    <button
                      onClick={() => handleCopy(config.announcement.playbackId, 'announcement-id')}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                      title="Copy playback ID"
                    >
                      {copied === 'announcement-id' ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Get this from your Mux dashboard → Assets → Copy the playback ID
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poster Image URL
                  </label>
                  <input
                    type="text"
                    value={config.announcement.poster}
                    onChange={(e) => handleUpdateField('announcement', 'poster', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://image.mux.com/..."
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Fallback image shown while video loads
                  </p>
                </div>

                {/* Preview */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
                  <img
                    src={config.announcement.poster}
                    alt="Announcement preview"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/1200x630?text=Invalid+Image'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Background Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={() => toggleSection('background')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <h2 className="text-xl font-semibold text-gray-900">Background Video</h2>
              <div className={`transform transition-transform ${expandedSections.includes('background') ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </button>

            {expandedSections.includes('background') && (
              <div className="border-t border-gray-200 px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mux Playback ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={config.background.playbackId}
                      onChange={(e) => handleUpdateField('background', 'playbackId', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Ds00sSvF021OikYIPZHp02OilLEnFQ2IFe"
                    />
                    <button
                      onClick={() => handleCopy(config.background.playbackId, 'background-id')}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                      title="Copy playback ID"
                    >
                      {copied === 'background-id' ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poster Image URL
                  </label>
                  <input
                    type="text"
                    value={config.background.poster}
                    onChange={(e) => handleUpdateField('background', 'poster', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://image.mux.com/..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Menu Items Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={() => toggleSection('items')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <h2 className="text-xl font-semibold text-gray-900">Menu Item Videos</h2>
              <div className={`transform transition-transform ${expandedSections.includes('items') ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </button>

            {expandedSections.includes('items') && (
              <div className="border-t border-gray-200 px-6 py-4 space-y-8">
                {Object.entries(config.items).map(([key, item]) => (
                  <div key={key} className="pb-6 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <div className="space-y-4 ml-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Playback ID
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={item.playbackId}
                            onChange={(e) => handleUpdateField('items', `${key}.playbackId`, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Ds00sSvF021OikYIPZHp02OilLEnFQ2IFe"
                          />
                          <button
                            onClick={() => handleCopy(item.playbackId, `item-${key}-id`)}
                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                            title="Copy playback ID"
                          >
                            {copied === `item-${key}-id` ? (
                              <Check className="w-5 h-5 text-green-600" />
                            ) : (
                              <Copy className="w-5 h-5 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Poster URL
                        </label>
                        <input
                          type="text"
                          value={item.poster}
                          onChange={(e) => handleUpdateField('items', `${key}.poster`, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://image.mux.com/..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-end">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition"
          >
            <RotateCcw className="w-5 h-5" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            <Save className="w-5 h-5" />
            Save Configuration
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to get Mux Playback IDs</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
            <li>Sign up at <a href="https://mux.com" target="_blank" rel="noopener noreferrer" className="underline">mux.com</a></li>
            <li>Upload your video to Mux (or use their asset library)</li>
            <li>Go to Assets and find your video</li>
            <li>Copy the <strong>Playback ID</strong> (looks like: <code className="bg-blue-100 px-2 py-1 rounded">Ds00sSvF021...</code>)</li>
            <li>Paste it here and save</li>
            <li>Video will stream with adaptive bitrate and CDN optimization</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
