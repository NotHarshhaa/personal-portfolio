import { Bot, Check, ChevronRight, Copy } from 'lucide-react'
import { Corners } from '../frame'
import { type AgentMessage } from '@/lib/agent-knowledge'
import { cn } from '@/lib/utils'
import { FormattedText } from './formatted-text'

/** State and callbacks shared by every message in the stream */
export interface MessageContext {
  isLoading: boolean
  streamingActive: boolean
  copiedId: string | null
  onSkipStream: () => void
  onSend: (text: string) => void
  onCopy: (msg: AgentMessage) => void
  onNavigate: () => void
}

interface MessageProps extends MessageContext {
  msg: AgentMessage
  /** Only the latest assistant reply offers follow-up chips */
  showSuggestions: boolean
}

export function Message({
  msg,
  showSuggestions,
  isLoading,
  streamingActive,
  copiedId,
  onSkipStream,
  onSend,
  onCopy,
  onNavigate,
}: MessageProps) {
  if (msg.role === 'user') {
    return (
      <div className="flex items-start gap-2 border-l border-foreground/30 py-1 pl-2.5 font-mono text-xs text-muted-foreground">
        <span className="text-foreground/70 select-none">
          visitor@portfolio:~$
        </span>
        <span className="flex-1 font-sans text-xs break-words text-foreground sm:text-sm">
          {msg.content}
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <AssistantMessage
        msg={msg}
        copiedId={copiedId}
        onSkipStream={onSkipStream}
        onCopy={onCopy}
        onNavigate={onNavigate}
      />

      {/* Suggested Questions — latest reply only */}
      {showSuggestions && !isLoading && !streamingActive && (
        <SuggestionChips
          suggestions={msg.suggestions}
          isLoading={isLoading}
          onSend={onSend}
        />
      )}
    </div>
  )
}

function AssistantMessage({
  msg,
  copiedId,
  onSkipStream,
  onCopy,
  onNavigate,
}: {
  msg: AgentMessage
  copiedId: string | null
  onSkipStream: () => void
  onCopy: (msg: AgentMessage) => void
  onNavigate: () => void
}) {
  return (
    <div
      className={cn(
        'group/msg relative space-y-1 border-l py-1 pl-3',
        msg.isError ? 'border-rose-500/50' : 'border-border'
      )}
    >
      {/* Meta row */}
      <div className="flex items-center gap-1.5">
        <span className="border-border bg-muted/40 relative flex size-4 items-center justify-center border">
          <Corners size="sm" offset="none" weight="thin" light />
          <Bot className="size-2.5 text-foreground/80" />
        </span>
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground/70 uppercase">
          {msg.isError ? 'system' : 'agent'}
        </span>
        {msg.isError && (
          <span className="font-mono text-[10px] tracking-widest text-rose-500/90 uppercase">
            error
          </span>
        )}
      </div>

      {/* Content — click to skip the streaming reveal */}
      <div
        onClick={msg.streaming ? onSkipStream : undefined}
        title={msg.streaming ? 'Click to reveal instantly' : undefined}
        className={cn(msg.streaming && 'cursor-pointer')}
      >
        <FormattedText text={msg.content} onNavigate={onNavigate} />
        {msg.streaming && (
          <span
            aria-hidden
            className="bg-foreground/70 ml-0.5 inline-block h-3 w-1.5 animate-pulse align-middle"
          />
        )}
      </div>

      {/* Actions: timestamp + copy */}
      {!msg.streaming && (
        <div className="flex items-center gap-2 pt-0.5 opacity-60 transition-opacity sm:opacity-0 sm:group-focus-within/msg:opacity-100 sm:group-hover/msg:opacity-100">
          <span className="font-mono text-[10px] text-muted-foreground/50 tabular-nums">
            {msg.timestamp}
          </span>
          {!msg.isError && (
            <button
              onClick={() => onCopy(msg)}
              aria-label="Copy reply"
              className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              {copiedId === msg.id ? (
                <>
                  <Check className="size-3 text-emerald-500" />
                  <span className="text-emerald-500">copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>copy</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function SuggestionChips({
  suggestions,
  isLoading,
  onSend,
}: {
  suggestions?: string[]
  isLoading: boolean
  onSend: (text: string) => void
}) {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {suggestions.map((suggestion, sIdx) => (
        <button
          key={sIdx}
          onClick={() => onSend(suggestion)}
          disabled={isLoading}
          className="group/chip relative inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground active:text-foreground disabled:opacity-50"
        >
          <Corners
            size="sm"
            offset="none"
            weight="thin"
            light
            className="transition-colors group-hover/chip:border-foreground/50"
          />
          <ChevronRight className="size-3 text-muted-foreground/60 transition-transform group-hover/chip:translate-x-0.5" />
          <span>{suggestion}</span>
        </button>
      ))}
    </div>
  )
}
