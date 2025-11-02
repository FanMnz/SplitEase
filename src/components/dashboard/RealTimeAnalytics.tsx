'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  ClockIcon,
  CurrencyDollarIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  hourlyOrders: Array<{ hour: string; orders: number; revenue: number }>
  categoryBreakdown: Array<{ name: string; value: number; color: string }>
  tableMetrics: {
    occupied: number
    total: number
    averageTurnover: number
    peakHour: string
  }
  customerMetrics: {
    total: number
    returning: number
    averageSpend: number
    satisfaction: number
  }
  liveMetrics: {
    activeOrders: number
    waitingTime: number
    staffEfficiency: number
    kitchenLoad: number
  }
}

interface RealTimeAnalyticsProps {
  data: AnalyticsData
  isLive?: boolean
}

export default function RealTimeAnalytics({ data, isLive = true }: RealTimeAnalyticsProps) {
  const [lastUpdate, setLastUpdate] = useState(new Date())
  
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
        // In a real app, this would trigger data refresh
      }, 30000) // Update every 30 seconds

      return () => clearInterval(interval)
    }
  }, [isLive])

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    changeType, 
    icon, 
    suffix = '' 
  }: {
    title: string
    value: string | number
    change?: string
    changeType?: 'positive' | 'negative' | 'neutral'
    icon: React.ReactNode
    suffix?: string
  }) => {
    const changeColors = {
      positive: 'text-success-600',
      negative: 'text-error-600',
      neutral: 'text-neutral-600'
    }

    return (
      <div className="bg-white rounded-lg border border-neutral-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-brand-50 rounded-lg">
            <div className="w-5 h-5 text-brand-600">{icon}</div>
          </div>
          {isLive && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-neutral-500">Live</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-2xl font-bold text-neutral-900">
            {value}{suffix}
          </p>
          <p className="text-sm text-neutral-600">{title}</p>
          {change && changeType && (
            <div className="flex items-center mt-1">
              {changeType === 'positive' ? (
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1 text-success-600" />
              ) : changeType === 'negative' ? (
                <ArrowTrendingDownIcon className="w-4 h-4 mr-1 text-error-600" />
              ) : null}
              <span className={`text-sm ${changeColors[changeType]}`}>{change}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Real-time Analytics</h3>
          <p className="text-sm text-neutral-600">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isLive && (
            <>
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-success-600">Live Data</span>
            </>
          )}
        </div>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Orders"
          value={data.liveMetrics.activeOrders}
          change="+3 from 1hr ago"
          changeType="positive"
          icon={<ClockIcon />}
        />
        <MetricCard
          title="Avg Wait Time"
          value={data.liveMetrics.waitingTime}
          suffix=" min"
          change="-2 min improved"
          changeType="positive"
          icon={<ClockIcon />}
        />
        <MetricCard
          title="Staff Efficiency"
          value={data.liveMetrics.staffEfficiency}
          suffix="%"
          change="+5% vs yesterday"
          changeType="positive"
          icon={<UsersIcon />}
        />
        <MetricCard
          title="Kitchen Load"
          value={data.liveMetrics.kitchenLoad}
          suffix="%"
          change="Normal capacity"
          changeType="neutral"
          icon={<CurrencyDollarIcon />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <h4 className="font-semibold text-neutral-900 mb-4">Hourly Orders Today</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.hourlyOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="hour" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="orders" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <h4 className="font-semibold text-neutral-900 mb-4">Order Categories</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Table Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <h4 className="font-semibold text-neutral-900 mb-4">Table Performance</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Occupancy Rate</span>
              <span className="font-medium text-neutral-900">
                {data.tableMetrics.occupied}/{data.tableMetrics.total} tables
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-brand-500 h-2 rounded-full"
                style={{ width: `${(data.tableMetrics.occupied / data.tableMetrics.total) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Avg Turnover</span>
              <span className="font-medium text-neutral-900">{data.tableMetrics.averageTurnover} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Peak Hour</span>
              <span className="font-medium text-neutral-900">{data.tableMetrics.peakHour}</span>
            </div>
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <h4 className="font-semibold text-neutral-900 mb-4">Customer Insights</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Total Customers</span>
              <span className="font-medium text-neutral-900">{data.customerMetrics.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Returning Customers</span>
              <span className="font-medium text-neutral-900">
                {data.customerMetrics.returning} ({((data.customerMetrics.returning / data.customerMetrics.total) * 100).toFixed(0)}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Average Spend</span>
              <span className="font-medium text-neutral-900">€{data.customerMetrics.averageSpend.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Satisfaction Score</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-neutral-900">{data.customerMetrics.satisfaction}/5</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < Math.floor(data.customerMetrics.satisfaction)
                          ? 'text-warning-400'
                          : 'text-neutral-300'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}