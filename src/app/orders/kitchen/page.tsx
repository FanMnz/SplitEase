'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import KitchenDashboard from '@/components/kitchen/KitchenDashboard'

function KitchenPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-neutral-900">Kitchen Management</h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span className="px-3 py-1 bg-success-100 text-success-800 rounded-full text-sm font-medium">
                  Live Orders
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span>Restaurant Kitchen</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <KitchenDashboard />
      </div>
    </div>
  )
}

export default function ProtectedKitchenPage() {
  return (
    <ProtectedRoute requiredRole={['manager', 'waiter']} requiredPermissions={['view_kitchen', 'manage_orders']}>
      <KitchenPage />
    </ProtectedRoute>
  )
}