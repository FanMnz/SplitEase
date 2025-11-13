'use client'

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'

// Types for real-time communication
export interface NotificationMessage {
  id: string
  type: 'order' | 'payment' | 'kitchen' | 'table' | 'system'
  title: string
  message: string
  timestamp: Date
  priority: 'low' | 'medium' | 'high' | 'urgent'
  targetRole?: string[]
  tableNumber?: number
  orderId?: string
  read: boolean
  actions?: {
    label: string
    action: string
    data?: any
  }[]
}

export interface LiveUpdate {
  type: 'order_status' | 'table_status' | 'payment_status' | 'kitchen_update' | 'staff_update'
  data: any
  timestamp: Date
  tableNumber?: number
  orderId?: string
}

export interface ConnectionStatus {
  connected: boolean
  reconnecting: boolean
  lastConnected?: Date
  connectionId?: string
}

interface RealtimeContextType {
  // Connection management
  connectionStatus: ConnectionStatus
  connect: () => void
  disconnect: () => void
  
  // Notifications
  notifications: NotificationMessage[]
  unreadCount: number
  addNotification: (notification: Omit<NotificationMessage, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
  
  // Live updates
  subscribeToUpdates: (callback: (update: LiveUpdate) => void) => () => void
  sendUpdate: (update: Omit<LiveUpdate, 'timestamp'>) => void
  
  // Room management (for table-specific updates)
  joinRoom: (roomId: string) => void
  leaveRoom: (roomId: string) => void
  currentRooms: string[]
  
  // Broadcast methods
  broadcastOrderUpdate: (orderId: string, status: string, tableNumber: number) => void
  broadcastTableUpdate: (tableNumber: number, status: string, data?: any) => void
  broadcastKitchenUpdate: (orderId: string, status: string, estimatedTime?: number) => void
  broadcastPaymentUpdate: (tableNumber: number, amount: number, status: string) => void
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export const useRealtime = () => {
  const context = useContext(RealtimeContext)
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
}

// Simulated WebSocket class (replace with actual WebSocket in production)
class MockWebSocket {
  private callbacks: { [key: string]: Function[] } = {}
  private connected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  constructor(private url: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.connected = true
        this.reconnectAttempts = 0
        this.emit('open', {})
        resolve()
      }, 500 + Math.random() * 1000) // Simulate connection delay
    })
  }

  disconnect() {
    this.connected = false
    this.emit('close', {})
  }

  send(data: string) {
    if (!this.connected) {
      throw new Error('WebSocket is not connected')
    }
    
    // Simulate server processing and responses
    setTimeout(() => {
      const message = JSON.parse(data)
      
      // Echo back updates to simulate real-time behavior
      if (message.type === 'subscribe') {
        this.emit('message', { 
          type: 'subscription_confirmed', 
          room: message.room 
        })
      } else if (message.type === 'broadcast') {
        // Simulate broadcasting to other clients
        setTimeout(() => {
          this.emit('message', {
            type: 'live_update',
            data: message.data
          })
        }, 100)
      }
    }, 50)
  }

  on(event: string, callback: Function) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }
    this.callbacks[event].push(callback)
  }

  off(event: string, callback: Function) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback)
    }
  }

  private emit(event: string, data: any) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data))
    }
  }

  get readyState() {
    return this.connected ? 1 : 0 // 1 = OPEN, 0 = CONNECTING/CLOSED
  }
}

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    reconnecting: false,
  })
  const [notifications, setNotifications] = useState<NotificationMessage[]>([])
  const [currentRooms, setCurrentRooms] = useState<string[]>([])
  
  const wsRef = useRef<MockWebSocket | null>(null)
  const updateCallbacksRef = useRef<Set<(update: LiveUpdate) => void>>(new Set())
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  // Notification management
  const addNotification = useCallback((notification: Omit<NotificationMessage, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationMessage = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    }
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]) // Keep last 50 notifications
    
    // Play notification sound for high priority notifications
    if (notification.priority === 'high' || notification.priority === 'urgent') {
      // In production, play actual notification sound
      console.log('🔔 High priority notification:', notification.title)
    }
  }, [])

  // Initialize WebSocket connection
  const connect = useCallback(async () => {
    if (wsRef.current?.readyState === 1) return

    try {
      setConnectionStatus(prev => ({ ...prev, reconnecting: true }))
      
      wsRef.current = new MockWebSocket('ws://localhost:3001/ws')
      
      wsRef.current.on('open', () => {
        setConnectionStatus({
          connected: true,
          reconnecting: false,
          lastConnected: new Date(),
          connectionId: Math.random().toString(36).substr(2, 9)
        })
        
        // Rejoin rooms after reconnection
        currentRooms.forEach(room => {
          wsRef.current?.send(JSON.stringify({
            type: 'subscribe',
            room
          }))
        })
      })

      wsRef.current.on('close', () => {
        setConnectionStatus(prev => ({
          ...prev,
          connected: false,
          reconnecting: false
        }))
        
        // Attempt to reconnect
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = undefined
            connect()
          }, 3000)
        }
      })

      wsRef.current.on('message', (data: any) => {
        if (data.type === 'live_update') {
          const update: LiveUpdate = {
            ...data.data,
            timestamp: new Date()
          }
          
          // Notify all subscribers
          updateCallbacksRef.current.forEach(callback => callback(update))
        } else if (data.type === 'notification') {
          addNotification(data.notification)
        }
      })

      await wsRef.current.connect()
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error)
      setConnectionStatus(prev => ({ ...prev, reconnecting: false }))
    }
  }, [currentRooms, addNotification])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = undefined
    }
    
    wsRef.current?.disconnect()
    wsRef.current = null
    setConnectionStatus({
      connected: false,
      reconnecting: false
    })
  }, [])

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Live updates
  const subscribeToUpdates = useCallback((callback: (update: LiveUpdate) => void) => {
    updateCallbacksRef.current.add(callback)
    
    return () => {
      updateCallbacksRef.current.delete(callback)
    }
  }, [])

  const sendUpdate = useCallback((update: Omit<LiveUpdate, 'timestamp'>) => {
    if (wsRef.current?.readyState === 1) {
      wsRef.current.send(JSON.stringify({
        type: 'broadcast',
        data: {
          ...update,
          timestamp: new Date()
        }
      }))
    }
  }, [])

  // Room management
  const joinRoom = useCallback((roomId: string) => {
    if (!currentRooms.includes(roomId)) {
      setCurrentRooms(prev => [...prev, roomId])
      
      if (wsRef.current?.readyState === 1) {
        wsRef.current.send(JSON.stringify({
          type: 'subscribe',
          room: roomId
        }))
      }
    }
  }, [currentRooms])

  const leaveRoom = useCallback((roomId: string) => {
    setCurrentRooms(prev => prev.filter(room => room !== roomId))
    
    if (wsRef.current?.readyState === 1) {
      wsRef.current.send(JSON.stringify({
        type: 'unsubscribe',
        room: roomId
      }))
    }
  }, [])

  // Broadcast methods
  const broadcastOrderUpdate = useCallback((orderId: string, status: string, tableNumber: number) => {
    sendUpdate({
      type: 'order_status',
      data: { orderId, status, tableNumber },
      orderId,
      tableNumber
    })
    
    // Add notification for relevant roles
    const statusMessages = {
      'preparing': 'Order is being prepared in the kitchen',
      'ready': 'Order is ready for pickup',
      'served': 'Order has been served to the table',
      'completed': 'Order has been completed'
    }
    
    addNotification({
      type: 'order',
      title: `Order ${orderId} Update`,
      message: statusMessages[status as keyof typeof statusMessages] || `Order status changed to ${status}`,
      priority: status === 'ready' ? 'high' : 'medium',
      targetRole: status === 'ready' ? ['waiter'] : ['kitchen', 'waiter'],
      tableNumber,
      orderId
    })
  }, [sendUpdate, addNotification])

  const broadcastTableUpdate = useCallback((tableNumber: number, status: string, data?: any) => {
    sendUpdate({
      type: 'table_status',
      data: { tableNumber, status, ...data },
      tableNumber
    })
    
    addNotification({
      type: 'table',
      title: `Table ${tableNumber} Update`,
      message: `Table status changed to ${status}`,
      priority: 'medium',
      targetRole: ['waiter', 'manager'],
      tableNumber
    })
  }, [sendUpdate, addNotification])

  const broadcastKitchenUpdate = useCallback((orderId: string, status: string, estimatedTime?: number) => {
    sendUpdate({
      type: 'kitchen_update',
      data: { orderId, status, estimatedTime },
      orderId
    })
    
    const timeMessage = estimatedTime ? ` (Est. ${estimatedTime} min)` : ''
    addNotification({
      type: 'kitchen',
      title: 'Kitchen Update',
      message: `Order ${orderId}: ${status}${timeMessage}`,
      priority: status === 'delayed' ? 'high' : 'medium',
      targetRole: ['waiter', 'customer'],
      orderId
    })
  }, [sendUpdate, addNotification])

  const broadcastPaymentUpdate = useCallback((tableNumber: number, amount: number, status: string) => {
    sendUpdate({
      type: 'payment_status',
      data: { tableNumber, amount, status },
      tableNumber
    })
    
    addNotification({
      type: 'payment',
      title: 'Payment Update',
      message: `Table ${tableNumber}: ${status} - $${amount.toFixed(2)}`,
      priority: 'medium',
      targetRole: ['waiter', 'manager'],
      tableNumber
    })
  }, [sendUpdate, addNotification])

  // Auto-connect on mount
  useEffect(() => {
    connect()
    
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  const unreadCount = notifications.filter(n => !n.read).length

  const value: RealtimeContextType = {
    connectionStatus,
    connect,
    disconnect,
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    subscribeToUpdates,
    sendUpdate,
    joinRoom,
    leaveRoom,
    currentRooms,
    broadcastOrderUpdate,
    broadcastTableUpdate,
    broadcastKitchenUpdate,
    broadcastPaymentUpdate
  }

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  )
}