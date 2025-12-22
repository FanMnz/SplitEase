'use client'

import Link from 'next/link'
import { Settings, Video, Package, Users, FileText, BarChart3 } from 'lucide-react'

export default function AdminDashboard() {
  const adminTools = [
    {
      title: 'Media Configuration',
      description: 'Manage Mux playback IDs and poster images for videos',
      icon: Video,
      href: '/admin/media-config',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Settings',
      description: 'System settings and configuration',
      icon: Settings,
      href: '#',
      color: 'from-gray-500 to-slate-500',
      disabled: true
    },
    {
      title: 'Inventory',
      description: 'Manage menu items and stock levels',
      icon: Package,
      href: '#',
      color: 'from-amber-500 to-orange-500',
      disabled: true
    },
    {
      title: 'Staff Management',
      description: 'Manage users and permissions',
      icon: Users,
      href: '#',
      color: 'from-blue-500 to-cyan-500',
      disabled: true
    },
    {
      title: 'Reports',
      description: 'View analytics and reports',
      icon: BarChart3,
      href: '#',
      color: 'from-green-500 to-emerald-500',
      disabled: true
    },
    {
      title: 'Documentation',
      description: 'Help and documentation',
      icon: FileText,
      href: '#',
      color: 'from-indigo-500 to-purple-500',
      disabled: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your restaurant configuration and operations</p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminTools.map((tool) => {
            const Icon = tool.icon
            const isDisabled = tool.disabled

            return (
              <Link
                key={tool.title}
                href={tool.href}
                className={`group relative overflow-hidden rounded-lg shadow-sm transition-all duration-300 ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-lg'
                }`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative h-full p-6 bg-white border border-gray-200 group-hover:border-gray-300 transition-colors rounded-lg">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} p-2.5 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <Icon className="w-full h-full text-white" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                    {tool.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 group-hover:text-gray-700 transition-colors">
                    {tool.description}
                  </p>

                  {!isDisabled && (
                    <div className="flex items-center text-sm font-medium text-gray-900 group-hover:gap-2 transition-all">
                      Access
                      <svg className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}

                  {isDisabled && (
                    <div className="text-xs font-medium text-gray-500">
                      Coming soon
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Links */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/manager"
              className="flex items-center gap-3 p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span>📊</span>
              <span>Manager Dashboard</span>
            </Link>
            <Link
              href="/tables"
              className="flex items-center gap-3 p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span>🍽️</span>
              <span>Table Management</span>
            </Link>
            <Link
              href="/admin/media-config"
              className="flex items-center gap-3 p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium text-purple-600"
            >
              <span>🎬</span>
              <span>Edit Media Files</span>
            </Link>
            <a
              href="/"
              className="flex items-center gap-3 p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span>🏠</span>
              <span>Back to Home</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
