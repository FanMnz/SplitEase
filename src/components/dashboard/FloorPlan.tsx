'use client'

import React from 'react'
import { TableInfo } from '@/types/dashboard'

export default function FloorPlan({ tables = [] }: { tables?: TableInfo[] }) {
  // Simple visual grid of tables with color coding
  const colorFor = (status: TableInfo['status']) => {
    switch (status) {
      case 'waiting_payment':
        return 'bg-critical/90 text-white'
      case 'long_stay':
        return 'bg-warning/90 text-white'
      case 'available':
        return 'bg-green-500 text-white'
      case 'occupied':
        return 'bg-neutral-700 text-white'
      case 'cleaning':
        return 'bg-neutral-200 text-neutral-800'
      default:
        return 'bg-neutral-200'
    }
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-card">
      <div className="text-sm text-neutral-500 mb-3">Floor Plan</div>
      <div className="grid grid-cols-3 gap-4">
        {tables.map((t) => (
          <button
            key={t.id}
            className={`${colorFor(t.status)} rounded-md p-4 flex flex-col items-center justify-center`}
            onClick={() => alert(`Open table ${t.number}`)}
          >
            <div className="text-sm font-semibold">Table {t.number}</div>
            <div className="text-xs">{t.guests ?? '-'} guests</div>
          </button>
        ))}
      </div>
    </div>
  )
}
