'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'

interface Shortcut {
  key: string
  description: string
  action: () => void
}

export function KeyboardShortcuts() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const shortcuts: Shortcut[] = [
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
        action: () => {
          toast.info('Keyboard Shortcuts', {
            description: 'g+h: Home | g+p: Projects | g+c: Career | g+t: Contact | /: Search',
            duration: 5000
          })
        }
      }
    ]

    let keys: string[] = []

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
        keys = []
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
      if (e.key === 'g' && keys.length === 0) {
        keys.push('g')
        return
      }

      if (keys.length === 1 && keys[0] === 'g') {
        const secondKey = e.key.toLowerCase()
        const shortcutKey = `g ${secondKey}`
        const shortcut = shortcuts.find((s) => s.key === shortcutKey)
        
        if (shortcut) {
          e.preventDefault()
          shortcut.action()
          keys = []
        } else {
          keys = []
        }
        return
      }

      keys = []
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [router, pathname])

  return null
}

