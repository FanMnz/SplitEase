'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, UserRole } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole | UserRole[]
  requiredPermissions?: string[]
  fallbackPath?: string
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermissions = [],
  fallbackPath = '/login'
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated
      if (!user) {
        router.push(fallbackPath)
        return
      }

      // Check role requirements
      if (requiredRole) {
        const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
        if (!allowedRoles.includes(user.role)) {
          // Redirect to appropriate dashboard based on user's actual role
          switch (user.role) {
            case 'manager':
              router.push('/manager')
              break
            case 'waiter':
              router.push('/waiter')
              break
            case 'customer':
              router.push('/customer')
              break
            default:
              router.push('/login')
          }
          return
        }
      }

      // Check permission requirements
      if (requiredPermissions.length > 0) {
        const hasAllPermissions = requiredPermissions.every(permission => 
          user.permissions.includes(permission)
        )
        
        if (!hasAllPermissions) {
          router.push('/unauthorized')
          return
        }
      }
    }
  }, [user, isLoading, requiredRole, requiredPermissions, fallbackPath, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if not authenticated or doesn't have required role/permissions
  if (!user) {
    return null
  }

  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!allowedRoles.includes(user.role)) {
      return null
    }
  }

  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      user.permissions.includes(permission)
    )
    if (!hasAllPermissions) {
      return null
    }
  }

  return <>{children}</>
}

// Higher-order component for easier usage
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    )
  }
}