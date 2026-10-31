import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Corners } from '../frame'
import { type AgentMessage } from '@/lib/agent-knowledge'
import { Message, type MessageContext } from './message'

interface MessageStreamProps extends MessageContext {
  messages: AgentMessage[]
}

export function MessageStream({ messages, ...ctx }: MessageStreamProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const [showJumpToLatest, setShowJumpToLatest] = useState(false)

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Pin to the latest message on open (mount) and on every update (streaming)
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setShowJumpToLatest(el.scrollHeight - el.scrollTop - el.clientHeight > 140)
  }

  const lastAssistantId = [...messages]
    .reverse()
    .find(m => m.role === 'assistant' && !m.streaming)?.id

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        aria-label="Conversation with the portfolio agent"
        className="h-full space-y-4 overflow-y-auto px-3 py-3 text-xs sm:px-4 sm:py-4 sm:text-sm"
      >
        <div className="flex items-center justify-between border-b border-border/50 pb-2 text-[10px] font-mono tracking-widest text-muted-foreground/70 uppercase">
          <span>System: Ready</span>
          <span>Model: Grounded AI</span>
        </div>

        {messages.map(msg => (
          <Message
            key={msg.id}
            msg={msg}
            showSuggestions={msg.id === lastAssistantId}
            {...ctx}
          />
        ))}

        {ctx.isLoading && <ThinkingIndicator />}

        <div ref={endRef} />
      </div>

      {/* Jump to latest */}
      {showJumpToLatest && (
        <button
          onClick={scrollToBottom}
          aria-label="Scroll to latest message"
          className="border-border bg-background/95 absolute bottom-3 left-1/2 flex size-7 -translate-x-1/2 items-center justify-center border shadow-lg backdrop-blur-xs transition-colors hover:border-foreground/40 hover:text-foreground"
        >
          <Corners size="sm" offset="border" light />
          <ChevronDown className="size-3.5" />
        </button>
      )}
    </div>
  )
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2 border-l border-border py-2 pl-3 font-mono text-xs text-muted-foreground">
      <span className="flex gap-1">
        <span className="size-1 animate-bounce rounded-full bg-foreground/50" />
        <span className="size-1 animate-bounce rounded-full bg-foreground/50 [animation-delay:120ms]" />
        <span className="size-1 animate-bounce rounded-full bg-foreground/50 [animation-delay:240ms]" />
      </span>
      <span>querying knowledge base</span>
      <span className="animate-pulse">▌</span>
    </div>
  )
}
