'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  Terminal,
  Search,
  Compass,
  FileText,
  Activity,
  Bot,
  Sun,
  Moon,
  Github,
  Linkedin,
  Send,
  Globe,
  Copy,
  Check,
  CornerDownLeft,
  X,
  Sparkles,
  Layers
} from 'lucide-react'
import { Corners, CornerBadge, Frame } from './frame'

interface CommandItem {
  id: string
  title: string
  description: string
  category: 'Navigation' | 'Platform Actions' | 'External' | 'CLI Command'
  icon: React.ComponentType<{ className?: string }>
  shortcut?: string
  action: () => void
}

interface TerminalLog {
  id: string
  command: string
  output: React.ReactNode
  timestamp: string
}

export function CommandPalette() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([])
  const [isCliMode, setIsCliMode] = useState(false)

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

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 50)
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
      setIsCliMode(true)
    },
    [router, setTheme, theme]
  )

  const commands: CommandItem[] = useMemo(
    () => [
      // Navigation
      {
        id: 'nav-home',
        title: 'Home',
        description: 'Go to personal overview & specialties',
        category: 'Navigation',
        icon: Compass,
        shortcut: 'G H',
        action: () => {
          setIsOpen(false)
          router.push('/')
        }
      },
      {
        id: 'nav-projects',
        title: 'Projects',
        description: 'Explore open source platforms, tools & guides',
        category: 'Navigation',
        icon: Terminal,
        shortcut: 'G P',
        action: () => {
          setIsOpen(false)
          router.push('/projects')
        }
      },
      {
        id: 'nav-career',
        title: 'Career Timeline',
        description: 'View work history, experience & achievements',
        category: 'Navigation',
        icon: FileText,
        shortcut: 'G C',
        action: () => {
          setIsOpen(false)
          router.push('/career')
        }
      },
      {
        id: 'nav-contact',
        title: 'Contact',
        description: 'Send direct message or book technical consultation',
        category: 'Navigation',
        icon: Send,
        shortcut: 'G T',
        action: () => {
          setIsOpen(false)
          router.push('/contact')
        }
      },

      // Platform Actions
      {
        id: 'act-architecture',
        title: 'System Architecture Diagrams',
        description: 'Explore interactive blueprints for AI, GitOps & Cloud',
        category: 'Platform Actions',
        icon: Layers,
        action: () => {
          setIsOpen(false)
          router.push('/#architectures')
        }
      },
      {
        id: 'act-agent',
        title: 'Ask Harshhaa\'s Agent',
        description: 'Open conversational AI portfolio assistant',
        category: 'Platform Actions',
        icon: Bot,
        action: () => {
          setIsOpen(false)
          // trigger agent modal
          const agentBtn = document.querySelector('button[aria-label="Ask Harshhaa\'s Agent"]') as HTMLButtonElement
          if (agentBtn) agentBtn.click()
        }
      },
      {
        id: 'act-telemetry',
        title: 'Inspect Platform Telemetry',
        description: 'View real-time cluster health, latency & edge routing',
        category: 'Platform Actions',
        icon: Activity,
        action: () => {
          setIsOpen(false)
          const telBtn = document.querySelector('button[aria-label="Inspect Platform Telemetry & Healthcheck"]') as HTMLButtonElement
          if (telBtn) telBtn.click()
        }
      },
      {
        id: 'act-theme',
        title: 'Toggle Theme',
        description: `Switch between dark and light appearance (Current: ${theme})`,
        category: 'Platform Actions',
        icon: theme === 'dark' ? Sun : Moon,
        action: () => {
          setTheme(theme === 'dark' ? 'light' : 'dark')
        }
      },
      {
        id: 'act-copy-email',
        title: copiedEmail ? 'Email Copied!' : 'Copy Email Address',
        description: 'harshhaa03@gmail.com',
        category: 'Platform Actions',
        icon: copiedEmail ? Check : Copy,
        action: copyEmail
      },

      // External
      {
        id: 'ext-github',
        title: 'GitHub Profile',
        description: 'github.com/NotHarshhaa',
        category: 'External',
        icon: Github,
        action: () => {
          window.open('https://github.com/NotHarshhaa', '_blank', 'noopener,noreferrer')
        }
      },
      {
        id: 'ext-linkedin',
        title: 'LinkedIn Profile',
        description: 'linkedin.com/in/harshhaa-vardhan-reddy',
        category: 'External',
        icon: Linkedin,
        action: () => {
          window.open('https://linkedin.com/in/harshhaa-vardhan-reddy', '_blank', 'noopener,noreferrer')
        }
      },
      {
        id: 'ext-blog',
        title: 'Engineering Blog',
        description: 'blog.harshhaareddy.site',
        category: 'External',
        icon: Globe,
        action: () => {
          window.open('https://blog.harshhaareddy.site', '_blank', 'noopener,noreferrer')
        }
      },
      {
        id: 'ext-telegram',
        title: 'Telegram Channel',
        description: 't.me/prodevopsguy',
        category: 'External',
        icon: Send,
        action: () => {
          window.open('https://t.me/prodevopsguy', '_blank', 'noopener,noreferrer')
        }
      }
    ],
    [copiedEmail, copyEmail, router, setTheme, theme]
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
      // If user typed a CLI command (e.g. cat, help, skills, ping, status, clear)
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

              {/* Terminal Logs (If any command was run) */}
              {terminalLogs.length > 0 && (
                <div className="border-b border-border bg-black/5 dark:bg-black/30 p-3 sm:p-4 font-mono space-y-3 max-h-48 overflow-y-auto">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 border-b border-border/40 pb-1">
                    <span>TERMINAL OUTPUT BUFFER</span>
                    <button
                      onClick={() => setTerminalLogs([])}
                      className="hover:text-foreground underline"
                    >
                      Clear buffer
                    </button>
                  </div>
                  {terminalLogs.map((log) => (
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
              )}

              {/* Command Results List */}
              <div
                ref={listRef}
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
                          <Icon className={`size-4 shrink-0 transition-colors ${isSelected ? 'text-foreground' : 'text-muted-foreground/70'}`} />
                          <div className="min-w-0">
                            <p className={`font-medium tracking-wide truncate ${isSelected ? 'text-foreground' : 'text-foreground/90'}`}>
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
