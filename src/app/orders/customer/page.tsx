'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import MenuDisplay from '@/components/menu/MenuDisplay'
import OrderCart from '@/components/orders/OrderCart'
import OrderStatusTracker from '@/components/orders/OrderStatusTracker'
import { useOrders, OrderItem, Order } from '@/contexts/OrderContext'
import { useAuth } from '@/contexts/AuthContext'
import { 
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

function CustomerOrderPage() {
  const { createOrder, calculateOrderTotal, getOrdersByTable } = useOrders()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'menu' | 'cart' | 'orders'>('menu')
  const [cartItems, setCartItems] = useState<OrderItem[]>([])
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [customerOrders, setCustomerOrders] = useState<Order[]>([])

  useEffect(() => {
    if (user?.tableNumber) {
      const orders = getOrdersByTable(user.tableNumber)
      setCustomerOrders(orders)
    }
  }, [user?.tableNumber, getOrdersByTable])

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
    if (!user?.tableNumber || cartItems.length === 0) return

    setIsPlacingOrder(true)
    
    try {
      const totals = calculateOrderTotal(cartItems)
      const estimatedReadyTime = new Date(Date.now() + Math.max(...cartItems.map(item => item.menuItem.preparationTime)) * 60 * 1000)
      
      const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
        tableNumber: user.tableNumber,
        customerId: user.id,
        items: cartItems,
        status: 'pending',
        priority: 'normal',
        totalAmount: totals.subtotal,
        tax: totals.tax,
        serviceCharge: totals.serviceCharge,
        finalAmount: totals.total,
        estimatedReadyTime,
        customerName: user.name
      }

      const orderId = await createOrder(orderData)
      
      // Clear cart and switch to orders tab
      setCartItems([])
      setActiveTab('orders')
      
      // Refresh orders
      const orders = getOrdersByTable(user.tableNumber)
      setCustomerOrders(orders)
      
    } catch (error) {
      console.error('Failed to place order:', error)
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const totalItemsInCart = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const tabs = [
    { 
      id: 'menu', 
      name: 'Menu', 
      icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
      badge: null
    },
    { 
      id: 'cart', 
      name: 'Cart', 
      icon: <ShoppingCartIcon className="w-5 h-5" />,
      badge: totalItemsInCart > 0 ? totalItemsInCart : null
    },
    { 
      id: 'orders', 
      name: 'My Orders', 
      icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
      badge: customerOrders.filter(o => o.status !== 'served' && o.status !== 'cancelled').length || null
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-neutral-900">
                Table {user?.tableNumber}
              </h1>
              <span className="px-3 py-1 bg-brand-100 text-brand-800 rounded-full text-sm font-medium">
                {user?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
                {tab.badge && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-brand-500 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900">Our Menu</h2>
              {totalItemsInCart > 0 && (
                <button
                  onClick={() => setActiveTab('cart')}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  <span>View Cart ({totalItemsInCart})</span>
                </button>
              )}
            </div>
            <MenuDisplay 
              onAddToCart={handleAddToCart}
              cartItems={cartItems}
              showCategories={true}
            />
          </div>
        )}

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900">Your Order</h2>
              <button
                onClick={() => setActiveTab('menu')}
                className="flex items-center space-x-2 px-4 py-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back to Menu</span>
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCartIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-600 mb-2">Your cart is empty</h3>
                <p className="text-neutral-500 mb-6">Add some delicious items from our menu</p>
                <button
                  onClick={() => setActiveTab('menu')}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Browse Menu</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <OrderCart
                    items={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onAddSpecialInstructions={handleAddSpecialInstructions}
                    onClearCart={handleClearCart}
                    onPlaceOrder={handlePlaceOrder}
                    showPlaceOrder={false}
                  />
                </div>
                <div>
                  <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 sticky top-8">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Order Summary</h3>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Items</span>
                        <span className="text-neutral-900">{totalItemsInCart}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Subtotal</span>
                        <span className="text-neutral-900">
                          €{cartItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder || cartItems.length === 0}
                      className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-neutral-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
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
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-neutral-900">My Orders</h2>
            
            {customerOrders.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardDocumentListIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-600 mb-2">No orders yet</h3>
                <p className="text-neutral-500 mb-6">Start by adding items to your cart</p>
                <button
                  onClick={() => setActiveTab('menu')}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Browse Menu</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {customerOrders.map((order) => (
                  <OrderStatusTracker
                    key={order.id}
                    orderId={order.id}
                    showCustomerView={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProtectedCustomerOrderPage() {
  return (
    <ProtectedRoute requiredRole="customer">
      <CustomerOrderPage />
    </ProtectedRoute>
  )
}