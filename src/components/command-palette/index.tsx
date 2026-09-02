'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { CornerDownLeft, X } from 'lucide-react'
import { CornerBadge, Frame } from '../frame'
import { isMobileOrTablet } from '@/lib/utils'
import type { TerminalLog } from './types'
import { buildCommands } from './command-actions'
import { TerminalOutput } from './terminal-output'
import { CommandList } from './command-list'

export function CommandPalette() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([])

  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Listen for global shortcut (⌘K or Ctrl+K) and custom open event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    const handleCustomOpen = () => setIsOpen(true)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('open-command-palette', handleCustomOpen)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-command-palette', handleCustomOpen)
    }
  }, [isOpen])

  // Lock body scroll on mobile when open, and auto-focus only on desktop
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      if (!isMobileOrTablet()) {
        const timer = setTimeout(() => inputRef.current?.focus(), 50)
        return () => clearTimeout(timer)
      }
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setSelectedIndex(0)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText('harshhaa03@gmail.com')
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } catch {
      // fallback
    }
  }, [])

  const executeCliCommand = useCallback(
    (cmdRaw: string) => {
      if (isMobileOrTablet()) {
        inputRef.current?.blur()
      }
      const cmd = cmdRaw.trim().toLowerCase()
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      let output: React.ReactNode = null

      if (cmd === 'help') {
        output = (
          <div className="space-y-1 text-xs">
            <p className="font-semibold text-foreground">Available CLI Commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-muted-foreground pt-1">
              <div><code className="text-foreground">cat about.txt</code> - View bio & platform focus</div>
              <div><code className="text-foreground">skills</code> - List tech stack & domains</div>
              <div><code className="text-foreground">status</code> - Query live telemetry & ping</div>
              <div><code className="text-foreground">projects</code> - List featured projects</div>
              <div><code className="text-foreground">contact</code> - View contact endpoints</div>
              <div><code className="text-foreground">theme</code> - Toggle dark/light theme</div>
              <div><code className="text-foreground">clear</code> - Clear terminal buffer</div>
            </div>
          </div>
        )
      } else if (cmd === 'cat about.txt' || cmd === 'about') {
        output = (
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Harshhaa Vardhan Reddy • Platform Engineer</p>
            <p>Platforms, AI infrastructure, and agents that help teams ship faster.</p>
            <p>Specialties: Kubernetes, AWS, Terraform, Docker, MLOps, LLMOps, Model Context Protocol (MCP), and Multi-Agent Systems.</p>
            <p>Based in Hyderabad, India (IST / UTC+5:30).</p>
          </div>
        )
      } else if (cmd.startsWith('skills')) {
        output = (
          <div className="space-y-1 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Technical Matrix:</p>
            <p>• Cloud: AWS, Azure, GCP</p>
            <p>• Platform: Kubernetes, Docker, Helm, ArgoCD, Terraform, Ansible</p>
            <p>• AI / MLOps: MCP, Python, LangGraph, LangChain, MLflow</p>
            <p>• Observability: Prometheus, Grafana</p>
          </div>
        )
      } else if (cmd === 'status' || cmd === 'ping') {
        output = (
          <div className="space-y-1 text-xs text-muted-foreground">
            <p className="font-semibold text-emerald-500">● Systems 100% Operational</p>
            <p>• Runtime: Next.js 16 (Turbopack Engine)</p>
            <p>• Ingress: TLS 1.3 Strict HTTPS • Edge Region: BOM1</p>
            <p>• Agent Engine: Ready • GitHub Telemetry: Synced</p>
          </div>
        )
      } else if (cmd === 'projects') {
        output = (
          <div className="space-y-1 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Featured Crafts:</p>
            <p>• Docker Ultimate Guide (Production containerization practices)</p>
            <p>• Kubernetes Cheatsheet & Lab (Production cluster architecture)</p>
            <p>• Agentic AI Systems (MCP tool bindings & agent orchestration)</p>
            <p className="text-foreground underline cursor-pointer" onClick={() => { setIsOpen(false); router.push('/projects'); }}>
              → Navigate to full Projects Catalog
            </p>
          </div>
        )
      } else if (cmd === 'contact') {
        output = (
          <div className="space-y-1 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Contact Endpoints:</p>
            <p>• Email: harshhaa03@gmail.com</p>
            <p>• GitHub: github.com/NotHarshhaa</p>
            <p>• LinkedIn: linkedin.com/in/harshhaa-vardhan-reddy</p>
            <p>• Telegram: @prodevopsguy</p>
          </div>
        )
      } else if (cmd === 'clear') {
        setTerminalLogs([])
        setQuery('')
        return
      } else if (cmd === 'theme') {
        setTheme(theme === 'dark' ? 'light' : 'dark')
        output = <p className="text-xs text-muted-foreground">Toggled theme to <strong className="text-foreground">{theme === 'dark' ? 'light' : 'dark'}</strong>.</p>
      } else {
        output = (
          <p className="text-xs text-red-500/80">
            command not found: <code className="text-red-400">{cmdRaw}</code>. Type <code className="text-foreground underline">help</code> for list.
          </p>
        )
      }

      setTerminalLogs((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          command: cmdRaw,
          output,
          timestamp: time
        }
      ])
      setQuery('')
    },
    [router, setTheme, theme]
  )

  const commands = useMemo(
    () =>
      buildCommands({
        router,
        theme,
        setTheme,
        setIsOpen,
        copiedEmail,
        copyEmail
      }),
    [router, theme, setTheme, setIsOpen, copiedEmail, copyEmail]
  )

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands
    const q = query.toLowerCase().trim()
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    )
  }, [commands, query])

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Handle arrow key navigation & execution
  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const trimmed = query.trim().toLowerCase()
      const isCliKeyword = ['help', 'cat', 'skills', 'status', 'ping', 'projects', 'contact', 'clear', 'theme'].some(
        (kw) => trimmed.startsWith(kw)
      )

      if (isCliKeyword) {
        executeCliCommand(query)
      } else if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action()
      }
    }
  }

  if (!mounted) return null

  return (
    <>
      {isOpen && typeof document !== 'undefined' && createPortal(
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <div
            suppressHydrationWarning
            className="fixed inset-x-3 top-[10%] sm:top-[15%] z-[100] sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-2xl sm:-translate-x-1/2 max-h-[80dvh] flex flex-col"
          >
            <Frame className="flex max-h-[80dvh] flex-col overflow-hidden border border-border bg-background/95 shadow-2xl backdrop-blur-xl">
              {/* Header Bar */}
              <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2.5 sm:px-5 sm:py-3 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <CornerBadge size="sm" className="text-[10px] sm:text-xs">
                    CLI / COMMAND PALETTE
                  </CornerBadge>
                  <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground tabular-nums">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    SHELL READY
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                  <span className="hidden sm:inline">Esc to close</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close command palette"
                    className="flex size-7 items-center justify-center border border-border/80 hover:bg-muted/40 transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Search & CLI Input Bar */}
              <div className="relative flex items-center border-b border-border bg-muted/10 px-3 sm:px-4 py-2.5 shrink-0">
                <span className="font-mono text-xs text-muted-foreground/70 select-none mr-2">
                  harshhaa:~$
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDownInInput}
                  placeholder="Type a command (cat, skills, ping, help) or search..."
                  className="flex-1 bg-transparent font-mono text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="text-muted-foreground hover:text-foreground text-xs font-mono mr-2"
                  >
                    CLEAR
                  </button>
                )}
                <CornerDownLeft className="size-3.5 text-muted-foreground/60 select-none" />
              </div>

              {/* Terminal Logs */}
              <TerminalOutput
                logs={terminalLogs}
                onClear={() => setTerminalLogs([])}
              />

              {/* Command Results List */}
              <CommandList
                ref={listRef}
                query={query}
                filteredCommands={filteredCommands}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
              />

              {/* Quick CLI Shortcuts Footer Bar */}
              <div className="border-t border-border bg-muted/20 px-3 py-2 sm:px-4 sm:py-2.5 text-[10px] font-mono text-muted-foreground/70 flex flex-wrap items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-3">
                  <span>CLI Commands:</span>
                  <button
                    onClick={() => executeCliCommand('help')}
                    className="text-foreground hover:underline"
                  >
                    help
                  </button>
                  <button
                    onClick={() => executeCliCommand('skills')}
                    className="text-foreground hover:underline"
                  >
                    skills
                  </button>
                  <button
                    onClick={() => executeCliCommand('status')}
                    className="text-foreground hover:underline"
                  >
                    status
                  </button>
                  <button
                    onClick={() => executeCliCommand('cat about.txt')}
                    className="text-foreground hover:underline"
                  >
                    cat about.txt
                  </button>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span>Navigate ↑↓</span>
                  <span>Select ↵</span>
                  <span>Close Esc</span>
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

export * from './types'
export * from './command-actions'
export * from './terminal-output'
export * from './command-list'
