'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { ScrollToTop } from '@/components/scroll-to-top'
import { SkipToContent } from '@/components/skip-to-content'
import { AIAgentModal } from '@/components/ai-agent-modal'

export function ClientLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <SkipToContent />
      <AnimatePresence mode="wait">
        {mounted && (
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="site-shell relative flex min-h-screen w-full flex-col pt-24 pb-8 sm:pt-28"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      <ScrollToTop />
      <AIAgentModal />
    </>
  )
}
