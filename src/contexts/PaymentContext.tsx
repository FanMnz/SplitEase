'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useOrders, Order } from './OrderContext'

export interface PaymentMethod {
  id: string
  type: 'card' | 'cash' | 'digital_wallet' | 'bank_transfer'
  name: string
  icon: string
  isAvailable: boolean
}

export interface SplitOption {
  type: 'equal' | 'by_item' | 'custom' | 'percentage'
  name: string
  description: string
}

export interface BillItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
  orderId: string
  assignedTo?: string
}

export interface Bill {
  id: string
  tableNumber: number
  orderIds: string[]
  items: BillItem[]
  subtotal: number
  tax: number
  serviceCharge: number
  discount: number
  total: number
  status: 'pending' | 'split' | 'paid' | 'refunded'
  paymentMethod?: string
  splitDetails?: SplitDetails[]
  createdAt: Date
  paidAt?: Date
  customerId?: string
  customerName?: string
}

export interface SplitDetails {
  id: string
  customerId: string
  customerName: string
  items: BillItem[]
  amount: number
  paymentMethod?: string
  status: 'pending' | 'paid'
  paidAt?: Date
}

export interface Receipt {
  id: string
  billId: string
  tableNumber: number
  customerName: string
  items: BillItem[]
  subtotal: number
  tax: number
  serviceCharge: number
  discount: number
  total: number
  paymentMethod: string
  transactionId: string
  timestamp: Date
  restaurantInfo: {
    name: string
    address: string
    phone: string
    tax_id: string
  }
}

interface PaymentContextType {
  // Payment Methods
  paymentMethods: PaymentMethod[]
  splitOptions: SplitOption[]
  
  // Bills Management
  bills: Bill[]
  currentBill: Bill | null
  
  // Bill Operations
  generateBill: (tableNumber: number, orderIds: string[]) => Promise<string>
  getBillByTable: (tableNumber: number) => Bill | null
  getBillById: (billId: string) => Bill | null
  updateBillStatus: (billId: string, status: Bill['status']) => void
  
  // Payment Processing
  processSinglePayment: (billId: string, paymentMethod: string) => Promise<boolean>
  
  // Bill Splitting
  initiateBillSplit: (billId: string, splitType: SplitOption['type']) => void
  updateSplitAssignment: (billId: string, itemId: string, customerId: string) => void
  finalizeSplit: (billId: string) => Promise<boolean>
  processSplitPayment: (billId: string, splitId: string, paymentMethod: string) => Promise<boolean>
  
  // Receipt Generation
  generateReceipt: (billId: string, splitId?: string) => Receipt
  
  // Discounts and Adjustments
  applyDiscount: (billId: string, discountAmount: number) => void
  
