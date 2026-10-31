'use client'

import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { isMobileOrTablet } from '@/lib/utils'

interface UseAgentDialogOptions {
  inputRef: RefObject<HTMLTextAreaElement | null>
  streamingId: string | null
  skipStream: () => void
}

/** Dialog shell behavior: open state, shortcuts, focus trap, scroll lock */
export function useAgentDialog({
  inputRef,
  streamingId,
  skipStream,
}: UseAgentDialogOptions) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Ctrl/⌘+I toggles the agent from anywhere
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Escape: skip the streaming animation first, then close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !isOpen) return
      if (streamingId) {
        skipStream()
        return
      }
      setIsOpen(false)
      // Return focus to the launcher for keyboard users
      setTimeout(() => launcherRef.current?.focus(), 80)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, streamingId, skipStream])

  // Trap Tab focus inside the dialog while open
  useEffect(() => {
    if (!isOpen) return
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const root = dialogRef.current
      if (!root) return
      const focusables = root.querySelectorAll<HTMLElement>(
        'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (!first || !last) return
      const active = document.activeElement
      if (e.shiftKey) {
        if (active === first || !root.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else if (active === last || !root.contains(active)) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleTab, true)
    return () => document.removeEventListener('keydown', handleTab, true)
  }, [isOpen])

  // Lock background body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Only auto-focus input when opening on desktop (never on mobile or tablet)
  useEffect(() => {
    if (isOpen && !isMobileOrTablet()) {
      const timer = setTimeout(() => inputRef.current?.focus(), 120)
      return () => clearTimeout(timer)
    }
  }, [isOpen, inputRef])

  return { isOpen, setIsOpen, mounted, launcherRef, dialogRef }
}
