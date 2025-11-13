'use client'

import { useState } from 'react'
import { usePayments, PaymentMethod } from '@/contexts/PaymentContext'
import { 
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface PaymentProcessorProps {
  billId: string
  amount: number
  onSuccess?: (transactionId: string) => void
  onFailure?: (error: string) => void
  onCancel?: () => void
}

interface CardDetails {
  number: string
  expiry: string
  cvv: string
  name: string
}

export default function PaymentProcessor({
  billId,
  amount,
  onSuccess,
  onFailure,
  onCancel
}: PaymentProcessorProps) {
  const { paymentMethods, processSinglePayment } = usePayments()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [processing, setProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'select' | 'details' | 'processing' | 'result'>('select')
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })
  const [paymentResult, setPaymentResult] = useState<'success' | 'failed' | null>(null)
  const [transactionId, setTransactionId] = useState<string>('')

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method)
    
    if (method.type === 'cash') {
      // Cash payments are processed immediately
      processPayment(method)
    } else if (method.type === 'digital_wallet') {
      // Digital wallets skip details entry
      setPaymentStep('processing')
      processPayment(method)
    } else {
      setPaymentStep('details')
    }
  }

  const processPayment = async (method: PaymentMethod) => {
    setProcessing(true)
    setPaymentStep('processing')
    
    try {
      const success = await processSinglePayment(billId, method.id)
      const txnId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      if (success) {
        setPaymentResult('success')
        setTransactionId(txnId)
        setTimeout(() => {
          onSuccess?.(txnId)
        }, 2000)
      } else {
        setPaymentResult('failed')
        setTimeout(() => {
          onFailure?.('Payment processing failed. Please try again.')
        }, 2000)
      }
    } catch (error) {
      setPaymentResult('failed')
      setTimeout(() => {
        onFailure?.(error instanceof Error ? error.message : 'An unexpected error occurred')
      }, 2000)
    }
    
    setProcessing(false)
    setPaymentStep('result')
  }

  const handleCardPayment = () => {
    if (!selectedMethod || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
      alert('Please fill in all card details')
      return
    }
    
    processPayment(selectedMethod)
  }

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method.type) {
      case 'card':
        return <CreditCardIcon className="w-8 h-8" />
      case 'cash':
        return <BanknotesIcon className="w-8 h-8" />
      case 'digital_wallet':
        return <DevicePhoneMobileIcon className="w-8 h-8" />
      case 'bank_transfer':
        return <BuildingLibraryIcon className="w-8 h-8" />
      default:
        return <CreditCardIcon className="w-8 h-8" />
    }
  }

  if (paymentStep === 'select') {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 max-w-md mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Payment</h2>
          <p className="text-neutral-600">Amount to pay: <span className="font-bold text-brand-600">€{amount.toFixed(2)}</span></p>
        </div>

        <div className="space-y-3">
          {paymentMethods.filter(method => method.isAvailable).map((method) => (
            <button
              key={method.id}
              onClick={() => handleMethodSelect(method)}
              className="w-full flex items-center space-x-4 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-brand-300 transition-colors"
            >
              <div className="text-brand-500">
                {getMethodIcon(method)}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-neutral-900">{method.name}</p>
                <p className="text-sm text-neutral-600 capitalize">{method.type.replace('_', ' ')}</p>
              </div>
              <span className="text-2xl">{method.icon}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onCancel}
          className="w-full mt-4 py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 font-medium"
        >
          Cancel
        </button>
      </div>
    )
  }

  if (paymentStep === 'details' && selectedMethod?.type === 'card') {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 max-w-md mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Card Details</h2>
          <p className="text-neutral-600">Enter your card information</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Card Number
            </label>
            <input
              type="text"
              value={cardDetails.number}
              onChange={(e) => setCardDetails(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full px-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                placeholder="123"
                maxLength={4}
                className="w-full px-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardDetails.name}
              onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
              placeholder="John Doe"
              className="w-full px-3 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-neutral-600">
            <ShieldCheckIcon className="w-5 h-5" />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => setPaymentStep('select')}
            className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 font-medium"
          >
            Back
          </button>
          <button
            onClick={handleCardPayment}
            className="flex-1 py-3 px-4 bg-brand-500 text-white rounded-lg hover:bg-brand-600 font-medium"
          >
            Pay €{amount.toFixed(2)}
          </button>
        </div>
      </div>
    )
  }

  if (paymentStep === 'details' && selectedMethod?.type === 'bank_transfer') {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 max-w-md mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Bank Transfer</h2>
          <p className="text-neutral-600">Transfer details</p>
        </div>

        <div className="space-y-4 bg-neutral-50 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-neutral-700">Account Name</label>
            <p className="font-mono text-sm">SplitEase Restaurant Ltd</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Account Number</label>
            <p className="font-mono text-sm">1234567890</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Sort Code</label>
            <p className="font-mono text-sm">12-34-56</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Reference</label>
            <p className="font-mono text-sm">BILL_{billId.slice(-8)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Amount</label>
            <p className="font-mono text-lg font-bold text-brand-600">€{amount.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Please use the reference number when making the transfer. Payment confirmation may take 1-3 business days.
          </p>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => setPaymentStep('select')}
            className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 font-medium"
          >
            Back
          </button>
          <button
            onClick={() => processPayment(selectedMethod!)}
            className="flex-1 py-3 px-4 bg-brand-500 text-white rounded-lg hover:bg-brand-600 font-medium"
          >
            Confirm Transfer
          </button>
        </div>
      </div>
    )
  }

  if (paymentStep === 'processing') {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 max-w-md mx-auto">
        <div className="text-center">
          <div className="mb-6">
            <ArrowPathIcon className="w-16 h-16 text-brand-500 animate-spin mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Processing Payment</h2>
          <p className="text-neutral-600">Please wait while we process your payment...</p>
          <p className="text-sm text-neutral-500 mt-2">
            Processing €{amount.toFixed(2)} via {selectedMethod?.name}
          </p>
        </div>
      </div>
    )
  }

  if (paymentStep === 'result') {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 max-w-md mx-auto">
        <div className="text-center">
          {paymentResult === 'success' ? (
            <>
              <div className="mb-6">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
              <p className="text-neutral-600 mb-4">Your payment has been processed successfully.</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Amount:</span>
                    <span className="font-semibold">€{amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Payment Method:</span>
                    <span className="font-semibold">{selectedMethod?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Transaction ID:</span>
                    <span className="font-mono text-xs">{transactionId}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
              <p className="text-neutral-600 mb-4">
                We were unable to process your payment. Please try again or use a different payment method.
              </p>
              <button
                onClick={() => setPaymentStep('select')}
                className="w-full py-3 px-4 bg-brand-500 text-white rounded-lg hover:bg-brand-600 font-medium"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  return null
}