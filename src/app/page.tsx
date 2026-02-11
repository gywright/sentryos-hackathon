'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

const Desktop = dynamic(
  () => import('@/components/desktop/Desktop').then(mod => mod.Desktop),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-[#0f0c14] flex items-center justify-center">
        <div className="text-[#7553ff] text-xl animate-pulse">Loading SentryOS...</div>
      </div>
    )
  }
)

export default function Home() {
  useEffect(() => {
    const startTime = performance.now()

    Sentry.logger.info('SentryOS application initialized')
    Sentry.metrics.count('app.load', 1)

    // Track page load time
    if (typeof window !== 'undefined' && window.performance) {
      const loadTime = performance.now() - startTime
      Sentry.metrics.distribution('app.load.time', loadTime, {
        unit: 'millisecond'
      })

      // Track navigation timing if available
      if (window.performance.timing) {
        const perfData = window.performance.timing
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
        if (pageLoadTime > 0) {
          Sentry.metrics.distribution('app.page.load.duration', pageLoadTime, {
            unit: 'millisecond'
          })
        }
      }
    }
  }, [])

  return <Desktop />
}
