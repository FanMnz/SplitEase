'use client'

import { useState } from 'react'
import { 
  ClockIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  BellIcon,
  PlusIcon,
  ArrowRightIcon,
  MapPinIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'

interface TableCardProps {
  table: {
    id: string
    number: string
    status: 'available' | 'occupied' | 'needsAttention' | 'ordering' | 'paying'
    guests: number
    capacity: number
    lastActivity: string
    priority: 'high' | 'normal' | 'low'
    totalBill?: number
    orders?: number
  }
  onAction: (action: string, tableId: string) => void
}

function TableCard({ table, onAction }: TableCardProps) {
  const statusConfig = {
    available: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, label: 'Available' },
    occupied: { color: 'bg-blue-100 text-blue-800', icon: UserGroupIcon, label: 'Occupied' },
    needsAttention: { color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon, label: 'Needs Help' },
    ordering: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, label: 'Ordering' },
    paying: { color: 'bg-purple-100 text-purple-800', icon: CurrencyDollarIcon, label: 'Payment' }
  }

  const config = statusConfig[table.status]
  const StatusIcon = config.icon

  return (
    <div className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-200 active:scale-98 ${
      table.priority === 'high' ? 'border-red-200 shadow-red-100' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">Table {table.number}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <UserGroupIcon className="w-4 h-4 mr-1" />
          <span>{table.guests}/{table.capacity} guests</span>
          <span className="mx-2">•</span>
          <ClockIcon className="w-4 h-4 mr-1" />
          <span>{table.lastActivity}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {table.status !== 'available' && (
          <div className="flex justify-between items-center mb-4">
            {table.totalBill && (
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">€{table.totalBill}</p>
                <p className="text-xs text-gray-500">Total Bill</p>
              </div>
            )}
            {table.orders && (
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{table.orders}</p>
                <p className="text-xs text-gray-500">Orders</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {table.status === 'available' ? (
            <>
              <button 
                onClick={() => onAction('seat', table.id)}
                className="btn-touch bg-blue-500 text-white"
              >
                <UserGroupIcon className="w-5 h-5 mr-2" />
                Seat Guests
              </button>
              <button 
                onClick={() => onAction('reserve', table.id)}
                className="btn-touch bg-gray-500 text-white"
              >
                <ClockIcon className="w-5 h-5 mr-2" />
                Reserve
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => onAction('takeOrder', table.id)}
                className="btn-touch bg-green-500 text-white"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Order
              </button>
              <button 
                onClick={() => onAction('viewTable', table.id)}
                className="btn-touch bg-blue-500 text-white"
              >
                <ArrowRightIcon className="w-5 h-5 mr-2" />
                View Details
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

interface NotificationProps {
  notification: {
    id: string
    type: 'order' | 'request' | 'alert'
    title: string
    message: string
    tableNumber: string
    timestamp: string
    urgent: boolean
  }
  onDismiss: (id: string) => void
}

function NotificationCard({ notification, onDismiss }: NotificationProps) {
  const typeConfig = {
    order: { color: 'bg-green-50 border-green-200', icon: CheckCircleIcon, iconColor: 'text-green-600' },
    request: { color: 'bg-blue-50 border-blue-200', icon: ChatBubbleLeftIcon, iconColor: 'text-blue-600' },
    alert: { color: 'bg-red-50 border-red-200', icon: ExclamationTriangleIcon, iconColor: 'text-red-600' }
  }

  const config = typeConfig[notification.type]
  const Icon = config.icon

  return (
    <div className={`p-4 rounded-xl border-2 ${config.color} ${notification.urgent ? 'animate-pulse' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <Icon className={`w-5 h-5 mt-0.5 ${config.iconColor}`} />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-gray-900">{notification.title}</h4>
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
                Table {notification.tableNumber}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
            <p className="text-xs text-gray-500">{notification.timestamp}</p>
          </div>
        </div>
        <button 
          onClick={() => onDismiss(notification.id)}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default function WaiterInterface() {
  const [selectedSection, setSelectedSection] = useState('all')
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'request' as const,
      title: 'Customer Request',
      message: 'Guest at table 7 requested extra napkins and water refill',
      tableNumber: '7',
      timestamp: '2 minutes ago',
      urgent: true
    },
    {
      id: '2',
      type: 'order' as const,
      title: 'Order Ready',
      message: 'Kitchen has finished preparing order #847',
      tableNumber: '12',
      timestamp: '5 minutes ago',
      urgent: false
    },
    {
      id: '3',
      type: 'alert' as const,
      title: 'Bill Request',
      message: 'Table 5 has requested their bill - ready for payment',
      tableNumber: '5',
      timestamp: '1 minute ago',
      urgent: true
    }
  ])

  const tables = [
    {
      id: '1',
      number: '1',
      status: 'needsAttention' as const,
      guests: 4,
      capacity: 4,
      lastActivity: '15 min ago',
      priority: 'high' as const,
      totalBill: 87.50,
      orders: 3
    },
    {
      id: '2',
      number: '5',
      status: 'paying' as const,
      guests: 2,
      capacity: 4,
      lastActivity: '5 min ago',
      priority: 'high' as const,
      totalBill: 45.20,
      orders: 2
    },
    {
      id: '3',
      number: '7',
      status: 'occupied' as const,
      guests: 6,
      capacity: 6,
      lastActivity: '8 min ago',
      priority: 'normal' as const,
      totalBill: 156.80,
      orders: 4
    },
    {
      id: '4',
      number: '12',
      status: 'ordering' as const,
      guests: 3,
      capacity: 4,
      lastActivity: '2 min ago',
      priority: 'normal' as const,
      totalBill: 23.50,
      orders: 1
    },
    {
      id: '5',
      number: '3',
      status: 'available' as const,
      guests: 0,
      capacity: 4,
      lastActivity: '1 hour ago',
      priority: 'low' as const
    },
    {
      id: '6',
      number: '8',
      status: 'available' as const,
      guests: 0,
      capacity: 2,
      lastActivity: '45 min ago',
      priority: 'low' as const
    }
  ]

  const shiftStats = {
    hoursWorked: 6.5,
    tablesServed: 23,
    ordersProcessed: 67,
    tipsEarned: 125.50,
    customerRating: 4.8
  }

  const handleTableAction = (action: string, tableId: string) => {
    console.log(`Action: ${action} for table: ${tableId}`)
    // Here you would implement the actual action logic
  }

  const handleNotificationDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const urgentNotifications = notifications.filter(n => n.urgent)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Waiter Dashboard</h1>
              <p className="text-sm text-gray-600">Section A • Emma Wilson</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">€{shiftStats.tipsEarned}</p>
                <p className="text-xs text-gray-500">Tips Today</p>
              </div>
              <div className="relative">
                <BellIcon className="w-6 h-6 text-gray-400" />
                {urgentNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                    {urgentNotifications.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Urgent Notifications */}
        {urgentNotifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
              Urgent Requests ({urgentNotifications.length})
            </h2>
            <div className="space-y-3">
              {urgentNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onDismiss={handleNotificationDismiss}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{shiftStats.tablesServed}</p>
            <p className="text-xs text-gray-500">Tables Served</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{shiftStats.ordersProcessed}</p>
            <p className="text-xs text-gray-500">Orders Processed</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{shiftStats.hoursWorked}h</p>
            <p className="text-xs text-gray-500">Hours Worked</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-gray-900">⭐{shiftStats.customerRating}</p>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-2xl font-bold text-green-600">€{shiftStats.tipsEarned}</p>
            <p className="text-xs text-gray-500">Tips Earned</p>
          </div>
        </div>

        {/* Section Filter */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {['all', 'needsAttention', 'occupied', 'available'].map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
                selectedSection === section
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {section === 'all' ? 'All Tables' : 
               section === 'needsAttention' ? 'Need Attention' :
               section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Tables Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tables
            .filter(table => selectedSection === 'all' || table.status === selectedSection)
            .sort((a, b) => {
              // Sort by priority: high first, then by status
              if (a.priority !== b.priority) {
                return a.priority === 'high' ? -1 : b.priority === 'high' ? 1 : 0
              }
              return a.number.localeCompare(b.number)
            })
            .map((table) => (
              <TableCard
                key={table.id}
                table={table}
                onAction={handleTableAction}
              />
            ))}
        </div>

        {/* All Notifications */}
        {notifications.length > urgentNotifications.length && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">All Notifications</h2>
            <div className="space-y-3">
              {notifications
                .filter(n => !n.urgent)
                .map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onDismiss={handleNotificationDismiss}
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Action FAB */}
      <div className="fixed bottom-6 right-6">
        <button className="w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}