'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled'
export type OrderPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  // Media enhancements for premium presentation
  muxPlaybackId?: string // Mux playback ID for streaming preview/hero
  posterUrl?: string // Poster image for video
  previewClipUrl?: string // Optional short clip fallback
  allergens: string[]
  dietary: string[] // vegetarian, vegan, gluten-free, etc.
  preparationTime: number // in minutes
  isAvailable: boolean
  ingredients: string[]
}

export interface OrderItem {
  id: string
  menuItem: MenuItem
  quantity: number
  specialInstructions?: string
  modifications?: string[]
  unitPrice: number
  totalPrice: number
}

export interface Order {
  id: string
  tableNumber: string
  customerId?: string
  waiterId?: string
  items: OrderItem[]
  status: OrderStatus
  priority: OrderPriority
  totalAmount: number
  tax: number
  serviceCharge: number
  finalAmount: number
  createdAt: Date
  updatedAt: Date
  estimatedReadyTime?: Date
  actualReadyTime?: Date
  servedAt?: Date
  notes?: string
  customerName?: string
  phoneNumber?: string
  specialRequests?: string[]
}

export interface KitchenOrder {
  orderId: string
  tableNumber: string
  items: OrderItem[]
  status: OrderStatus
  priority: OrderPriority
  createdAt: Date
  estimatedReadyTime?: Date
  kitchenNotes?: string
  waiterId?: string
  customerName?: string
}

interface OrderContextType {
  // Orders state
  orders: Order[]
  kitchenOrders: KitchenOrder[]
  menu: MenuItem[]
  
  // Order actions
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>
  updateOrderPriority: (orderId: string, priority: OrderPriority) => Promise<boolean>
  addItemToOrder: (orderId: string, item: OrderItem) => Promise<boolean>
  removeItemFromOrder: (orderId: string, itemId: string) => Promise<boolean>
  cancelOrder: (orderId: string, reason?: string) => Promise<boolean>
  
  // Menu actions
  getMenuByCategory: (category: string) => MenuItem[]
  getMenuItem: (itemId: string) => MenuItem | undefined
  
  // Kitchen actions
  getKitchenOrders: () => KitchenOrder[]
  updateKitchenOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>
  
  // Utility functions
  calculateOrderTotal: (items: OrderItem[]) => { subtotal: number; tax: number; serviceCharge: number; total: number }
  getOrdersByTable: (tableNumber: string) => Order[]
  getOrdersByWaiter: (waiterId: string) => Order[]
  getOrdersByStatus: (status: OrderStatus) => Order[]
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

// Mock menu data
const mockMenu: MenuItem[] = [
  // Appetizers
  {
    id: 'app1',
    name: 'Bruschetta Trio',
    description: 'Three varieties of our signature bruschetta with fresh tomatoes, basil, and mozzarella',
    price: 12.50,
    category: 'appetizers',
    allergens: ['gluten', 'dairy'],
    dietary: ['vegetarian'],
    preparationTime: 8,
    isAvailable: true,
    ingredients: ['bread', 'tomatoes', 'basil', 'mozzarella', 'olive oil']
  },
  {
    id: 'app2',
    name: 'Calamari Rings',
    description: 'Crispy fried squid rings with marinara sauce and lemon',
    price: 14.00,
    category: 'appetizers',
    allergens: ['gluten', 'seafood'],
    dietary: [],
    preparationTime: 12,
    isAvailable: true,
    ingredients: ['squid', 'flour', 'marinara sauce', 'lemon']
  },
  
  // Main Courses
  {
    id: 'main1',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon with roasted vegetables and lemon butter sauce',
    price: 28.00,
    category: 'mains',
    muxPlaybackId: 'mux_demo_salmon_001',
    posterUrl: 'https://via.placeholder.com/800x600?text=Grilled+Salmon',
    allergens: ['fish', 'dairy'],
    dietary: ['gluten-free'],
    preparationTime: 18,
    isAvailable: true,
    ingredients: ['salmon', 'vegetables', 'butter', 'lemon', 'herbs']
  },
  {
    id: 'main2',
    name: 'Ribeye Steak',
    description: '12oz ribeye with garlic mashed potatoes and seasonal vegetables',
    price: 35.00,
    category: 'mains',
    muxPlaybackId: 'mux_demo_steak_002',
    posterUrl: 'https://via.placeholder.com/800x600?text=Ribeye+Steak',
    allergens: ['dairy'],
    dietary: ['gluten-free'],
    preparationTime: 22,
    isAvailable: true,
    ingredients: ['ribeye', 'potatoes', 'garlic', 'butter', 'vegetables']
  },
  {
    id: 'main3',
    name: 'Mushroom Risotto',
    description: 'Creamy arborio rice with mixed mushrooms and parmesan',
    price: 24.00,
    category: 'mains',
    muxPlaybackId: 'mux_demo_risotto_003',
    posterUrl: 'https://via.placeholder.com/800x600?text=Mushroom+Risotto',
    allergens: ['dairy'],
    dietary: ['vegetarian', 'gluten-free'],
    preparationTime: 20,
    isAvailable: true,
    ingredients: ['arborio rice', 'mushrooms', 'parmesan', 'white wine', 'herbs']
  },
  
  // Desserts
  {
    id: 'dess1',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone',
    price: 9.50,
    category: 'desserts',
    muxPlaybackId: 'mux_demo_tiramisu_004',
    posterUrl: 'https://via.placeholder.com/800x600?text=Tiramisu',
    allergens: ['dairy', 'eggs', 'gluten'],
    dietary: ['vegetarian'],
    preparationTime: 5,
    isAvailable: true,
    ingredients: ['mascarpone', 'ladyfingers', 'espresso', 'cocoa', 'eggs']
  },
  
  // Beverages
  {
    id: 'bev1',
    name: 'House Wine (Red)',
    description: 'Our signature red wine blend',
    price: 8.00,
    category: 'beverages',
    allergens: ['sulfites'],
    dietary: ['vegan'],
    preparationTime: 2,
    isAvailable: true,
    ingredients: ['red wine']
  },
  {
    id: 'bev2',
    name: 'Craft Beer',
    description: 'Local brewery selection',
    price: 6.50,
    category: 'beverages',
    allergens: ['gluten'],
    dietary: [],
    preparationTime: 2,
    isAvailable: true,
    ingredients: ['beer']
  }
]

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>([])
  const [menu] = useState<MenuItem[]>(mockMenu)

