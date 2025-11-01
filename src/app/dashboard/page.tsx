import { Table, TableSession, DashboardStats } from '@/types'

export default function Dashboard() {
  // Mock data - In real app, this would come from API
  const stats: DashboardStats = {
    totalTables: 24,
    activeTables: 18,
    totalRevenue: 12450.75,
    averageTableTurnover: 85.5,
    guestSatisfaction: 4.7
  }

  const activeSessions: TableSession[] = [
    // Mock session data would go here
  ]

  return (
    <div className="container-mobile py-6 lg:py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-2">
              Good morning, John 👋
            </h1>
            <p className="text-neutral-600">Here&apos;s what&apos;s happening at your restaurant today</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-2 bg-success-50 text-success-700 rounded-xl text-sm font-medium">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Mobile Optimized */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
        <div className="card col-span-1 hover:shadow-lg transition-all duration-200">
          <div className="card-body p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-neutral-500">Total Tables</h3>
              <span className="text-xl">🪑</span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-neutral-900">{stats.totalTables}</p>
            <p className="text-xs text-neutral-500 mt-1">Restaurant capacity</p>
          </div>
        </div>
        
        <div className="card col-span-1 hover:shadow-lg transition-all duration-200">
          <div className="card-body p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-neutral-500">Active</h3>
              <span className="text-xl">🟢</span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-success-600">{stats.activeTables}</p>
            <p className="text-xs text-neutral-500 mt-1">Currently serving</p>
          </div>
        </div>
        
        <div className="card col-span-2 lg:col-span-1 hover:shadow-lg transition-all duration-200">
          <div className="card-body p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-neutral-500">Revenue</h3>
              <span className="text-xl">💰</span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-brand-600">${stats.totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-success-600 mt-1">+12% from yesterday</p>
          </div>
        </div>
        
        <div className="card col-span-1 hover:shadow-lg transition-all duration-200">
          <div className="card-body p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-neutral-500">Turnover</h3>
              <span className="text-xl">⏱️</span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-warning-600">{stats.averageTableTurnover.toFixed(0)}<span className="text-lg">min</span></p>
            <p className="text-xs text-neutral-500 mt-1">Average time</p>
          </div>
        </div>
        
        <div className="card col-span-1 hover:shadow-lg transition-all duration-200">
          <div className="card-body p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-neutral-500">Rating</h3>
              <span className="text-xl">⭐</span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-warning-600">{stats.guestSatisfaction.toFixed(1)}</p>
            <p className="text-xs text-neutral-500 mt-1">Guest satisfaction</p>
          </div>
        </div>
      </div>

      {/* Quick Actions - Mobile First */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
        <button className="card-interactive group text-left">
          <div className="card-body p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center group-hover:bg-brand-200 transition-colors">
                <span className="text-2xl">🪑</span>
              </div>
              <svg className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Seat Guests</h3>
            <p className="text-neutral-600 text-sm mb-4">Assign guests to tables and start new dining sessions</p>
            <div className="flex items-center text-sm text-brand-600 font-medium">
              <span>6 tables available</span>
            </div>
          </div>
        </button>
        
        <button className="card-interactive group text-left">
          <div className="card-body p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-success-100 rounded-2xl flex items-center justify-center group-hover:bg-success-200 transition-colors">
                <span className="text-2xl">📋</span>
              </div>
              <svg className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Take Orders</h3>
            <p className="text-neutral-600 text-sm mb-4">Add items to guest orders and track kitchen progress</p>
            <div className="flex items-center text-sm text-warning-600 font-medium">
              <span>12 orders pending</span>
            </div>
          </div>
        </button>
        
        <button className="card-interactive group text-left">
          <div className="card-body p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-warning-100 rounded-2xl flex items-center justify-center group-hover:bg-warning-200 transition-colors">
                <span className="text-2xl">💳</span>
              </div>
              <svg className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Process Payments</h3>
            <p className="text-neutral-600 text-sm mb-4">Handle bills, split payments, and close tables</p>
            <div className="flex items-center text-sm text-error-600 font-medium">
              <span>3 bills ready</span>
            </div>
          </div>
        </button>
      </div>

      {/* Active Tables - Responsive Grid */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900">Active Tables</h2>
            <button className="btn btn-secondary btn-sm">
              <span className="mr-2">🔄</span>
              Refresh
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }, (_, i) => {
              const tableNumber = i + 1
              const isActive = i < 8
              const guestCount = Math.floor(Math.random() * 6) + 2
              const duration = Math.floor(Math.random() * 90) + 10
              const amount = (Math.random() * 200 + 50).toFixed(2)
              
              return (
                <div 
                  key={i} 
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                    isActive 
                      ? 'table-status-occupied hover:border-error-400' 
                      : 'table-status-available hover:border-success-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">T{tableNumber}</h3>
                    <span className={`badge ${isActive ? 'badge-error' : 'badge-success'}`}>
                      {isActive ? 'Busy' : 'Free'}
                    </span>
                  </div>
                  
                  {isActive ? (
                    <div className="space-y-2">
                      <p className="text-sm text-neutral-600">{guestCount} guests</p>
                      <p className="text-sm font-medium text-neutral-900">${amount}</p>
                      <p className="text-xs text-neutral-500">{duration}min ago</p>
                      <div className="flex gap-1 mt-3">
                        <button className="flex-1 bg-brand-500 text-white text-xs py-1 px-2 rounded-lg hover:bg-brand-600 transition-colors">
                          Orders
                        </button>
                        <button className="flex-1 bg-neutral-200 text-neutral-700 text-xs py-1 px-2 rounded-lg hover:bg-neutral-300 transition-colors">
                          Bill
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <button className="w-full bg-success-500 text-white text-sm py-2 px-3 rounded-lg hover:bg-success-600 transition-colors">
                        Seat Guests
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}