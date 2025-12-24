'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface KeyboardShortcutsProps {
  onShowModal: () => void
}

export function KeyboardShortcuts({ onShowModal }: KeyboardShortcutsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const keysRef = useRef<string[]>([])

  useEffect(() => {
    const shortcuts: Array<{
      key: string
      description: string
      action: () => void
    }> = [
      {
        key: 'g h',
        description: 'Go to Home',
        action: () => router.push('/')
      },
      {
        key: 'g p',
        description: 'Go to Projects',
        action: () => router.push('/projects')
      },
      {
        key: 'g c',
        description: 'Go to Career',
        action: () => router.push('/career')
      },
      {
        key: 'g t',
        description: 'Go to Contact',
        action: () => router.push('/contact')
      },
      {
        key: '/',
        description: 'Focus search (on projects page)',
        action: () => {
          if (pathname === '/projects') {
            const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement
            if (searchInput) {
              searchInput.focus()
            }
          }
        }
      },
      {
        key: '?',
        description: 'Show keyboard shortcuts',
        action: () => onShowModal()
      }
    ]

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      // Handle Escape key to clear
      if (e.key === 'Escape') {
        keysRef.current = []
        return
      }

      // Handle single key shortcuts
      if (e.key === '/' || e.key === '?') {
        e.preventDefault()
        const shortcut = shortcuts.find((s) => s.key === e.key)
        if (shortcut) {
          shortcut.action()
        }
        return
      }

      // Handle multi-key shortcuts (g + h, g + p, etc.)
      if (e.key === 'g' && keysRef.current.length === 0) {
        keysRef.current.push('g')
        return
      }

      if (keysRef.current.length === 1 && keysRef.current[0] === 'g') {
        const secondKey = e.key.toLowerCase()
        const shortcutKey = `g ${secondKey}`
        const shortcut = shortcuts.find((s) => s.key === shortcutKey)
        
        if (shortcut) {
          e.preventDefault()
          shortcut.action()
          keysRef.current = []
        } else {
          keysRef.current = []
        }
        return
      }

      keysRef.current = []
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [router, pathname, onShowModal])

  return null
}

