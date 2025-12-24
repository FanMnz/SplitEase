'use client'

import React from 'react'
import { OrderProvider } from '@/contexts/OrderContext'

/**
 * Client-Only Layout
 * Used for /table/[tableId] routes
 * 
 * Features:
 * - No staff navigation (manager, waiter icons)
 * - Premium, minimal design focused on dining experience
 * - Mobile-optimized
 * - Full-screen video support
 * - Cart sticky footer
 */

export default function TableLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <OrderProvider>
      <div className="min-h-screen bg-white">
        {/* No header/navigation - client focused */}
        
        {/* Main content area */}
        <main className="w-full">
          {children}
        </main>

        {/* Sticky Cart Footer (Optional - can be toggled) */}
        {/* This will be populated by cart context if needed */}
      </div>
    </OrderProvider>
  )
}
