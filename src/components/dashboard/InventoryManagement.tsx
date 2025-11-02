'use client'

import { useState } from 'react'
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  MinusIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface InventoryItem {
  id: string
  name: string
  category: 'food' | 'beverage' | 'supplies'
  currentStock: number
  minThreshold: number
  maxCapacity: number
  unit: string
  cost: number
  supplier: string
  lastUpdated: string
  status: 'good' | 'low' | 'critical' | 'out'
}

interface InventoryManagementProps {
  items: InventoryItem[]
  onUpdateStock: (id: string, newStock: number) => void
}

export default function InventoryManagement({ items, onUpdateStock }: InventoryManagementProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-success-600 bg-success-50'
      case 'low': return 'text-warning-600 bg-warning-50'
      case 'critical': return 'text-error-600 bg-error-50'
      case 'out': return 'text-neutral-600 bg-neutral-100'
      default: return 'text-neutral-600 bg-neutral-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircleIcon className="w-4 h-4" />
      case 'low': case 'critical': return <ExclamationTriangleIcon className="w-4 h-4" />
      case 'out': return <XCircleIcon className="w-4 h-4" />
      default: return <CheckCircleIcon className="w-4 h-4" />
    }
  }

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categoryStats = {
    total: items.length,
    low: items.filter(item => item.status === 'low').length,
    critical: items.filter(item => item.status === 'critical').length,
    out: items.filter(item => item.status === 'out').length
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Inventory Management</h3>
          <p className="text-sm text-neutral-600">Track and manage restaurant inventory</p>
        </div>
        <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors">
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          Sync Inventory
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-neutral-50 rounded-lg">
          <p className="text-2xl font-bold text-neutral-900">{categoryStats.total}</p>
          <p className="text-sm text-neutral-600">Total Items</p>
        </div>
        <div className="text-center p-3 bg-warning-50 rounded-lg">
          <p className="text-2xl font-bold text-warning-600">{categoryStats.low}</p>
          <p className="text-sm text-neutral-600">Low Stock</p>
        </div>
        <div className="text-center p-3 bg-error-50 rounded-lg">
          <p className="text-2xl font-bold text-error-600">{categoryStats.critical}</p>
          <p className="text-sm text-neutral-600">Critical</p>
        </div>
        <div className="text-center p-3 bg-neutral-100 rounded-lg">
          <p className="text-2xl font-bold text-neutral-600">{categoryStats.out}</p>
          <p className="text-sm text-neutral-600">Out of Stock</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search items or suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        >
          <option value="all">All Categories</option>
          <option value="food">Food Items</option>
          <option value="beverage">Beverages</option>
          <option value="supplies">Supplies</option>
        </select>
      </div>

      {/* Inventory List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredItems.map((item) => {
          const stockPercentage = (item.currentStock / item.maxCapacity) * 100
          
          return (
            <div key={item.id} className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                    <span className="ml-1 capitalize">{item.status}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">{item.name}</h4>
                    <p className="text-sm text-neutral-600">{item.supplier} • {item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-neutral-900">
                    {item.currentStock} {item.unit}
                  </p>
                  <p className="text-sm text-neutral-600">
                    of {item.maxCapacity} {item.unit}
                  </p>
                </div>
              </div>

              {/* Stock Level Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-neutral-600 mb-1">
                  <span>Stock Level</span>
                  <span>{stockPercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      stockPercentage > 50 ? 'bg-success-500' :
                      stockPercentage > 20 ? 'bg-warning-500' : 'bg-error-500'
                    }`}
                    style={{ width: `${Math.max(stockPercentage, 2)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                  <span>Min: {item.minThreshold}</span>
                  <span>Max: {item.maxCapacity}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpdateStock(item.id, Math.max(0, item.currentStock - 1))}
                    className="p-1 text-neutral-600 hover:text-error-600 hover:bg-error-50 rounded transition-colors"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 bg-neutral-100 rounded text-sm font-medium">
                    {item.currentStock}
                  </span>
                  <button
                    onClick={() => onUpdateStock(item.id, Math.min(item.maxCapacity, item.currentStock + 1))}
                    className="p-1 text-neutral-600 hover:text-success-600 hover:bg-success-50 rounded transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-neutral-600">
                  €{item.cost.toFixed(2)} per {item.unit}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-neutral-600">No items found matching your criteria</p>
        </div>
      )}
    </div>
  )
}