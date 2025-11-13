'use client'

import { useState, useEffect } from 'react'
import { useRealtime } from '@/contexts/RealtimeContext'
import { Play, Pause, RotateCcw, Zap, Users, ChefHat, DollarSign, Clock } from 'lucide-react'

export default function RealtimeDemo() {
  const {
    broadcastOrderUpdate,
    broadcastTableUpdate,
    broadcastKitchenUpdate,
    broadcastPaymentUpdate,
    connectionStatus,
    notifications,
    unreadCount
  } = useRealtime()

  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationCount, setSimulationCount] = useState(0)

  // Demo simulation
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isSimulating) {
      interval = setInterval(() => {
        setSimulationCount(prev => prev + 1)
        
        // Simulate various restaurant activities
        const activities = [
          () => broadcastOrderUpdate(
            `ORD-${Math.floor(Math.random() * 1000)}`,
            ['preparing', 'ready', 'served'][Math.floor(Math.random() * 3)],
            Math.floor(Math.random() * 20) + 1
          ),
          () => broadcastTableUpdate(
            Math.floor(Math.random() * 20) + 1,
            ['occupied', 'available', 'needs_cleaning'][Math.floor(Math.random() * 3)],
            { guests: Math.floor(Math.random() * 6) + 1 }
          ),
          () => broadcastKitchenUpdate(
            `ORD-${Math.floor(Math.random() * 1000)}`,
            ['started', 'in_progress', 'plating', 'ready'][Math.floor(Math.random() * 4)],
            Math.floor(Math.random() * 30) + 5
          ),
          () => broadcastPaymentUpdate(
            Math.floor(Math.random() * 20) + 1,
            Math.floor(Math.random() * 200) + 25,
            ['pending', 'processing', 'completed'][Math.floor(Math.random() * 3)]
          )
        ]
        
        // Execute random activity
        const randomActivity = activities[Math.floor(Math.random() * activities.length)]
        randomActivity()
      }, 2000) // Every 2 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isSimulating, broadcastOrderUpdate, broadcastTableUpdate, broadcastKitchenUpdate, broadcastPaymentUpdate])

  const handleManualBroadcast = (type: string) => {
    switch (type) {
      case 'order':
        broadcastOrderUpdate('ORD-123', 'ready', 7)
        break
      case 'table':
        broadcastTableUpdate(5, 'needs_attention', { issue: 'drink refill' })
        break
      case 'kitchen':
        broadcastKitchenUpdate('ORD-456', 'delayed', 25)
        break
      case 'payment':
        broadcastPaymentUpdate(3, 85.50, 'completed')
        break
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Zap className="w-8 h-8 text-blue-500" />
                Real-time Communication Demo
              </h1>
              <p className="text-gray-600 mt-2">
                Experience live updates, notifications, and real-time synchronization across all user roles
              </p>
            </div>
            
            {/* Connection Status */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              connectionStatus.connected 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus.connected ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="font-medium">
                {connectionStatus.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Demo Controls</h2>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isSimulating
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
            </button>
            
            <button
              onClick={() => setSimulationCount(0)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Counter
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{simulationCount}</div>
              <div className="text-sm text-gray-600">Updates Sent</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{notifications.length}</div>
              <div className="text-sm text-gray-600">Total Notifications</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
              <div className="text-sm text-gray-600">Unread Notifications</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {connectionStatus.connected ? 'Online' : 'Offline'}
              </div>
              <div className="text-sm text-gray-600">Connection Status</div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">Manual Broadcast Tests</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => handleManualBroadcast('order')}
                className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <ChefHat className="w-4 h-4" />
                Order Update
              </button>
              <button
                onClick={() => handleManualBroadcast('table')}
                className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <Users className="w-4 h-4" />
                Table Update
              </button>
              <button
                onClick={() => handleManualBroadcast('kitchen')}
                className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors"
              >
                <Clock className="w-4 h-4" />
                Kitchen Update
              </button>
              <button
                onClick={() => handleManualBroadcast('payment')}
                className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
              >
                <DollarSign className="w-4 h-4" />
                Payment Update
              </button>
            </div>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Real-time Features */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              Real-time Features
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Live order status updates
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Kitchen queue synchronization
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Table management updates
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Payment status tracking
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Staff notifications
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Customer order tracking
              </li>
            </ul>
          </div>

          {/* User Roles */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Multi-Role Support</h3>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900">Manager Dashboard</div>
                <div className="text-sm text-blue-700">Real-time analytics, alerts, and oversight</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-green-900">Waiter Interface</div>
                <div className="text-sm text-green-700">Order management and customer service</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="font-medium text-orange-900">Kitchen Display</div>
                <div className="text-sm text-orange-700">Order queue and preparation tracking</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="font-medium text-purple-900">Customer View</div>
                <div className="text-sm text-purple-700">Order status and bill management</div>
              </div>
            </div>
          </div>

          {/* Technical Implementation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Stack</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                WebSocket connection simulation
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                React Context for state management
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Real-time notification system
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Connection status monitoring
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Automatic reconnection handling
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Live data synchronization
              </li>
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Experience the Demo</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Check the notification bell in the top navigation - it shows real-time notifications</li>
            <li>Click &quot;Start Simulation&quot; to begin automatic real-time updates every 2 seconds</li>
            <li>Use the manual broadcast buttons to trigger specific types of updates</li>
            <li>Visit different pages (Manager, Waiter, Kitchen, Customer) to see role-specific real-time data</li>
            <li>Notice how the connection status indicator shows live connectivity</li>
            <li>Observe how notifications appear instantly across all interfaces</li>
          </ol>
        </div>
      </div>
    </div>
  )
}