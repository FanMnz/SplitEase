'use client'

import { useState, useEffect } from 'react'
import { useOrders, MenuItem, OrderItem } from '@/contexts/OrderContext'
import MuxPlayer from '@mux/mux-player-react'
import { useMediaConfig } from '@/hooks/useMediaConfig'
import { 
  PlusIcon,
  MinusIcon,
  ShoppingCartIcon,
  ClockIcon,
  InformationCircleIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface MenuDisplayProps {
  onAddToCart: (item: OrderItem) => void
  cartItems: OrderItem[]
  className?: string
  showCategories?: boolean
}

export default function MenuDisplay({ 
  onAddToCart, 
  cartItems, 
  className = '',
  showCategories = true 
}: MenuDisplayProps) {
  const { menu, getMenuByCategory } = useOrders()
  const mediaConfig = useMediaConfig()
  const [mounted, setMounted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('appetizers')
  const [favorites, setFavorites] = useState<string[]>([])
  const [showDetails, setShowDetails] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const categories = [
    { id: 'appetizers', name: 'Appetizers', emoji: '🥗' },
    { id: 'mains', name: 'Main Courses', emoji: '🍽️' },
    { id: 'desserts', name: 'Desserts', emoji: '🍰' },
    { id: 'beverages', name: 'Beverages', emoji: '🥤' }
  ]

  const getDietaryIcon = (dietary: string) => {
    switch (dietary) {
      case 'vegetarian': return <SparklesIcon className="w-4 h-4 text-green-600" title="Vegetarian" />
      case 'vegan': return <div className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold" title="Vegan">V</div>
      case 'gluten-free': return <div className="w-4 h-4 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-bold" title="Gluten Free">GF</div>
      default: return null
    }
  }

  const getItemQuantityInCart = (itemId: string) => {
    const cartItem = cartItems.find(item => item.menuItem.id === itemId)
    return cartItem ? cartItem.quantity : 0
  }

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
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

  const currentItems = showCategories 
    ? getMenuByCategory(selectedCategory)
    : menu.filter(item => item.isAvailable)

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-neutral-200 ${className}`}>
      {/* Header */}
      <div className="border-b border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Menu</h2>
            <p className="text-sm text-neutral-600">
              {currentItems.length} items available
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <ShoppingCartIcon className="w-5 h-5 text-neutral-600" />
            <span className="text-sm font-medium text-neutral-900">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>
        </div>

        {/* Category Filters */}
        {showCategories && (
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-brand-500 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                <span>{category.emoji}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div className="p-6">
        {currentItems.length === 0 ? (
          <div className="text-center py-12">
            <InformationCircleIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No Items Available</h3>
            <p className="text-neutral-600">
              Check back later or select a different category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => {
              const quantityInCart = getItemQuantityInCart(item.id)
              const isFavorite = favorites.includes(item.id)
              
              return (
                <div
                  key={item.id}
                  className="border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Media Preview */}
                  <div className="h-48 relative overflow-hidden">
                    {item.muxPlaybackId ? (
                      <MuxPlayer
                        playbackId={item.muxPlaybackId}
                        streamType="on-demand"
                        muted
                        autoPlay
                        loop
                        playsInline
                        poster={item.posterUrl}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                        <span className="text-4xl">{item.category === 'appetizers' ? '🥗' : item.category === 'mains' ? '🍽️' : item.category === 'desserts' ? '🍰' : '🥤'}</span>
                      </div>
                    )}
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                    >
                      {isFavorite ? (
                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-neutral-400 hover:text-red-500" />
                      )}
                    </button>

                    {/* Availability Badge */}
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-medium">Unavailable</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {/* Item Info */}
                    <div className="mb-3">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-neutral-900">{item.name}</h3>
                        <span className="text-lg font-bold text-brand-600">
                          €{item.price.toFixed(2)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-neutral-600 mb-2 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Dietary and Time Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {item.dietary.map((diet, idx) => (
                            <div key={`${item.id}-${diet}-${idx}`}>
                              {getDietaryIcon(diet)}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-neutral-500">
                          <ClockIcon className="w-4 h-4" />
                          <span>{item.preparationTime}min</span>
                        </div>
                      </div>
                    </div>

                    {/* Allergens */}
                    {item.allergens.length > 0 && (
                      <div className="mb-3 p-2 bg-yellow-50 rounded-lg">
                        <p className="text-xs text-yellow-800">
                          <strong>Allergens:</strong> {item.allergens.join(', ')}
                        </p>
                      </div>
                    )}

                    {/* Add to Cart Controls */}
                    <div className="flex items-center justify-between">
                      {quantityInCart > 0 ? (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => {
                              // Remove one from cart logic would go here
                              console.log('Remove from cart:', item.id)
                            }}
                            className="p-1 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                          >
                            <MinusIcon className="w-4 h-4 text-neutral-600" />
                          </button>
                          <span className="font-medium text-neutral-900">
                            {quantityInCart}
                          </span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="p-1 rounded-full bg-brand-500 hover:bg-brand-600 text-white transition-colors"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.isAvailable}
                          className="flex items-center space-x-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:bg-neutral-300 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          <PlusIcon className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                      )}

                      {/* Details Button */}
                      <button
                        onClick={() => setShowDetails(showDetails === item.id ? null : item.id)}
                        className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                      >
                        <InformationCircleIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Expanded Details */}
                    {showDetails === item.id && (
                      <div className="mt-4 pt-4 border-t border-neutral-200">
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-neutral-900">Ingredients:</span>
                            <p className="text-neutral-600">{item.ingredients.join(', ')}</p>
                          </div>
                          {item.dietary.length > 0 && (
                            <div>
                              <span className="font-medium text-neutral-900">Dietary:</span>
                              <p className="text-neutral-600">{item.dietary.join(', ')}</p>
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-neutral-900">Prep Time:</span>
                            <p className="text-neutral-600">{item.preparationTime} minutes</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}