'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import MenuDisplay from '@/components/menu/MenuDisplay'
import OrderCart from '@/components/orders/OrderCart'
import { useOrders, OrderItem, Order } from '@/contexts/OrderContext'
import { useAuth } from '@/contexts/AuthContext'
import { 
  PlusIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

function OrderTakingPage() {
  const { createOrder, calculateOrderTotal } = useOrders()
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<OrderItem[]>([])
  const [tableNumber, setTableNumber] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null)

  const handleAddToCart = (item: OrderItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.menuItem.id === item.menuItem.id)
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.menuItem.id === item.menuItem.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity, totalPrice: cartItem.unitPrice * (cartItem.quantity + item.quantity) }
            : cartItem
        )
      }
      return [...prev, item]
    })
  }

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
          : item
      )
    )
  }

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  const handleAddSpecialInstructions = (itemId: string, instructions: string) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, specialInstructions: instructions }
          : item
      )
    )
  }

  const handleClearCart = () => {
    setCartItems([])
  }

  const handlePlaceOrder = async () => {
    if (!tableNumber || cartItems.length === 0) return

    setIsPlacingOrder(true)
    
    try {
      const totals = calculateOrderTotal(cartItems)
      const estimatedReadyTime = new Date(Date.now() + Math.max(...cartItems.map(item => item.menuItem.preparationTime)) * 60 * 1000)
      
      const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
        tableNumber,
        customerId: undefined,
        waiterId: user?.id,
        items: cartItems,
        status: 'pending',
        priority: 'normal',
        totalAmount: totals.subtotal,
        tax: totals.tax,
        serviceCharge: totals.serviceCharge,
        finalAmount: totals.total,
        estimatedReadyTime,
        customerName: customerName || undefined,
        phoneNumber: phoneNumber || undefined,
        specialRequests: specialRequests ? [specialRequests] : undefined
      }

      const orderId = await createOrder(orderData)
      
      // Clear form
      setCartItems([])
      setTableNumber('')
      setCustomerName('')
      setPhoneNumber('')
      setSpecialRequests('')
      setOrderPlaced(orderId)
      
      // Reset success message after 5 seconds
      setTimeout(() => setOrderPlaced(null), 5000)
      
    } catch (error) {
      console.error('Failed to place order:', error)
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-neutral-900">Take Order</h1>
              <span className="px-3 py-1 bg-brand-100 text-brand-800 rounded-full text-sm font-medium">
                Waiter Interface
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              <UserIcon className="w-4 h-4" />
              <span>{user?.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {orderPlaced && (
          <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-success-600" />
              <p className="text-success-800 font-medium">
                Order placed successfully! Order ID: {orderPlaced.substring(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="xl:col-span-2">
            <MenuDisplay 
              onAddToCart={handleAddToCart}
              cartItems={cartItems}
              showCategories={true}
            />
          </div>

          {/* Order Cart and Customer Info */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Order Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Table Number *
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="Enter table number"
                      className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Customer Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name (optional)"
                      className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number (optional)"
                      className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any special dietary requirements or requests..."
                    rows={3}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Order Cart */}
            <OrderCart
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onAddSpecialInstructions={handleAddSpecialInstructions}
              onClearCart={handleClearCart}
              onPlaceOrder={handlePlaceOrder}
              showPlaceOrder={true}
            />

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || !tableNumber || cartItems.length === 0}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-neutral-300 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              {isPlacingOrder ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <PlusIcon className="w-5 h-5" />
                  <span>Place Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProtectedOrderTakingPage() {
  return (
    <ProtectedRoute requiredRole={['manager', 'waiter']} requiredPermissions={['take_orders']}>
      <OrderTakingPage />
    </ProtectedRoute>
  )
}