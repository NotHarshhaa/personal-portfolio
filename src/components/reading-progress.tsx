'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const scrollableHeight = documentHeight - windowHeight
      const scrollProgress = (scrollTop / scrollableHeight) * 100

      setProgress(Math.min(100, Math.max(0, scrollProgress)))
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress() // Initial calculation

    return () => {
      window.removeEventListener('scroll', updateProgress)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-neutral-200 dark:bg-neutral-800 z-50">
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-primary/70"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  )
}

