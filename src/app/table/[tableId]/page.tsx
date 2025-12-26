'use client'

import React, { useState, useEffect } from 'react'
import AnnouncementHero from '@/components/media/AnnouncementHero'
import MenuDisplay from '@/components/menu/MenuDisplay'
import { useOrders, OrderItem, MenuItem } from '@/contexts/OrderContext'
import { useMediaConfig } from '@/hooks/useMediaConfig'
import { ShoppingCartIcon, XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useParams } from 'next/navigation'

export default function TablePage() {
  const params = useParams()
  const tableId = params.tableId as string
  const mediaConfig = useMediaConfig()
  const { menu, createOrder } = useOrders()
  const [mounted, setMounted] = useState(false)
  const [cart, setCart] = useState<OrderItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [pseudonym, setPseudonym] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [isIdentified, setIsIdentified] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(`table-${tableId}-pseudonym`)
    if (stored) {
      setPseudonym(stored)
      setIsIdentified(true)
      setNameInput(stored)
    }
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-white" />
  }

  const handleConfirmName = () => {
    const trimmed = nameInput.trim()
    if (!trimmed) return
    localStorage.setItem(`table-${tableId}-pseudonym`, trimmed)
    setPseudonym(trimmed)
    setIsIdentified(true)
  }

  // Add item to cart
  const handleAddToCart = (item: OrderItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1, totalPrice: cartItem.unitPrice * (cartItem.quantity + 1) }
            : cartItem
        )
      }
      return [...prevCart, item]
    })
  }

  // Remove item from cart
  const handleRemoveFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
  }

  // Update quantity
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(itemId)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId
          ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
          : item
      )
    )
  }

  // Calculate cart totals
  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Calculate subtotal, tax, and total
  const subtotal = cartTotal
  const taxRate = 0.19 // 19% VAT
  const tax = subtotal * taxRate
  const serviceCharge = subtotal * 0.1 // 10% service charge
  const total = subtotal + tax + serviceCharge

  // Handle checkout
  const handleCheckout = async () => {
    if (cart.length === 0) return

    try {
      const orderId = await createOrder({
        tableNumber: tableId,
        items: cart,
        status: 'pending',
        priority: 'normal',
        totalAmount: subtotal,
        tax,
        serviceCharge,
        finalAmount: total
      })

      // Clear cart and show success
      setCart([])
      setShowCheckout(false)
      alert(`Order #${orderId} placed successfully!`)
    } catch (error) {
      console.error('Failed to create order:', error)
      alert('Failed to place order. Please try again.')
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {!isIdentified && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-brand-600 font-semibold">Welcome</p>
              <h2 className="text-2xl font-bold text-neutral-900 mt-1">Identify yourself</h2>
              <p className="text-sm text-neutral-600 mt-2">Pick a name or nickname so staff can match your orders at table {tableId}.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-neutral-700" htmlFor="pseudonym">Your name or pseudonym</label>
              <input
                id="pseudonym"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmName()
                }}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="e.g., Alice, Table Captain"
                autoFocus
              />
            </div>
            <button
              onClick={handleConfirmName}
              disabled={!nameInput.trim()}
              className="w-full btn btn-primary disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Announcement Hero - Full Bleed */}
      <AnnouncementHero
        playbackId={mediaConfig.announcement.playbackId}
        title={`Welcome, ${pseudonym}`}
        subtitle="Scan & order your favorite dishes"
        ctaLabel="Browse Menu"
        onCtaClick={() => {
          const menuElement = document.getElementById('menu-section')
          menuElement?.scrollIntoView({ behavior: 'smooth' })
        }}
        poster={mediaConfig.announcement.poster}
      />

      {/* Menu Section */}
      <section id="menu-section" className="w-full py-8 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">
            Our Menu
          </h2>
          <MenuDisplay
            onAddToCart={(item) => handleAddToCart(item)}
            cartItems={cart}
            showCategories={true}
          />
        </div>
      </section>

      {/* Sticky Cart Footer */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex-1">
              <button
                onClick={() => setCartOpen(!cartOpen)}
                className="flex items-center gap-3 text-gray-900 hover:text-gray-700"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                <div className="text-left">
                  <p className="text-sm text-gray-600">Cart</p>
                  <p className="font-semibold">
                    {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </button>
            </div>

            <div className="text-right mr-4">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">€{total.toFixed(2)}</p>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Checkout
            </button>
          </div>

          {/* Cart Dropdown */}
          {cartOpen && (
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 max-h-80 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-center text-gray-600">Cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.menuItem.name}</p>
                        <p className="text-sm text-gray-600">€{item.unitPrice.toFixed(2)} each</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="p-1 hover:bg-red-100 text-red-600 rounded ml-2"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Checkout Modal (Placeholder) */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Order Summary</h3>
              <button onClick={() => setShowCheckout(false)} className="text-gray-600 hover:text-gray-900">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Order Summary */}
            <div className="space-y-3 mb-6 border-b border-gray-200 pb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-700">
                  <span>
                    {item.menuItem.name} x {item.quantity}
                  </span>
                  <span className="font-semibold">€{item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (19%)</span>
                <span>€{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Service (10%)</span>
                <span>€{serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                Confirm Order
              </button>
              <button
                onClick={() => setShowCheckout(false)}
                className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition"
              >
                Continue Shopping
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-4">
              Table: <span className="font-semibold">{tableId}</span>
            </p>
          </div>
        </div>
      )}
    </main>
  )
}
