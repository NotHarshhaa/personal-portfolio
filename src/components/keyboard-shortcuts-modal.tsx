'use client'

import { useEffect } from 'react'
import { Keyboard } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

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

export function KeyboardShortcutsModal({ isOpen, onOpenChange }: KeyboardShortcutsModalProps) {
  // Handle Escape key to close modal
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
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 sm:left-1/2 sm:inset-x-auto sm:w-full sm:max-w-2xl z-[100] -translate-y-1/2 sm:-translate-x-1/2 transform pointer-events-none"
          >
              <div className={cn(
                'rounded-2xl border border-border/50',
                'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl',
                'shadow-2xl p-4 sm:p-6',
                'max-h-[85vh] sm:max-h-[90vh] overflow-y-auto',
                'pointer-events-auto'
              )}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4 sm:mb-6 gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <Keyboard className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                        Keyboard Shortcuts
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5 sm:mt-1">
                        Use these shortcuts to navigate faster
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onOpenChange(false)}
                    className="size-8 hover:bg-primary/10 flex-shrink-0"
                    aria-label="Close"
                  >
                    <span className="text-xl">×</span>
                  </Button>
                </div>

                {/* Shortcuts List */}
                <div className="space-y-2 sm:space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0',
                        'py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg',
                        'border border-border/50',
                        'bg-neutral-50/50 dark:bg-neutral-800/50',
                        'hover:bg-neutral-100/50 dark:hover:bg-neutral-700/50',
                        'transition-colors'
                      )}
                    >
                      <span className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                        {shortcut.keys.map((key, keyIndex) => (
                          <div key={keyIndex} className="flex items-center gap-1 sm:gap-1.5">
                            <kbd
                              className={cn(
                                'px-2 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold',
                                'text-neutral-700 dark:text-neutral-300',
                                'bg-white dark:bg-neutral-800',
                                'border border-neutral-300 dark:border-neutral-700',
                                'rounded-md shadow-sm',
                                'min-w-[1.75rem] sm:min-w-[2rem] text-center'
                              )}
                            >
                              {key === ' ' ? 'Space' : key.toUpperCase()}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-neutral-400 dark:text-neutral-600 text-xs sm:text-sm font-medium">
                                +
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border/50">
                  <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 text-center">
                    Press <kbd className="px-1 sm:px-1.5 py-0.5 text-[10px] sm:text-xs bg-neutral-200 dark:bg-neutral-800 rounded mx-0.5 sm:mx-1">Esc</kbd> or click outside to close
                  </p>
                </div>
              </div>
            </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
