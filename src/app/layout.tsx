import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SplitEase - Group Billing for HORECA',
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
        <div className="min-h-screen">
          <Navigation />
          <main className="pb-20 lg:pb-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}