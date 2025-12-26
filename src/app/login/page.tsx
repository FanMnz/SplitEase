'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth, UserRole } from '@/contexts/AuthContext'
import { 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon,
  KeyIcon,
  QrCodeIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface LoginFormProps {
  role: UserRole
  onSuccess: () => void
}

function LoginForm({ role, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    const success = await login(email, password, role)
    if (success) {
      onSuccess()
    } else {
      setError('Invalid credentials. Please try again.')
    }
  }

  const roleConfig = {
    manager: {
      title: 'Manager Portal',
      subtitle: 'Access executive dashboard and analytics',
      buttonText: 'Sign In as Manager',
      bgColor: 'bg-blue-500',
      bgGradient: 'from-blue-500 to-blue-600',
      icon: '👨‍💼',
      demoEmail: 'manager@restaurant.com',
      demoPassword: 'manager123'
    },
    waiter: {
      title: 'Staff Portal',
      subtitle: 'Access waiter interface and table management',
      buttonText: 'Sign In as Staff',
      bgColor: 'bg-green-500',
      bgGradient: 'from-green-500 to-green-600',
      icon: '👨‍🍳',
      demoEmail: 'waiter@restaurant.com',
      demoPassword: 'waiter123'
    },
    customer: {
      title: 'Guest Access',
      subtitle: 'Scan QR code from your table',
      buttonText: 'Continue as Guest',
      bgColor: 'bg-purple-500',
      bgGradient: 'from-purple-500 to-purple-600',
      icon: '👥',
      demoEmail: '',
      demoPassword: ''
    }
  }

  const config = roleConfig[role]

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">{config.icon}</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{config.title}</h2>
        <p className="text-gray-600">{config.subtitle}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 bg-gradient-to-r ${config.bgGradient} text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>{config.buttonText}</span>
              <ArrowRightIcon className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials */}
      {config.demoEmail && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-600 mb-2">Demo Credentials:</p>
          <p className="text-sm font-mono text-gray-700">Email: {config.demoEmail}</p>
          <p className="text-sm font-mono text-gray-700">Password: {config.demoPassword}</p>
        </div>
      )}
    </div>
  )
}

function LoginPageContent() {
  const router = useRouter()
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get('role') as UserRole | null
  const [selectedRole, setSelectedRole] = useState<UserRole>('manager')

  // Set selected role from URL parameter after mount
  useEffect(() => {
    if (roleParam && ['manager', 'waiter'].includes(roleParam)) {
      setSelectedRole(roleParam)
    }
  }, [roleParam])

  // Redirect if already authenticated
  if (user) {
    switch (user.role) {
      case 'manager':
        router.push('/manager')
        break
      case 'waiter':
        router.push('/waiter')
        break
      case 'customer':
        router.push('/customer')
        break
    }
    return null
  }

  const handleLoginSuccess = () => {
    // Redirect will happen via the useEffect above
    switch (selectedRole) {
      case 'manager':
        router.push('/manager')
        break
      case 'waiter':
        router.push('/waiter')
        break
      case 'customer':
        router.push('/customer')
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left">
          <Link href="/" className="inline-flex items-center space-x-3 group mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">SplitEase</span>
              <span className="text-sm text-gray-500 -mt-1">Billing Solutions</span>
            </div>
          </Link>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Welcome to your
            <span className="block text-brand-600">Restaurant Portal</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            Access your role-specific dashboard to manage operations, serve customers, 
            or enjoy your dining experience.
          </p>

          {/* Role Selection - Only show if no role parameter in URL */}
          {!roleParam && (
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              {[
                { role: 'manager' as UserRole, label: 'Manager', icon: '👨‍💼', color: 'blue' },
                { role: 'waiter' as UserRole, label: 'Staff', icon: '👨‍🍳', color: 'green' }
              ].map(({ role, label, icon, color }) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    selectedRole === role
                      ? `bg-${color}-500 text-white shadow-lg`
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{icon}</span>
                  <span>{label} Portal</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Login Form */}
        <div className="flex justify-center">
          <LoginForm role={selectedRole} onSuccess={handleLoginSuccess} />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  )
}