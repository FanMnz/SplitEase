'use client'

import Link from 'next/link'
import React from 'react'

const links = [
  { id: 'overview', label: 'Overview', href: '/dashboard' },
  { id: 'orders', label: 'Orders', href: '/orders' },
  { id: 'tables', label: 'Tables', href: '/tables' },
  { id: 'billing', label: 'Billing', href: '/billing' },
  { id: 'insights', label: 'Insights', href: '/insights/executive' },
]

export default function ManagerSidebar({ active = 'overview' }: { active?: string }) {
  return (
    <aside className="w-72 min-h-screen bg-primary text-white flex flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="text-xl font-semibold">SplitEase</div>
        <div className="text-sm text-white/80 mt-1">Live Ops</div>
      </div>

      <nav className="px-3 py-4 flex-1 overflow-y-auto">
        <div className="text-xs text-neutral-300 uppercase px-3 mb-2">Management</div>
        <ul className="space-y-1">
          {links.map((l) => (
            <li key={l.id}>
              <Link
                href={l.href}
                className={
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ` +
                  (active === l.id
                    ? 'bg-accent text-white shadow-lg'
                    : 'text-white/90 hover:bg-white/5')
                }
              >
                <span className="w-6 text-center">●</span>
                <span>{l.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <button className="w-full bg-accent text-primary font-semibold py-2 rounded">Open Live</button>
      </div>
    </aside>
  )
}
