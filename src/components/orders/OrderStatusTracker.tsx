'use client'

import { useState, useEffect } from 'react'
import { useOrders, Order, OrderStatus } from '@/contexts/OrderContext'
import { 
  ClockIcon,
  CheckCircleIcon,
  CakeIcon,
  TruckIcon,
  XCircleIcon,
  InformationCircleIcon,
  PhoneIcon,
  MapPinIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid'

interface OrderStatusTrackerProps {
  orderId: string
  showCustomerView?: boolean
  className?: string
}

export default function OrderStatusTracker({ 
  orderId, 
  showCustomerView = false,
  className = '' 
}: OrderStatusTrackerProps) {
  const { orders, updateOrderStatus } = useOrders()
  const [order, setOrder] = useState<Order | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const foundOrder = orders.find(o => o.id === orderId)
    setOrder(foundOrder || null)
  }, [orders, orderId])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  if (!order) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-neutral-200 p-6 ${className}`}>
        <div className="text-center">
          <InformationCircleIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Order Not Found</h3>
          <p className="text-neutral-600">Order ID: {orderId}</p>
        </div>
      </div>
    )
  }

  const statusSteps: Array<{
    status: OrderStatus
    label: string
    description: string
    icon: React.ReactNode
    completedIcon: React.ReactNode
  }> = [
    {
      status: 'pending',
      label: 'Order Placed',
      description: 'Your order has been received',
      icon: <ClockIcon className="w-6 h-6" />,
      completedIcon: <CheckCircleSolidIcon className="w-6 h-6 text-success-600" />
    },
    {
      status: 'confirmed',
      label: 'Order Confirmed',
      description: 'Kitchen has received your order',
      icon: <CheckCircleIcon className="w-6 h-6" />,
      completedIcon: <CheckCircleSolidIcon className="w-6 h-6 text-success-600" />
    },
    {
      status: 'preparing',
      label: 'Preparing',
      description: 'Your food is being prepared',
      icon: <CakeIcon className="w-6 h-6" />,
      completedIcon: <CheckCircleSolidIcon className="w-6 h-6 text-success-600" />
    },
    {
      status: 'ready',
      label: 'Ready',
      description: 'Your order is ready for pickup/serving',
      icon: <TruckIcon className="w-6 h-6" />,
      completedIcon: <CheckCircleSolidIcon className="w-6 h-6 text-success-600" />
    },
    {
      status: 'served',
      label: 'Served',
      description: 'Order has been delivered to your table',
      icon: <CheckCircleIcon className="w-6 h-6" />,
      completedIcon: <CheckCircleSolidIcon className="w-6 h-6 text-success-600" />
    }
  ]

  const getCurrentStepIndex = () => {
    const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'served']
    return statusOrder.indexOf(order.status)
  }

  const currentStepIndex = getCurrentStepIndex()
  const isCancelled = order.status === 'cancelled'

  const formatTimeElapsed = (date: Date) => {
    const elapsed = Math.floor((currentTime.getTime() - date.getTime()) / 1000 / 60)
    if (elapsed < 1) return 'Just now'
    if (elapsed < 60) return `${elapsed}m ago`
    const hours = Math.floor(elapsed / 60)
    const minutes = elapsed % 60
    return `${hours}h ${minutes}m ago`
  }

  const formatEstimatedTime = (date?: Date) => {
    if (!date) return 'Calculating...'
    const remaining = Math.floor((date.getTime() - currentTime.getTime()) / 1000 / 60)
    if (remaining <= 0) return 'Any moment now'
    if (remaining < 60) return `${remaining} minutes`
    const hours = Math.floor(remaining / 60)
    const minutes = remaining % 60
    return `${hours}h ${minutes}m`
  }

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus)
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-neutral-200 ${className}`}>
      {/* Header */}
      <div className="border-b border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              Order #{order.id.substring(0, 8).toUpperCase()}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-neutral-600">
              <div className="flex items-center space-x-1">
                <MapPinIcon className="w-4 h-4" />
                <span>Table {order.tableNumber}</span>
              </div>
              <span>•</span>
              <span>Ordered {formatTimeElapsed(order.createdAt)}</span>
            </div>
          </div>
          
          {!showCustomerView && order.phoneNumber && (
            <button className="flex items-center space-x-2 px-3 py-2 text-sm text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors">
              <PhoneIcon className="w-4 h-4" />
              <span>{order.phoneNumber}</span>
            </button>
          )}
        </div>

        {/* Customer Info */}
        {order.customerName && (
          <div className="flex items-center space-x-2 text-sm text-neutral-600">
            <span>Customer: {order.customerName}</span>
          </div>
        )}
      </div>

      {/* Status Timeline */}
      <div className="p-6">
        {isCancelled ? (
          <div className="text-center py-8">
            <XCircleIcon className="w-16 h-16 text-error-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-error-900 mb-2">Order Cancelled</h3>
            <p className="text-error-600">This order has been cancelled</p>
            {order.notes && (
              <div className="mt-4 p-3 bg-error-50 rounded-lg">
                <p className="text-sm text-error-800">{order.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="relative">
              <div className="flex items-center justify-between">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex
                  const isCurrent = index === currentStepIndex
                  
                  return (
                    <div key={step.status} className="flex flex-col items-center relative">
                      {/* Step Circle */}
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                          isCompleted
                            ? 'bg-success-50 border-success-600'
                            : isCurrent
                            ? 'bg-brand-50 border-brand-600'
                            : 'bg-neutral-50 border-neutral-300'
                        }`}
                      >
                        {isCompleted ? (
                          step.completedIcon
                        ) : (
                          <div className={isCurrent ? 'text-brand-600' : 'text-neutral-400'}>
                            {step.icon}
                          </div>
                        )}
                      </div>
                      
                      {/* Step Label */}
                      <div className="mt-2 text-center">
                        <p className={`text-sm font-medium ${
                          isCompleted || isCurrent ? 'text-neutral-900' : 'text-neutral-500'
                        }`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-neutral-500 max-w-20">
                          {step.description}
                        </p>
                      </div>
                      
                      {/* Connecting Line */}
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`absolute top-6 left-12 h-0.5 w-full transition-colors ${
                            index < currentStepIndex ? 'bg-success-600' : 'bg-neutral-300'
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Current Status Details */}
            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-neutral-900">
                  Current Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </h4>
                {order.priority === 'urgent' && (
                  <div className="flex items-center space-x-1 text-error-600">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Urgent</span>
                  </div>
                )}
              </div>
              
              {order.estimatedReadyTime && (
                <p className="text-sm text-neutral-600">
                  Estimated ready time: {formatEstimatedTime(order.estimatedReadyTime)}
                </p>
              )}
              
              {order.status === 'ready' && order.actualReadyTime && (
                <p className="text-sm text-success-600 font-medium">
                  ✅ Ready since {formatTimeElapsed(order.actualReadyTime)}
                </p>
              )}
            </div>

            {/* Order Items Summary */}
            <div className="border-t border-neutral-200 pt-4">
              <h4 className="font-medium text-neutral-900 mb-3">Order Items ({order.items.length})</h4>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900">
                        {item.quantity}x {item.menuItem.name}
                      </p>
                      {item.specialInstructions && (
                        <p className="text-sm text-orange-600">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-neutral-600">
                      €{item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-neutral-900">Total</span>
                  <span className="font-bold text-lg text-brand-600">
                    €{order.finalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons for Staff */}
            {!showCustomerView && (
              <div className="flex space-x-2 pt-4 border-t border-neutral-200">
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate('confirmed')}
                    className="flex-1 bg-brand-500 text-white py-2 px-4 rounded-lg hover:bg-brand-600 transition-colors"
                  >
                    Confirm Order
                  </button>
                )}
                {order.status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusUpdate('preparing')}
                    className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => handleStatusUpdate('ready')}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Mark Ready
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    onClick={() => handleStatusUpdate('served')}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Mark Served
                  </button>
                )}
                
                {order.status !== 'served' && order.status !== 'cancelled' && (
                  <button
                    onClick={() => handleStatusUpdate('cancelled')}
                    className="px-4 py-2 border border-error-300 text-error-600 rounded-lg hover:bg-error-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}