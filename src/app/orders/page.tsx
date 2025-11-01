'use client'

import { useState } from 'react'
import { OrderItem, MenuItem, Guest } from '@/types'

interface OrderWithDetails extends OrderItem {
  guest: Guest;
}

export default function Orders() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ordered' | 'preparing' | 'ready' | 'served'>('all')
  
  // Mock data
  const orders: OrderWithDetails[] = [
    {
      id: '1',
      menuItemId: 'item1',
      menuItem: {
        id: 'item1',
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon with herbs',
        price: 24.99,
        category: 'Main Course',
        restaurantId: 'rest1',
        isAvailable: true,
        prepTime: 15,
        allergens: ['fish'],
      },
      quantity: 1,
      price: 24.99,
      totalPrice: 24.99,
      guestId: 'g1',
      sessionId: 'session1',
      status: 'preparing',
      orderedAt: new Date(Date.now() - 600000), // 10 minutes ago
      guest: {
        id: 'g1',
        name: 'Alice',
        sessionId: 'session1',
        status: 'active',
        joinedAt: new Date(),
      },
    },
    // Add more mock orders...
  ]

  const filteredOrders = selectedFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedFilter)

  const getStatusColor = (status: OrderItem['status']) => {
    switch (status) {
      case 'ordered': return 'bg-blue-100 text-blue-800'
      case 'preparing': return 'bg-yellow-100 text-yellow-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'served': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const updateOrderStatus = (orderId: string, newStatus: OrderItem['status']) => {
    // In real app, this would call an API
    console.log(`Updating order ${orderId} to ${newStatus}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">Track and manage all orders in real-time</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'ordered', 'preparing', 'ready', 'served'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === filter
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              <span className="ml-2 text-xs">
                ({filter === 'all' ? orders.length : orders.filter(o => o.status === filter).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{order.menuItem.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.floor((Date.now() - order.orderedAt.getTime()) / 60000)}m ago
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Guest</p>
                    <p className="font-medium">{order.guest.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Quantity & Price</p>
                    <p className="font-medium">{order.quantity}x ${order.price.toFixed(2)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total</p>
                    <p className="font-medium text-primary-600">${order.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
                
                {order.specialInstructions && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm text-yellow-800">
                      <strong>Special Instructions:</strong> {order.specialInstructions}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="ml-4 flex flex-col gap-2">
                {order.status === 'ordered' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                  >
                    Start Preparing
                  </button>
                )}
                
                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  >
                    Mark Ready
                  </button>
                )}
                
                {order.status === 'ready' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'served')}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Mark Served
                  </button>
                )}
                
                <button
                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">
            {selectedFilter === 'all' 
              ? 'No orders have been placed yet.' 
              : `No orders with status "${selectedFilter}".`
            }
          </p>
        </div>
      )}
    </div>
  )
}