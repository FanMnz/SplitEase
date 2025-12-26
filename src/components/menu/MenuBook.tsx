'use client'

import { useEffect, useState } from 'react'
import { useOrders, MenuItem, OrderItem } from '@/contexts/OrderContext'
import MuxPlayer from '@mux/mux-player-react'
import { 
  PlusIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/24/outline'

interface MenuBookProps {
  onAddToCart: (item: OrderItem) => void
  cartItems: OrderItem[]
  className?: string
}

export default function MenuBook({ onAddToCart, cartItems, className = '' }: MenuBookProps) {
  const { getMenuByCategory, menu } = useOrders()
  const [mounted, setMounted] = useState(false)
  const categories = [
    { id: 'appetizers', name: 'Appetizers', emoji: '🥗' },
    { id: 'mains', name: 'Main Courses', emoji: '🍽️' },
    { id: 'desserts', name: 'Desserts', emoji: '🍰' },
    { id: 'beverages', name: 'Beverages', emoji: '🥤' }
  ]
  const [pageIndex, setPageIndex] = useState(0)
  const [isTurning, setIsTurning] = useState<'next'|'prev'|null>(null)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchDeltaX, setTouchDeltaX] = useState(0)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentCategory = categories[pageIndex]
  const currentItems = getMenuByCategory(currentCategory.id)

  const getItemQuantityInCart = (itemId: string) => {
    const cartItem = cartItems.find(ci => ci.menuItem.id === itemId)
    return cartItem ? cartItem.quantity : 0
  }

  const handleAddToCart = (menuItem: MenuItem, quantity: number = 1) => {
    const orderItem: OrderItem = {
      id: `${menuItem.id}_${Date.now()}`,
      menuItem,
      quantity,
      unitPrice: menuItem.price,
      totalPrice: menuItem.price * quantity
    }
    onAddToCart(orderItem)
  }

  const goPrev = () => {
    if (pageIndex === 0) return
    setIsTurning('prev')
    if (soundEnabled) playFlipSound()
    setTimeout(() => {
      setPageIndex(i => Math.max(0, i - 1))
      setIsTurning(null)
    }, 250)
  }

  const goNext = () => {
    if (pageIndex === categories.length - 1) return
    setIsTurning('next')
    if (soundEnabled) playFlipSound()
    setTimeout(() => {
      setPageIndex(i => Math.min(categories.length - 1, i + 1))
      setIsTurning(null)
    }, 250)
  }

  // Touch swipe handling
  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    setTouchStartX(e.touches[0].clientX)
    setTouchDeltaX(0)
  }

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartX === null) return
    const dx = e.touches[0].clientX - touchStartX
    setTouchDeltaX(dx)
  }

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    const threshold = 60
    if (touchDeltaX > threshold) {
      goPrev()
    } else if (touchDeltaX < -threshold) {
      goNext()
    }
    setTouchStartX(null)
    setTouchDeltaX(0)
  }

  // Paper rustling sound via WebAudio
  const playFlipSound = () => {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioCtx()
      const now = ctx.currentTime
      
      // Create white noise for paper rustling effect
      const bufferSize = ctx.sampleRate * 0.12
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      
      const noise = ctx.createBufferSource()
      noise.buffer = buffer
      
      // High-pass filter for crisp paper sound
      const filter = ctx.createBiquadFilter()
      filter.type = 'highpass'
      filter.frequency.value = 2400
      filter.Q.value = 0.8
      
      const gain = ctx.createGain()
      gain.gain.value = 0.0001
      
      noise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      
      // Quick attack, fast decay for paper rustle
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.008)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12)
      
      noise.start(now)
      noise.stop(now + 0.13)
    } catch (e) {
      // ignore
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [pageIndex])

  if (!mounted) {
    return <div className={`bg-white rounded-xl shadow-sm border border-neutral-200 h-64 ${className}`} />
  }

  return (
    <div className={`relative ${className}`}>
      {/* Selected dish preview above the book */}
      <div className="relative w-full max-w-3xl mx-auto mb-6">
        <div className="relative h-56 lg:h-72 rounded-2xl border border-neutral-200 overflow-hidden bg-neutral-100 flex items-center justify-center">
          {selectedItem ? (
            <>
              {selectedItem.muxPlaybackId ? (
                <MuxPlayer
                  playbackId={selectedItem.muxPlaybackId}
                  streamType="on-demand"
                  muted
                  autoPlay
                  loop
                  playsInline
                  poster={selectedItem.posterUrl}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : selectedItem.posterUrl ? (
                <img
                  src={selectedItem.posterUrl}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl">
                  {selectedItem.category === 'appetizers' ? '🥗' : selectedItem.category === 'mains' ? '🍽️' : selectedItem.category === 'desserts' ? '🍰' : '🥤'}
                </div>
              )}
              {/* Dish details legend overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4 pt-12">
                <h3 className="text-white font-bold text-lg mb-1">{selectedItem.name}</h3>
                <p className="text-white/90 text-sm mb-2">{selectedItem.description}</p>
                <div className="flex items-center gap-4 text-xs text-white/80">
                  <span className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    {selectedItem.preparationTime} min
                  </span>
                  <span className="font-semibold text-white">€{selectedItem.price.toFixed(2)}</span>
                  {selectedItem.dietary && selectedItem.dietary.length > 0 && (
                    <span className="flex items-center gap-1">
                      {selectedItem.dietary.map(diet => (
                        <span key={diet} className="text-xs">
                          {diet === 'vegetarian' && '🥬'}
                          {diet === 'vegan' && '🌱'}
                          {diet === 'gluten-free' && '🌾'}
                          {diet === 'dairy-free' && '🥛'}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-neutral-500">
              <p className="text-sm">Tap an item to preview</p>
            </div>
          )}
        </div>
      </div>

      {/* Book container */}
      <div className="relative w-full max-w-lg mx-auto">
        {/* Book spine */}
        <div className="absolute -left-2 top-6 bottom-6 w-2 bg-gradient-to-b from-neutral-300 via-neutral-400 to-neutral-300 rounded" />

        {/* Book card */}
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
            <button
              onClick={goPrev}
              disabled={pageIndex === 0}
              className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <div className="text-center">
              <p className="text-xs text-neutral-500">Category</p>
              <p className="text-sm font-semibold">{currentCategory.emoji} {currentCategory.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(s => !s)}
                className={`p-2 rounded-lg ${soundEnabled ? 'bg-brand-50 text-brand-700' : 'hover:bg-neutral-100 text-neutral-600'}`}
                aria-label="Toggle flip sound"
                title={soundEnabled ? 'Flip sound on' : 'Flip sound off'}
              >
                {soundEnabled ? (
                  <SpeakerWaveIcon className="w-5 h-5" />
                ) : (
                  <SpeakerXMarkIcon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={goNext}
                disabled={pageIndex === categories.length - 1}
                className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Page content with simple turn animation */}
          <div
            className="relative h-[480px] select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div
                className={`absolute inset-0 p-4 space-y-3 transition-transform duration-300 ease-out ${
                  isTurning === 'next' ? 'translate-x-4 opacity-90' : isTurning === 'prev' ? '-translate-x-4 opacity-90' : ''
                }`}
                style={{
                  transform:
                    touchDeltaX !== 0
                      ? `translateX(${Math.max(Math.min(touchDeltaX, 80), -80)}px) skewY(${Math.max(Math.min(touchDeltaX / 20, 4), -4)}deg)`
                      : undefined,
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 20% 10%, rgba(0,0,0,0.03), rgba(0,0,0,0) 40%), radial-gradient(circle at 80% 90%, rgba(0,0,0,0.02), rgba(0,0,0,0) 40%), repeating-linear-gradient(0deg, rgba(0,0,0,0.015) 0, rgba(0,0,0,0.015) 1px, rgba(0,0,0,0) 2px)'
                  }}
                />
                {currentItems.slice(0, 12).map((item) => {
                  const qty = getItemQuantityInCart(item.id)
                  return (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between px-3 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50"
                    >
                      <button onClick={() => setSelectedItem(item)} className="flex-1 text-left">
                        <p className="font-medium text-neutral-900">{item.name}</p>
                        <div className="flex items-center text-xs text-neutral-500 gap-2">
                          <span>€{item.price.toFixed(2)}</span>
                          <span className="inline-flex items-center gap-1"><ClockIcon className="w-3 h-3" />{item.preparationTime}m</span>
                        </div>
                      </button>
                      <div className="flex items-center gap-2">
                        {qty > 0 && (
                          <span className="px-2 py-1 rounded-lg bg-brand-50 text-brand-700 text-xs font-semibold">{qty}</span>
                        )}
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.isAvailable}
                          className="px-3 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-medium disabled:bg-neutral-300"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Edge shadows and page edge highlights */}
              {touchDeltaX > 0 && (
                <>
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(90deg, rgba(0,0,0,${Math.min(touchDeltaX / 120, 0.25)}) 0%, rgba(0,0,0,0) 50%)`
                    }}
                  />
                  <div
                    className="absolute left-0 top-0 bottom-0 w-10 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.0) 70%)'
                    }}
                  />
                </>
              )}
              {touchDeltaX < 0 && (
                <>
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(270deg, rgba(0,0,0,${Math.min(Math.abs(touchDeltaX) / 120, 0.25)}) 0%, rgba(0,0,0,0) 50%)`
                    }}
                  />
                  <div
                    className="absolute right-0 top-0 bottom-0 w-10 pointer-events-none"
                    style={{
                      background: 'linear-gradient(270deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.0) 70%)'
                    }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Footer with page indicator */}
          <div className="px-4 py-2 border-t border-neutral-200 flex items-center justify-center text-xs text-neutral-500">
            Page {pageIndex + 1} / {categories.length}
          </div>
        </div>
      </div>
    </div>
  )
}
