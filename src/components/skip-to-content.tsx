'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function SkipToContent() {
  return (
    <motion.div
      initial={{ y: -100 }}
      whileFocus={{ y: 0 }}
      className="absolute left-4 top-4 z-50 -translate-y-full focus-within:translate-y-0 transition-transform"
    >
      <Link
        href="#main-content"
        className="bg-primary text-white dark:text-black px-4 py-2 rounded-md font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Skip to main content
      </Link>
    </motion.div>
  )
}

