"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AnnouncementHero from '@/components/media/AnnouncementHero'
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
      {/* Hero using AnnouncementHero over background video */}
      <AnnouncementHero
        playbackId={mediaConfig.background.playbackId}
        poster={mediaConfig.background.poster}
        badgeLabel="Revolutionizing Billing Operations"
        title="Make Group Billing"
        highlight="Effortless"
        subtitle={
          'Transform your restaurant operations with SplitEase. Eliminate billing confusion, speed up table turnover, and delight your customers with seamless payment experiences.'
        }
        ctaLabel="Manager Dashboard"
        onCtaClick={() => window.location.assign('/manager')}
        secondaryCtaLabel="Waiter Interface"
        onSecondaryCtaClick={() => window.location.assign('/waiter')}
      />

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