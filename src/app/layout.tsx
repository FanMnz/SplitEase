import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import { AuthProvider } from '@/contexts/AuthContext'
import { OrderProvider } from '@/contexts/OrderContext'
import { PaymentProvider } from '@/contexts/PaymentContext'
import { RealtimeProvider } from '@/contexts/RealtimeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SplitEase - Group Billing Made Easy',
  description: 'Revolutionizing group billing and order management in hotels, restaurants, cafes, bars, and entertainment venues.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#0ea5e9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} bg-neutral-50 antialiased`}>
        <AuthProvider>
          <OrderProvider>
            <PaymentProvider>
              <RealtimeProvider>
                <div className="min-h-screen">
                  <Navigation />
                  <main className="pb-20 lg:pb-0">
                  {children}
                </main>
              </div>
              </RealtimeProvider>
            </PaymentProvider>
          </OrderProvider>
        </AuthProvider>
      </body>
    </html>
  )
}