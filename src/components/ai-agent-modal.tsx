'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Bot, X, RotateCcw, Send, Sparkles } from 'lucide-react'
import { Corners, CornerBadge, Frame } from './frame'
import { Button } from './ui/button'
import {
  type AgentMessage,
  INITIAL_SUGGESTIONS,
  getLocalAgentResponse
} from '@/lib/agent-knowledge'
import { isMobileOrTablet } from '@/lib/utils'
import { Link } from 'next-view-transitions'

export function AIAgentModal() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am Harshhaa\'s Portfolio Agent. I can answer questions about his Platform Engineering experience, AI Infrastructure & Agentic Systems work, technical stack, or open-source projects.',
      timestamp: 'now',
      suggestions: INITIAL_SUGGESTIONS
    }
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Scroll to bottom when messages update or modal opens
  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [isOpen, messages, scrollToBottom])

  // Only auto-focus input when opening on desktop (never on mobile or tablet)
  useEffect(() => {
    if (isOpen && !isMobileOrTablet()) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Lock background body scroll when open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input
    if (!textToSend.trim() || isLoading) return

    // Dismiss keyboard on mobile/tablet or when clicking existing suggestions
    if (queryText || isMobileOrTablet()) {
      inputRef.current?.blur()
    }

    const userMessage: AgentMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages((prev) => [...prev, userMessage])
    if (!queryText) setInput('')
    setIsLoading(true)

    try {
      // Try API route first
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      })

      if (res.ok) {
        const data = await res.json()
        const botMessage: AgentMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: data.suggestions
        }
        setMessages((prev) => [...prev, botMessage])
      } else {
        // Local fallback
        const local = getLocalAgentResponse(textToSend)
        const botMessage: AgentMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: local.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: local.suggestions
        }
        setMessages((prev) => [...prev, botMessage])
      }
    } catch {
      // Client-side fallback if offline/error
      const local = getLocalAgentResponse(textToSend)
      const botMessage: AgentMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: local.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: local.suggestions
      }
      setMessages((prev) => [...prev, botMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content:
          'Session reset. Ask me anything about Harshhaa\'s engineering background, AI infrastructure, or projects.',
        timestamp: 'now',
        suggestions: INITIAL_SUGGESTIONS
      }
    ])
  }

  // Format simple markdown into rich UI (links, bold, bullets)
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-2" />
      }

      // Format markdown links [text](url) and bold **text**
      const parseInline = (str: string) => {
        const linkRegex = /\[(.*?)\]\((.*?)\)/g
        const parts: React.ReactNode[] = []
        let lastIdx = 0
        let match

        while ((match = linkRegex.exec(str)) !== null) {
          if (match.index > lastIdx) {
            parts.push(str.substring(lastIdx, match.index))
          }
          const linkText = match[1] ?? ''
          const href = match[2] ?? '#'
          const isExternal = href.startsWith('http') || href.startsWith('mailto:')

          if (isExternal) {
            parts.push(
              <a
                key={match.index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline decoration-border underline-offset-2 transition-colors hover:decoration-foreground"
              >
                {linkText}
              </a>
            )
          } else {
            parts.push(
              <Link
                key={match.index}
                href={href}
                onClick={() => setIsOpen(false)}
                className="font-medium text-foreground underline decoration-border underline-offset-2 transition-colors hover:decoration-foreground"
              >
                {linkText}
              </Link>
            )
          }
          lastIdx = match.index + match[0].length
        }

        if (lastIdx < str.length) {
          parts.push(str.substring(lastIdx))
        }

        // Format **bold**
        return parts.map((part, partIdx) => {
          if (typeof part !== 'string') return part
          const boldParts = part.split(/\*\*(.*?)\*\*/g)
          return boldParts.map((bPart, bIdx) =>
            bIdx % 2 === 1 ? (
              <strong key={`${partIdx}-${bIdx}`} className="font-semibold text-foreground">
                {bPart}
              </strong>
            ) : (
              bPart
            )
          )
        })
      }

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <div key={idx} className="flex items-start gap-2 pl-1 py-0.5 text-xs text-muted-foreground sm:text-sm">
            <span className="text-foreground/50 select-none">•</span>
            <span className="flex-1">{parseInline(line.substring(2))}</span>
          </div>
        )
      }

      return (
        <p key={idx} className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {parseInline(line)}
        </p>
      )
    })
  }

  if (!mounted) return null

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div
          suppressHydrationWarning
          className="fixed right-3 bottom-3 sm:right-6 sm:bottom-6 z-40 max-w-[calc(100vw-1.5rem)]"
        >
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Ask Harshhaa's Agent"
            className="group relative flex items-center gap-2 border border-border bg-background/95 px-2.5 py-2 sm:gap-2.5 sm:px-3.5 sm:py-2.5 shadow-xl backdrop-blur-md transition-all hover:border-foreground/40 hover:bg-background"
          >
            <Corners size="sm" offset="border" weight="thin" light />
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <Bot className="size-3.5 sm:size-4 shrink-0 text-foreground transition-transform group-hover:scale-110" />
            <span className="truncate text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-foreground">
              Ask Harshhaa&apos;s Agent
            </span>
          </button>
        </div>
      )}

      {/* Floating Blueprint Chat Drawer */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <>
          {/* Backdrop on mobile and tablet */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm sm:bg-background/40 sm:backdrop-blur-[2px]"
          />

          <div
            suppressHydrationWarning
            className="fixed inset-x-2 bottom-2 sm:inset-x-auto sm:right-6 sm:bottom-6 z-[100] w-auto sm:w-[420px] md:w-[460px] h-[calc(100dvh-1rem)] sm:h-[560px] max-h-[92dvh] sm:max-h-[85vh] flex flex-col"
          >
            <Frame className="flex h-full flex-col overflow-hidden border border-border bg-background/95 shadow-2xl backdrop-blur-xl">
              {/* Header Bar */}
              <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5 sm:px-5 sm:py-3 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <CornerBadge size="sm" className="truncate text-[10px] sm:text-[11px]">
                    AGENT / HARSHHAA-AI
                  </CornerBadge>
                  <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground tabular-nums">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    ONLINE
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    title="Reset chat"
                    className="size-8 sm:size-7 text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    title="Close agent"
                    className="size-8 sm:size-7 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 space-y-4 text-xs sm:text-sm">
                <div className="flex items-center justify-between border-b border-border/50 pb-2 text-[10px] font-mono text-muted-foreground/70 uppercase tracking-widest">
                  <span>System: Ready</span>
                  <span>Model: Grounded AI</span>
                </div>

                {messages.map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    {msg.role === 'user' ? (
                      <div className="flex items-start gap-2 border-l border-foreground/30 pl-2.5 py-1 font-mono text-xs text-muted-foreground">
                        <span className="text-foreground/70 select-none">visitor@portfolio:~$</span>
                        <span className="text-foreground font-sans text-xs sm:text-sm">{msg.content}</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="relative border-l border-border pl-3 py-1">
                          {renderFormattedText(msg.content)}
                        </div>

                        {/* Suggested Questions */}
                        {msg.suggestions && msg.suggestions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {msg.suggestions.map((suggestion, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={() => {
                                  inputRef.current?.blur()
                                  handleSend(suggestion)
                                }}
                                disabled={isLoading}
                                className="group relative inline-flex items-center px-2 py-1 text-[11px] font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground active:text-foreground disabled:opacity-50"
                              >
                                <Corners size="sm" offset="none" weight="thin" light />
                                <span>{suggestion}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground py-2 pl-3 border-l border-border">
                    <Sparkles className="size-3 animate-spin text-foreground/50" />
                    <span>Agent is thinking...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="border-t border-border bg-muted/10 p-2.5 sm:p-3.5 shrink-0 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] sm:pb-3.5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about AI infra, K8s, projects..."
                      disabled={isLoading}
                      className="w-full border border-border bg-background px-3 py-2 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/50 focus:outline-none"
                    />
                    <Corners size="sm" offset="border" weight="thin" light />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!input.trim() || isLoading}
                    className="relative shrink-0 h-10 px-3.5 sm:h-9 sm:px-3 font-semibold uppercase text-xs tracking-wider"
                  >
                    <Send className="size-3.5 sm:size-3" />
                    <span className="hidden sm:inline">Ask</span>
                  </Button>
                </form>
                <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-muted-foreground/60">
                  <span>Enter ↵ to send</span>
                  <span className="hidden sm:inline">Esc to close</span>
                </div>
              </div>
            </Frame>
          </div>
        </>,
        document.body
      )}
    </>
  )
}
