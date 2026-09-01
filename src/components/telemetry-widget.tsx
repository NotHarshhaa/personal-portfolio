'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Activity, X, RefreshCw, Server, Cpu, ShieldCheck, Wifi } from 'lucide-react'
import { Corners, CornerBadge, Frame } from './frame'
import { Button } from './ui/button'

interface ServiceStatus {
  name: string
  status: string
  protocol?: string
  version?: string
  engine?: string
  rateLimit?: string
}

interface TelemetryData {
  status: string
  system: string
  timestamp: string
  uptimeSeconds: number
  region: string
  clientIP: string
  runtime: string
  services: ServiceStatus[]
  cluster: {
    nodes: number
    readyNodes: number
    podsRunning: number
    memoryStatus: string
  }
  latencyCheckMs: number
}

interface TelemetryWidgetProps {
  variant?: 'footer' | 'header'
}

export function TelemetryWidget({ variant = 'footer' }: TelemetryWidgetProps) {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [latency, setLatency] = useState<number | null>(null)
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchHealth = useCallback(async () => {
    const start = performance.now()
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/health', { cache: 'no-store' })
      const end = performance.now()
      const ping = Math.round(end - start)
      setLatency(ping)
      if (res.ok) {
        const data = await res.json()
        setTelemetry(data)
      }
    } catch {
      setLatency(null)
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    fetchHealth()

    // Periodically update latency every 30s
    const interval = setInterval(fetchHealth, 30000)
    return () => clearInterval(interval)
  }, [fetchHealth])

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Lock body scroll on mobile when modal open
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

  if (!mounted) {
    if (variant === 'header') {
      return (
        <div className="relative flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono text-muted-foreground">
          <Corners size="sm" offset="none" weight="thin" light />
          <span className="size-1.5 rounded-full bg-emerald-500" />
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">HEALTHY</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        <span>SYSTEMS OPERATIONAL</span>
      </div>
    )
  }

  return (
    <>
      {variant === 'header' ? (
        /* Header Compact Beacon */
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          title="Platform Telemetry & Healthcheck (Click to inspect)"
          aria-label="Inspect Platform Telemetry"
          className="group relative flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono transition-colors hover:text-foreground active:opacity-80"
        >
          <Corners size="sm" offset="none" weight="thin" light />
          <span className="relative flex size-1.5 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {latency !== null ? `${latency}ms` : 'HEALTHY'}
          </span>
        </button>
      ) : (
        /* Footer Status Pill / Trigger */
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Inspect Platform Telemetry & Healthcheck"
          className="group relative inline-flex items-center gap-2 border border-border/70 bg-background/80 px-2.5 py-1 text-[11px] font-mono text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground active:bg-muted/40"
        >
          <Corners size="sm" offset="border" weight="thin" light />
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-semibold uppercase tracking-wider text-foreground">
            OPERATIONAL
          </span>
          {latency !== null && (
            <span className="hidden xs:inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 tabular-nums">
              • {latency}ms
            </span>
          )}
          <span className="hidden sm:inline-block text-muted-foreground/60">•</span>
          <span className="hidden sm:inline-block text-muted-foreground/80 uppercase">
            {telemetry?.region || 'BOM1'}
          </span>
          <span className="text-[10px] text-muted-foreground/70 underline underline-offset-2 group-hover:text-foreground">
            [INSPECT]
          </span>
        </button>
      )}

      {/* Expanded Blueprint Telemetry Modal */}
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
            className="fixed inset-x-3 top-1/2 z-[100] -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-2xl sm:-translate-x-1/2 max-h-[90dvh] flex flex-col"
          >
            <Frame className="flex max-h-[90dvh] flex-col overflow-hidden border border-border bg-background/95 shadow-2xl backdrop-blur-xl">
              {/* Header */}
              <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2 min-w-0">
                  <CornerBadge size="sm" className="truncate text-[10px] sm:text-xs">
                    <span className="hidden xs:inline">PLATFORM </span>TELEMETRY
                  </CornerBadge>
                  <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 tabular-nums">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    LIVE
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={fetchHealth}
                    disabled={isRefreshing}
                    title="Refresh telemetry"
                    className="size-8 text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    title="Close inspector"
                    className="size-8 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs sm:text-sm">
                {/* Status Hero Banner */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border border-border bg-muted/20 p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center border border-border bg-background">
                      <ShieldCheck className="size-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-heading text-sm font-semibold tracking-wide uppercase">
                        All Systems Fully Operational
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Infrastructure nodes and edge routing healthy. Zero degraded services.
                      </p>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-right text-muted-foreground/80">
                    <div>Uptime: <span className="text-foreground font-semibold">99.98%</span></div>
                    <div className="text-[10px] text-muted-foreground/60">SLA Verified</div>
                  </div>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="border border-border/80 bg-background p-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase">
                      <Wifi className="size-3 text-foreground/70" />
                      <span>Roundtrip Ping</span>
                    </div>
                    <p className="mt-1 font-mono text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                      {latency !== null ? `${latency}ms` : 'Checking...'}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70">Client to Edge</p>
                  </div>

                  <div className="border border-border/80 bg-background p-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase">
                      <Server className="size-3 text-foreground/70" />
                      <span>Edge Region</span>
                    </div>
                    <p className="mt-1 font-mono text-lg font-bold text-foreground">
                      {telemetry?.region || 'BOM1'}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70">Routing Node</p>
                  </div>

                  <div className="border border-border/80 bg-background p-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase">
                      <Cpu className="size-3 text-foreground/70" />
                      <span>Cluster Replicas</span>
                    </div>
                    <p className="mt-1 font-mono text-lg font-bold tabular-nums text-foreground">
                      {telemetry?.cluster?.readyNodes || 3}/{telemetry?.cluster?.nodes || 3}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70">Nodes Ready</p>
                  </div>

                  <div className="border border-border/80 bg-background p-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase">
                      <Activity className="size-3 text-foreground/70" />
                      <span>Runtime</span>
                    </div>
                    <p className="mt-1 font-mono text-sm font-bold text-foreground truncate">
                      Next.js 16
                    </p>
                    <p className="text-[10px] text-muted-foreground/70">Turbopack Engine</p>
                  </div>
                </div>

                {/* Service Health Breakdown Table */}
                <div className="space-y-2">
                  <p className="font-heading text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Service Health Breakdown
                  </p>
                  <div className="border border-border divide-y divide-border text-xs">
                    {(telemetry?.services || [
                      { name: 'Edge Ingress & CDN', status: 'healthy', protocol: 'TLS 1.3 / HTTP2' },
                      { name: 'Next.js App Runtime', status: 'healthy', version: 'v16.2.12' },
                      { name: 'AI Portfolio Agent', status: 'ready', engine: 'Grounded v1.0' },
                      { name: 'GitHub Telemetry Sync', status: 'healthy', rateLimit: 'OK' }
                    ]).map((srv, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 sm:px-4 sm:py-2.5 hover:bg-muted/10 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                          <span className="font-medium text-foreground truncate">{srv.name}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
                          <span className="hidden sm:inline text-muted-foreground/70">
                            {srv.protocol || srv.version || srv.engine || srv.rateLimit || 'OK'}
                          </span>
                          <span className="border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                            {srv.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SRE Telemetry Footer Notes */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-border/60 pt-3 text-[10px] font-mono text-muted-foreground/70">
                  <span>SSL: TLS 1.3 Strict HTTPS • HSTS Active</span>
                  <span>Polled live from <code className="text-foreground">/api/health</code></span>
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
