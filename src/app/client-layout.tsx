'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { ScrollToTop } from '@/components/scroll-to-top'
import { SkipToContent } from '@/components/skip-to-content'
import { ReadingProgress } from '@/components/reading-progress'

export function ClientLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <SkipToContent />
      <ReadingProgress />
      <AnimatePresence mode='wait'>
        {mounted && (
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative flex flex-col items-center justify-center w-full min-h-screen px-4 sm:px-6 lg:px-8 pt-24 md:pt-[130px] pb-8 isolate overflow-hidden
                       before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] 
                       before:from-purple-400/30 before:via-violet-400/10 before:to-transparent before:blur-3xl"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      <ScrollToTop />
    </>
  )
}

