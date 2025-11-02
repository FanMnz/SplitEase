'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  ClockIcon,
  TableCellsIcon,
  ExclamationTriangleIcon,
  CogIcon,
  DocumentChartBarIcon,
  UsersIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  BellIcon
} from '@heroicons/react/24/outline'

interface KPICardProps {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
}

function KPICard({ title, value, change, changeType, icon }: KPICardProps) {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          <p className={`text-sm font-medium ${changeColor}`}>{change}</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="w-6 h-6 text-blue-600">
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}

interface QuickActionProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
  urgent?: boolean
}

function QuickAction({ title, description, icon, onClick, urgent = false }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
        urgent 
          ? 'border-red-200 bg-red-50 hover:border-red-300' 
          : 'border-gray-200 bg-white hover:border-blue-300'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${urgent ? 'bg-red-100' : 'bg-blue-50'}`}>
          <div className={`w-5 h-5 ${urgent ? 'text-red-600' : 'text-blue-600'}`}>
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <h3 className={`font-medium ${urgent ? 'text-red-900' : 'text-gray-900'}`}>
            {title}
          </h3>
          <p className={`text-sm ${urgent ? 'text-red-700' : 'text-gray-600'}`}>
            {description}
          </p>
        </div>
      </div>
    </button>
  )
}

function ManagerDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('today')

  const kpiData = [
    {
      title: 'Today&apos;s Revenue',
      value: '€2,847',
      change: '+12.5% vs yesterday',
      changeType: 'positive' as const,
      icon: <CurrencyDollarIcon />
    },
    {
      title: 'Table Occupancy',
      value: '78%',
      change: '+5.2% vs last week',
      changeType: 'positive' as const,
      icon: <TableCellsIcon />
    },
    {
      title: 'Average Order Value',
      value: '€42.30',
      change: '-2.1% vs yesterday',
      changeType: 'negative' as const,
      icon: <ChartBarIcon />
    },
    {
      title: 'Staff Efficiency',
      value: '92%',
      change: 'Stable',
      changeType: 'neutral' as const,
      icon: <UserGroupIcon />
    },
    {
      title: 'Peak Hour Performance',
      value: '18:30',
      change: 'Busiest today',
      changeType: 'neutral' as const,
      icon: <ClockIcon />
    },
    {
      title: 'Customer Satisfaction',
      value: '4.7/5',
      change: '+0.2 vs last month',
      changeType: 'positive' as const,
      icon: <ArrowTrendingUpIcon />
    }
  ]

  const urgentActions = [
    {
      title: 'Staff Shortage Alert',
      description: 'Table 7 and 12 need immediate attention - 15 min wait',
      icon: <ExclamationTriangleIcon />,
      urgent: true
    },
    {
      title: 'Low Inventory Warning',
      description: 'Salmon and house wine running low for dinner service',
      icon: <ExclamationTriangleIcon />,
      urgent: true
    }
  ]

  const quickActions = [
    {
      title: 'View Live Floor Plan',
      description: 'Real-time table status and reservations',
      icon: <TableCellsIcon />
    },
    {
      title: 'Staff Management',
      description: 'Schedule, performance, and shift handovers',
      icon: <UsersIcon />
    },
    {
      title: 'Financial Reports',
      description: 'Revenue, costs, and profit analysis',
      icon: <DocumentChartBarIcon />
    },
    {
      title: 'System Settings',
      description: 'Restaurant configuration and preferences',
      icon: <CogIcon />
    },
    {
      title: 'Daily Reservations',
      description: 'Booking management and availability',
      icon: <CalendarDaysIcon />
    },
    {
      title: 'Customer Feedback',
      description: 'Reviews, complaints, and satisfaction scores',
      icon: <BellIcon />
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Manager Dashboard</h1>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Live
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/manager/enhanced"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
              >
                <ChartBarIcon className="w-4 h-4 mr-2" />
                Enhanced Dashboard
              </a>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Restaurant Le Gourmet</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Good evening, Manager! 👨‍💼
          </h2>
          <p className="text-gray-600">
            Here&apos;s your restaurant overview for {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Urgent Alerts */}
        {urgentActions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
              Urgent Attention Required
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {urgentActions.map((action, index) => (
                <QuickAction
                  key={index}
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  onClick={() => console.log('Urgent action:', action.title)}
                  urgent={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              changeType={kpi.changeType}
              icon={kpi.icon}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <QuickAction
                key={index}
                title={action.title}
                description={action.description}
                icon={action.icon}
                onClick={() => console.log('Quick action:', action.title)}
              />
            ))}
          </div>
        </div>

        {/* Today's Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Revenue Trend</h3>
            <div className="h-48 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <p className="text-gray-600">Revenue chart will be implemented here</p>
                <p className="text-sm text-gray-500">Real-time data visualization</p>
              </div>
            </div>
          </div>

          {/* Staff Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Performance Today</h3>
            <div className="space-y-4">
              {[
                { name: 'Emma Wilson', role: 'Senior Waiter', tables: 8, orders: 32, tips: '€47', rating: 4.9 },
                { name: 'Lucas Martin', role: 'Waiter', tables: 6, orders: 24, tips: '€32', rating: 4.7 },
                { name: 'Sophie Chen', role: 'Host', tables: 12, orders: 48, tips: '€18', rating: 4.8 }
              ].map((staff, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{staff.name}</p>
                    <p className="text-sm text-gray-600">{staff.role} • {staff.tables} tables • {staff.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{staff.tips}</p>
                    <p className="text-sm text-gray-600">⭐ {staff.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProtectedManagerDashboard() {
  return (
    <ProtectedRoute requiredRole="manager" requiredPermissions={['view_analytics', 'manage_staff']}>
      <ManagerDashboard />
    </ProtectedRoute>
  )
}