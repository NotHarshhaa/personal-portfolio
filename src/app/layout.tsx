import type { Metadata } from 'next'
import { ViewTransitions } from 'next-view-transitions'
import { Instrument_Sans } from 'next/font/google'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { StructuredData } from '@/components/structured-data'
import { cn } from '@/lib/utils'
import { metadata as siteMetadata } from './metadata'
import './globals.css'

import { ClientLayout } from './client-layout'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans'
})

export const metadata: Metadata = siteMetadata

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn(
        'min-h-screen font-sans antialiased overflow-y-scroll',
        instrumentSans.variable
      )}
      suppressHydrationWarning
    >
      <body className="w-full">
        <StructuredData />
        <ViewTransitions>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
              <Header />
              <ClientLayout>
                <main id="main-content">{children}</main>
                <Footer />
              </ClientLayout>
            </TooltipProvider>
            <Toaster />
          </ThemeProvider>
          <Analytics />
          <SpeedInsights />
        </ViewTransitions>
      </body>
    </html>
  )
}
