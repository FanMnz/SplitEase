'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navigation = [
  { name: 'Manager', href: '/manager', icon: '👨‍💼', description: 'Executive dashboard' },
  { name: 'Waiter', href: '/waiter', icon: '👨‍🍳', description: 'Service interface' },
  { name: 'Customer', href: '/customer', icon: '👥', description: 'Table ordering' },
  { name: 'Dashboard', href: '/dashboard', icon: '📊', description: 'Overview & stats' },
  { name: 'Tables', href: '/tables', icon: '🪑', description: 'Manage seating' },
  { name: 'Orders', href: '/orders', icon: '📋', description: 'Track orders' },
  { name: 'Menu', href: '/menu', icon: '📖', description: 'Menu items' },
  { name: 'Payments', href: '/payments', icon: '💳', description: 'Bills & splits' },
  { name: 'Analytics', href: '/analytics', icon: '📈', description: 'Reports' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex bg-white/80 backdrop-blur-xl border-b border-neutral-200/50 sticky top-0 z-50">
        <div className="container-mobile">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-neutral-900">SplitEase</span>
                <span className="text-xs text-neutral-500 -mt-1">HORECA Solutions</span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className="text-xs text-neutral-400 group-hover:text-neutral-500">
                        {item.description}
                      </span>
                    </div>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-brand-500 rounded-full"></div>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2.5 text-neutral-600 hover:text-neutral-900 rounded-xl hover:bg-neutral-50 transition-colors">
                <span className="text-xl">🔔</span>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
              </button>
              <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors">
                <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                  JD
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-900">John Doe</span>
                  <span className="text-xs text-neutral-500">Manager</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white border-b border-neutral-200/50 sticky top-0 z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-bold text-neutral-900">SplitEase</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-neutral-200/50 shadow-lg">
            <div className="px-4 py-6 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-4 px-4 py-3 rounded-xl text-base font-medium transition-colors touch-target ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className="text-sm text-neutral-500">{item.description}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
            <div className="px-4 py-4 border-t border-neutral-200/50">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-neutral-50">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-white text-sm font-semibold">
                  JD
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-900">John Doe</span>
                  <span className="text-xs text-neutral-500">Manager • Restaurant ABC</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-neutral-200/50 lg:hidden z-40 safe-area-inset">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {navigation.slice(0, 4).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-medium transition-colors touch-target ${
                  isActive
                    ? 'text-brand-700 bg-brand-50'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <span className="text-lg mb-1">{item.icon}</span>
                <span className="text-xs">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}