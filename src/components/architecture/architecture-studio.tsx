'use client'

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import {
  ARCHITECTURES,
  type ArchitectureSystem,
  type ArchitectureNode,
  generateMermaidDiagram
} from '@/data/architectures'
import { Frame, FrameHeader, FrameBody, CornerBadge, CornerHeading, Corners } from '@/components/frame'
import {
  Layers,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Download,
  Share2,
  Check,
  Code,
  Activity,
  Zap,
  Terminal,
  FileCode,
  ExternalLink,
  RotateCcw
} from 'lucide-react'
import { FlowCanvas } from './flow-canvas'
import { NodeInspector } from './node-inspector'

interface TelemetryPacket {
  id: string
  timestamp: string
  source: string
  target: string
  protocol: string
  latency: number
  status: '200 OK' | 'SYN_ACK' | 'STREAMING' | 'RECONCILED'
}

export function ArchitectureStudio() {
  const [selectedArchId, setSelectedArchId] = useState<string>('gitops-k8s')
  const [selectedNodeId, setSelectedNodeId] = useState<string>('backstage')
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [simulateFlow, setSimulateFlow] = useState<boolean>(true)

  // Trace walkthrough state
  const [isTraceMode, setIsTraceMode] = useState<boolean>(false)
  const [currentTraceStep, setCurrentTraceStep] = useState<number>(0)
  const [isAutoPlayingTrace, setIsAutoPlayingTrace] = useState<boolean>(false)

  // Inspector tab & copy state
  const [inspectorTab, setInspectorTab] = useState<'specs' | 'code' | 'mermaid'>('code')
  const [copiedCode, setCopiedCode] = useState<boolean>(false)
  const [copiedMermaid, setCopiedMermaid] = useState<boolean>(false)
  const [copiedShareLink, setCopiedShareLink] = useState<boolean>(false)

  // Live Traffic Simulation state
  const [isTrafficSimulating, setIsTrafficSimulating] = useState<boolean>(false)
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryPacket[]>([])
  const trafficTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Active architecture
  const activeArch: ArchitectureSystem = useMemo(() => {
    return ARCHITECTURES.find((a) => a.id === selectedArchId) || ARCHITECTURES[0]!
  }, [selectedArchId])

  // Active node
  const activeNode: ArchitectureNode = useMemo(() => {
    return (
      activeArch.nodes.find((n) => n.id === selectedNodeId) ||
      activeArch.nodes[0]!
    )
  }, [activeArch, selectedNodeId])

  // Active trace step
  const activeStep = useMemo(() => {
    return activeArch.traceSteps?.[currentTraceStep] || null
  }, [activeArch, currentTraceStep])

  // Upstream & Downstream connections
  const upstreamNodes = useMemo(() => {
    const fromIds = activeArch.edges
      .filter((e) => e.to === selectedNodeId)
      .map((e) => e.from)
    return activeArch.nodes.filter((n) => fromIds.includes(n.id))
  }, [activeArch, selectedNodeId])

  const downstreamNodes = useMemo(() => {
    const toIds = activeArch.edges
      .filter((e) => e.from === selectedNodeId)
      .map((e) => e.to)
    return activeArch.nodes.filter((n) => toIds.includes(n.id))
  }, [activeArch, selectedNodeId])

  // Sync selected node with trace step when trace mode is on
  useEffect(() => {
    if (isTraceMode && activeStep) {
      setSelectedNodeId(activeStep.activeNodeId)
    }
  }, [isTraceMode, activeStep])

  // Auto-play trace steps
  useEffect(() => {
    if (!isTraceMode || !isAutoPlayingTrace || !activeArch.traceSteps?.length) return

    const timer = setInterval(() => {
      setCurrentTraceStep((prev) => {
        if (prev >= activeArch.traceSteps.length - 1) {
          return 0
        }
        return prev + 1
      })
    }, 3000)

    return () => clearInterval(timer)
  }, [isTraceMode, isAutoPlayingTrace, activeArch.traceSteps])

  // Handle system selection
  const handleSelectArch = (archId: string) => {
    setSelectedArchId(archId)
    const targetArch = ARCHITECTURES.find((a) => a.id === archId) || ARCHITECTURES[0]!
    setSelectedNodeId(targetArch.nodes[0]?.id || '')
    setCurrentTraceStep(0)
    setIsAutoPlayingTrace(false)
    setIsTraceMode(false)
  }

  // Trigger simulated traffic burst
  const handleTriggerTrafficSimulation = useCallback(() => {
    setIsTrafficSimulating(true)
    const edges = activeArch.edges
    if (!edges.length) return

    let step = 0
    if (trafficTimerRef.current) clearInterval(trafficTimerRef.current)

    trafficTimerRef.current = setInterval(() => {
      if (step >= edges.length) {
        if (trafficTimerRef.current) clearInterval(trafficTimerRef.current)
        setIsTrafficSimulating(false)
        return
      }

      const edge = edges[step]
      if (edge) {
        setSelectedNodeId(edge.to)
        const newPacket: TelemetryPacket = {
          id: Math.random().toString(36).slice(2, 8),
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          source: edge.from,
          target: edge.to,
          protocol: edge.protocol,
          latency: Math.floor(Math.random() * 28) + 4,
          status: step === edges.length - 1 ? 'RECONCILED' : '200 OK'
        }
        setTelemetryLogs((prev) => [newPacket, ...prev.slice(0, 7)])
      }
      step++
    }, 750)
  }, [activeArch])

  // Cleanup traffic timer
  useEffect(() => {
    return () => {
      if (trafficTimerRef.current) clearInterval(trafficTimerRef.current)
    }
  }, [])

  // Copy code snippet
  const handleCopyCode = useCallback(async () => {
    if (!activeNode.codeSnippet?.code) return
    try {
      await navigator.clipboard.writeText(activeNode.codeSnippet.code)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    } catch {
      // fallback
    }
  }, [activeNode])

  // Copy Mermaid definition
  const handleCopyMermaid = useCallback(async () => {
    try {
      const code = generateMermaidDiagram(activeArch)
      await navigator.clipboard.writeText(code)
      setCopiedMermaid(true)
      setTimeout(() => setCopiedMermaid(false), 2000)
    } catch {
      // fallback
    }
  }, [activeArch])

  // Export SVG directly from DOM
  const handleExportSvg = useCallback(() => {
    const svgEl = document.getElementById('architecture-svg-canvas')
    if (!svgEl) return

    const serializer = new XMLSerializer()
    const source = serializer.serializeToString(svgEl)
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${activeArch.id}-architecture.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [activeArch])

  // Export Mermaid file
  const handleExportMermaid = useCallback(() => {
    const mermaidCode = generateMermaidDiagram(activeArch)
    const blob = new Blob([mermaidCode], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${activeArch.id}-diagram.mmd`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [activeArch])

  // Copy share link
  const handleCopyShareLink = useCallback(async () => {
    try {
      const url = typeof window !== 'undefined'
        ? `${window.location.origin}/architecture?system=${activeArch.id}&node=${selectedNodeId}`
        : ''
      await navigator.clipboard.writeText(url)
      setCopiedShareLink(true)
      setTimeout(() => setCopiedShareLink(false), 2000)
    } catch {
      // fallback
    }
  }, [activeArch, selectedNodeId])

  return (
    <div className="flex w-full flex-col gap-6 py-4 sm:py-6">
      {/* Studio Header Frame */}
      <Frame>
        <FrameHeader label="Systems Design Studio / Architecture Lab">
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
            {ARCHITECTURES.length} Production Systems
          </span>
        </FrameHeader>
        <FrameBody className="space-y-4 py-8 sm:py-10">
          <div className="flex flex-wrap items-center gap-2">
            <CornerBadge size="sm">LIVE ARCHITECTURE LAB</CornerBadge>
            <span className="font-mono text-xs text-muted-foreground">
              Deep-dive interactive topology, packet flow simulations, and declarative IaC manifests
            </span>
          </div>

          <CornerHeading size="lg" className="w-fit max-w-4xl px-3 py-2 sm:px-4 sm:py-3">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              Production Architecture Blueprints
            </h1>
          </CornerHeading>

          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Explore interactive system topologies engineered for enterprise scale. Inspect declarative
            Kubernetes manifests, Terraform modules, and Model Context Protocol (MCP) server implementations
            with simulated live packet routing.
          </p>
        </FrameBody>
      </Frame>

      {/* Multi-System Blueprint Switcher */}
      <Frame>
        <FrameHeader label="1. Select System Blueprint">
          <span className="font-mono text-[10px] text-muted-foreground uppercase">
            Active: {activeArch.badge}
          </span>
        </FrameHeader>
        <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          {ARCHITECTURES.map((arch) => {
            const isSelected = arch.id === selectedArchId
            return (
              <button
                key={arch.id}
                type="button"
                onClick={() => handleSelectArch(arch.id)}
                className={`relative flex flex-col p-4 text-left transition-all ${
                  isSelected
                    ? 'bg-foreground/5 shadow-inner'
                    : 'bg-background hover:bg-muted/30'
                }`}
              >
                {isSelected && <Corners size="sm" offset="border" weight="thin" light />}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`border px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-wider uppercase ${
                      isSelected
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    {arch.badge}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground/70 tabular-nums">
                    {arch.nodes.length} nodes
                  </span>
                </div>

                <p className="font-heading text-sm font-semibold text-foreground leading-snug">
                  {arch.title}
                </p>

                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                  {arch.subtitle}
                </p>

                <div className="mt-4 flex flex-wrap gap-1 pt-2 border-t border-border/40">
                  {arch.nodes.slice(0, 3).map((n) => (
                    <span
                      key={n.id}
                      className="font-mono text-[9px] text-muted-foreground/80 bg-muted/30 px-1 py-0.5"
                    >
                      {n.label.split(' ')[0]}
                    </span>
                  ))}
                  {arch.nodes.length > 3 && (
                    <span className="font-mono text-[9px] text-muted-foreground/60 px-1 py-0.5">
                      +{arch.nodes.length - 3}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </Frame>

      {/* Interactive Controls & Live Simulation Toolbar */}
      <Frame>
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 bg-muted/15 border-b border-border">
          {/* Left Controls: Simulation & Trace */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleTriggerTrafficSimulation}
              disabled={isTrafficSimulating}
              className={`flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs transition-colors ${
                isTrafficSimulating
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 animate-pulse'
                  : 'border-border bg-background text-foreground hover:border-foreground/50 hover:bg-muted/40'
              }`}
            >
              <Zap className="size-3.5" />
              <span>{isTrafficSimulating ? 'Simulating Traffic...' : 'Simulate Packet Flow'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const next = !isTraceMode
                setIsTraceMode(next)
                if (next) {
                  setCurrentTraceStep(0)
                  setIsAutoPlayingTrace(true)
                } else {
                  setIsAutoPlayingTrace(false)
                }
              }}
              className={`flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs transition-colors ${
                isTraceMode
                  ? 'border-foreground bg-foreground text-background font-medium'
                  : 'border-border bg-background text-muted-foreground hover:border-foreground/50 hover:text-foreground'
              }`}
            >
              <Activity className="size-3.5" />
              <span>{isTraceMode ? 'Exit Walkthrough' : 'Step-by-Step Trace'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSimulateFlow(!simulateFlow)}
              className={`border px-2.5 py-1.5 font-mono text-xs transition-colors ${
                simulateFlow
                  ? 'border-border bg-background text-foreground'
                  : 'border-border/50 text-muted-foreground hover:text-foreground'
              }`}
              title="Toggle animated edge flow lines"
            >
              Edge Flow: {simulateFlow ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Right Controls: Exports & Share */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportSvg}
              className="flex items-center gap-1 border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors"
              title="Download architecture as standalone SVG"
            >
              <Download className="size-3" />
              <span>Export SVG</span>
            </button>

            <button
              type="button"
              onClick={handleExportMermaid}
              className="flex items-center gap-1 border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors"
              title="Download Mermaid diagram file (.mmd)"
            >
              <Code className="size-3" />
              <span>Export Mermaid</span>
            </button>

            <button
              type="button"
              onClick={handleCopyShareLink}
              className="flex items-center gap-1 border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors"
              title="Copy shareable link with selected node"
            >
              {copiedShareLink ? <Check className="size-3 text-emerald-500" /> : <Share2 className="size-3" />}
              <span>{copiedShareLink ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Topology SVG Canvas */}
        <div className="p-3 sm:p-6 bg-background">
          <FlowCanvas
            activeArch={activeArch}
            selectedNodeId={selectedNodeId}
            hoveredNodeId={hoveredNodeId}
            setSelectedNodeId={setSelectedNodeId}
            setHoveredNodeId={setHoveredNodeId}
            simulateFlow={simulateFlow}
            isTraceMode={isTraceMode}
            activeStep={activeStep}
            currentTraceStep={currentTraceStep}
            isAutoPlayingTrace={isAutoPlayingTrace}
            onPrevStep={() => {
              setCurrentTraceStep((prev) => Math.max(0, prev - 1))
              setIsAutoPlayingTrace(false)
            }}
            onNextStep={() => {
              setCurrentTraceStep((prev) =>
                Math.min(activeArch.traceSteps.length - 1, prev + 1)
              )
              setIsAutoPlayingTrace(false)
            }}
            onTogglePlay={() => setIsAutoPlayingTrace(!isAutoPlayingTrace)}
            isModal={false}
          />
        </div>
      </Frame>

      {/* Live Packet Telemetry Stream Console (When packets exist or simulating) */}
      {telemetryLogs.length > 0 && (
        <Frame>
          <FrameHeader label="Live Packet Telemetry Stream">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                Hop Handshake Stream
              </span>
            </div>
          </FrameHeader>
          <div className="bg-background/90 p-3 sm:p-4 font-mono text-xs space-y-2 overflow-x-auto">
            <div className="grid grid-cols-5 gap-2 pb-1 border-b border-border text-[10px] uppercase text-muted-foreground">
              <span>Time</span>
              <span>Hop (Source → Target)</span>
              <span>Protocol</span>
              <span>Latency</span>
              <span>Status</span>
            </div>
            {telemetryLogs.map((log) => (
              <div
                key={log.id}
                className="grid grid-cols-5 gap-2 py-1 border-b border-border/40 text-[11px] items-center font-mono"
              >
                <span className="text-muted-foreground">{log.timestamp}</span>
                <span className="text-foreground font-medium truncate">
                  {log.source} → {log.target}
                </span>
                <span className="text-muted-foreground/80">{log.protocol}</span>
                <span className="text-emerald-500 tabular-nums">+{log.latency}ms</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-foreground">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </Frame>
      )}

      {/* Deep-Dive Manifest & IaC Technical Inspector */}
      <Frame>
        <FrameHeader label={`2. Deep-Dive Inspector: ${activeNode.label}`}>
          <span className="font-mono text-[11px] text-muted-foreground">
            {activeNode.category} Layer
          </span>
        </FrameHeader>
        <div className="p-3 sm:p-6 bg-background">
          <NodeInspector
            activeNode={activeNode}
            activeArch={activeArch}
            upstreamNodes={upstreamNodes}
            downstreamNodes={downstreamNodes}
            onSelectNode={setSelectedNodeId}
            inspectorTab={inspectorTab}
            setInspectorTab={setInspectorTab}
            copiedCode={copiedCode}
            copiedMermaid={copiedMermaid}
            onCopyCode={handleCopyCode}
            onCopyMermaid={handleCopyMermaid}
          />
        </div>
      </Frame>
    </div>
  )
}
