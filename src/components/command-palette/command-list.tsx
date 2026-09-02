'use client'

import React, { forwardRef } from 'react'
import { Corners } from '../frame'
import type { CommandItem } from './types'

interface CommandListProps {
  query: string
  filteredCommands: CommandItem[]
  selectedIndex: number
  setSelectedIndex: (index: number) => void
}

export const CommandList = forwardRef<HTMLDivElement, CommandListProps>(
  function CommandList(
    { query, filteredCommands, selectedIndex, setSelectedIndex },
    ref
  ) {
    return (
      <div
        ref={ref}
        className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1 text-xs"
      >
        {filteredCommands.length === 0 ? (
          <div className="py-8 text-center font-mono text-xs text-muted-foreground space-y-2">
            <p>No matching actions found for &quot;{query}&quot;</p>
            <p className="text-[11px]">
              Press <kbd className="border border-border bg-muted px-1.5 py-0.5">Enter ↵</kbd> to run &quot;{query}&quot; as a CLI command (try <code className="text-foreground">help</code>)
            </p>
          </div>
        ) : (
          filteredCommands.map((item, index) => {
            const Icon = item.icon
            const isSelected = index === selectedIndex

            return (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`group relative flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors ${
                  isSelected
                    ? 'bg-muted/60 text-foreground'
                    : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                }`}
              >
                {isSelected && (
                  <Corners size="sm" offset="border" weight="thin" light />
                )}
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`size-4 shrink-0 transition-colors ${
                      isSelected ? 'text-foreground' : 'text-muted-foreground/70'
                    }`}
                  />
                  <div className="min-w-0">
                    <p
                      className={`font-medium tracking-wide truncate ${
                        isSelected ? 'text-foreground' : 'text-foreground/90'
                      }`}
                    >
                      {item.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70 truncate">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                  <span className="hidden sm:inline border border-border/60 px-1.5 py-0.5 text-muted-foreground/60 uppercase">
                    {item.category}
                  </span>
                  {item.shortcut && (
                    <kbd className="border border-border bg-background px-1.5 py-0.5 text-foreground/80">
                      {item.shortcut}
                    </kbd>
                  )}
                </div>
              </button>
            )
          })
        )}
      </div>
    )
  }
)
