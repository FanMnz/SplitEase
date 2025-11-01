'use client'

import { useState } from 'react'
import { Bill, Payment, Guest, SplitMethod } from '@/types'

interface BillWithGuest extends Bill {
  guest: Guest;
}

export default function Payments() {
  const [selectedBill, setSelectedBill] = useState<string | null>(null)
  const [splitMethod, setSplitMethod] = useState<SplitMethod>('equal')
  
  // Mock data
  const bills: BillWithGuest[] = [
    {
      id: 'bill1',
      guestId: 'g1',
      sessionId: 'session1',
      items: [],
      subtotal: 45.99,
      taxAmount: 3.68,
      serviceChargeAmount: 6.90,
      totalAmount: 56.57,
      status: 'sent',
      sentAt: new Date(),
      guest: {
        id: 'g1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+1234567890',
        sessionId: 'session1',
        status: 'active',
        joinedAt: new Date(),
      },
    },
    {
      id: 'bill2',
      guestId: 'g2',
      sessionId: 'session1',
      items: [],
      subtotal: 32.50,
      taxAmount: 2.60,
      serviceChargeAmount: 4.88,
      totalAmount: 39.98,
      status: 'paid',
      sentAt: new Date(),
      paidAt: new Date(),
      paymentMethod: 'card',
      guest: {
        id: 'g2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        sessionId: 'session1',
        status: 'checked_out',
        joinedAt: new Date(),
      },
    },
  ]

  const getStatusColor = (status: Bill['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'sent': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const processBillSplit = () => {
    // Handle bill splitting logic
    console.log(`Splitting bill using ${splitMethod} method`)
  }

  const sendBill = (billId: string) => {
    // Send bill to guest
    console.log(`Sending bill ${billId}`)
  }

  const processPayment = (billId: string) => {
    // Process payment
    console.log(`Processing payment for bill ${billId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
        <p className="text-gray-600">Process bills, split payments, and track transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bills List */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Active Bills</h2>
              <button 
                onClick={processBillSplit}
                className="btn-primary"
              >
                Split All Bills
              </button>
            </div>

            <div className="space-y-4">
              {bills.map((bill) => (
                <div
                  key={bill.id}
                  onClick={() => setSelectedBill(bill.id)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedBill === bill.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{bill.guest.name}</h3>
                      <p className="text-sm text-gray-600">{bill.guest.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(bill.status)}`}>
                      {bill.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Subtotal</p>
                      <p className="font-medium">${bill.subtotal.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tax & Service</p>
                      <p className="font-medium">${(bill.taxAmount + bill.serviceChargeAmount).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total</p>
                      <p className="font-medium text-primary-600">${bill.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    {bill.status === 'draft' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          sendBill(bill.id)
                        }}
                        className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Send Bill
                      </button>
                    )}
                    
                    {bill.status === 'sent' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          processPayment(bill.id)
                        }}
                        className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Process Payment
                      </button>
                    )}

                    {bill.status === 'paid' && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded">
                        Paid via {bill.paymentMethod}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bill Details & Split Options */}
        <div className="lg:col-span-1">
          <div className="card">
            {selectedBill ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Bill Details</h2>
                {(() => {
                  const bill = bills.find(b => b.id === selectedBill)
                  if (!bill) return null
                  
                  return (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-700">{bill.guest.name}</h3>
                        <p className="text-sm text-gray-600">{bill.guest.email}</p>
                        <p className="text-sm text-gray-600">{bill.guest.phone}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Subtotal:</span>
                          <span className="text-sm font-medium">${bill.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tax:</span>
                          <span className="text-sm font-medium">${bill.taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Service Charge:</span>
                          <span className="text-sm font-medium">${bill.serviceChargeAmount.toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                          <span className="font-medium">Total:</span>
                          <span className="font-medium text-primary-600">${bill.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      {bill.status === 'sent' && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-700">Payment Methods</h4>
                          <div className="space-y-2">
                            <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                              💳 Credit/Debit Card
                            </button>
                            <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                              📱 Mobile Payment
                            </button>
                            <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                              💵 Cash
                            </button>
                            <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">
                              🏦 Bank Transfer
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <button className="w-full btn-primary text-sm">
                          Send Bill via SMS
                        </button>
                        <button className="w-full btn-secondary text-sm">
                          Send Bill via Email
                        </button>
                        <button className="w-full bg-purple-500 hover:bg-purple-600 text-white text-sm py-2 px-4 rounded-lg">
                          Generate QR Code
                        </button>
                      </div>
                    </div>
                  )
                })()}
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">Split Options</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Split Method
                    </label>
                    <select
                      value={splitMethod}
                      onChange={(e) => setSplitMethod(e.target.value as SplitMethod)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="equal">Split Equally</option>
                      <option value="by_item">Split by Item</option>
                      <option value="custom">Custom Amounts</option>
                      <option value="percentage">By Percentage</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Include Tax</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Include Service Charge</span>
                    </label>
                  </div>

                  <button 
                    onClick={processBillSplit}
                    className="w-full btn-primary"
                  >
                    Apply Split Method
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}