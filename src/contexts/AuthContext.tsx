'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'

export type UserRole = 'manager' | 'waiter' | 'customer'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  restaurantId: string
  tableNumber?: string // For customers
  section?: string // For waiters
  permissions: string[]
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>
  loginWithQR: (qrData: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user database for demo purposes
const mockUsers: Record<string, AuthUser & { password: string }> = {
  'manager@restaurant.com': {
    id: 'mgr1',
    name: 'Sarah Johnson',
    email: 'manager@restaurant.com',
    password: 'manager123',
    role: 'manager',
    restaurantId: 'rest1',
    permissions: ['view_analytics', 'manage_staff', 'view_all_tables', 'modify_menu', 'financial_reports']
  },
  'waiter@restaurant.com': {
    id: 'wait1',
    name: 'Emma Wilson',
    email: 'waiter@restaurant.com',
    password: 'waiter123',
    role: 'waiter',
    restaurantId: 'rest1',
    section: 'Section A',
    permissions: ['view_tables', 'take_orders', 'process_payments', 'customer_service']
  }
}

// Mock QR code data for customer access
const mockQRSessions: Record<string, Omit<AuthUser, 'id'> & { sessionId: string }> = {
  'table-7-session-abc123': {
    name: 'Table 7 Guest',
    email: 'guest@table7.temp',
    role: 'customer',
    restaurantId: 'rest1',
    tableNumber: '7',
    sessionId: 'abc123',
    permissions: ['place_orders', 'view_menu', 'split_bill', 'request_service']
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = Cookies.get('auth_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Failed to parse saved user:', error)
        Cookies.remove('auth_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role?: UserRole): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user = mockUsers[email.toLowerCase()]
    
    if (user && user.password === password && (!role || user.role === role)) {
      const { password: _, ...userWithoutPassword } = user
      setUser(userWithoutPassword)
      
      // Save to cookie (expires in 24 hours)
      Cookies.set('auth_user', JSON.stringify(userWithoutPassword), { expires: 1 })
      
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const loginWithQR = async (qrData: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate QR validation delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const session = mockQRSessions[qrData]
    
    if (session) {
      const customerUser: AuthUser = {
        id: `customer-${session.sessionId}`,
        name: session.name,
        email: session.email,
        role: session.role as UserRole,
        restaurantId: session.restaurantId,
        tableNumber: session.tableNumber,
        permissions: session.permissions
      }
      
      setUser(customerUser)
      
      // Save to cookie (expires in 4 hours for customers)
      Cookies.set('auth_user', JSON.stringify(customerUser), { expires: 1/6 })
      
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    Cookies.remove('auth_user')
  }

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    loginWithQR,
    logout,
    isAuthenticated: !!user,
    hasPermission
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext