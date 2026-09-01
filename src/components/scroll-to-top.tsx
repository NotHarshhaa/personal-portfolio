'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from './ui/button'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isVisible) return null

  return (
    <div className="fixed right-4 bottom-16 sm:right-6 sm:bottom-20 z-40">
      <Button
        onClick={scrollToTop}
        size="icon"
        variant="default"
        aria-label="Scroll to top"
      >
        <ArrowUp className="size-5" />
      </Button>
    </div>
  )
}
