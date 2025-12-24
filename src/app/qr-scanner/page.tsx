'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import QRCode from 'react-qr-code'
import { useAuth } from '@/contexts/AuthContext'
import { 
  QrCodeIcon,
  CameraIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline'

export default function QRScannerPage() {
  const [scannedData, setScannedData] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { loginWithQR, isLoading, user } = useAuth()

  // Demo QR codes for testing
  const demoQRCodes = [
    {
      table: '7',
      restaurant: 'Le Gourmet',
      data: 'table-7-session-abc123',
      description: 'Table 7 - Main dining room'
    },
    {
      table: '12',
      restaurant: 'Le Gourmet', 
      data: 'table-12-session-def456',
      description: 'Table 12 - Window seating'
    },
    {
      table: '3',
      restaurant: 'Le Gourmet',
      data: 'table-3-session-ghi789', 
      description: 'Table 3 - Private booth'
    }
  ]

  // Extract table ID from QR data and redirect
  const getTableIdFromQR = (data: string): string | null => {
    const match = data.match(/table-(\d+)-/)
    return match ? match[1] : null
  }

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/customer')
    }
  }, [user, router])

  const handleQRScan = async (data: string) => {
    setError('')
    setIsScanning(true)

    try {
      const success = await loginWithQR(data)
      if (success) {
        const tableId = getTableIdFromQR(data)
        setSuccess(true)
        setTimeout(() => {
          router.push(tableId ? `/table/${tableId}` : '/customer')
        }, 1500)
      } else {
        setError('Invalid QR code. Please try scanning the QR code from your table.')
      }
    } catch (err) {
      setError('Failed to process QR code. Please try again.')
    } finally {
      setIsScanning(false)
    }
  }

  const handleManualInput = async () => {
    if (!scannedData.trim()) {
      setError('Please enter a valid table code')
      return
    }
    await handleQRScan(scannedData.trim())
  }

  const handleDemoQR = async (data: string) => {
    setScannedData(data)
    await handleQRScan(data)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome!</h1>
          <p className="text-lg text-gray-600 mb-6">
            You&apos;re now connected to your table. Redirecting to your dining experience...
          </p>
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/login"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to Login</span>
            </Link>
            
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-gray-900">SplitEase</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <QrCodeIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Scan Your Table QR Code
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scan the QR code at your table to access the menu, place orders, 
            and split the bill with your group.
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* QR Scanner Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Scan QR Code
            </h2>
            
            {/* Simulated Camera View */}
            <div className="bg-gray-100 rounded-2xl p-8 mb-6 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <CameraIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Camera Scanner</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Point your camera at the QR code on your table
                </p>
                <button 
                  onClick={() => setError('Camera access not available in demo. Please use manual input or demo QR codes below.')}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Enable Camera
                </button>
              </div>
            </div>

            {/* Manual Input */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Manual Entry</h3>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={scannedData}
                  onChange={(e) => setScannedData(e.target.value)}
                  placeholder="Enter table code manually"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={handleManualInput}
                  disabled={isLoading || !scannedData.trim()}
                  className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ClipboardDocumentIcon className="w-5 h-5" />
                      <span>Connect</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Demo QR Codes */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Demo Tables
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Try these demo QR codes to explore the customer experience
            </p>

            <div className="space-y-6">
              {demoQRCodes.map((qr, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Table {qr.table}</h3>
                      <p className="text-sm text-gray-600">{qr.description}</p>
                    </div>
                    <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg p-1">
                      <QRCode 
                        value={qr.data} 
                        size={56}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDemoQR(qr.data)}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading && scannedData === qr.data ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                      `Connect to Table ${qr.table}`
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-700">
                <strong>💡 Tip:</strong> In a real restaurant, you&apos;d scan the QR code 
                printed on your table or provided by your server.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            How it Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Scan QR Code',
                description: 'Use your phone to scan the QR code at your table or enter the table code manually'
              },
              {
                step: '2', 
                title: 'Join Your Table',
                description: 'Get instant access to your table\'s digital menu and ordering system'
              },
              {
                step: '3',
                title: 'Order & Split',
                description: 'Place orders, collaborate with your group, and easily split the bill when ready'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}