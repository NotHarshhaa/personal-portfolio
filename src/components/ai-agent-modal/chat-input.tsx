import type { RefObject } from 'react'
import { Send } from 'lucide-react'
import { Corners } from '../frame'
import { Button } from '../ui/button'
import { MAX_INPUT_LENGTH } from './session'

interface ChatInputProps {
  inputRef: RefObject<HTMLTextAreaElement | null>
  value: string
  /** Fired on every keystroke — wire auto-resize in the parent */
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
  streamingActive: boolean
}

export function ChatInput({
  inputRef,
  value,
  onChange,
  onSubmit,
  isLoading,
  streamingActive,
}: ChatInputProps) {
  const canSend = Boolean(value.trim()) && !isLoading && !streamingActive

  return (
    <div className="border-border bg-muted/10 shrink-0 border-t p-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] sm:p-3.5 sm:pb-3.5">
      <form
        onSubmit={e => {
          e.preventDefault()
          onSubmit()
        }}
        className="flex items-end gap-2"
      >
        <div className="relative flex-1">
          <textarea
            ref={inputRef}
            rows={1}
            maxLength={MAX_INPUT_LENGTH}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                onSubmit()
              }
            }}
            placeholder="Ask about AI infra, K8s, projects..."
            aria-label="Message the portfolio agent"
            className="border-border bg-background placeholder:text-muted-foreground/60 focus:border-foreground/50 w-full resize-none border px-3 py-2 text-base text-foreground focus:outline-none sm:text-sm"
          />
          <Corners size="sm" offset="border" weight="thin" light />
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={!canSend}
          className="relative h-10 shrink-0 px-3.5 text-xs font-semibold tracking-wider uppercase sm:h-9 sm:px-3"
        >
          <Send className="size-3.5 sm:size-3" />
          <span className="hidden sm:inline">Ask</span>
        </Button>
      </form>
      <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-muted-foreground/60">
        <span>
          <span className="hidden sm:inline">Enter ↵ send · </span>
          <span className="hidden md:inline">⇧↵ newline · </span>
          <span>Esc close</span>
        </span>
        <span className="tabular-nums">
          {value.length > 0
            ? `${value.length}/${MAX_INPUT_LENGTH}`
            : '⌘/Ctrl+I toggle'}
        </span>
      </div>
    </div>
  )
}
