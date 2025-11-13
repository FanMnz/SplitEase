'use client'

import { useState } from 'react'
import { OrderItem } from '@/contexts/OrderContext'
import { 
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ShoppingCartIcon,
  XMarkIcon,
  PencilIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface OrderCartProps {
  items: OrderItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onAddSpecialInstructions: (itemId: string, instructions: string) => void
  onClearCart: () => void
  onPlaceOrder: () => void
  className?: string
  showPlaceOrder?: boolean
}

export default function OrderCart({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onAddSpecialInstructions,
  onClearCart,
  onPlaceOrder,
  className = '',
  showPlaceOrder = true
}: OrderCartProps) {
  const [editingInstructions, setEditingInstructions] = useState<string | null>(null)
  const [instructionsText, setInstructionsText] = useState('')

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const tax = subtotal * 0.08 // 8% tax
  const serviceCharge = subtotal * 0.05 // 5% service charge
  const total = subtotal + tax + serviceCharge

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const estimatedTime = Math.max(...items.map(item => item.menuItem.preparationTime), 0)

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(itemId)
    } else {
      onUpdateQuantity(itemId, newQuantity)
    }
  }

  const handleSaveInstructions = (itemId: string) => {
    onAddSpecialInstructions(itemId, instructionsText)
    setEditingInstructions(null)
    setInstructionsText('')
  }

  const startEditingInstructions = (itemId: string, currentInstructions?: string) => {
    setEditingInstructions(itemId)
    setInstructionsText(currentInstructions || '')
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-neutral-200 ${className}`}>
      {/* Header */}
      <div className="border-b border-neutral-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCartIcon className="w-5 h-5 text-neutral-600" />
            <h3 className="text-lg font-semibold text-neutral-900">
              Order Cart ({totalItems})
            </h3>
          </div>
          {items.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-sm text-error-600 hover:text-error-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
        
        {estimatedTime > 0 && (
          <div className="flex items-center space-x-2 mt-2 text-sm text-neutral-600">
            <ClockIcon className="w-4 h-4" />
            <span>Estimated time: {estimatedTime} minutes</span>
          </div>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto max-h-96">
        {items.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingCartIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-neutral-600 mb-2">Your cart is empty</h4>
            <p className="text-neutral-500">Add items from the menu to get started</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border border-neutral-200 rounded-lg p-4">
                {/* Item Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900">{item.menuItem.name}</h4>
                    <p className="text-sm text-neutral-600">€{item.unitPrice.toFixed(2)} each</p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 text-neutral-400 hover:text-error-600 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="p-1 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                    >
                      <MinusIcon className="w-4 h-4 text-neutral-600" />
                    </button>
                    <span className="font-medium text-neutral-900 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="p-1 rounded-full bg-brand-500 hover:bg-brand-600 text-white transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="font-semibold text-neutral-900">
                    €{item.totalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Special Instructions */}
                <div className="space-y-2">
                  {editingInstructions === item.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={instructionsText}
                        onChange={(e) => setInstructionsText(e.target.value)}
                        placeholder="Add special instructions..."
                        className="w-full p-2 border border-neutral-300 rounded-md resize-none text-sm"
                        rows={2}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveInstructions(item.id)}
                          className="px-3 py-1 bg-brand-500 text-white rounded-md text-sm hover:bg-brand-600 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingInstructions(null)}
                          className="px-3 py-1 bg-neutral-200 text-neutral-700 rounded-md text-sm hover:bg-neutral-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      {item.specialInstructions ? (
                        <div className="flex-1">
                          <p className="text-sm text-neutral-600">
                            <span className="font-medium">Instructions:</span> {item.specialInstructions}
                          </p>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <p className="text-sm text-neutral-500">No special instructions</p>
                        </div>
                      )}
                      <button
                        onClick={() => startEditingInstructions(item.id, item.specialInstructions)}
                        className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Modifications */}
                {item.modifications && item.modifications.length > 0 && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Modifications:</span> {item.modifications.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Summary */}
      {items.length > 0 && (
        <div className="border-t border-neutral-200 p-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Subtotal</span>
              <span className="text-neutral-900">€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Tax (8%)</span>
              <span className="text-neutral-900">€{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Service Charge (5%)</span>
              <span className="text-neutral-900">€{serviceCharge.toFixed(2)}</span>
            </div>
            <div className="border-t border-neutral-200 pt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-neutral-900">Total</span>
                <span className="font-bold text-lg text-brand-600">€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          {showPlaceOrder && (
            <button
              onClick={onPlaceOrder}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Place Order • €{total.toFixed(2)}
            </button>
          )}
        </div>
      )}
    </div>
  )
}