  // Load orders from localStorage on component mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('splitease_orders')
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt),
          estimatedReadyTime: order.estimatedReadyTime ? new Date(order.estimatedReadyTime) : undefined,
          actualReadyTime: order.actualReadyTime ? new Date(order.actualReadyTime) : undefined,
          servedAt: order.servedAt ? new Date(order.servedAt) : undefined,
        }))
        setOrders(parsedOrders)
      } catch (error) {
        console.error('Failed to load orders from localStorage:', error)
        // Generate some mock orders for demo if loading fails
        generateMockOrders()
      }
    } else {
      // Generate some mock orders for demo if no saved orders
      generateMockOrders()
    }
  }, [])

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem('splitease_orders', JSON.stringify(orders))
    
    // Update kitchen orders
    const kitchenOrdersFromOrders = orders
      .filter(order => ['confirmed', 'preparing'].includes(order.status))
      .map(order => ({
        orderId: order.id,
        tableNumber: order.tableNumber,
        items: order.items,
        status: order.status,
        priority: order.priority,
        createdAt: order.createdAt,
        estimatedReadyTime: order.estimatedReadyTime,
        waiterId: order.waiterId,
        customerName: order.customerName
      }))
    
    setKitchenOrders(kitchenOrdersFromOrders)
  }, [orders])

  const generateMockOrders = () => {
    const mockOrders: Order[] = [
      {
        id: 'ord1',
        tableNumber: '12',
        customerId: 'cust1',
        waiterId: 'wait1',
        items: [
          {
            id: 'item1',
            menuItem: mockMenu[0], // Bruschetta
            quantity: 1,
            unitPrice: 12.50,
            totalPrice: 12.50,
            specialInstructions: 'Extra basil please'
          },
          {
            id: 'item2',
            menuItem: mockMenu[2], // Grilled Salmon
            quantity: 1,
            unitPrice: 28.00,
            totalPrice: 28.00
          }
        ],
        status: 'preparing',
        priority: 'normal',
        totalAmount: 40.50,
        tax: 3.24,
        serviceCharge: 2.03,
        finalAmount: 45.77,
        createdAt: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
        updatedAt: new Date(Date.now() - 15 * 60 * 1000),
        estimatedReadyTime: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        customerName: 'John Smith',
        phoneNumber: '+1-555-0123'
      },
      {
        id: 'ord2',
        tableNumber: '7',
        customerId: 'cust2',
        waiterId: 'wait1',
        items: [
          {
            id: 'item3',
            menuItem: mockMenu[3], // Ribeye Steak
            quantity: 2,
            unitPrice: 35.00,
            totalPrice: 70.00,
            specialInstructions: 'Medium rare, both steaks'
          }
        ],
        status: 'confirmed',
        priority: 'high',
        totalAmount: 70.00,
        tax: 5.60,
        serviceCharge: 3.50,
        finalAmount: 79.10,
        createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        updatedAt: new Date(Date.now() - 5 * 60 * 1000),
        estimatedReadyTime: new Date(Date.now() + 25 * 60 * 1000), // 25 minutes from now
        customerName: 'Sarah Johnson'
      }
    ]

    setOrders(mockOrders)
  }

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date()
    
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: now,
      updatedAt: now
    }

    setOrders(prev => [...prev, newOrder])
    return orderId
  }

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status, updatedAt: new Date() }
        
        // Set timestamps based on status
        if (status === 'ready' && !order.actualReadyTime) {
          updatedOrder.actualReadyTime = new Date()
        } else if (status === 'served' && !order.servedAt) {
          updatedOrder.servedAt = new Date()
        }
        
        return updatedOrder
      }
      return order
    }))
    return true
  }

  const updateOrderPriority = async (orderId: string, priority: OrderPriority): Promise<boolean> => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, priority, updatedAt: new Date() }
        : order
    ))
    return true
  }

  const addItemToOrder = async (orderId: string, item: OrderItem): Promise<boolean> => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedItems = [...order.items, item]
        const totals = calculateOrderTotal(updatedItems)
        return {
          ...order,
          items: updatedItems,
          totalAmount: totals.subtotal,
          tax: totals.tax,
          serviceCharge: totals.serviceCharge,
          finalAmount: totals.total,
          updatedAt: new Date()
        }
      }
      return order
    }))
    return true
  }

  const removeItemFromOrder = async (orderId: string, itemId: string): Promise<boolean> => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.filter(item => item.id !== itemId)
        const totals = calculateOrderTotal(updatedItems)
        return {
          ...order,
          items: updatedItems,
          totalAmount: totals.subtotal,
          tax: totals.tax,
          serviceCharge: totals.serviceCharge,
          finalAmount: totals.total,
          updatedAt: new Date()
        }
      }
      return order
    }))
    return true
  }

  const cancelOrder = async (orderId: string, reason?: string): Promise<boolean> => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: 'cancelled', 
            updatedAt: new Date(),
            notes: reason ? `${order.notes || ''}\nCancellation reason: ${reason}`.trim() : order.notes
          }
        : order
    ))
    return true
  }

  const getMenuByCategory = (category: string): MenuItem[] => {
    return menu.filter(item => item.category === category && item.isAvailable)
  }

  const getMenuItem = (itemId: string): MenuItem | undefined => {
    return menu.find(item => item.id === itemId)
  }

  const getKitchenOrders = (): KitchenOrder[] => {
    return kitchenOrders.sort((a, b) => {
      // Sort by priority first, then by creation time
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return a.createdAt.getTime() - b.createdAt.getTime()
    })
  }

  const updateKitchenOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
    return updateOrderStatus(orderId, status)
  }

  const calculateOrderTotal = (items: OrderItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
    const tax = subtotal * 0.08 // 8% tax
    const serviceCharge = subtotal * 0.05 // 5% service charge
    const total = subtotal + tax + serviceCharge
    
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      serviceCharge: Math.round(serviceCharge * 100) / 100,
      total: Math.round(total * 100) / 100
    }
  }

  const getOrdersByTable = (tableNumber: string): Order[] => {
    return orders.filter(order => order.tableNumber === tableNumber)
  }

  const getOrdersByWaiter = (waiterId: string): Order[] => {
    return orders.filter(order => order.waiterId === waiterId)
  }

  const getOrdersByStatus = (status: OrderStatus): Order[] => {
    return orders.filter(order => order.status === status)
  }

  const value: OrderContextType = {
    orders,
    kitchenOrders,
    menu,
    createOrder,
    updateOrderStatus,
    updateOrderPriority,
    addItemToOrder,
    removeItemFromOrder,
    cancelOrder,
    getMenuByCategory,
    getMenuItem,
    getKitchenOrders,
    updateKitchenOrderStatus,
    calculateOrderTotal,
    getOrdersByTable,
    getOrdersByWaiter,
    getOrdersByStatus
  }

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider')
  }
  return context
}