'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import RevenueChart from '@/components/dashboard/RevenueChart'
import InventoryManagement from '@/components/dashboard/InventoryManagement'
import StaffScheduling from '@/components/dashboard/StaffScheduling'
import RealTimeAnalytics from '@/components/dashboard/RealTimeAnalytics'
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
  BellIcon,
  EyeIcon,
  Cog8ToothIcon,
  ChartPieIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'

interface KPICardProps {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
  isLive?: boolean
}

function KPICard({ title, value, change, changeType, icon, isLive = false }: KPICardProps) {
  const changeColor = {
    positive: 'text-success-600',
    negative: 'text-error-600',
    neutral: 'text-neutral-600'
  }[changeType]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <p className="text-sm font-medium text-neutral-600">{title}</p>
            {isLive && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-success-600">Live</span>
              </div>
            )}
          </div>
          <p className="text-3xl font-bold text-neutral-900 mb-2">{value}</p>
          <p className={`text-sm font-medium ${changeColor}`}>{change}</p>
        </div>
        <div className="p-3 bg-brand-50 rounded-lg">
          <div className="w-6 h-6 text-brand-600">
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}

function EnhancedManagerDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [activeTab, setActiveTab] = useState('overview')
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simulated real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
      // In a real app, this would fetch new data
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Mock data - in a real app, this would come from API
  const revenueData = [
    { time: '09:00', revenue: 450, orders: 8, target: 400 },
    { time: '10:00', revenue: 780, orders: 12, target: 700 },
    { time: '11:00', revenue: 1200, orders: 18, target: 1000 },
    { time: '12:00', revenue: 2100, orders: 32, target: 1800 },
    { time: '13:00', revenue: 2800, orders: 45, target: 2500 },
    { time: '14:00', revenue: 1900, orders: 28, target: 1800 },
    { time: '15:00', revenue: 950, orders: 15, target: 1000 },
    { time: '16:00', revenue: 1200, orders: 20, target: 1200 },
  ]

  const inventoryItems = [
    {
      id: '1',
      name: 'Fresh Salmon',
      category: 'food' as const,
      currentStock: 12,
      minThreshold: 15,
      maxCapacity: 50,
      unit: 'kg',
      cost: 24.50,
      supplier: 'Ocean Fresh Co.',
      lastUpdated: '2024-11-02T10:30:00Z',
      status: 'low' as const
    },
    {
      id: '2',
      name: 'House Wine (Red)',
      category: 'beverage' as const,
      currentStock: 8,
      minThreshold: 10,
      maxCapacity: 60,
      unit: 'bottles',
      cost: 15.00,
      supplier: 'Valley Vineyards',
      lastUpdated: '2024-11-02T09:15:00Z',
      status: 'critical' as const
    },
    {
      id: '3',
      name: 'Napkins',
      category: 'supplies' as const,
      currentStock: 45,
      minThreshold: 20,
      maxCapacity: 100,
      unit: 'packs',
      cost: 2.50,
      supplier: 'Restaurant Supply Co.',
      lastUpdated: '2024-11-02T08:00:00Z',
      status: 'good' as const
    }
  ]

  const staffMembers = [
    { id: '1', name: 'Emma Wilson', role: 'Senior Waiter', hourlyRate: 18, skills: ['Wine Service', 'Customer Relations'], availability: ['mon', 'tue', 'wed', 'thu', 'fri'] },
    { id: '2', name: 'Lucas Martin', role: 'Waiter', hourlyRate: 15, skills: ['Food Service', 'POS Systems'], availability: ['tue', 'wed', 'thu', 'fri', 'sat'] },
    { id: '3', name: 'Sophie Chen', role: 'Host', hourlyRate: 14, skills: ['Customer Service', 'Reservations'], availability: ['fri', 'sat', 'sun'] }
  ]

  const shifts = [
    {
      id: '1',
      staffId: '1',
      staffName: 'Emma Wilson',
      role: 'Senior Waiter',
      date: new Date(),
      startTime: '16:00',
      endTime: '23:00',
      status: 'confirmed' as const,
      breakTime: 30
    },
    {
      id: '2',
      staffId: '2',
      staffName: 'Lucas Martin',
      role: 'Waiter',
      date: new Date(),
      startTime: '11:00',
      endTime: '19:00',
      status: 'scheduled' as const,
      breakTime: 30
    }
  ]

  const analyticsData = {
    hourlyOrders: [
      { hour: '09', orders: 8, revenue: 450 },
      { hour: '10', orders: 12, revenue: 780 },
      { hour: '11', orders: 18, revenue: 1200 },
      { hour: '12', orders: 32, revenue: 2100 },
      { hour: '13', orders: 45, revenue: 2800 },
      { hour: '14', orders: 28, revenue: 1900 },
      { hour: '15', orders: 15, revenue: 950 },
      { hour: '16', orders: 20, revenue: 1200 },
    ],
    categoryBreakdown: [
      { name: 'Appetizers', value: 25, color: '#3B82F6' },
      { name: 'Main Courses', value: 45, color: '#10B981' },
      { name: 'Desserts', value: 15, color: '#F59E0B' },
      { name: 'Beverages', value: 15, color: '#EF4444' }
    ],
    tableMetrics: {
      occupied: 18,
      total: 24,
      averageTurnover: 85,
      peakHour: '19:30'
    },
    customerMetrics: {
      total: 156,
      returning: 47,
      averageSpend: 42.30,
      satisfaction: 4.7
    },
    liveMetrics: {
      activeOrders: 23,
      waitingTime: 12,
      staffEfficiency: 92,
      kitchenLoad: 78
    }
  }

  const kpiData = [
    {
      title: 'Today&apos;s Revenue',
      value: '€11,380',
      change: '+12.5% vs yesterday',
      changeType: 'positive' as const,
      icon: <CurrencyDollarIcon />,
      isLive: true
    },
    {
      title: 'Table Occupancy',
      value: '78%',
      change: '+5.2% vs last week',
      changeType: 'positive' as const,
      icon: <TableCellsIcon />,
      isLive: true
    },
    {
      title: 'Average Order Value',
      value: '€42.30',
      change: '-2.1% vs yesterday',
      changeType: 'negative' as const,
      icon: <ChartBarIcon />,
      isLive: true
    },
    {
      title: 'Staff Efficiency',
      value: '92%',
      change: '+3% vs yesterday',
      changeType: 'positive' as const,
      icon: <UserGroupIcon />,
      isLive: true
    },
    {
      title: 'Customer Satisfaction',
      value: '4.7/5',
      change: '+0.2 vs last month',
      changeType: 'positive' as const,
      icon: <ArrowTrendingUpIcon />,
      isLive: false
    },
    {
      title: 'Average Wait Time',
      value: '12 min',
      change: '-3 min improved',
      changeType: 'positive' as const,
      icon: <ClockIcon />,
      isLive: true
    }
  ]

  const urgentAlerts = [
    {
      title: 'Low Inventory Alert',
      description: 'Fresh Salmon and House Wine running low for dinner service',
      icon: <ExclamationTriangleIcon />,
      type: 'inventory',
      urgent: true
    },
    {
      title: 'Staff Coverage Gap',
      description: 'Need additional waiter for dinner rush (7-9 PM)',
      icon: <UserGroupIcon />,
      type: 'staffing',
      urgent: true
    }
  ]

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <EyeIcon className="w-5 h-5" /> },
    { id: 'analytics', name: 'Analytics', icon: <ChartPieIcon className="w-5 h-5" /> },
    { id: 'inventory', name: 'Inventory', icon: <ClipboardDocumentListIcon className="w-5 h-5" /> },
    { id: 'staff', name: 'Staff', icon: <UsersIcon className="w-5 h-5" /> }
  ]

  const handleUpdateStock = (id: string, newStock: number) => {
    console.log('Update stock:', id, newStock)
    // In a real app, this would update the inventory
  }

  const handleAddShift = (shift: any) => {
    console.log('Add shift:', shift)
    // In a real app, this would add the shift to the schedule
  }

  const handleUpdateShift = (id: string, shift: any) => {
    console.log('Update shift:', id, shift)
    // In a real app, this would update the shift
  }

  const handleDeleteShift = (id: string) => {
    console.log('Delete shift:', id)
    // In a real app, this would delete the shift
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-neutral-900">Enhanced Manager Dashboard</h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span className="px-3 py-1 bg-success-100 text-success-800 rounded-full text-sm font-medium">
                  Live Data
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-neutral-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span>Restaurant Le Gourmet</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Good evening, Manager! 👨‍💼
              </h2>
              <p className="text-neutral-600">
                Real-time overview for {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} • Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>

            {/* Urgent Alerts */}
            {urgentAlerts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-error-500 mr-2" />
                  Urgent Attention Required
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {urgentAlerts.map((alert, index) => (
                    <div
                      key={index}
                      className="p-4 border-2 border-error-200 bg-error-50 rounded-lg hover:border-error-300 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-error-100 rounded-lg">
                          <div className="w-5 h-5 text-error-600">
                            {alert.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-error-900">{alert.title}</h4>
                          <p className="text-sm text-error-700">{alert.description}</p>
                          <button className="mt-2 text-sm font-medium text-error-600 hover:text-error-700">
                            Take Action →
                          </button>
                        </div>
                      </div>
                    </div>
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
                  isLive={kpi.isLive}
                />
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="mb-8">
              <RevenueChart data={revenueData} period={selectedPeriod} />
            </div>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <RealTimeAnalytics data={analyticsData} isLive={true} />
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <InventoryManagement 
            items={inventoryItems}
            onUpdateStock={handleUpdateStock}
          />
        )}

        {/* Staff Tab */}
        {activeTab === 'staff' && (
          <StaffScheduling
            shifts={shifts}
            staff={staffMembers}
            onAddShift={handleAddShift}
            onUpdateShift={handleUpdateShift}
            onDeleteShift={handleDeleteShift}
          />
        )}
      </div>
    </div>
  )
}

export default function ProtectedEnhancedManagerDashboard() {
  return (
    <ProtectedRoute requiredRole="manager" requiredPermissions={['view_analytics', 'manage_staff', 'manage_inventory']}>
      <EnhancedManagerDashboard />
    </ProtectedRoute>
  )
}