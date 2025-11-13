'use client'

import { useState, useEffect } from 'react'
import { useOrders, OrderStatus, OrderPriority, KitchenOrder } from '@/contexts/OrderContext'
import { useRealtime } from '@/contexts/RealtimeContext'
import { 
  ClockIcon,
  FireIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  PlayIcon,
  PauseIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'
import RealtimeStats from '@/components/realtime/RealtimeStats'
import LiveUpdatesDisplay from '@/components/realtime/LiveUpdatesDisplay'

interface KitchenDashboardProps {
  className?: string
}

export default function KitchenDashboard({ className = '' }: KitchenDashboardProps) {
  const { 
    getKitchenOrders, 
    updateKitchenOrderStatus, 
    updateOrderPriority 
  } = useOrders()
  
  const [orders, setOrders] = useState<KitchenOrder[]>([])
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'preparing'>('all')
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const loadOrders = () => {
      setOrders(getKitchenOrders())
    }
    
    loadOrders()
    const interval = setInterval(loadOrders, 5000) // Refresh every 5 seconds
    
    return () => clearInterval(interval)
  }, [getKitchenOrders])

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timeInterval)
  }, [])

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    await updateKitchenOrderStatus(orderId, newStatus)
    setOrders(getKitchenOrders())
  }

  const handlePriorityUpdate = async (orderId: string, newPriority: OrderPriority) => {
    await updateOrderPriority(orderId, newPriority)
    setOrders(getKitchenOrders())
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'ready': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: OrderPriority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'normal': return 'text-blue-600 bg-blue-50'
      case 'low': return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityIcon = (priority: OrderPriority) => {
    switch (priority) {
      case 'urgent': return <FireIcon className="w-4 h-4" />
      case 'high': return <ExclamationTriangleIcon className="w-4 h-4" />
      case 'normal': return <ClockIcon className="w-4 h-4" />
      case 'low': return <ArrowDownIcon className="w-4 h-4" />
    }
  }

  const formatTimeElapsed = (createdAt: Date) => {
    const elapsed = Math.floor((currentTime.getTime() - createdAt.getTime()) / 1000 / 60)
    if (elapsed < 60) {
      return `${elapsed}m`
    }
    const hours = Math.floor(elapsed / 60)
    const minutes = elapsed % 60
    return `${hours}h ${minutes}m`
  }

  const formatEstimatedTime = (estimatedTime?: Date) => {
    if (!estimatedTime) return 'TBD'
    const remaining = Math.floor((estimatedTime.getTime() - currentTime.getTime()) / 1000 / 60)
    if (remaining <= 0) return 'Overdue'
    if (remaining < 60) return `${remaining}m`
    const hours = Math.floor(remaining / 60)
    const minutes = remaining % 60
    return `${hours}h ${minutes}m`
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case 'confirmed': return 'preparing'
      case 'preparing': return 'ready'
      default: return null
    }
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-neutral-200 ${className}`}>
      {/* Header */}
      <div className="border-b border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Kitchen Dashboard</h2>
            <p className="text-sm text-neutral-600">
              {filteredOrders.length} orders • Updated {currentTime.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">Live</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'All Orders', count: orders.length },
            { key: 'confirmed', label: 'New', count: orders.filter(o => o.status === 'confirmed').length },
            { key: 'preparing', label: 'In Progress', count: orders.filter(o => o.status === 'preparing').length }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-brand-500 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="px-6 pb-4">
        <RealtimeStats role="kitchen" />
      </div>

      {/* Live Updates */}
      <div className="px-6 pb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <LiveUpdatesDisplay 
            types={['order_status', 'kitchen_update']} 
            maxUpdates={6} 
          />
        </div>
      </div>

      {/* Orders Grid */}
      <div className="p-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircleIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No Orders</h3>
            <p className="text-neutral-600">
              {filter === 'all' ? 'No orders in the kitchen queue' : `No ${filter} orders`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-neutral-900">
                      Table {order.tableNumber}
                    </span>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                      {getPriorityIcon(order.priority)}
                      <span className="ml-1 capitalize">{order.priority}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-600">Order Time</p>
                    <p className="font-medium text-neutral-900">
                      {formatTimeElapsed(order.createdAt)} ago
                    </p>
                  </div>
                </div>

                {/* Customer Info */}
                {order.customerName && (
                  <div className="mb-3 p-2 bg-neutral-50 rounded-lg">
                    <p className="text-sm text-neutral-600">Customer: {order.customerName}</p>
                  </div>
                )}

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="font-medium text-neutral-900 mb-2">Items ({order.items.length})</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900">
                            {item.quantity}x {item.menuItem.name}
                          </p>
                          {item.specialInstructions && (
                            <p className="text-sm text-orange-600 font-medium">
                              ⚠️ {item.specialInstructions}
                            </p>
                          )}
                          {item.modifications && item.modifications.length > 0 && (
                            <p className="text-sm text-neutral-600">
                              Mods: {item.modifications.join(', ')}
                            </p>
                          )}
                        </div>
                        <span className="text-sm text-neutral-500 ml-2">
                          {item.menuItem.preparationTime}min
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status and Timing */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {order.status === 'confirmed' && <PlayIcon className="w-4 h-4 mr-1" />}
                      {order.status === 'preparing' && <ClockIcon className="w-4 h-4 mr-1" />}
                      {order.status === 'ready' && <CheckCircleIcon className="w-4 h-4 mr-1" />}
                      <span className="capitalize">{order.status}</span>
                    </span>
                    {order.estimatedReadyTime && (
                      <span className="text-sm text-neutral-600">
                        ETA: {formatEstimatedTime(order.estimatedReadyTime)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {getNextStatus(order.status) && (
                    <button
                      onClick={() => handleStatusUpdate(order.orderId, getNextStatus(order.status)!)}
                      className="flex-1 px-3 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
                    >
                      {order.status === 'confirmed' && 'Start Cooking'}
                      {order.status === 'preparing' && 'Mark Ready'}
                    </button>
                  )}
                  
                  {/* Priority Actions */}
                  <div className="flex space-x-1">
                    {order.priority !== 'urgent' && (
                      <button
                        onClick={() => handlePriorityUpdate(order.orderId, 'urgent')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Mark as Urgent"
                      >
                        <ArrowUpIcon className="w-4 h-4" />
                      </button>
                    )}
                    {order.priority === 'urgent' && (
                      <button
                        onClick={() => handlePriorityUpdate(order.orderId, 'normal')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Mark as Normal"
                      >
                        <ArrowDownIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Kitchen Notes */}
                {order.kitchenNotes && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Kitchen Notes:</strong> {order.kitchenNotes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}