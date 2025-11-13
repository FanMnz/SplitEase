'use client'

import { useState } from 'react'
import { usePayments, Bill, SplitDetails } from '@/contexts/PaymentContext'
import { 
  CreditCardIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PrinterIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

interface BillDisplayProps {
  bill: Bill
  onPayment?: (paymentMethod: string) => void
  onSplit?: () => void
  onPrint?: () => void
  showActions?: boolean
  variant?: 'full' | 'compact' | 'receipt'
}

export default function BillDisplay({
  bill,
  onPayment,
  onSplit,
  onPrint,
  showActions = true,
  variant = 'full'
}: BillDisplayProps) {
  const { paymentMethods } = usePayments()
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)

  const getStatusIcon = (status: Bill['status']) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-orange-500" />
      case 'split':
        return <UserGroupIcon className="w-5 h-5 text-blue-500" />
      case 'paid':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'refunded':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: Bill['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending Payment'
      case 'split':
        return 'Split Bill'
      case 'paid':
        return 'Paid'
      case 'refunded':
        return 'Refunded'
      default:
        return 'Unknown'
    }
  }

  const getStatusColor = (status: Bill['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      case 'split':
        return 'bg-blue-100 text-blue-800'
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'refunded':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-neutral-900">Table {bill.tableNumber}</h3>
            <p className="text-sm text-neutral-600">{bill.items.length} items</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-neutral-900">€{bill.total.toFixed(2)}</p>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
              {getStatusIcon(bill.status)}
              <span className="ml-1">{getStatusText(bill.status)}</span>
            </div>
          </div>
        </div>
        
        {showActions && bill.status === 'pending' && (
          <div className="flex space-x-2">
            <button
              onClick={() => setShowPaymentMethods(true)}
              className="flex-1 bg-brand-500 text-white py-2 px-4 rounded-lg hover:bg-brand-600 text-sm font-medium"
            >
              Pay Bill
            </button>
            <button
              onClick={onSplit}
              className="flex-1 bg-neutral-100 text-neutral-700 py-2 px-4 rounded-lg hover:bg-neutral-200 text-sm font-medium"
            >
              Split Bill
            </button>
          </div>
        )}
      </div>
    )
  }

  if (variant === 'receipt') {
    return (
      <div className="bg-white p-6 max-w-sm mx-auto" style={{ fontFamily: 'monospace' }}>
        <div className="text-center mb-4">
          <h2 className="font-bold text-lg">SplitEase Restaurant</h2>
          <p className="text-sm text-neutral-600">123 Dining Street</p>
          <p className="text-sm text-neutral-600">Food City, FC 12345</p>
          <p className="text-sm text-neutral-600">Tel: +1 (555) 123-4567</p>
        </div>
        
        <div className="border-t border-b border-dashed border-neutral-300 py-3 mb-4">
          <div className="flex justify-between text-sm">
            <span>Table:</span>
            <span>{bill.tableNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Date:</span>
            <span>{bill.createdAt.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Time:</span>
            <span>{bill.createdAt.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="space-y-1 mb-4">
          {bill.items.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span>€{item.totalPrice.toFixed(2)}</span>
              </div>
              <div className="text-xs text-neutral-500 ml-2">
                {item.quantity} x €{item.unitPrice.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-neutral-300 pt-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>€{bill.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (10%):</span>
            <span>€{bill.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Service (12%):</span>
            <span>€{bill.serviceCharge.toFixed(2)}</span>
          </div>
          {bill.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount:</span>
              <span>-€{bill.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t border-dashed border-neutral-300 pt-2">
            <span>TOTAL:</span>
            <span>€{bill.total.toFixed(2)}</span>
          </div>
        </div>

        {bill.paymentMethod && (
          <div className="mt-4 text-center">
            <p className="text-sm text-neutral-600">
              Paid via {paymentMethods.find(m => m.id === bill.paymentMethod)?.name}
            </p>
            <p className="text-xs text-neutral-500">
              Transaction ID: TXN_{bill.id.slice(-8)}
            </p>
          </div>
        )}

        <div className="text-center mt-6 text-xs text-neutral-500">
          <p>Thank you for dining with us!</p>
          <p>Visit again soon!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Bill #{bill.id.slice(-8)}</h2>
          <p className="text-neutral-600">Table {bill.tableNumber}</p>
          {bill.customerName && (
            <p className="text-sm text-neutral-500">{bill.customerName}</p>
          )}
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(bill.status)}`}>
            {getStatusIcon(bill.status)}
            <span className="ml-2">{getStatusText(bill.status)}</span>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Created: {bill.createdAt.toLocaleDateString()} {bill.createdAt.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-3">Order Items</h3>
        <div className="space-y-3">
          {bill.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-neutral-900">{item.name}</h4>
                <p className="text-sm text-neutral-600">
                  {item.quantity} × €{item.unitPrice.toFixed(2)}
                </p>
                {item.assignedTo && (
                  <p className="text-xs text-blue-600">Assigned to: {item.assignedTo}</p>
                )}
              </div>
              <div className="text-right">
                <span className="font-semibold text-neutral-900">€{item.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Split Details */}
      {bill.status === 'split' && bill.splitDetails && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-3">Split Details</h3>
          <div className="space-y-3">
            {bill.splitDetails.map((split) => (
              <div key={split.id} className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-neutral-900">{split.customerName}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-neutral-900">€{split.amount.toFixed(2)}</span>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      split.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {split.status === 'paid' ? 'Paid' : 'Pending'}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-neutral-600">
                  {split.items.length} items • {split.paymentMethod || 'Payment method not selected'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bill Summary */}
      <div className="bg-neutral-50 rounded-lg p-4 mb-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Subtotal:</span>
            <span className="text-neutral-900">€{bill.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Tax (10%):</span>
            <span className="text-neutral-900">€{bill.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Service Charge (12%):</span>
            <span className="text-neutral-900">€{bill.serviceCharge.toFixed(2)}</span>
          </div>
          {bill.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Discount:</span>
              <span className="text-green-600">-€{bill.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-neutral-200 pt-2">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-neutral-900">Total:</span>
              <span className="text-2xl font-bold text-neutral-900">€{bill.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex flex-wrap gap-3">
          {bill.status === 'pending' && (
            <>
              <button
                onClick={() => setShowPaymentMethods(true)}
                className="flex items-center space-x-2 bg-brand-500 text-white px-6 py-3 rounded-lg hover:bg-brand-600 font-medium"
              >
                <CreditCardIcon className="w-5 h-5" />
                <span>Pay Full Amount</span>
              </button>
              <button
                onClick={onSplit}
                className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium"
              >
                <UserGroupIcon className="w-5 h-5" />
                <span>Split Bill</span>
              </button>
            </>
          )}
          
          {bill.status === 'paid' && (
            <button
              onClick={onPrint}
              className="flex items-center space-x-2 bg-neutral-500 text-white px-6 py-3 rounded-lg hover:bg-neutral-600 font-medium"
            >
              <PrinterIcon className="w-5 h-5" />
              <span>Print Receipt</span>
            </button>
          )}

          <button
            onClick={onPrint}
            className="flex items-center space-x-2 bg-neutral-100 text-neutral-700 px-6 py-3 rounded-lg hover:bg-neutral-200 font-medium"
          >
            <DocumentTextIcon className="w-5 h-5" />
            <span>View Receipt</span>
          </button>
        </div>
      )}

      {/* Payment Methods Modal */}
      {showPaymentMethods && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Select Payment Method</h3>
            <div className="space-y-3">
              {paymentMethods.filter(method => method.isAvailable).map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    onPayment?.(method.id)
                    setShowPaymentMethods(false)
                  }}
                  className="w-full flex items-center space-x-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
                >
                  <span className="text-2xl">{method.icon}</span>
                  <div className="text-left">
                    <p className="font-medium text-neutral-900">{method.name}</p>
                    <p className="text-sm text-neutral-600">{method.type.replace('_', ' ')}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPaymentMethods(false)}
              className="w-full mt-4 py-2 px-4 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}