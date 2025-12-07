'use client'

import React from 'react'
import { KPIProps } from '@/types/dashboard'

function KpiCard({ kpi }: { kpi: KPIProps }) {
  const deltaClass = kpi.deltaPositive ? 'text-green-500' : 'text-critical'
  return (
    <div className="bg-white rounded-lg p-4 border-l-4 border-accent shadow-sm">
      <div className="text-sm text-neutral-500">{kpi.title}</div>
      <div className="mt-2 flex items-baseline gap-3">
        <div className="text-2xl font-semibold">{kpi.value}</div>
        {typeof kpi.delta === 'number' && (
          <div className={`text-sm ${deltaClass}`}>{kpi.delta > 0 ? `+${kpi.delta}%` : `${kpi.delta}%`}</div>
        )}
      </div>
      {kpi.description && <div className="text-xs text-neutral-400 mt-2">{kpi.description}</div>}
    </div>
  )
}

export default function KpiCards({ items }: { items: KPIProps[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((k) => (
        <KpiCard key={k.id} kpi={k} />
      ))}
    </div>
  )
}
