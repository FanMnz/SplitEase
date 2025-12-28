'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
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
  onSelectItem?: (item: MenuItem) => void
}

export default function MenuBook({ onAddToCart, cartItems, className = '', onSelectItem }: MenuBookProps) {
  const { getMenuByCategory } = useOrders()
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
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handwritingFont = `'Segoe Script', 'Bradley Hand', 'Comic Sans MS', 'Caveat', cursive`
  const notebookStyle: CSSProperties = {
    backgroundColor: '#fffdf7',
    backgroundImage: `
      linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px),
      linear-gradient(to right, rgba(244,63,94,0.35) 2px, transparent 2px)
    `,
    backgroundSize: '100% 44px, 74px 100%',
    backgroundPosition: '0 28px, 62px 0',
  }

  useEffect(() => {
    setMounted(true)
    // Preload external flip sound if available in /public/sounds/page-flip.mp3
    const audio = new Audio('/sounds/page-flip.mp3')
    audio.preload = 'auto'
    audioRef.current = audio
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
    if (soundEnabled) playFlipSound('prev')
    setTimeout(() => {
      setPageIndex(i => Math.max(0, i - 1))
      setIsTurning(null)
    }, 250)
  }

  const goNext = () => {
    if (pageIndex === categories.length - 1) return
    setIsTurning('next')
    if (soundEnabled) playFlipSound('next')
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

  // MP3-first flip sound; falls back to WebAudio synthesis if file missing
  const playFlipSound = (direction: 'next' | 'prev' = 'next') => {
    try {
      const audio = audioRef.current
      if (audio) {
        audio.currentTime = 0
        // Slight playbackRate tweak for direction feel
        audio.playbackRate = direction === 'next' ? 1.02 : 0.98
        audio.play().catch(() => {})
        return
      }

      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioCtx()
      if (ctx.state === 'suspended') ctx.resume()
      const now = ctx.currentTime

      // Base paper rustle: band-passed noise with slight sweep, longer tail (~0.35s)
      const bufferSize = Math.floor(ctx.sampleRate * 0.38)
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }

      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const bandpass = ctx.createBiquadFilter()
      bandpass.type = 'bandpass'
      bandpass.frequency.setValueAtTime(750, now)
      bandpass.frequency.linearRampToValueAtTime(1500, now + 0.18)
      bandpass.Q.value = 1.1

      const highpass = ctx.createBiquadFilter()
      highpass.type = 'highpass'
      highpass.frequency.value = 380
      highpass.Q.value = 0.8

      const rustleGain = ctx.createGain()
      rustleGain.gain.setValueAtTime(0.0001, now)
      rustleGain.gain.exponentialRampToValueAtTime(0.22, now + 0.014)
      rustleGain.gain.exponentialRampToValueAtTime(0.04, now + 0.18)
      rustleGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.34)
      rustleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38)

      const panner = ctx.createStereoPanner()
      panner.pan.setValueAtTime(direction === 'next' ? 0.35 : -0.35, now)

      noise.connect(bandpass)
      bandpass.connect(highpass)
      highpass.connect(rustleGain)
      rustleGain.connect(panner)
      panner.connect(ctx.destination)

      // Low flutter for page stiffness
      const flutter = ctx.createOscillator()
      flutter.type = 'triangle'
      flutter.frequency.setValueAtTime(24, now)
      flutter.frequency.linearRampToValueAtTime(32, now + 0.16)
      const flutterGain = ctx.createGain()
      flutterGain.gain.setValueAtTime(0.00001, now)
      flutterGain.gain.exponentialRampToValueAtTime(0.0045, now + 0.018)
      flutterGain.gain.exponentialRampToValueAtTime(0.0002, now + 0.22)
      flutter.connect(flutterGain)
      flutterGain.connect(ctx.destination)

      // Soft thump to mimic the page settling
      const thump = ctx.createOscillator()
      thump.type = 'sine'
      thump.frequency.setValueAtTime(110, now)
      const thumpGain = ctx.createGain()
      thumpGain.gain.setValueAtTime(0.0001, now)
      thumpGain.gain.exponentialRampToValueAtTime(0.018, now + 0.012)
      thumpGain.gain.exponentialRampToValueAtTime(0.00012, now + 0.09)
      thump.connect(thumpGain)
      thumpGain.connect(ctx.destination)

      // Secondary short rustle for trailing edge
      const noise2 = ctx.createBufferSource()
      noise2.buffer = buffer
      const bandpass2 = ctx.createBiquadFilter()
      bandpass2.type = 'bandpass'
      bandpass2.frequency.setValueAtTime(1600, now + 0.08)
      bandpass2.frequency.linearRampToValueAtTime(1200, now + 0.2)
      bandpass2.Q.value = 0.9
      const gain2 = ctx.createGain()
      gain2.gain.setValueAtTime(0.0001, now + 0.08)
      gain2.gain.exponentialRampToValueAtTime(0.08, now + 0.1)
      gain2.gain.exponentialRampToValueAtTime(0.0004, now + 0.22)
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.3)
      noise2.connect(bandpass2)
      bandpass2.connect(gain2)
      gain2.connect(panner)

      noise.start(now)
      noise.stop(now + 0.38)
      noise2.start(now + 0.08)
      noise2.stop(now + 0.32)
      flutter.start(now)
      flutter.stop(now + 0.24)
      thump.start(now)
      thump.stop(now + 0.11)
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
      {/* Book container */}
      <div className="relative w-full max-w-2xl mx-auto rotate-[-0.4deg]">
        {/* Book spine */}
        <div className="absolute -left-3 top-8 bottom-8 w-3 bg-gradient-to-b from-amber-200 via-amber-300 to-amber-200 rounded-full shadow-inner" />

        {/* Paper holes */}
        <div className="absolute -left-6 top-12 flex flex-col gap-10">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="w-3 h-3 rounded-full bg-neutral-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]" />
          ))}
        </div>

        {/* Book card */}
        <div className="rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.18)] border border-amber-200 overflow-hidden" style={notebookStyle}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-amber-200/70 bg-white/50 backdrop-blur-sm" style={{ fontFamily: handwritingFont }}>
            <button
              onClick={goPrev}
              disabled={pageIndex === 0}
              className="p-2 rounded-lg hover:bg-amber-100/80 disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <div className="text-center">
              <p className="text-xs text-amber-700/80">Category</p>
              <p className="text-lg font-semibold text-amber-900">{currentCategory.emoji} {currentCategory.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(s => !s)}
                className={`p-2 rounded-lg ${soundEnabled ? 'bg-amber-100 text-amber-900' : 'hover:bg-amber-100 text-amber-700'}`}
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
            className="relative h-[520px] select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div
                className={`absolute inset-0 px-5 py-4 space-y-4 transition-transform duration-300 ease-out ${
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
                      className={`group flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                        selectedItem?.id === item.id
                          ? 'border-amber-400 bg-amber-50/80'
                          : 'border-amber-200/70 bg-white/70 hover:bg-amber-50/60'
                      } shadow-[0_4px_10px_rgba(0,0,0,0.06)]`}
                    >
                      <button onClick={() => { setSelectedItem(item); onSelectItem && onSelectItem(item) }} className="flex-1 text-left" style={{ fontFamily: handwritingFont }}>
                        <p className="text-lg text-amber-950 font-semibold">{item.name}</p>
                        <div className="flex items-center text-xs text-amber-800 gap-3 mt-1">
                          <span className="inline-flex items-center gap-1"><ClockIcon className="w-3 h-3" />{item.preparationTime}m</span>
                          <span className="text-sm font-semibold text-amber-900">€{item.price.toFixed(2)}</span>
                        </div>
                      </button>
                      <div className="flex items-center gap-2">
                        {qty > 0 && (
                          <span className="px-2 py-1 rounded-lg bg-brand-50 text-brand-700 text-xs font-semibold">{qty}</span>
                        )}
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.isAvailable}
                          className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-medium disabled:bg-neutral-300 shadow-sm"
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
          <div className="px-5 py-3 border-t border-amber-200/70 bg-white/60 flex items-center justify-center text-xs text-amber-700" style={{ fontFamily: handwritingFont }}>
            Page {pageIndex + 1} / {categories.length}
          </div>
        </div>
      </div>
    </div>
  )
}
