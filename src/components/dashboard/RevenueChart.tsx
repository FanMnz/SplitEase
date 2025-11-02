'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface RevenueData {
  time: string
  revenue: number
  orders: number
  target: number
}

interface RevenueChartProps {
  data: RevenueData[]
  period: string
}

export default function RevenueChart({ data, period }: RevenueChartProps) {
  const formatCurrency = (value: number) => `€${value.toLocaleString()}`
  
  const formatTooltip = (value: number, name: string) => {
    if (name === 'revenue' || name === 'target') {
      return [formatCurrency(value), name === 'revenue' ? 'Revenue' : 'Target']
    }
    return [value, 'Orders']
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Revenue Trend</h3>
          <p className="text-sm text-neutral-600 capitalize">{period} performance</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-brand-500 rounded-full"></div>
            <span className="text-neutral-600">Revenue</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-neutral-300 rounded-full"></div>
            <span className="text-neutral-600">Target</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#revenueGradient)"
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#9CA3AF"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
        <div className="text-center">
          <p className="text-sm text-neutral-600">Total Revenue</p>
          <p className="text-lg font-semibold text-neutral-900">
            {formatCurrency(data.reduce((sum, item) => sum + item.revenue, 0))}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-neutral-600">Average Order</p>
          <p className="text-lg font-semibold text-neutral-900">
            {formatCurrency(
              data.reduce((sum, item) => sum + item.revenue, 0) / 
              data.reduce((sum, item) => sum + item.orders, 0)
            )}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-neutral-600">vs Target</p>
          <p className="text-lg font-semibold text-success-600">
            +{(((data.reduce((sum, item) => sum + item.revenue, 0) / 
                data.reduce((sum, item) => sum + item.target, 0)) - 1) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  )
}