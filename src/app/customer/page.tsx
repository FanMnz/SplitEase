'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { 
  ShoppingCartIcon,
  CreditCardIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  UserIcon,
  HomeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import RealtimeStats from '@/components/realtime/RealtimeStats'

function CustomerWelcome() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-neutral-900">
                SplitEase Customer
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <BellIcon className="w-6 h-6 text-neutral-600" />
              <div className="flex items-center space-x-2">
                <UserIcon className="w-8 h-8 text-neutral-600" />
                <span className="text-sm font-medium text-neutral-700">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Welcome to Table {user?.tableNumber}!
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Enjoy your dining experience with our easy-to-use ordering system. 
            Browse our menu, place orders, and track your meal progress all in one place.
          </p>
        </div>

        {/* Current Status */}
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Table Status</h2>
              <p className="text-neutral-600">You are seated at Table {user?.tableNumber}</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Active
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link 
              href="/orders/customer"
              className="flex flex-col items-center p-6 rounded-xl bg-brand-50 hover:bg-brand-100 transition-colors group"
            >
              <div className="w-14 h-14 bg-brand-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ClipboardDocumentListIcon className="w-7 h-7 text-white" />
              </div>
              <span className="font-semibold text-neutral-900">View Menu</span>
              <span className="text-sm text-neutral-600 mt-1">Browse our menu</span>
            </Link>
            
            <Link 
              href="/orders/customer"
              className="flex flex-col items-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors group"
            >
              <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingCartIcon className="w-7 h-7 text-white" />
              </div>
              <span className="font-semibold text-neutral-900">Place Order</span>
              <span className="text-sm text-neutral-600 mt-1">Order food & drinks</span>
            </Link>
            
            <Link 
              href="/billing/customer"
              className="flex flex-col items-center p-6 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors group"
            >
              <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CreditCardIcon className="w-7 h-7 text-white" />
              </div>
              <span className="font-semibold text-neutral-900">View Bill</span>
              <span className="text-sm text-neutral-600 mt-1">Check your bill</span>
            </Link>
          </div>
        </div>

        {/* Real-time Order Status */}
        <div className="mt-12">
          <RealtimeStats role="customer" />
        </div>

        {/* Features Overview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">Easy Ordering</h3>
            </div>
            <p className="text-neutral-600">
              Browse our digital menu, customize your orders, and add special instructions 
              with just a few taps.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">Order Tracking</h3>
            </div>
            <p className="text-neutral-600">
              Track your order progress in real-time from kitchen preparation to your table.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCardIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">Smart Billing</h3>
            </div>
            <p className="text-neutral-600">
              View itemized bills, split payments with your group, and pay securely 
              when you&apos;re ready.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <BellIcon className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">Live Updates</h3>
            </div>
            <p className="text-neutral-600">
              Get notified when your order is ready, when bills are updated, 
              or when staff need your attention.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Link
            href="/orders/customer"
            className="inline-flex items-center px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            <ShoppingCartIcon className="w-6 h-6 mr-3" />
            Start Ordering Now
          </Link>
        </div>
      </div>
    </div>
  )
}



export default function ProtectedCustomerWelcome() {
  return (
    <ProtectedRoute requiredRole="customer">
      <CustomerWelcome />
    </ProtectedRoute>
  )
}