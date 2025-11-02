'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { 
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  HomeIcon
} from '@heroicons/react/24/outline'

export default function UnauthorizedPage() {
  const { user, logout } = useAuth()

  const getRoleBasedRedirect = () => {
    if (!user) return '/login'
    
    switch (user.role) {
      case 'manager':
        return '/manager'
      case 'waiter':
        return '/waiter'
      case 'customer':
        return '/customer'
      default:
        return '/login'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
          You don&apos;t have permission to access this page. Your current role 
          {user && ` (${user.role})`} doesn&apos;t include the required permissions for this resource.
        </p>

        {/* User Info */}
        {user && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-2">Your Account</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Email:</strong> {user.email}</p>
              {user.tableNumber && (
                <p><strong>Table:</strong> {user.tableNumber}</p>
              )}
              {user.section && (
                <p><strong>Section:</strong> {user.section}</p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href={getRoleBasedRedirect()}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Go to Your Dashboard</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>

          <button
            onClick={logout}
            className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Help */}
        <div className="mt-12 p-6 bg-blue-50 rounded-xl">
          <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-blue-700 text-sm">
            If you believe you should have access to this page, please contact your 
            manager or system administrator for assistance.
          </p>
        </div>
      </div>
    </div>
  )
}