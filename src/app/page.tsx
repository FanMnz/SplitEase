"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AnnouncementHero from '@/components/media/AnnouncementHero'
import BackgroundVideo from '@/components/media/BackgroundVideo'
import { useMediaConfig } from '@/hooks/useMediaConfig'

export default function Home() {
  const mediaConfig = useMediaConfig()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch - use defaults until mounted
  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-brand-50" />
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-brand-50">
      {/* Hero Video Announcement */}
      <AnnouncementHero
        playbackId={mediaConfig.announcement.playbackId}
        title="Tonight: Live Jazz & Seasonal Menu"
        subtitle="Experience signature dishes and crafted cocktails"
        ctaLabel="Reserve a Table"
        onCtaClick={() => window.location.assign('/tables')}
        poster={mediaConfig.announcement.poster}
      />

      {/* Full-screen background visual section */}
      <BackgroundVideo
        playbackId={mediaConfig.background.playbackId}
        poster={mediaConfig.background.poster}
      />
      {/* Hero Section */}
      <section className="container-mobile pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-8">
              <span className="mr-2">🚀</span>
              Revolutionizing Billing Operations
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-neutral-900 mb-6 text-balance">
              Make Group Billing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-500">
                Effortless
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-neutral-600 mb-12 max-w-3xl mx-auto text-balance leading-relaxed">
              Transform your restaurant operations with SplitEase. Eliminate billing confusion, 
              speed up table turnover, and delight your customers with seamless payment experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/manager" className="btn btn-primary btn-lg group">
                <span>Manager Dashboard</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/waiter" className="btn btn-secondary btn-lg group">
                <span>Waiter Interface</span>
                <span className="ml-2">👨‍🍳</span>
              </Link>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="animate-slide-up">
            <p className="text-sm text-neutral-500 mb-6">Trusted by 500+ restaurants worldwide</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="bg-neutral-100 px-4 py-2 rounded-lg text-sm font-medium">Restaurant A</div>
              <div className="bg-neutral-100 px-4 py-2 rounded-lg text-sm font-medium">Hotel B</div>
              <div className="bg-neutral-100 px-4 py-2 rounded-lg text-sm font-medium">Cafe C</div>
              <div className="bg-neutral-100 px-4 py-2 rounded-lg text-sm font-medium">Bar D</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-white" id="features">
        <div className="container-mobile">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-neutral-900 mb-6">
              Everything You Need to
              <span className="block text-brand-600">Streamline Operations</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Comprehensive tools designed specifically for the hospitality industry
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: '📱',
                title: 'Digital Order Management',
                description: 'Create individual guest profiles and assign orders precisely. No more confusion about who ordered what.',
                features: ['Individual guest tracking', 'Real-time order sync', 'Kitchen integration'],
                color: 'brand'
              },
              {
                icon: '💰',
                title: 'Smart Bill Splitting',
                description: 'Automatic calculation with personalized bills delivered via SMS, email, or QR codes.',
                features: ['Multiple split methods', 'Digital bill delivery', 'Payment tracking'],
                color: 'success'
              },
              {
                icon: '⚡',
                title: 'Instant Checkout',
                description: 'Guests can pay and leave early without disrupting the group or waiting for others.',
                features: ['Early departure', 'Instant processing', 'Group harmony'],
                color: 'warning'
              }
            ].map((feature, index) => (
              <div key={index} className="card-interactive animate-slide-up group" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="card-body">
                  <div className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">{feature.title}</h3>
                  <p className="text-neutral-600 mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center text-sm text-neutral-600">
                        <svg className="w-4 h-4 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-brand-50 to-neutral-50">
        <div className="container-mobile">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-neutral-900 mb-6">
              Measurable Business Impact
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Real results from restaurants using SplitEase
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { metric: '15%', label: 'Faster Table Turnover', description: 'Eliminate payment delays' },
              { metric: '30%', label: 'Staff Efficiency', description: 'Reduce manual calculations' },
              { metric: '25%', label: 'Kitchen Workflow', description: 'Better order organization' },
              { metric: '20%', label: 'Customer Satisfaction', description: 'Smoother experiences' }
            ].map((stat, index) => (
              <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="card">
                  <div className="card-body">
                    <div className="text-4xl lg:text-5xl font-bold text-brand-600 mb-2">{stat.metric}</div>
                    <div className="text-lg font-semibold text-neutral-900 mb-2">{stat.label}</div>
                    <div className="text-sm text-neutral-600">{stat.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-brand-600 to-brand-700 text-white">
        <div className="container-mobile text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl mb-12 text-brand-100 max-w-2xl mx-auto">
            Join hundreds of restaurants already improving their operations with SplitEase
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/dashboard" className="btn bg-white text-brand-600 hover:bg-neutral-50 btn-lg">
              Start Free Trial
            </Link>
            <Link href="/contact" className="btn btn-ghost border-white text-white hover:bg-white/10 btn-lg">
              Schedule Demo
            </Link>
          </div>
          
          <div className="text-sm text-brand-200">
            ✓ 30-day free trial &nbsp;&nbsp;•&nbsp;&nbsp; ✓ No setup fees &nbsp;&nbsp;•&nbsp;&nbsp; ✓ Cancel anytime
          </div>
        </div>
      </section>
    </main>
  )
}