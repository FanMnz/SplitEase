'use client'

import { useState } from 'react'
import { Table, Guest } from '@/types'

interface TableWithGuests extends Table {
  guests: Guest[];
  totalAmount: number;
  duration: number; // minutes
}

export default function Tables() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  
  // Mock data - would come from API
  const tables: TableWithGuests[] = [
    {
      id: '1',
      number: 'T1',
      capacity: 4,
      status: 'occupied',
      restaurantId: 'rest1',
      currentSessionId: 'session1',
      guests: [
        { id: 'g1', name: 'Alice', sessionId: 'session1', status: 'active', joinedAt: new Date() },
        { id: 'g2', name: 'Bob', sessionId: 'session1', status: 'active', joinedAt: new Date() },
      ],
      totalAmount: 85.50,
      duration: 45,
    },
    {
      id: '2',
      number: 'T2',
      capacity: 6,
      status: 'available',
      restaurantId: 'rest1',
      guests: [],
      totalAmount: 0,
      duration: 0,
    },
    // Add more mock tables...
  ]

  const getTableStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'occupied': return 'bg-red-100 text-red-800'
      case 'reserved': return 'bg-yellow-100 text-yellow-800'
      case 'cleaning': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Table Management</h1>
        <p className="text-gray-600">Monitor and manage all restaurant tables</p>
      </div>

      {/* Table Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tables Grid */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">All Tables</h2>
              <button className="btn-primary">+ Add Table</button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tables.map((table) => (
                <div
                  key={table.id}
                  onClick={() => setSelectedTable(table.id)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedTable === table.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{table.number}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getTableStatusColor(table.status)}`}>
                      {table.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">
                    Capacity: {table.capacity} guests
                  </p>
                  
                  {table.status === 'occupied' && (
                    <>
                      <p className="text-sm text-gray-600 mb-1">
                        Guests: {table.guests.length}
                      </p>
                      <p className="text-sm font-medium text-primary-600 mb-1">
                        ${table.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {table.duration}min ago
                      </p>
                    </>
                  )}
                  
                  {table.status === 'available' && (
                    <button 
                      className="w-full mt-2 bg-primary-500 text-white text-sm py-1 rounded hover:bg-primary-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle seat guests
                      }}
                    >
                      Seat Guests
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table Details Panel */}
        <div className="lg:col-span-1">
          <div className="card">
            {selectedTable ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Table Details</h2>
                {(() => {
                  const table = tables.find(t => t.id === selectedTable)
                  if (!table) return null
                  
                  return (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-700">Table {table.number}</h3>
                        <p className="text-sm text-gray-600">Capacity: {table.capacity} guests</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getTableStatusColor(table.status)}`}>
                          {table.status}
                        </span>
                      </div>

                      {table.status === 'occupied' && (
                        <>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Guests ({table.guests.length})</h4>
                            <div className="space-y-2">
                              {table.guests.map((guest) => (
                                <div key={guest.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                                  <span className="text-sm">{guest.name}</span>
                                  <span className="text-xs text-gray-500">{guest.status}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-700">Session Info</h4>
                            <p className="text-sm text-gray-600">Duration: {table.duration} minutes</p>
                            <p className="text-sm text-gray-600">Total: ${table.totalAmount.toFixed(2)}</p>
                          </div>

                          <div className="space-y-2">
                            <button className="w-full btn-primary text-sm">
                              Take Order
                            </button>
                            <button className="w-full btn-secondary text-sm">
                              Split Bill
                            </button>
                            <button className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-4 rounded-lg">
                              Process Payment
                            </button>
                          </div>
                        </>
                      )}

                      {table.status === 'available' && (
                        <div className="space-y-2">
                          <button className="w-full btn-primary">
                            Seat Guests
                          </button>
                          <button className="w-full btn-secondary">
                            Reserve Table
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Select a table to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}