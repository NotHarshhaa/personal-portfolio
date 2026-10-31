'use client'

import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  RotateCcw,
  Send,
  X,
} from 'lucide-react'
import { Corners, CornerBadge, Frame } from './frame'
import { Button } from './ui/button'
import {
  type AgentMessage,
  INITIAL_SUGGESTIONS,
  getLocalAgentResponse,
} from '@/lib/agent-knowledge'
import { cn, isMobileOrTablet } from '@/lib/utils'
import { Link } from 'next-view-transitions'

const STORAGE_KEY = 'agent-chat-session'
const MAX_STORED_MESSAGES = 30
const MAX_INPUT_LENGTH = 500

const WELCOME_MESSAGE: AgentMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hello! I am Harshhaa's Portfolio Agent. I can answer questions about his Platform Engineering experience, AI Infrastructure & Agentic Systems work, technical stack, or open-source projects.",
  timestamp: 'now',
  suggestions: INITIAL_SUGGESTIONS,
}

function nowTime() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function isStoredMessages(value: unknown): value is AgentMessage[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      m =>
        typeof m === 'object' &&
        m !== null &&
        typeof (m as AgentMessage).id === 'string' &&
        ((m as AgentMessage).role === 'user' ||
          (m as AgentMessage).role === 'assistant') &&
        typeof (m as AgentMessage).content === 'string' &&
        typeof (m as AgentMessage).timestamp === 'string'
    )
  )
}

function loadStoredMessages(): AgentMessage[] {
  if (typeof window === 'undefined') return [WELCOME_MESSAGE]
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (isStoredMessages(parsed)) {
        return parsed.map(m => ({ ...m, streaming: false }))
      }
    }
  } catch {
    // Corrupted storage falls through to a fresh session
  }
  return [WELCOME_MESSAGE]
}

