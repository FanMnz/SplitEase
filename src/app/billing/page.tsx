'use client'

import { useState, useEffect } from 'react'
import { usePayments, Bill } from '@/contexts/PaymentContext'
import { useOrders } from '@/contexts/OrderContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import BillDisplay from '@/components/billing/BillDisplay'
import BillSplitter from '@/components/billing/BillSplitter'
import PaymentProcessor from '@/components/billing/PaymentProcessor'
import { 
  CreditCardIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ChartBarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'

function BillingDashboard() {
  const { 
    bills, 
    generateBill, 
    getDailyRevenue, 
    getPaymentMethodStats,
    processSinglePayment
  } = usePayments()
  
  const { orders } = useOrders()
  
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
  const [showSplitter, setShowSplitter] = useState(false)
  const [showPaymentProcessor, setShowPaymentProcessor] = useState(false)
  const [viewMode, setViewMode] = useState<'all' | 'pending' | 'paid' | 'split'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateBill, setShowCreateBill] = useState(false)
  const [newBillTable, setNewBillTable] = useState('')

  const dailyRevenue = getDailyRevenue()
  const paymentStats = getPaymentMethodStats()

  const filteredBills = bills.filter(bill => {
    const matchesSearch = searchTerm === '' || 
      bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.tableNumber.toString().includes(searchTerm) ||
      bill.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = viewMode === 'all' || bill.status === viewMode
    
    return matchesSearch && matchesStatus
  })

  const handleGenerateBill = async () => {
    if (!newBillTable) return

    const tableNumber = parseInt(newBillTable)
    const tableOrders = orders.filter(order => 
      order.tableNumber === tableNumber.toString() && 
      (order.status === 'served' || order.status === 'ready')
    )

    if (tableOrders.length === 0) {
      alert('No completed orders found for this table')
      return
    }

    try {
      const billId = await generateBill(tableNumber, tableOrders.map(o => o.id))
      setNewBillTable('')
      setShowCreateBill(false)
      alert('Bill generated successfully!')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to generate bill')
    }
  }

  const handlePayment = async (paymentMethodId: string) => {
    if (!selectedBill) return

    try {
      const success = await processSinglePayment(selectedBill.id, paymentMethodId)
      if (success) {
        setSelectedBill(null)
        alert('Payment processed successfully!')
      } else {
        alert('Payment failed. Please try again.')
      }
    } catch (error) {
      alert('Payment processing error')
    }
  }

  const handleSplitComplete = () => {
    setShowSplitter(false)
    setSelectedBill(null)
  }

  const handlePrint = (bill: Bill) => {
    // In a real app, this would integrate with a receipt printer
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - Bill #${bill.id.slice(-8)}</title>
            <style>
              body { font-family: monospace; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .item { display: flex; justify-content: space-between; margin: 5px 0; }
              .total { border-top: 1px solid #000; padding-top: 10px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>SplitEase Restaurant</h2>
              <p>Table ${bill.tableNumber}</p>
              <p>${new Date().toLocaleString()}</p>
            </div>
            ${bill.items.map(item => `
              <div class="item">
                <span>${item.name} x${item.quantity}</span>
                <span>€${item.totalPrice.toFixed(2)}</span>
              </div>
            `).join('')}
            <div class="total">
              <div class="item">
                <span>Total:</span>
                <span>€${bill.total.toFixed(2)}</span>
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-neutral-900">Billing & Payments</h1>
            <button
              onClick={() => setShowCreateBill(true)}
              className="flex items-center space-x-2 bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Generate Bill</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-600">Daily Revenue</p>
                <p className="text-3xl font-bold text-neutral-900">€{dailyRevenue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BanknotesIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-600">Total Bills</p>
                <p className="text-3xl font-bold text-neutral-900">{bills.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-600">Pending Payments</p>
                <p className="text-3xl font-bold text-neutral-900">
                  {bills.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CreditCardIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-600">Split Bills</p>
                <p className="text-3xl font-bold text-neutral-900">
                  {bills.filter(b => b.status === 'split').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ReceiptPercentIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Stats */}
        {paymentStats.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Payment Methods Today</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentStats.map((stat, index) => (
                <div key={index} className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-neutral-900">{stat.method}</span>
                    <span className="text-sm text-neutral-500">{stat.count} transactions</span>
                  </div>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">€{stat.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search bills by ID, table, or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              {['all', 'pending', 'paid', 'split'].map((status) => (
                <button
                  key={status}
                  onClick={() => setViewMode(status as typeof viewMode)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === status
                      ? 'bg-brand-500 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bills List */}
        <div className="space-y-6">
          {filteredBills.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-600 mb-2">No bills found</h3>
              <p className="text-neutral-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Generate a bill to get started'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBills.map((bill) => (
                <BillDisplay
                  key={bill.id}
                  bill={bill}
                  variant="compact"
                  onPayment={(method) => {
                    setSelectedBill(bill)
                    handlePayment(method)
                  }}
                  onSplit={() => {
                    setSelectedBill(bill)
                    setShowSplitter(true)
                  }}
                  onPrint={() => handlePrint(bill)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Bill Modal */}
      {showCreateBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Generate New Bill</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Table Number
              </label>
              <input
                type="number"
                value={newBillTable}
                onChange={(e) => setNewBillTable(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Enter table number"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCreateBill(false)
                  setNewBillTable('')
                }}
                className="flex-1 py-2 px-4 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateBill}
                className="flex-1 py-2 px-4 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bill Splitter Modal */}
      {showSplitter && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <BillSplitter
            bill={selectedBill}
            onComplete={handleSplitComplete}
            onCancel={() => setShowSplitter(false)}
          />
        </div>
      )}

      {/* Payment Processor Modal */}
      {showPaymentProcessor && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <PaymentProcessor
            billId={selectedBill.id}
            amount={selectedBill.total}
            onSuccess={() => {
              setShowPaymentProcessor(false)
              setSelectedBill(null)
            }}
            onFailure={() => {
              setShowPaymentProcessor(false)
            }}
            onCancel={() => setShowPaymentProcessor(false)}
          />
        </div>
      )}
    </div>
  )
}

export default function ProtectedBillingDashboard() {
  return (
    <ProtectedRoute requiredRole="manager">
      <BillingDashboard />
    </ProtectedRoute>
  )
}