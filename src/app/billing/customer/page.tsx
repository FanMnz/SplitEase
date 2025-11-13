'use client'

import { useState, useEffect } from 'react'
import { usePayments, Bill } from '@/contexts/PaymentContext'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import BillDisplay from '@/components/billing/BillDisplay'
import BillSplitter from '@/components/billing/BillSplitter'
import PaymentProcessor from '@/components/billing/PaymentProcessor'
import { 
  CreditCardIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

function CustomerBilling() {
  const { user } = useAuth()
  const { 
    getBillByTable, 
    generateBill,
    processSinglePayment 
  } = usePayments()
  
  const [currentBill, setCurrentBill] = useState<Bill | null>(null)
  const [showSplitter, setShowSplitter] = useState(false)
  const [showPaymentProcessor, setShowPaymentProcessor] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.tableNumber) {
      const bill = getBillByTable(parseInt(user.tableNumber))
      setCurrentBill(bill)
    }
    setLoading(false)
  }, [user?.tableNumber, getBillByTable])

  const handlePayment = async (paymentMethodId: string) => {
    if (!currentBill) return

    try {
      const success = await processSinglePayment(currentBill.id, paymentMethodId)
      if (success) {
        // Refresh bill data
        const updatedBill = getBillByTable(parseInt(user?.tableNumber || '0'))
        setCurrentBill(updatedBill)
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
    // Refresh bill data
    const updatedBill = getBillByTable(parseInt(user?.tableNumber || '0'))
    setCurrentBill(updatedBill)
  }

  const handlePrint = () => {
    if (!currentBill) return
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - Table ${currentBill.tableNumber}</title>
            <style>
              body { 
                font-family: 'Courier New', monospace; 
                padding: 20px; 
                max-width: 400px; 
                margin: 0 auto; 
              }
              .header { text-align: center; margin-bottom: 20px; border-bottom: 2px dashed #000; padding-bottom: 15px; }
              .item { display: flex; justify-content: space-between; margin: 5px 0; }
              .item-name { flex: 1; }
              .item-price { text-align: right; }
              .total-section { border-top: 2px dashed #000; padding-top: 10px; margin-top: 15px; }
              .total { font-weight: bold; font-size: 1.2em; }
              .footer { text-align: center; margin-top: 20px; border-top: 1px dashed #000; padding-top: 15px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>SplitEase Restaurant</h2>
              <p>123 Dining Street, Food City</p>
              <p>Tel: +1 (555) 123-4567</p>
              <p>Table ${currentBill.tableNumber}</p>
              <p>${new Date().toLocaleString()}</p>
            </div>
            
            ${currentBill.items.map(item => `
              <div class="item">
                <span class="item-name">${item.name} x${item.quantity}</span>
                <span class="item-price">€${item.totalPrice.toFixed(2)}</span>
              </div>
            `).join('')}
            
            <div class="total-section">
              <div class="item">
                <span>Subtotal:</span>
                <span>€${currentBill.subtotal.toFixed(2)}</span>
              </div>
              <div class="item">
                <span>Tax (10%):</span>
                <span>€${currentBill.tax.toFixed(2)}</span>
              </div>
              <div class="item">
                <span>Service (12%):</span>
                <span>€${currentBill.serviceCharge.toFixed(2)}</span>
              </div>
              ${currentBill.discount > 0 ? `
                <div class="item">
                  <span>Discount:</span>
                  <span>-€${currentBill.discount.toFixed(2)}</span>
                </div>
              ` : ''}
              <div class="item total">
                <span>TOTAL:</span>
                <span>€${currentBill.total.toFixed(2)}</span>
              </div>
            </div>
            
            <div class="footer">
              <p>Thank you for dining with us!</p>
              <p>Please visit again soon!</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your bill...</p>
        </div>
      </div>
    )
  }

  if (!currentBill) {
    return (
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-neutral-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-2xl font-bold text-neutral-900">Your Bill</h1>
              <div className="text-sm text-neutral-600">
                Table {user?.tableNumber}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <DocumentTextIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-neutral-600 mb-2">No Bill Available</h2>
            <p className="text-neutral-500 mb-6">
              Your bill hasn&apos;t been generated yet. Please complete your orders first, 
              or ask your server to generate the bill.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <h3 className="font-medium text-blue-900">Need Help?</h3>
                  <p className="text-sm text-blue-700">
                    Contact your server or restaurant staff to generate your bill 
                    once you&apos;ve finished ordering.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Your Bill</h1>
              <p className="text-sm text-neutral-600">Table {user?.tableNumber}</p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                currentBill.status === 'paid' 
                  ? 'bg-green-100 text-green-800'
                  : currentBill.status === 'split'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {currentBill.status === 'paid' && <CheckCircleIcon className="w-4 h-4 mr-1" />}
                {currentBill.status === 'split' && <UserGroupIcon className="w-4 h-4 mr-1" />}
                {currentBill.status === 'pending' && <ClockIcon className="w-4 h-4 mr-1" />}
                {currentBill.status === 'paid' ? 'Paid' : 
                 currentBill.status === 'split' ? 'Split Bill' : 'Pending Payment'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        {currentBill.status === 'pending' && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowPaymentProcessor(true)}
                className="flex items-center space-x-2 bg-brand-500 text-white px-6 py-3 rounded-lg hover:bg-brand-600 font-medium"
              >
                <CreditCardIcon className="w-5 h-5" />
                <span>Pay Full Amount</span>
              </button>
              <button
                onClick={() => setShowSplitter(true)}
                className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium"
              >
                <UserGroupIcon className="w-5 h-5" />
                <span>Split Bill</span>
              </button>
            </div>
          </div>
        )}

        {/* Bill Details */}
        <BillDisplay
          bill={currentBill}
          variant="full"
          showActions={false}
          onPayment={handlePayment}
          onSplit={() => setShowSplitter(true)}
          onPrint={handlePrint}
        />

        {/* Payment Instructions */}
        {currentBill.status === 'split' && currentBill.splitDetails && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Split Payment Instructions</h3>
            <div className="space-y-3">
              {currentBill.splitDetails.map((split) => (
                <div key={split.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-900">{split.customerName}</p>
                    <p className="text-sm text-neutral-600">Amount: €{split.amount.toFixed(2)}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    split.status === 'paid' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {split.status === 'paid' ? 'Paid' : 'Pending'}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                Each person should pay their portion individually. You can use any available payment method.
              </p>
            </div>
          </div>
        )}

        {/* Payment Confirmation */}
        {currentBill.status === 'paid' && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-900 mb-2">Payment Complete!</h3>
            <p className="text-green-700 mb-4">
              Thank you for your payment. Your bill has been settled successfully.
            </p>
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <DocumentTextIcon className="w-5 h-5" />
              <span>Print Receipt</span>
            </button>
          </div>
        )}
      </div>

      {/* Bill Splitter Modal */}
      {showSplitter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <BillSplitter
            bill={currentBill}
            onComplete={handleSplitComplete}
            onCancel={() => setShowSplitter(false)}
          />
        </div>
      )}

      {/* Payment Processor Modal */}
      {showPaymentProcessor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <PaymentProcessor
            billId={currentBill.id}
            amount={currentBill.total}
            onSuccess={() => {
              setShowPaymentProcessor(false)
              // Refresh bill data
              const updatedBill = getBillByTable(parseInt(user?.tableNumber || '0'))
              setCurrentBill(updatedBill)
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

export default function ProtectedCustomerBilling() {
  return (
    <ProtectedRoute requiredRole="customer">
      <CustomerBilling />
    </ProtectedRoute>
  )
}