export function AIAgentModal() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingId, setStreamingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showJumpToLatest, setShowJumpToLatest] = useState(false)
  const [messages, setMessages] = useState<AgentMessage[]>(loadStoredMessages)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const streamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const streamTextRef = useRef('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Scroll to bottom when messages update or modal opens (also pins during streaming)
  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [isOpen, messages, scrollToBottom])

  // Only auto-focus input when opening on desktop (never on mobile or tablet)
  useEffect(() => {
    if (isOpen && !isMobileOrTablet()) {
      const timer = setTimeout(() => inputRef.current?.focus(), 120)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Lock background body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const stopStreamTimer = useCallback(() => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current)
      streamTimerRef.current = null
    }
  }, [])

  // Commit the full reply text and end the streaming state
  const finishStream = useCallback(
    (id: string) => {
      stopStreamTimer()
      setMessages(prev =>
        prev.map(m =>
          m.id === id
            ? { ...m, content: streamTextRef.current, streaming: false }
            : m
        )
      )
      setStreamingId(null)
    },
    [stopStreamTimer]
  )

  const skipStream = useCallback(() => {
    if (streamingId) finishStream(streamingId)
  }, [streamingId, finishStream])

  // Reveal a reply line-by-line (terminal-style). Whole lines keep the
  // markdown renderer valid mid-animation, unlike char-by-char typing.
  const startStream = useCallback(
    (fullText: string, suggestions?: string[], isError = false) => {
      const id = `a-${Date.now()}`
      const lines = fullText.split('\n')
      streamTextRef.current = fullText

      setMessages(prev => [
        ...prev,
        {
          id,
          role: 'assistant',
          content: lines[0] ?? '',
          timestamp: nowTime(),
          suggestions,
          isError,
          streaming: lines.length > 1,
        },
      ])

      if (lines.length <= 1) return
      setStreamingId(id)

      const step = Math.min(140, Math.max(45, Math.round(1500 / lines.length)))
      let index = 1
      streamTimerRef.current = setInterval(() => {
        if (index >= lines.length) {
          finishStream(id)
          return
        }
        const line = lines[index]
        index += 1
        setMessages(prev =>
          prev.map(m =>
            m.id === id ? { ...m, content: `${m.content}\n${line}` } : m
          )
        )
      }, step)
    },
    [finishStream]
  )

  useEffect(() => {
    return () => stopStreamTimer()
  }, [stopStreamTimer])

  // Persist the conversation for the browser session (survives refresh)
  useEffect(() => {
    if (!mounted) return
    try {
      const persistable = messages
        .filter(m => !m.streaming)
        .slice(-MAX_STORED_MESSAGES)
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(persistable))
    } catch {
      // Storage unavailable (private mode) — chat simply won't persist
    }
  }, [messages, mounted])

  // Ctrl/⌘+I toggles the agent from anywhere
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Escape: skip the streaming animation first, then close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !isOpen) return
      if (streamingId) {
        skipStream()
        return
      }
      setIsOpen(false)
      // Return focus to the launcher for keyboard users
      setTimeout(() => launcherRef.current?.focus(), 80)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, streamingId, skipStream])

  // Trap Tab focus inside the dialog while open
  useEffect(() => {
    if (!isOpen) return
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const root = dialogRef.current
      if (!root) return
      const focusables = root.querySelectorAll<HTMLElement>(
        'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (!first || !last) return
      const active = document.activeElement
      if (e.shiftKey) {
        if (active === first || !root.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else if (active === last || !root.contains(active)) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleTab, true)
    return () => document.removeEventListener('keydown', handleTab, true)
  }, [isOpen])

  const autoResizeInput = useCallback(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`
  }, [])

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText ?? input).trim()
    if (!textToSend || isLoading || streamingId) return

    // Dismiss keyboard on mobile/tablet or when clicking existing suggestions
    if (queryText || isMobileOrTablet()) {
      inputRef.current?.blur()
    }

    const userMessage: AgentMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: nowTime(),
    }

    setMessages(prev => [...prev, userMessage])
    if (!queryText) {
      setInput('')
      if (inputRef.current) inputRef.current.style.height = 'auto'
    }
    setIsLoading(true)

    try {
      // Try API route first
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      })

      if (res.ok) {
        const data = await res.json()
        startStream(data.reply, data.suggestions)
      } else if (res.status === 429 || res.status === 400) {
        // Show server-side notices (rate limit, validation) as error replies
        let serverMessage: string | undefined
        try {
          const errData = await res.json()
          serverMessage = errData?.message
        } catch {
          // No JSON body
        }
        setMessages(prev => [
          ...prev,
          {
            id: `e-${Date.now()}`,
            role: 'assistant',
            content:
              serverMessage ||
              'Request rejected. Please try a shorter message in a moment.',
            timestamp: nowTime(),
            isError: true,
          },
        ])
      } else {
        // Server trouble: fall back to the local knowledge engine
        const local = getLocalAgentResponse(textToSend)
        startStream(local.reply, local.suggestions)
      }
    } catch {
      // Client-side fallback if offline/error
      const local = getLocalAgentResponse(textToSend)
      startStream(local.reply, local.suggestions)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    stopStreamTimer()
    setStreamingId(null)
    setMessages([{ ...WELCOME_MESSAGE, id: `welcome-${Date.now()}` }])
  }

  const handleCopy = async (msg: AgentMessage) => {
    try {
      await navigator.clipboard.writeText(msg.content)
      setCopiedId(msg.id)
      setTimeout(
        () => setCopiedId(prev => (prev === msg.id ? null : prev)),
        1600
      )
    } catch {
      // Clipboard permission denied — silently ignore
    }
  }

  const handleStreamScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setShowJumpToLatest(el.scrollHeight - el.scrollTop - el.clientHeight > 140)
  }

  const userCount = messages.filter(m => m.role === 'user').length
  const lastAssistantId = [...messages]
    .reverse()
    .find(m => m.role === 'assistant' && !m.streaming)?.id

  // Format markdown into rich UI (links, bold, inline code, lists)
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-2" />
      }

      // Inline renderer: markdown links [text](url), **bold**, `code`
      const parseInline = (str: string) => {
        const linkRegex = /\[(.*?)\]\((.*?)\)/g
        const parts: React.ReactNode[] = []
        let lastIdx = 0
        let match

        const renderEmphasis = (segment: string, key: string) =>
          segment
            // **bold**
            .split(/\*\*(.*?)\*\*/g)
            .map((boldPart, boldIdx) => {
              const boldKey = `${key}-b${boldIdx}`
              if (boldIdx % 2 === 1) {
                return (
                  <strong
                    key={boldKey}
                    className="font-semibold text-foreground"
                  >
                    {boldPart}
                  </strong>
                )
              }
              // `code`
              return boldPart.split(/`([^`]+)`/g).map((codePart, codeIdx) =>
                codeIdx % 2 === 1 ? (
                  <code
                    key={`${boldKey}-c${codeIdx}`}
                    className="border-border bg-muted/70 mx-px border px-1 py-px font-mono text-[0.85em] text-foreground"
                  >
                    {codePart}
                  </code>
                ) : (
                  codePart
                )
              )
            })

        while ((match = linkRegex.exec(str)) !== null) {
          if (match.index > lastIdx) {
            parts.push(
              ...renderEmphasis(
                str.substring(lastIdx, match.index),
                `t${match.index}`
              )
            )
          }
          const linkText = match[1] ?? ''
          const href = match[2] ?? '#'
          const linkClass =
            'font-medium text-foreground underline decoration-border underline-offset-2 transition-colors hover:decoration-foreground'
          const isExternal =
            href.startsWith('http') || href.startsWith('mailto:')

          if (isExternal) {
            parts.push(
              <a
                key={`l${match.index}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {linkText}
              </a>
            )
          } else {
            parts.push(
              <Link
                key={`l${match.index}`}
                href={href}
                onClick={() => setIsOpen(false)}
                className={linkClass}
              >
                {linkText}
              </Link>
            )
          }
          lastIdx = match.index + match[0].length
        }

        if (lastIdx < str.length) {
          parts.push(...renderEmphasis(str.substring(lastIdx), 't-end'))
        }

        return parts
      }

      // Bullet lists
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <div
            key={idx}
            className="flex items-start gap-2 py-0.5 pl-1 text-xs text-muted-foreground sm:text-sm"
          >
            <span className="text-foreground/50 select-none">•</span>
            <span className="flex-1">{parseInline(line.substring(2))}</span>
          </div>
        )
      }

      // Ordered lists
      const orderedMatch = line.match(/^(\d+)\.\s+(.*)$/)
      if (orderedMatch) {
        return (
          <div
            key={idx}
            className="flex items-start gap-2 py-0.5 pl-1 text-xs text-muted-foreground sm:text-sm"
          >
            <span className="font-mono text-foreground/50 tabular-nums select-none">
              {orderedMatch[1]}.
            </span>
            <span className="flex-1">{parseInline(orderedMatch[2] ?? '')}</span>
          </div>
        )
      }

      return (
        <p
          key={idx}
          className="text-xs leading-relaxed text-muted-foreground sm:text-sm"
        >
          {parseInline(line)}
        </p>
      )
    })
  }

  if (!mounted) return null

  return (
    <>
      {/* Floating Launcher Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="agent-launcher"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            suppressHydrationWarning
            className="fixed right-3 bottom-3 z-40 max-w-[calc(100vw-1.5rem)] sm:right-6 sm:bottom-6"
          >
            <button
              ref={launcherRef}
              onClick={() => setIsOpen(true)}
              aria-label="Ask Harshhaa's Agent"
              aria-haspopup="dialog"
              className="group relative flex items-center gap-2 border border-border bg-background/95 px-2.5 py-2 shadow-xl backdrop-blur-xs transition-all transform-gpu hover:border-foreground/40 hover:bg-background sm:gap-2.5 sm:px-3.5 sm:py-2.5"
            >
              <Corners size="sm" offset="border" weight="thin" light />
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <Bot className="size-3.5 shrink-0 text-foreground transition-transform group-hover:scale-110 sm:size-4" />
              <span className="truncate text-[11px] font-semibold tracking-[0.14em] text-foreground uppercase sm:text-xs">
                Ask Harshhaa&apos;s Agent
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Blueprint Chat Drawer */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <Fragment key="agent-modal">
                {/* Backdrop on mobile and tablet */}
                <motion.div
                  key="agent-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm sm:bg-background/40 sm:backdrop-blur-[2px]"
                />

                <motion.div
                  key="agent-panel"
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  suppressHydrationWarning
                  role="dialog"
                  aria-modal="true"
                  aria-label="Harshhaa's AI Agent chat"
                  ref={dialogRef}
                  className="fixed inset-x-2 bottom-2 z-[100] flex h-[calc(100dvh-1rem)] max-h-[92dvh] w-auto flex-col sm:inset-x-auto sm:right-6 sm:bottom-6 sm:h-[560px] sm:max-h-[85vh] sm:w-[420px] md:w-[460px]"
                >
                  <Frame className="flex h-full flex-col overflow-hidden border border-border bg-background/95 shadow-2xl backdrop-blur-xl">
                    {/* Header Bar */}
                    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-2.5 sm:px-5 sm:py-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <CornerBadge
                          size="sm"
                          className="truncate text-[10px] sm:text-[11px]"
                        >
                          AGENT / HARSHHAA-AI
                        </CornerBadge>
                        <span className="hidden items-center gap-1.5 font-mono text-[10px] text-muted-foreground tabular-nums sm:inline-flex">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          ONLINE
                        </span>
                        <span
                          className="hidden font-mono text-[10px] text-muted-foreground/70 tabular-nums md:inline"
                          title="Questions this session"
                        >
                          Q:{String(userCount).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleReset}
                          title="Reset chat"
                          className="size-8 text-muted-foreground hover:text-foreground sm:size-7"
                        >
                          <RotateCcw className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsOpen(false)}
                          title="Close agent"
                          className="size-8 text-muted-foreground hover:text-foreground sm:size-7"
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Chat Message Stream */}
                    <div className="relative min-h-0 flex-1">
                      <div
                        ref={scrollRef}
                        onScroll={handleStreamScroll}
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
                          <div key={msg.id} className="space-y-2">
                            {msg.role === 'user' ? (
                              <div className="flex items-start gap-2 border-l border-foreground/30 py-1 pl-2.5 font-mono text-xs text-muted-foreground">
                                <span className="text-foreground/70 select-none">
                                  visitor@portfolio:~$
                                </span>
                                <span className="flex-1 font-sans text-xs break-words text-foreground sm:text-sm">
                                  {msg.content}
                                </span>
                              </div>
                            ) : (
                              <div
                                className={cn(
                                  'group/msg relative space-y-1 border-l py-1 pl-3',
                                  msg.isError
                                    ? 'border-rose-500/50'
                                    : 'border-border'
                                )}
                              >
                                {/* Meta row */}
                                <div className="flex items-center gap-1.5">
                                  <span className="border-border bg-muted/40 relative flex size-4 items-center justify-center border">
                                    <Corners
                                      size="sm"
                                      offset="none"
                                      weight="thin"
                                      light
                                    />
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
                                  onClick={
                                    msg.streaming ? skipStream : undefined
                                  }
                                  title={
                                    msg.streaming
                                      ? 'Click to reveal instantly'
                                      : undefined
                                  }
                                  className={cn(
                                    msg.streaming && 'cursor-pointer'
                                  )}
                                >
                                  {renderFormattedText(msg.content)}
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
                                        onClick={() => handleCopy(msg)}
                                        aria-label="Copy reply"
                                        className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground/70 transition-colors hover:text-foreground"
                                      >
                                        {copiedId === msg.id ? (
                                          <>
                                            <Check className="size-3 text-emerald-500" />
                                            <span className="text-emerald-500">
                                              copied
                                            </span>
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
                            )}

                            {/* Suggested Questions — latest reply only */}
                            {msg.role === 'assistant' &&
                              msg.id === lastAssistantId &&
                              !isLoading &&
                              !streamingId &&
                              msg.suggestions &&
                              msg.suggestions.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {msg.suggestions.map((suggestion, sIdx) => (
                                    <button
                                      key={sIdx}
                                      onClick={() => {
                                        inputRef.current?.blur()
                                        handleSend(suggestion)
                                      }}
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
                              )}
                          </div>
                        ))}

                        {isLoading && (
                          <div className="flex items-center gap-2 border-l border-border py-2 pl-3 font-mono text-xs text-muted-foreground">
                            <span className="flex gap-1">
                              <span className="size-1 animate-bounce rounded-full bg-foreground/50" />
                              <span className="size-1 animate-bounce rounded-full bg-foreground/50 [animation-delay:120ms]" />
                              <span className="size-1 animate-bounce rounded-full bg-foreground/50 [animation-delay:240ms]" />
                            </span>
                            <span>querying knowledge base</span>
                            <span className="animate-pulse">▌</span>
                          </div>
                        )}

                        <div ref={messagesEndRef} />
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

                    {/* Chat Input Bar */}
                    <div className="border-border bg-muted/10 shrink-0 border-t p-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] sm:p-3.5 sm:pb-3.5">
                      <form
                        onSubmit={e => {
                          e.preventDefault()
                          handleSend()
                        }}
                        className="flex items-end gap-2"
                      >
                        <div className="relative flex-1">
                          <textarea
                            ref={inputRef}
                            rows={1}
                            maxLength={MAX_INPUT_LENGTH}
                            value={input}
                            onChange={e => {
                              setInput(e.target.value)
                              autoResizeInput()
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSend()
                              }
                            }}
                            placeholder="Ask about AI infra, K8s, projects..."
                            aria-label="Message the portfolio agent"
                            className="border-border bg-background placeholder:text-muted-foreground/60 focus:border-foreground/50 w-full resize-none border px-3 py-2 text-base text-foreground focus:outline-none sm:text-sm"
                          />
                          <Corners
                            size="sm"
                            offset="border"
                            weight="thin"
                            light
                          />
                        </div>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={!input.trim() || isLoading || !!streamingId}
                          className="relative h-10 shrink-0 px-3.5 text-xs font-semibold tracking-wider uppercase sm:h-9 sm:px-3"
                        >
                          <Send className="size-3.5 sm:size-3" />
                          <span className="hidden sm:inline">Ask</span>
                        </Button>
                      </form>
                      <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-muted-foreground/60">
                        <span>
                          <span className="hidden sm:inline">
                            Enter ↵ send ·{' '}
                          </span>
                          <span className="hidden md:inline">
                            ⇧↵ newline ·{' '}
                          </span>
                          <span>Esc close</span>
                        </span>
                        <span className="tabular-nums">
                          {input.length > 0
                            ? `${input.length}/${MAX_INPUT_LENGTH}`
                            : '⌘/Ctrl+I toggle'}
                        </span>
                      </div>
                    </div>
                  </Frame>
                </motion.div>
              </Fragment>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}