  // Analytics
  getDailyRevenue: () => number
  getPaymentMethodStats: () => { method: string; count: number; amount: number }[]
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const { orders, getOrdersByTable } = useOrders()
  const [bills, setBills] = useState<Bill[]>([])
  const [currentBill, setCurrentBill] = useState<Bill | null>(null)

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      type: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      isAvailable: true
    },
    {
      id: 'cash',
      type: 'cash',
      name: 'Cash',
      icon: '💵',
      isAvailable: true
    },
    {
      id: 'apple_pay',
      type: 'digital_wallet',
      name: 'Apple Pay',
      icon: '📱',
      isAvailable: true
    },
    {
      id: 'google_pay',
      type: 'digital_wallet',
      name: 'Google Pay',
      icon: '📱',
      isAvailable: true
    },
    {
      id: 'bank_transfer',
      type: 'bank_transfer',
      name: 'Bank Transfer',
      icon: '🏦',
      isAvailable: true
    }
  ]

  const splitOptions: SplitOption[] = [
    {
      type: 'equal',
      name: 'Split Equally',
      description: 'Divide the total amount equally among all customers'
    },
    {
      type: 'by_item',
      name: 'Split by Items',
      description: 'Each customer pays for their own items'
    },
    {
      type: 'custom',
      name: 'Custom Split',
      description: 'Manually assign amounts to each customer'
    },
    {
      type: 'percentage',
      name: 'Percentage Split',
      description: 'Split by percentage for each customer'
    }
  ]

  // Load bills from localStorage on mount
  useEffect(() => {
    try {
      const savedBills = localStorage.getItem('splitease_bills')
      if (savedBills) {
        const parsedBills = JSON.parse(savedBills).map((bill: any) => ({
          ...bill,
          createdAt: new Date(bill.createdAt),
          paidAt: bill.paidAt ? new Date(bill.paidAt) : undefined
        }))
        setBills(parsedBills)
      }
    } catch (error) {
      console.error('Error loading bills:', error)
    }
  }, [])

  // Save bills to localStorage whenever bills change
  useEffect(() => {
    try {
      localStorage.setItem('splitease_bills', JSON.stringify(bills))
    } catch (error) {
      console.error('Error saving bills:', error)
    }
  }, [bills])

  const generateBill = async (tableNumber: number, orderIds: string[]): Promise<string> => {
    const tableOrders = orders.filter(order => 
      orderIds.includes(order.id) && order.tableNumber === tableNumber.toString()
    )

    if (tableOrders.length === 0) {
      throw new Error('No orders found for this table')
    }

    const billItems: BillItem[] = []
    
    tableOrders.forEach(order => {
      order.items.forEach(item => {
        billItems.push({
          id: `${order.id}-${item.id}`,
          name: item.menuItem.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          orderId: order.id,
          assignedTo: order.customerId
        })
      })
    })

    const subtotal = billItems.reduce((sum, item) => sum + item.totalPrice, 0)
    const tax = subtotal * 0.1 // 10% tax
    const serviceCharge = subtotal * 0.12 // 12% service charge
    const total = subtotal + tax + serviceCharge

    const newBill: Bill = {
      id: `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tableNumber,
      orderIds,
      items: billItems,
      subtotal,
      tax,
      serviceCharge,
      discount: 0,
      total,
      status: 'pending',
      createdAt: new Date(),
      customerId: tableOrders[0].customerId,
      customerName: tableOrders[0].customerName
    }

    setBills(prev => [...prev, newBill])
    setCurrentBill(newBill)
    
    return newBill.id
  }

  const getBillByTable = (tableNumber: number): Bill | null => {
    return bills.find(bill => 
      bill.tableNumber === tableNumber && 
      bill.status !== 'paid'
    ) || null
  }

  const getBillById = (billId: string): Bill | null => {
    return bills.find(bill => bill.id === billId) || null
  }

  const updateBillStatus = (billId: string, status: Bill['status']) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId 
        ? { ...bill, status, paidAt: status === 'paid' ? new Date() : bill.paidAt }
        : bill
    ))
  }

  const processSinglePayment = async (billId: string, paymentMethod: string): Promise<boolean> => {
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, this would integrate with payment processors
      const success = Math.random() > 0.1 // 90% success rate
      
      if (success) {
        setBills(prev => prev.map(bill => 
          bill.id === billId 
            ? { 
                ...bill, 
                status: 'paid', 
                paymentMethod,
                paidAt: new Date() 
              }
            : bill
        ))
      }
      
      return success
    } catch (error) {
      console.error('Payment processing error:', error)
      return false
    }
  }

  const initiateBillSplit = (billId: string, splitType: SplitOption['type']) => {
    const bill = getBillById(billId)
    if (!bill) return

    let splitDetails: SplitDetails[] = []

    if (splitType === 'equal') {
      // For demo, assume 2 customers for equal split
      const amountPerPerson = bill.total / 2
      splitDetails = [
        {
          id: 'split_1',
          customerId: 'customer_1',
          customerName: 'Customer 1',
          items: bill.items.slice(0, Math.ceil(bill.items.length / 2)),
          amount: amountPerPerson,
          status: 'pending'
        },
        {
          id: 'split_2',
          customerId: 'customer_2',
          customerName: 'Customer 2',
          items: bill.items.slice(Math.ceil(bill.items.length / 2)),
          amount: amountPerPerson,
          status: 'pending'
        }
      ]
    } else if (splitType === 'by_item') {
      // Group items by customer
      const itemsByCustomer = bill.items.reduce((acc, item) => {
        const customerId = item.assignedTo || 'unassigned'
        if (!acc[customerId]) {
          acc[customerId] = []
        }
        acc[customerId].push(item)
        return acc
      }, {} as Record<string, BillItem[]>)

      splitDetails = Object.entries(itemsByCustomer).map(([customerId, items], index) => ({
        id: `split_${index + 1}`,
        customerId,
        customerName: `Customer ${index + 1}`,
        items,
        amount: items.reduce((sum, item) => sum + item.totalPrice, 0),
        status: 'pending' as const
      }))
    }

    setBills(prev => prev.map(bill => 
      bill.id === billId 
        ? { ...bill, status: 'split', splitDetails }
        : bill
    ))
  }

  const updateSplitAssignment = (billId: string, itemId: string, customerId: string) => {
    setBills(prev => prev.map(bill => {
      if (bill.id === billId && bill.splitDetails) {
        const updatedSplitDetails = bill.splitDetails.map(split => {
          // Remove item from all splits first
          const itemsWithoutTarget = split.items.filter(item => item.id !== itemId)
          
          if (split.customerId === customerId) {
            // Add item to target customer's split
            const targetItem = bill.items.find(item => item.id === itemId)
            if (targetItem) {
              const updatedItems = [...itemsWithoutTarget, { ...targetItem, assignedTo: customerId }]
              return {
                ...split,
                items: updatedItems,
                amount: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)
              }
            }
          }
          
          return {
            ...split,
            items: itemsWithoutTarget,
            amount: itemsWithoutTarget.reduce((sum, item) => sum + item.totalPrice, 0)
          }
        })
        
        return { ...bill, splitDetails: updatedSplitDetails }
      }
      return bill
    }))
  }

  const finalizeSplit = async (billId: string): Promise<boolean> => {
    const bill = getBillById(billId)
    if (!bill || !bill.splitDetails) return false

    // Validate that all items are assigned
    const totalAssignedAmount = bill.splitDetails.reduce((sum, split) => sum + split.amount, 0)
    if (Math.abs(totalAssignedAmount - bill.total) > 0.01) {
      return false // Amounts don't match
    }

    return true
  }

  const processSplitPayment = async (billId: string, splitId: string, paymentMethod: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const success = Math.random() > 0.1 // 90% success rate
      
      if (success) {
        setBills(prev => prev.map(bill => {
          if (bill.id === billId && bill.splitDetails) {
            const updatedSplitDetails = bill.splitDetails.map(split => 
              split.id === splitId 
                ? { ...split, status: 'paid' as const, paymentMethod, paidAt: new Date() }
                : split
            )
            
            // Check if all splits are paid
            const allPaid = updatedSplitDetails.every(split => split.status === 'paid')
            
            return {
              ...bill,
              splitDetails: updatedSplitDetails,
              status: allPaid ? 'paid' as const : bill.status,
              paidAt: allPaid ? new Date() : bill.paidAt
            }
          }
          return bill
        }))
      }
      
      return success
    } catch (error) {
      console.error('Split payment processing error:', error)
      return false
    }
  }

  const generateReceipt = (billId: string, splitId?: string): Receipt => {
    const bill = getBillById(billId)
    if (!bill) throw new Error('Bill not found')

    let receiptItems = bill.items
    let receiptTotal = bill.total
    let customerName = bill.customerName || 'Customer'

    if (splitId && bill.splitDetails) {
      const split = bill.splitDetails.find(s => s.id === splitId)
      if (split) {
        receiptItems = split.items
        receiptTotal = split.amount
        customerName = split.customerName
      }
    }

    return {
      id: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      billId,
      tableNumber: bill.tableNumber,
      customerName,
      items: receiptItems,
      subtotal: bill.subtotal,
      tax: bill.tax,
      serviceCharge: bill.serviceCharge,
      discount: bill.discount,
      total: receiptTotal,
      paymentMethod: bill.paymentMethod || 'Unknown',
      transactionId: `TXN_${Date.now()}`,
      timestamp: new Date(),
      restaurantInfo: {
        name: 'SplitEase Restaurant',
        address: '123 Dining Street, Food City, FC 12345',
        phone: '+1 (555) 123-4567',
        tax_id: 'TAX123456789'
      }
    }
  }

  const applyDiscount = (billId: string, discountAmount: number) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId 
        ? { 
            ...bill, 
            discount: discountAmount,
            total: Math.max(0, bill.subtotal + bill.tax + bill.serviceCharge - discountAmount)
          }
        : bill
    ))
  }

  const getDailyRevenue = (): number => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return bills
      .filter(bill => 
        bill.status === 'paid' && 
        bill.paidAt && 
        bill.paidAt >= today
      )
      .reduce((sum, bill) => sum + bill.total, 0)
  }

  const getPaymentMethodStats = () => {
    const stats = paymentMethods.map(method => ({
      method: method.name,
      count: 0,
      amount: 0
    }))

    bills
      .filter(bill => bill.status === 'paid' && bill.paymentMethod)
      .forEach(bill => {
        const methodStat = stats.find(s => 
          s.method === paymentMethods.find(m => m.id === bill.paymentMethod)?.name
        )
        if (methodStat) {
          methodStat.count++
          methodStat.amount += bill.total
        }
      })

    return stats.filter(stat => stat.count > 0)
  }

  const value: PaymentContextType = {
    paymentMethods,
    splitOptions,
    bills,
    currentBill,
    generateBill,
    getBillByTable,
    getBillById,
    updateBillStatus,
    processSinglePayment,
    initiateBillSplit,
    updateSplitAssignment,
    finalizeSplit,
    processSplitPayment,
    generateReceipt,
    applyDiscount,
    getDailyRevenue,
    getPaymentMethodStats
  }

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  )
}

export function usePayments() {
  const context = useContext(PaymentContext)
  if (context === undefined) {
    throw new Error('usePayments must be used within a PaymentProvider')
  }
  return context
}