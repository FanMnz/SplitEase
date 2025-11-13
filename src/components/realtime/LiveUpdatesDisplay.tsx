'use client'

import React, { useEffect, useState } from 'react'
import { useRealtime, LiveUpdate } from '@/contexts/RealtimeContext'
import { Clock, ChefHat, DollarSign, Users, Zap } from 'lucide-react'

interface LiveUpdatesDisplayProps {
  className?: string
  types?: ('order_status' | 'table_status' | 'payment_status' | 'kitchen_update' | 'staff_update')[]
  maxUpdates?: number
}

const LiveUpdatesDisplay: React.FC<LiveUpdatesDisplayProps> = ({
  className = '',
  types,
  maxUpdates = 10
}) => {
  const { subscribeToUpdates } = useRealtime()
  const [updates, setUpdates] = useState<LiveUpdate[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToUpdates((update) => {
      // Filter by types if specified
      if (types && !types.includes(update.type)) {
        return
      }

      setUpdates(prev => [update, ...prev.slice(0, maxUpdates - 1)])
    })

    return unsubscribe
  }, [subscribeToUpdates, types, maxUpdates])

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'order_status':
        return <ChefHat className="w-4 h-4 text-blue-500" />
      case 'table_status':
        return <Users className="w-4 h-4 text-purple-500" />
      case 'payment_status':
        return <DollarSign className="w-4 h-4 text-green-500" />
      case 'kitchen_update':
        return <ChefHat className="w-4 h-4 text-orange-500" />
      case 'staff_update':
        return <Users className="w-4 h-4 text-gray-500" />
      default:
        return <Zap className="w-4 h-4 text-gray-500" />
    }
  }

  const getUpdateTitle = (update: LiveUpdate) => {
    switch (update.type) {
      case 'order_status':
        return `Order ${update.data.orderId} - ${update.data.status}`
      case 'table_status':
        return `Table ${update.data.tableNumber} - ${update.data.status}`
      case 'payment_status':
        return `Payment: $${update.data.amount?.toFixed(2)} - ${update.data.status}`
      case 'kitchen_update':
        return `Kitchen: Order ${update.data.orderId} - ${update.data.status}`
      case 'staff_update':
        return `Staff Update: ${update.data.message || 'Status changed'}`
      default:
        return 'Live Update'
    }
  }

  const getUpdateDescription = (update: LiveUpdate) => {
    switch (update.type) {
      case 'order_status':
        return `Table ${update.data.tableNumber}`
      case 'table_status':
        return update.data.guests ? `${update.data.guests} guests` : ''
      case 'payment_status':
        return `Table ${update.data.tableNumber}`
      case 'kitchen_update':
        return update.data.estimatedTime ? `Est. ${update.data.estimatedTime} min` : ''
      case 'staff_update':
        return update.data.staff || ''
      default:
        return ''
    }
  }

  const formatUpdateTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)

    if (minutes > 0) return `${minutes}m ago`
    return `${seconds}s ago`
  }

  if (updates.length === 0) {
    return (
      <div className={`p-4 text-center text-gray-500 ${className}`}>
        <Zap className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">Waiting for live updates...</p>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">Live Updates</h3>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {updates.map((update, index) => (
          <div
            key={`${update.type}-${update.timestamp.getTime()}-${index}`}
            className={`
              p-3 rounded-lg border transition-all duration-300
              ${index === 0 ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-200'}
            `}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getUpdateIcon(update.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {getUpdateTitle(update)}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatUpdateTime(update.timestamp)}
                  </div>
                </div>

                {getUpdateDescription(update) && (
                  <p className="text-sm text-gray-600 mt-1">
                    {getUpdateDescription(update)}
                  </p>
                )}

                {/* Additional data display */}
                {update.data && Object.keys(update.data).length > 0 && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                    {JSON.stringify(update.data, null, 1)
                      .replace(/[{}"\n]/g, '')
                      .replace(/,/g, ' • ')
                      .replace(/:/g, ': ')
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {updates.length === maxUpdates && (
        <div className="text-center text-xs text-gray-500 pt-2">
          Showing latest {maxUpdates} updates
        </div>
      )}
    </div>
  )
}

export default LiveUpdatesDisplay