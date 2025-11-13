'use client'

import React, { useEffect, useState } from 'react'
import { useRealtime } from '@/contexts/RealtimeContext'
import { useOrders } from '@/contexts/OrderContext'
import { usePayments } from '@/contexts/PaymentContext'
import { Activity, TrendingUp, Clock, Users, DollarSign, ChefHat } from 'lucide-react'

interface RealtimeStatsProps {
  className?: string
  role?: 'manager' | 'waiter' | 'kitchen' | 'customer'
}

const RealtimeStats: React.FC<RealtimeStatsProps> = ({ 
  className = '',
  role = 'manager'
}) => {
  const { subscribeToUpdates, connectionStatus } = useRealtime()
  const { orders } = useOrders()
  const { bills } = usePayments()
  
  const [stats, setStats] = useState({
    activeOrders: 0,
    pendingPayments: 0,
    totalRevenue: 0,
    averageOrderTime: 0,
    busyTables: 0,
    kitchenQueue: 0
  })

  const [recentActivity, setRecentActivity] = useState<string[]>([])

  // Calculate stats from contexts
  useEffect(() => {
    const activeOrders = orders.filter((order: any) => 
      ['pending', 'preparing', 'ready'].includes(order.status)
    ).length

    const pendingPayments = bills.filter((bill: any) => 
      bill.status === 'pending'
    ).length

    const totalRevenue = bills
      .filter((bill: any) => bill.status === 'paid')
      .reduce((sum: number, bill: any) => sum + bill.total, 0)

    const busyTables = new Set(
      orders.filter((order: any) => order.status !== 'served')
        .map((order: any) => order.tableNumber)
    ).size

    const kitchenQueue = orders.filter((order: any) => 
      ['pending', 'preparing'].includes(order.status)
    ).length

    setStats({
      activeOrders,
      pendingPayments,
      totalRevenue,
      averageOrderTime: 15, // Mock data
      busyTables,
      kitchenQueue
    })
  }, [orders, bills])

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToUpdates((update) => {
      // Add activity to recent activity log
      const activity = `${update.type}: ${JSON.stringify(update.data).substring(0, 50)}...`
      setRecentActivity(prev => [activity, ...prev.slice(0, 4)])
    })

    return unsubscribe
  }, [subscribeToUpdates])

  const getStatsForRole = () => {
    switch (role) {
      case 'manager':
        return [
          {
            label: 'Active Orders',
            value: stats.activeOrders,
            icon: <ChefHat className="w-5 h-5 text-blue-500" />,
            trend: '+2 from last hour'
          },
          {
            label: 'Revenue Today',
            value: `$${stats.totalRevenue.toFixed(2)}`,
            icon: <DollarSign className="w-5 h-5 text-green-500" />,
            trend: '+15% from yesterday'
          },
          {
            label: 'Busy Tables',
            value: stats.busyTables,
            icon: <Users className="w-5 h-5 text-purple-500" />,
            trend: '8 total tables'
          },
          {
            label: 'Avg Order Time',
            value: `${stats.averageOrderTime}m`,
            icon: <Clock className="w-5 h-5 text-orange-500" />,
            trend: '-2m from average'
          }
        ]
      
      case 'waiter':
        return [
          {
            label: 'My Active Orders',
            value: stats.activeOrders,
            icon: <ChefHat className="w-5 h-5 text-blue-500" />,
            trend: 'Last order: 5m ago'
          },
          {
            label: 'Ready to Serve',
            value: orders.filter((o: any) => o.status === 'ready').length,
            icon: <Activity className="w-5 h-5 text-green-500" />,
            trend: 'Needs attention'
          },
          {
            label: 'Pending Payments',
            value: stats.pendingPayments,
            icon: <DollarSign className="w-5 h-5 text-yellow-500" />,
            trend: 'Follow up needed'
          }
        ]
      
      case 'kitchen':
        return [
          {
            label: 'Kitchen Queue',
            value: stats.kitchenQueue,
            icon: <ChefHat className="w-5 h-5 text-orange-500" />,
            trend: 'Next up: Table 3'
          },
          {
            label: 'Avg Prep Time',
            value: `${stats.averageOrderTime}m`,
            icon: <Clock className="w-5 h-5 text-blue-500" />,
            trend: 'On target'
          },
          {
            label: 'Orders Ready',
            value: orders.filter((o: any) => o.status === 'ready').length,
            icon: <Activity className="w-5 h-5 text-green-500" />,
            trend: 'Awaiting pickup'
          }
        ]
      
      case 'customer':
        return [
          {
            label: 'Order Status',
            value: 'Preparing',
            icon: <ChefHat className="w-5 h-5 text-blue-500" />,
            trend: 'Est. 10 minutes'
          },
          {
            label: 'Current Bill',
            value: '$45.50',
            icon: <DollarSign className="w-5 h-5 text-green-500" />,
            trend: '3 items'
          }
        ]
      
      default:
        return []
    }
  }

  const roleStats = getStatsForRole()

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Live Stats
          </h3>
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus.connected ? 'bg-green-500' : 'bg-red-500'
          }`} />
        </div>
      </div>

      <div className="p-4">
        {/* Stats Grid */}
        <div className={`grid gap-4 mb-6 ${
          roleStats.length <= 2 ? 'grid-cols-2' : 
          roleStats.length === 3 ? 'grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'
        }`}>
          {roleStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-2">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-gray-500">
                {stat.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        {role === 'manager' && recentActivity.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Recent Activity
            </h4>
            <div className="space-y-2">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index}
                  className={`text-xs p-2 rounded ${
                    index === 0 ? 'bg-blue-50 text-blue-800' : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  {activity}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connection Status */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Real-time updates</span>
            <span className={connectionStatus.connected ? 'text-green-600' : 'text-red-600'}>
              {connectionStatus.connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RealtimeStats