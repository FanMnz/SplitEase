'use client'

import { useState } from 'react'
import { usePayments, Bill, SplitDetails, SplitOption } from '@/contexts/PaymentContext'
import { 
  UserGroupIcon,
  CalculatorIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface BillSplitterProps {
  bill: Bill
  onComplete?: () => void
  onCancel?: () => void
}

export default function BillSplitter({ bill, onComplete, onCancel }: BillSplitterProps) {
  const { 
    splitOptions, 
    paymentMethods, 
    initiateBillSplit, 
    updateSplitAssignment,
    finalizeSplit,
    processSplitPayment 
  } = usePayments()
  
  const [selectedSplitType, setSelectedSplitType] = useState<SplitOption['type'] | null>(null)
  const [splitStep, setSplitStep] = useState<'select' | 'configure' | 'payment'>('select')
  const [customAmounts, setCustomAmounts] = useState<{ [key: string]: number }>({})
  const [percentages, setPercentages] = useState<{ [key: string]: number }>({})
  const [numberOfPeople, setNumberOfPeople] = useState(2)
  const [customerNames, setCustomerNames] = useState<string[]>(['Customer 1', 'Customer 2'])
  const [processingPayments, setProcessingPayments] = useState<{ [key: string]: boolean }>({})
  const [paymentResults, setPaymentResults] = useState<{ [key: string]: 'success' | 'failed' }>({})

  const handleSplitTypeSelect = (splitType: SplitOption['type']) => {
    setSelectedSplitType(splitType)
    
    if (splitType === 'equal' || splitType === 'by_item') {
      // These can be processed immediately
      initiateBillSplit(bill.id, splitType)
      setSplitStep('payment')
    } else {
      // Custom and percentage need configuration
      setSplitStep('configure')
    }
  }

  const handleCustomConfiguration = () => {
    if (!selectedSplitType) return

    if (selectedSplitType === 'custom') {
      // Validate custom amounts
      const totalCustomAmount = Object.values(customAmounts).reduce((sum, amount) => sum + (amount || 0), 0)
      if (Math.abs(totalCustomAmount - bill.total) > 0.01) {
        alert('Custom amounts must equal the total bill amount!')
        return
      }
    } else if (selectedSplitType === 'percentage') {
      // Validate percentages
      const totalPercentage = Object.values(percentages).reduce((sum, pct) => sum + (pct || 0), 0)
      if (Math.abs(totalPercentage - 100) > 0.01) {
        alert('Percentages must equal 100%!')
        return
      }
    }

    // Create custom split details
    const splitDetails: SplitDetails[] = customerNames.map((name, index) => {
      let amount = 0
      if (selectedSplitType === 'custom') {
        amount = customAmounts[`customer_${index}`] || 0
      } else if (selectedSplitType === 'percentage') {
        amount = (bill.total * (percentages[`customer_${index}`] || 0)) / 100
      }

      return {
        id: `split_${index + 1}`,
        customerId: `customer_${index}`,
        customerName: name,
        items: [], // For custom splits, items are not specifically assigned
        amount,
        status: 'pending'
      }
    })

    // Update the bill with custom split details
    initiateBillSplit(bill.id, selectedSplitType)
    setSplitStep('payment')
  }

  const handleSplitPayment = async (splitId: string, paymentMethod: string) => {
    setProcessingPayments(prev => ({ ...prev, [splitId]: true }))
    
    try {
      const success = await processSplitPayment(bill.id, splitId, paymentMethod)
      setPaymentResults(prev => ({ 
        ...prev, 
        [splitId]: success ? 'success' : 'failed' 
      }))
      
      if (success) {
        // Check if all splits are paid
        const allSplitsPaid = bill.splitDetails?.every(split => 
          split.id === splitId || paymentResults[split.id] === 'success'
        )
        
        if (allSplitsPaid) {
          setTimeout(() => {
            onComplete?.()
          }, 2000)
        }
      }
    } catch (error) {
      setPaymentResults(prev => ({ ...prev, [splitId]: 'failed' }))
    } finally {
      setProcessingPayments(prev => ({ ...prev, [splitId]: false }))
    }
  }

  const updateNumberOfPeople = (count: number) => {
    setNumberOfPeople(count)
    const newNames = Array.from({ length: count }, (_, i) => 
      customerNames[i] || `Customer ${i + 1}`
    )
    setCustomerNames(newNames)
    
    // Reset amounts and percentages
    const newCustomAmounts: { [key: string]: number } = {}
    const newPercentages: { [key: string]: number } = {}
    
    for (let i = 0; i < count; i++) {
      const key = `customer_${i}`
      newCustomAmounts[key] = bill.total / count
      newPercentages[key] = 100 / count
    }
    
    setCustomAmounts(newCustomAmounts)
    setPercentages(newPercentages)
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          splitStep === 'select' ? 'bg-brand-500 text-white' : 'bg-brand-100 text-brand-600'
        }`}>
          1
        </div>
        <div className={`h-0.5 w-12 ${
          ['configure', 'payment'].includes(splitStep) ? 'bg-brand-500' : 'bg-neutral-200'
        }`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          splitStep === 'configure' ? 'bg-brand-500 text-white' : 
          splitStep === 'payment' ? 'bg-brand-100 text-brand-600' : 'bg-neutral-200 text-neutral-400'
        }`}>
          2
        </div>
        <div className={`h-0.5 w-12 ${
          splitStep === 'payment' ? 'bg-brand-500' : 'bg-neutral-200'
        }`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          splitStep === 'payment' ? 'bg-brand-500 text-white' : 'bg-neutral-200 text-neutral-400'
        }`}>
          3
        </div>
      </div>
    </div>
  )

  if (splitStep === 'select') {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Split Bill</h2>
          <p className="text-neutral-600">Choose how you&apos;d like to split the bill</p>
        </div>

        {renderStepIndicator()}

        <div className="space-y-4">
          {splitOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => handleSplitTypeSelect(option.type)}
              className="w-full p-4 text-left border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-brand-300 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {option.type === 'equal' && <UserGroupIcon className="w-6 h-6 text-brand-500" />}
                  {option.type === 'by_item' && <CheckCircleIcon className="w-6 h-6 text-green-500" />}
                  {option.type === 'custom' && <CalculatorIcon className="w-6 h-6 text-blue-500" />}
                  {option.type === 'percentage' && <div className="w-6 h-6 text-purple-500 font-bold">%</div>}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{option.name}</h3>
                  <p className="text-sm text-neutral-600">{option.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (splitStep === 'configure') {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Configure Split</h2>
          <p className="text-neutral-600">
            {selectedSplitType === 'custom' ? 'Set custom amounts for each person' : 'Set percentage for each person'}
          </p>
        </div>

        {renderStepIndicator()}

        {/* Number of People */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Number of People
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => updateNumberOfPeople(Math.max(2, numberOfPeople - 1))}
              className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200"
            >
              -
            </button>
            <span className="font-semibold text-lg">{numberOfPeople}</span>
            <button
              onClick={() => updateNumberOfPeople(Math.min(8, numberOfPeople + 1))}
              className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200"
            >
              +
            </button>
          </div>
        </div>

        {/* Customer Configuration */}
        <div className="space-y-4 mb-6">
          {customerNames.map((name, index) => (
            <div key={index} className="p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      const newNames = [...customerNames]
                      newNames[index] = e.target.value
                      setCustomerNames(newNames)
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder={`Customer ${index + 1}`}
                  />
                </div>
                <div className="flex-1">
                  {selectedSplitType === 'custom' ? (
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-neutral-500">€</span>
                      <input
                        type="number"
                        step="0.01"
                        value={customAmounts[`customer_${index}`] || ''}
                        onChange={(e) => {
                          setCustomAmounts(prev => ({
                            ...prev,
                            [`customer_${index}`]: parseFloat(e.target.value) || 0
                          }))
                        }}
                        className="w-full pl-8 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="0.00"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={percentages[`customer_${index}`] || ''}
                        onChange={(e) => {
                          setPercentages(prev => ({
                            ...prev,
                            [`customer_${index}`]: parseFloat(e.target.value) || 0
                          }))
                        }}
                        className="w-full pr-8 pl-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-2 text-neutral-500">%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-neutral-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-medium text-neutral-900">Total Bill:</span>
            <span className="font-bold text-xl text-neutral-900">€{bill.total.toFixed(2)}</span>
          </div>
          {selectedSplitType === 'custom' && (
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-neutral-600">Assigned Total:</span>
              <span className={`text-sm font-medium ${
                Math.abs(Object.values(customAmounts).reduce((sum, amount) => sum + (amount || 0), 0) - bill.total) < 0.01
                  ? 'text-green-600' : 'text-red-600'
              }`}>
                €{Object.values(customAmounts).reduce((sum, amount) => sum + (amount || 0), 0).toFixed(2)}
              </span>
            </div>
          )}
          {selectedSplitType === 'percentage' && (
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-neutral-600">Total Percentage:</span>
              <span className={`text-sm font-medium ${
                Math.abs(Object.values(percentages).reduce((sum, pct) => sum + (pct || 0), 0) - 100) < 0.01
                  ? 'text-green-600' : 'text-red-600'
              }`}>
                {Object.values(percentages).reduce((sum, pct) => sum + (pct || 0), 0).toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setSplitStep('select')}
            className="flex-1 py-3 px-4 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 font-medium"
          >
            Back
          </button>
          <button
            onClick={handleCustomConfiguration}
            className="flex-1 py-3 px-4 bg-brand-500 text-white rounded-lg hover:bg-brand-600 font-medium"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    )
  }

  // Payment step
  return (
    <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">Process Payments</h2>
        <p className="text-neutral-600">Each person can pay their portion individually</p>
      </div>

      {renderStepIndicator()}

      <div className="space-y-6">
        {bill.splitDetails?.map((split) => (
          <div key={split.id} className="border border-neutral-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{split.customerName}</h3>
                <p className="text-2xl font-bold text-brand-600">€{split.amount.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                {split.status === 'paid' ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircleIcon className="w-6 h-6" />
                    <span className="font-medium">Paid</span>
                  </div>
                ) : paymentResults[split.id] === 'success' ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircleIcon className="w-6 h-6" />
                    <span className="font-medium">Payment Successful</span>
                  </div>
                ) : paymentResults[split.id] === 'failed' ? (
                  <div className="flex items-center space-x-2 text-red-600">
                    <ExclamationTriangleIcon className="w-6 h-6" />
                    <span className="font-medium">Payment Failed</span>
                  </div>
                ) : (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    Pending
                  </span>
                )}
              </div>
            </div>

            {split.status !== 'paid' && paymentResults[split.id] !== 'success' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {paymentMethods.filter(method => method.isAvailable).map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleSplitPayment(split.id, method.id)}
                    disabled={processingPayments[split.id]}
                    className="flex flex-col items-center space-y-2 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {processingPayments[split.id] ? (
                      <ArrowPathIcon className="w-6 h-6 text-brand-500 animate-spin" />
                    ) : (
                      <span className="text-2xl">{method.icon}</span>
                    )}
                    <span className="text-sm font-medium text-neutral-700">{method.name}</span>
                  </button>
                ))}
              </div>
            )}

            {paymentResults[split.id] === 'failed' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  Payment failed. Please try again or use a different payment method.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={onCancel}
          className="py-3 px-6 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 font-medium"
        >
          Close
        </button>
      </div>
    </div>
  )
}