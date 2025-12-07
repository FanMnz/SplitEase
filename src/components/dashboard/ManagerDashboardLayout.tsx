'use client'

import React from 'react'
import ManagerSidebar from './ManagerSidebar'
import LiveAlertsHeader from './LiveAlertsHeader'
import KpiCards from './KpiCards'
import FloorPlan from './FloorPlan'
import { KPIProps, TableInfo } from '@/types/dashboard'

export default function ManagerDashboardLayout({
  kpis = [],
  tables = [],
  children,
}: {
  kpis?: KPIProps[]
  tables?: TableInfo[]
  children?: React.ReactNode
}) {
  // Default sample data if none provided
  const sampleKpis: KPIProps[] = kpis.length
    ? kpis
    : [
        { id: '1', title: 'Covers Today', value: 124, delta: 8, deltaPositive: true },
        { id: '2', title: 'Avg Ticket', value: '$42.50', delta: -3, deltaPositive: false },
        { id: '3', title: 'Open Bills', value: 6, delta: 50, deltaPositive: false },
        { id: '4', title: 'Turnover (h)', value: '18m', description: 'Avg table turnover' },
      ]

  const sampleTables: TableInfo[] = tables.length
    ? tables
    : [
        { id: 't1', number: '1', status: 'available' },
        { id: 't2', number: '2', status: 'occupied', guests: 4 },
        { id: 't3', number: '3', status: 'waiting_payment', guests: 2 },
        { id: 't4', number: '4', status: 'long_stay', guests: 3 },
        { id: 't5', number: '5', status: 'cleaning' },
        { id: 't6', number: '6', status: 'available' },
      ]

  return (
    <div className="flex">
      <ManagerSidebar />

      <div className="flex-1 min-h-screen bg-background p-6">
        <div className="max-w-full">
          <LiveAlertsHeader />

          <section className="mt-6 space-y-6">
            <KpiCards items={sampleKpis} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FloorPlan tables={sampleTables} />
              </div>

              <aside className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-card">Quick Actions</div>
                <div className="bg-white rounded-lg p-4 shadow-card">Activity Feed</div>
              </aside>
            </div>
          </section>

          {children}
        </div>
      </div>
    </div>
  )
}
