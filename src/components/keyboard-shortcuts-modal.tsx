'use client'

import { useEffect } from 'react'
import { Keyboard } from 'lucide-react'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './ui/card'

interface Shortcut {
  keys: string[]
  description: string
}

const shortcuts: Shortcut[] = [
  { keys: ['g', 'h'], description: 'Go to Home' },
  { keys: ['g', 'p'], description: 'Go to Projects' },
  { keys: ['g', 'c'], description: 'Go to Career' },
  { keys: ['g', 't'], description: 'Go to Contact' },
  { keys: ['/'], description: 'Focus search (on projects page)' },
  { keys: ['?'], description: 'Show keyboard shortcuts' }
]

interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcutsModal({
  isOpen,
  onOpenChange
}: KeyboardShortcutsModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onOpenChange(false)
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onOpenChange])

  if (!isOpen) return null

  return (
    <>
      <div
        onClick={() => onOpenChange(false)}
        className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
      />

      <div className="pointer-events-none fixed inset-x-4 top-1/2 z-[100] max-h-[85vh] -translate-y-1/2 transform sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-2xl sm:-translate-x-1/2">
        <Card className="pointer-events-auto max-h-[85vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Keyboard className="size-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <CardTitle>Keyboard Shortcuts</CardTitle>
                  <CardDescription>
                    Use these shortcuts to navigate faster
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                aria-label="Close"
              >
                <span className="text-xl">×</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex flex-col justify-between gap-2 border border-border bg-muted/50 px-4 py-3 sm:flex-row sm:items-center"
              >
                <span className="text-sm font-medium">
                  {shortcut.description}
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {shortcut.keys.map((key, keyIndex) => (
                    <div key={keyIndex} className="flex items-center gap-1.5">
                      <kbd className="min-w-[2rem] border border-border bg-background px-2.5 py-1 text-center text-xs font-semibold">
                        {key === ' ' ? 'Space' : key.toUpperCase()}
                      </kbd>
                      {keyIndex < shortcut.keys.length - 1 && (
                        <span className="text-xs font-medium text-muted-foreground">
                          +
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <p className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
              Press{' '}
              <kbd className="mx-1 border border-border bg-muted px-1.5 py-0.5 text-xs">
                Esc
              </kbd>{' '}
              or click outside to close
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
