import React from 'react'

export interface CommandItem {
  id: string
  title: string
  description: string
  category: 'Navigation' | 'Platform Actions' | 'External' | 'CLI Command'
  icon: React.ComponentType<{ className?: string }>
  shortcut?: string
  action: () => void
}

export interface TerminalLog {
  id: string
  command: string
  output: React.ReactNode
  timestamp: string
}
