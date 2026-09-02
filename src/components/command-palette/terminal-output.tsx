'use client'

import React from 'react'
import type { TerminalLog } from './types'

interface TerminalOutputProps {
  logs: TerminalLog[]
  onClear: () => void
}

export function TerminalOutput({ logs, onClear }: TerminalOutputProps) {
  if (logs.length === 0) return null

  return (
    <div className="border-b border-border bg-black/5 dark:bg-black/30 p-3 sm:p-4 font-mono space-y-3 max-h-48 overflow-y-auto">
      <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 border-b border-border/40 pb-1">
        <span>TERMINAL OUTPUT BUFFER</span>
        <button
          onClick={onClear}
          className="hover:text-foreground underline"
        >
          Clear buffer
        </button>
      </div>
      {logs.map((log) => (
        <div key={log.id} className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] text-foreground/80">
            <span className="text-emerald-500 select-none">❯</span>
            <span className="font-semibold">{log.command}</span>
            <span className="text-[9px] text-muted-foreground/50 ml-auto">{log.timestamp}</span>
          </div>
          <div className="pl-4 py-0.5">{log.output}</div>
        </div>
      ))}
    </div>
  )
}
