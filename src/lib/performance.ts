// Performance monitoring utilities
export const performanceUtils = {
  // Track Core Web Vitals
  trackWebVitals: () => {
    if (typeof window !== 'undefined') {
      // Track Largest Contentful Paint (LCP)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.log('LCP:', entry.startTime)
          // Send to analytics service
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // Track First Input Delay (FID)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const fidEntry = entry as PerformanceEventTiming
          console.log('FID:', fidEntry.processingStart - fidEntry.startTime)
          // Send to analytics service
        }
      }).observe({ entryTypes: ['first-input'] })

      // Track Cumulative Layout Shift (CLS)
      new PerformanceObserver((entryList) => {
        let clsValue = 0
        for (const entry of entryList.getEntries()) {
          const clsEntry = entry as PerformanceEntry & { value: number; hadRecentInput: boolean }
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value
          }
        }
        console.log('CLS:', clsValue)
        // Send to analytics service
      }).observe({ entryTypes: ['layout-shift'] })
    }
  },

  // Track page load time
  trackPageLoad: () => {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart
        console.log('Page Load Time:', loadTime)
        // Send to analytics service
      })
    }
  },

  // Track component render time
  trackComponentRender: (componentName: string) => {
    const start = window.performance.now()
    return () => {
      const end = window.performance.now()
      const duration = end - start
      console.log(`${componentName} render time:`, duration)
      // Send to analytics service
    }
  }
}

// Initialize performance tracking
if (typeof window !== 'undefined') {
  performanceUtils.trackWebVitals()
  performanceUtils.trackPageLoad()
}
