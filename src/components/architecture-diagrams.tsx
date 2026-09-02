'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  ARCHITECTURES,
  type ArchitectureSystem,
  type ArchitectureNode,
  generateMermaidDiagram
} from '@/data/architecture-data'
import { Corners, CornerBadge, Frame, FrameHeader, FrameBody } from './frame'
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Layers,
  Cpu,
  Shield,
  Activity,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Code,
  FileCode,
  Sparkles,
  Terminal,
  ArrowRight,
  Database,
  Globe,
  Compass,
  Bot,
  GitBranch,
  Workflow,
  Network,
  Server,
  Share2
} from 'lucide-react'

function getCategoryIcon(category: string) {
  const cat = category.toLowerCase()
  if (cat.includes('ingress') || cat.includes('presentation')) return Globe
  if (cat.includes('routing') || cat.includes('gateway')) return Compass
  if (cat.includes('agent') || cat.includes('core')) return Bot
  if (cat.includes('tool') || cat.includes('binding')) return Terminal
  if (cat.includes('inference') || cat.includes('llm')) return Cpu
  if (cat.includes('retrieval') || cat.includes('rag') || cat.includes('storage') || cat.includes('vector')) return Database
  if (cat.includes('source') || cat.includes('git')) return GitBranch
  if (cat.includes('automation') || cat.includes('ci')) return Workflow
  if (cat.includes('security') || cat.includes('secrets')) return Shield
  if (cat.includes('network')) return Network
  if (cat.includes('compute')) return Server
  if (cat.includes('monitoring') || cat.includes('observability')) return Activity
  return Layers
}

export function ArchitectureDiagrams() {
  const [selectedArchId, setSelectedArchId] = useState<string>('agentic-mcp')
  const [selectedNodeId, setSelectedNodeId] = useState<string>('orchestrator')
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [simulateFlow, setSimulateFlow] = useState<boolean>(true)

  // Interactive Trace Mode
  const [isTraceMode, setIsTraceMode] = useState<boolean>(false)
  const [currentTraceStep, setCurrentTraceStep] = useState<number>(0)
  const [isAutoPlayingTrace, setIsAutoPlayingTrace] = useState<boolean>(false)

  // Inspector Tabs
  const [inspectorTab, setInspectorTab] = useState<'specs' | 'code' | 'mermaid'>('specs')
  const [copiedCode, setCopiedCode] = useState<boolean>(false)
  const [copiedMermaid, setCopiedMermaid] = useState<boolean>(false)

  // Fullscreen Modal
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const activeArch: ArchitectureSystem = useMemo(() => {
    return ARCHITECTURES.find((a) => a.id === selectedArchId) || ARCHITECTURES[0]!
  }, [selectedArchId])

  const activeNode: ArchitectureNode = useMemo(() => {
    return (
      activeArch.nodes.find((n) => n.id === selectedNodeId) ||
      activeArch.nodes[0]!
    )
  }, [activeArch, selectedNodeId])

  // Current active trace step object
  const activeStep = useMemo(() => {
    return activeArch.traceSteps?.[currentTraceStep] || null
  }, [activeArch, currentTraceStep])

  // Sync selected node with trace step when in trace mode
  useEffect(() => {
    if (isTraceMode && activeStep) {
      setSelectedNodeId(activeStep.activeNodeId)
    }
  }, [isTraceMode, activeStep])

  // Auto-advance trace steps
  useEffect(() => {
    if (!isTraceMode || !isAutoPlayingTrace || !activeArch.traceSteps?.length) return

    const timer = setInterval(() => {
      setCurrentTraceStep((prev) => {
        if (prev >= activeArch.traceSteps.length - 1) {
          return 0
        }
        return prev + 1
      })
    }, 2800)

    return () => clearInterval(timer)
  }, [isTraceMode, isAutoPlayingTrace, activeArch.traceSteps])

  // Reset trace step when changing architecture
  const handleSelectArch = (archId: string) => {
    setSelectedArchId(archId)
    const targetArch = ARCHITECTURES.find((a) => a.id === archId) || ARCHITECTURES[0]!
    setSelectedNodeId(targetArch.nodes[1]?.id || targetArch.nodes[0]?.id || '')
    setCurrentTraceStep(0)
    setIsAutoPlayingTrace(false)
  }

  // Handle escape key for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

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

  // Copy Mermaid diagram definition
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

  // Upstream and Downstream connections for selected node
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

  // Map coordinates to 1000x480 SVG canvas
  const getNodePos = (node: ArchitectureNode) => {
    return {
      cx: (node.x / 100) * 1000,
      cy: (node.y / 100) * 480
    }
  }

  // SVG Diagram Content component to reuse in main & fullscreen
  const renderSvgCanvas = (isModal = false) => (
    <div className={`relative overflow-hidden border border-border bg-muted/5 ${isModal ? 'h-[60vh] sm:h-[68vh]' : ''}`}>
      <Corners size="default" offset="none" weight="thin" light />

      {/* Canvas Status Bar */}
      <div className="flex items-center justify-between border-b border-border/70 bg-background/90 px-3 py-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-foreground">Topology View</span>
          <span className="hidden md:inline text-muted-foreground/60">• Interactive Nodes & Live Connections</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-muted-foreground/60">
            {isTraceMode ? 'Trace Mode Active' : 'Click node to inspect production specs & manifests'}
          </span>
          {!isModal && (
            <button
              onClick={() => setIsFullscreen(true)}
              title="Expand Canvas Fullscreen"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Maximize2 className="size-3" />
              <span className="hidden md:inline">Expand</span>
            </button>
          )}
        </div>
      </div>

      {/* Trace Narrative Banner (When in Trace Mode) */}
      {isTraceMode && activeStep && (
        <div className="border-b border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-mono text-emerald-400 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex size-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold uppercase tracking-wider shrink-0 text-[11px]">
              Step {activeStep.step}/{activeArch.traceSteps.length}: {activeStep.title}
            </span>
            <span className="hidden sm:inline text-muted-foreground/80 truncate">
              — {activeStep.action} ({activeStep.narrative})
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                setCurrentTraceStep((prev) => Math.max(0, prev - 1))
                setIsAutoPlayingTrace(false)
              }}
              disabled={currentTraceStep === 0}
              title="Previous Step"
              className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <SkipBack className="size-3.5" />
            </button>
            <button
              onClick={() => setIsAutoPlayingTrace(!isAutoPlayingTrace)}
              title={isAutoPlayingTrace ? 'Pause Walkthrough' : 'Play Walkthrough'}
              className="p-1 text-emerald-400 hover:text-emerald-300"
            >
              {isAutoPlayingTrace ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            </button>
            <button
              onClick={() => {
                setCurrentTraceStep((prev) =>
                  Math.min(activeArch.traceSteps.length - 1, prev + 1)
                )
                setIsAutoPlayingTrace(false)
              }}
              disabled={currentTraceStep === activeArch.traceSteps.length - 1}
              title="Next Step"
              className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <SkipForward className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* SVG Canvas Container */}
      <div className={`w-full overflow-x-auto scrollbar-thin ${isModal ? 'h-[calc(100%-2.5rem)] flex items-center' : ''}`}>
        <div className="min-w-[780px] p-4 sm:p-6 select-none w-full">
          <svg
            viewBox="0 0 1000 480"
            className="w-full h-auto overflow-visible"
            style={{ maxHeight: isModal ? '540px' : '460px' }}
          >
            <defs>
              {/* Subtle Blueprint Grid Pattern */}
              <pattern
                id="archGrid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-border/40"
                />
              </pattern>

              {/* Marker Arrow Default */}
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon
                  points="0 0, 8 3, 0 6"
                  fill="currentColor"
                  className="text-foreground/40"
                />
              </marker>

              {/* Marker Arrow Active/Trace */}
              <marker
                id="arrowhead-active"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon
                  points="0 0, 8 3, 0 6"
                  fill="currentColor"
                  className="text-emerald-500"
                />
              </marker>
            </defs>

            {/* Grid Background */}
            <rect width="1000" height="480" fill="url(#archGrid)" />

            {/* Connection Edges */}
            {activeArch.edges.map((edge, idx) => {
              const sourceNode = activeArch.nodes.find((n) => n.id === edge.from)
              const targetNode = activeArch.nodes.find((n) => n.id === edge.to)
              if (!sourceNode || !targetNode) return null

              const source = getNodePos(sourceNode)
              const target = getNodePos(targetNode)

              const isConnectedToSelected =
                sourceNode.id === selectedNodeId || targetNode.id === selectedNodeId
              const isConnectedToHovered =
                sourceNode.id === hoveredNodeId || targetNode.id === hoveredNodeId

              // Check if edge is the active path in trace mode
              const isTraceActiveEdge =
                isTraceMode &&
                activeStep &&
                ((activeStep.fromNodeId === sourceNode.id && activeStep.activeNodeId === targetNode.id) ||
                  (activeStep.activeNodeId === sourceNode.id && activeStep.toNodeId === targetNode.id))

              const isHighlighted = isTraceActiveEdge || isConnectedToSelected || isConnectedToHovered

              // Smooth cubic Bezier path
              const dx = target.cx - source.cx
              const controlX1 = source.cx + dx * 0.5
              const controlY1 = source.cy
              const controlX2 = target.cx - dx * 0.5
              const controlY2 = target.cy

              const pathData = `M ${source.cx + 70} ${source.cy} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${target.cx - 70} ${target.cy}`

              return (
                <g key={`edge-${idx}`} className="transition-all duration-300">
                  {/* Base Connection Path */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={isTraceActiveEdge ? 2.5 : isHighlighted ? 2 : 1.2}
                    className={`transition-colors ${
                      isTraceActiveEdge
                        ? 'text-emerald-500'
                        : isHighlighted
                        ? 'text-foreground'
                        : isTraceMode
                        ? 'text-border/40'
                        : 'text-border/80'
                    }`}
                    markerEnd={isTraceActiveEdge ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                  />

                  {/* Animated Flow Pulse (Simulated Traffic) */}
                  {simulateFlow && (
                    <path
                      d={pathData}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={isTraceActiveEdge ? 3 : isHighlighted ? 2.5 : 1.5}
                      strokeDasharray="6 14"
                      className={`${
                        isTraceActiveEdge
                          ? 'text-emerald-400 animate-[dash_1s_linear_infinite]'
                          : isHighlighted
                          ? 'text-foreground/80 animate-[dash_1.4s_linear_infinite]'
                          : 'text-emerald-500/70 animate-[dash_2s_linear_infinite]'
                      }`}
                      style={{
                        animation: isTraceActiveEdge ? 'dash 1s linear infinite' : 'dash 1.8s linear infinite'
                      }}
                    />
                  )}

                  {/* Protocol Badge on Edge */}
                  {edge.label && (
                    <g
                      transform={`translate(${(source.cx + target.cx) / 2}, ${
                        (source.cy + target.cy) / 2 - 8
                      })`}
                    >
                      <rect
                        x="-36"
                        y="-9"
                        width="72"
                        height="18"
                        fill="currentColor"
                        className={`transition-colors ${
                          isTraceActiveEdge
                            ? 'text-emerald-950/80 stroke-emerald-500/60 stroke-1'
                            : 'text-background border border-border'
                        }`}
                        rx="2"
                      />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        className={`font-mono text-[9px] font-medium select-none uppercase tracking-wider ${
                          isTraceActiveEdge ? 'fill-emerald-400 font-semibold' : 'fill-muted-foreground'
                        }`}
                      >
                        {edge.label}
                      </text>
                    </g>
                  )}
                </g>
              )
            })}

            {/* Nodes */}
            {activeArch.nodes.map((node) => {
              const { cx, cy } = getNodePos(node)
              const isSelected = node.id === selectedNodeId
              const isHovered = node.id === hoveredNodeId
              const isTraceActive = isTraceMode && activeStep?.activeNodeId === node.id

              const width = 154
              const height = 70
              const rx = cx - width / 2
              const ry = cy - height / 2

              const CategoryIcon = getCategoryIcon(node.category)

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className="cursor-pointer transition-all duration-200"
                >
                  {/* Subtle Node Drop Shadow on Selection */}
                  {(isSelected || isTraceActive) && (
                    <rect
                      x={rx - 3}
                      y={ry - 3}
                      width={width + 6}
                      height={height + 6}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-emerald-500/40"
                      rx="3"
                    />
                  )}

                  {/* Node Box */}
                  <rect
                    x={rx}
                    y={ry}
                    width={width}
                    height={height}
                    fill="currentColor"
                    className={`transition-all ${
                      isTraceActive
                        ? 'text-background stroke-emerald-500 stroke-2'
                        : isSelected
                        ? 'text-background stroke-foreground stroke-2'
                        : isHovered
                        ? 'text-background stroke-foreground/60 stroke-1'
                        : isTraceMode
                        ? 'text-background/80 stroke-border/50 stroke-1'
                        : 'text-background stroke-border stroke-1'
                    }`}
                    rx="2"
                  />

                  {/* Blueprint Corner Ticks on Active Node */}
                  {(isSelected || isTraceActive) && (
                    <>
                      <path
                        d={`M ${rx - 3} ${ry + 7} L ${rx - 3} ${ry - 3} L ${rx + 7} ${ry - 3}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={isTraceActive ? 'text-emerald-500' : 'text-foreground'}
                      />
                      <path
                        d={`M ${rx + width + 3} ${ry + 7} L ${rx + width + 3} ${ry - 3} L ${rx + width - 7} ${ry - 3}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={isTraceActive ? 'text-emerald-500' : 'text-foreground'}
                      />
                      <path
                        d={`M ${rx - 3} ${ry + height - 7} L ${rx - 3} ${ry + height + 3} L ${rx + 7} ${ry + height + 3}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={isTraceActive ? 'text-emerald-500' : 'text-foreground'}
                      />
                      <path
                        d={`M ${rx + width + 3} ${ry + height - 7} L ${rx + width + 3} ${ry + height + 3} L ${rx + width - 7} ${ry + height + 3}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={isTraceActive ? 'text-emerald-500' : 'text-foreground'}
                      />
                    </>
                  )}

                  {/* Category Label Pill with Icon */}
                  <rect
                    x={rx + 8}
                    y={ry + 8}
                    width="68"
                    height="15"
                    fill="currentColor"
                    className="text-muted/60"
                    rx="2"
                  />
                  <text
                    x={rx + 12}
                    y={ry + 19}
                    className="font-mono text-[8px] font-semibold uppercase fill-muted-foreground tracking-wider"
                  >
                    {node.category.length > 11 ? node.category.substring(0, 11) : node.category}
                  </text>

                  {/* Status indicator dot */}
                  <circle
                    cx={rx + width - 14}
                    cy={ry + 15}
                    r={isTraceActive ? '4' : '3'}
                    className={isTraceActive ? 'fill-emerald-400 animate-ping' : 'fill-emerald-500'}
                  />
                  {isTraceActive && (
                    <circle
                      cx={rx + width - 14}
                      cy={ry + 15}
                      r="3"
                      className="fill-emerald-500"
                    />
                  )}

                  {/* Node Title */}
                  <text
                    x={rx + 10}
                    y={ry + 41}
                    className={`font-mono text-[11px] font-semibold tracking-tight transition-colors ${
                      isTraceActive
                        ? 'fill-emerald-400'
                        : isSelected
                        ? 'fill-foreground'
                        : 'fill-foreground/90'
                    }`}
                  >
                    {node.label}
                  </text>

                  {/* Protocol / Tech pill */}
                  <text
                    x={rx + 10}
                    y={ry + 58}
                    className="font-mono text-[9px] fill-muted-foreground/80"
                  >
                    {node.protocol}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  )

  // Technical Inspector Component
  const renderInspector = () => (
    <div className="relative border border-border bg-background/95 p-4 sm:p-6 space-y-4">
      <Corners size="sm" offset="border" weight="thin" light />

      {/* Inspector Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CornerBadge size="sm">
              COMPONENT: {activeNode.label.toUpperCase()}
            </CornerBadge>
            <span className="font-mono text-[10px] text-muted-foreground uppercase">
              {activeNode.category} Layer
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            Protocol: <span className="text-foreground font-semibold">{activeNode.protocol}</span>
          </p>
        </div>

        {/* Tab Switcher & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center border border-border bg-muted/20 p-0.5">
            <button
              onClick={() => setInspectorTab('specs')}
              className={`px-2.5 py-1 text-xs font-mono transition-colors ${
                inspectorTab === 'specs'
                  ? 'bg-background text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Specs
            </button>
            <button
              onClick={() => setInspectorTab('code')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono transition-colors ${
                inspectorTab === 'code'
                  ? 'bg-background text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code className="size-3" />
              <span>Manifest</span>
            </button>
            <button
              onClick={() => setInspectorTab('mermaid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono transition-colors ${
                inspectorTab === 'mermaid'
                  ? 'bg-background text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Share2 className="size-3" />
              <span>Mermaid</span>
            </button>
          </div>

          <button
            onClick={handleCopyMermaid}
            title="Copy entire architecture as Mermaid.js graph"
            className="flex items-center gap-1.5 border border-border/80 bg-background px-2.5 py-1.5 text-xs font-mono text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground active:bg-muted/40"
          >
            {copiedMermaid ? (
              <>
                <Check className="size-3 text-emerald-500" />
                <span className="text-emerald-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                <span>Export Graph</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
        {activeNode.description}
      </p>

      {/* Tab 1: Specifications */}
      {inspectorTab === 'specs' && (
        <div className="space-y-4">
          {/* Tech Stack Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-muted-foreground uppercase mr-1">Stack:</span>
            {activeNode.tech.map((t) => (
              <span
                key={t}
                className="border border-border bg-muted/30 px-2 py-0.5 text-[10px] font-mono text-foreground font-medium"
              >
                {t}
              </span>
            ))}
          </div>

          {/* 4 Technical Architecture Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            <div className="border border-border/70 bg-muted/10 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase">
                <Layers className="size-3 text-foreground/70" />
                <span>Architecture Layer</span>
              </div>
              <p className="font-mono text-xs font-semibold text-foreground">
                {activeNode.specs.layer}
              </p>
            </div>

            <div className="border border-border/70 bg-muted/10 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase">
                <Cpu className="size-3 text-foreground/70" />
                <span>Scaling & Runtime</span>
              </div>
              <p className="font-mono text-xs font-semibold text-foreground">
                {activeNode.specs.scaling}
              </p>
            </div>

            <div className="border border-border/70 bg-muted/10 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase">
                <Shield className="size-3 text-foreground/70" />
                <span>Security & Access</span>
              </div>
              <p className="font-mono text-xs font-semibold text-foreground">
                {activeNode.specs.security}
              </p>
            </div>

            <div className="border border-border/70 bg-muted/10 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase">
                <Activity className="size-3 text-foreground/70" />
                <span>SRE Observability</span>
              </div>
              <p className="font-mono text-xs font-semibold text-foreground">
                {activeNode.specs.observability}
              </p>
            </div>
          </div>

          {/* Interactive Graph Neighbors (Upstream / Downstream Traversal) */}
          {(upstreamNodes.length > 0 || downstreamNodes.length > 0) && (
            <div className="border-t border-border/60 pt-3 flex flex-wrap items-center gap-4 text-xs font-mono">
              {upstreamNodes.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-[11px]">Inputs from:</span>
                  {upstreamNodes.map((un) => (
                    <button
                      key={un.id}
                      onClick={() => setSelectedNodeId(un.id)}
                      className="border border-border bg-background px-2 py-0.5 text-[11px] text-foreground hover:border-foreground transition-colors"
                    >
                      ← {un.label}
                    </button>
                  ))}
                </div>
              )}

              {downstreamNodes.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-[11px]">Outputs to:</span>
                  {downstreamNodes.map((dn) => (
                    <button
                      key={dn.id}
                      onClick={() => setSelectedNodeId(dn.id)}
                      className="border border-border bg-background px-2 py-0.5 text-[11px] text-foreground hover:border-foreground transition-colors"
                    >
                      {dn.label} →
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Code / Manifest Blueprint */}
      {inspectorTab === 'code' && (
        <div className="space-y-2">
          {activeNode.codeSnippet ? (
            <div className="border border-border bg-black/40 text-foreground font-mono text-xs">
              {/* Code Header Bar */}
              <div className="flex items-center justify-between border-b border-border/70 bg-muted/20 px-3 py-1.5">
                <div className="flex items-center gap-2">
                  <FileCode className="size-3.5 text-foreground/70" />
                  <span className="font-semibold text-foreground text-[11px]">
                    {activeNode.codeSnippet.filename}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase">
                    [{activeNode.codeSnippet.language}]
                  </span>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="size-3 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      <span>Copy snippet</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Body */}
              <pre className="p-3 sm:p-4 overflow-x-auto text-[11px] sm:text-xs leading-relaxed text-emerald-300/90 max-h-72">
                <code>{activeNode.codeSnippet.code}</code>
              </pre>
            </div>
          ) : (
            <p className="text-xs font-mono text-muted-foreground py-4 text-center">
              No specific manifest snippet configured for this component.
            </p>
          )}
        </div>
      )}

      {/* Tab 3: Mermaid Diagram Graph */}
      {inspectorTab === 'mermaid' && (
        <div className="space-y-2">
          <div className="border border-border bg-black/40 text-foreground font-mono text-xs">
            <div className="flex items-center justify-between border-b border-border/70 bg-muted/20 px-3 py-1.5">
              <span className="font-semibold text-[11px]">Mermaid.js Flowchart (graph LR)</span>
              <button
                onClick={handleCopyMermaid}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedMermaid ? (
                  <>
                    <Check className="size-3 text-emerald-500" />
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Copy Graph</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 sm:p-4 overflow-x-auto text-[11px] sm:text-xs leading-relaxed text-sky-300 max-h-72">
              <code>{generateMermaidDiagram(activeArch)}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      <Frame id="architectures" className="w-full scroll-mt-24">
        <FrameHeader label="System Architectures / Blueprints">
          <div className="flex items-center gap-2">
            {/* Trace Walkthrough Toggle */}
            <button
              onClick={() => {
                const nextMode = !isTraceMode
                setIsTraceMode(nextMode)
                if (nextMode) {
                  setCurrentTraceStep(0)
                  setIsAutoPlayingTrace(true)
                } else {
                  setIsAutoPlayingTrace(false)
                }
              }}
              className={`flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors ${
                isTraceMode
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold'
                  : 'border-border/80 bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground'
              }`}
            >
              <Sparkles className="size-3 text-emerald-400" />
              <span>Trace Request</span>
            </button>

            {/* Continuous Pulse Toggle */}
            <button
              onClick={() => setSimulateFlow(!simulateFlow)}
              className="flex items-center gap-1.5 border border-border/80 bg-background px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              <span className="relative flex size-2">
                {simulateFlow ? (
                  <>
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </>
                ) : (
                  <span className="size-2 rounded-full bg-muted-foreground/50" />
                )}
              </span>
              <span className="hidden sm:inline">Traffic:</span>
              <span>{simulateFlow ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </FrameHeader>

        <FrameBody className="space-y-6 py-6 sm:py-8">
          {/* Architecture Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {ARCHITECTURES.map((arch, idx) => {
              const isCurrent = arch.id === selectedArchId
              return (
                <button
                  key={arch.id}
                  type="button"
                  onClick={() => handleSelectArch(arch.id)}
                  className={`group relative flex items-center gap-2 px-3 py-1.5 text-xs font-mono transition-all ${
                    isCurrent
                      ? 'border border-foreground/30 bg-muted/30 text-foreground font-semibold'
                      : 'border border-border/70 text-muted-foreground hover:border-foreground/20 hover:text-foreground'
                  }`}
                >
                  <Corners size="sm" offset="border" weight="thin" light={!isCurrent} />
                  <span className="text-[10px] text-muted-foreground/60">0{idx + 1}.</span>
                  <span className="tracking-wider uppercase">{arch.title}</span>
                </button>
              )
            })}
          </div>

          {/* Architecture Subtitle & Overview */}
          <div className="border-l-2 border-border pl-3 sm:pl-4 py-1">
            <p className="font-heading text-sm font-semibold tracking-wide uppercase text-foreground">
              {activeArch.subtitle}
            </p>
            <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              {activeArch.description}
            </p>
          </div>

          {/* Mobile Quick Node Ribbon (Allows mobile users to inspect any node with 1 tap) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:hidden scrollbar-none">
            <span className="shrink-0 text-[10px] font-mono text-muted-foreground uppercase">Nodes:</span>
            {activeArch.nodes.map((node) => {
              const isSelected = node.id === selectedNodeId
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`shrink-0 px-2.5 py-1 text-[10px] font-mono border transition-all ${
                    isSelected
                      ? 'border-foreground bg-foreground text-background font-semibold'
                      : 'border-border bg-muted/20 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {node.label}
                </button>
              )
            })}
          </div>

          {/* Interactive SVG Canvas */}
          {renderSvgCanvas(false)}

          {/* Selected Node Blueprint Technical Inspector */}
          {renderInspector()}
        </FrameBody>
      </Frame>

      {/* Fullscreen Modal View */}
      {isFullscreen && mounted && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[150] bg-background/95 backdrop-blur-xl flex flex-col p-3 sm:p-6 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4 shrink-0">
            <div className="flex items-center gap-3">
              <CornerBadge size="sm">BLUEPRINT FULLSCREEN</CornerBadge>
              <span className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider">
                {activeArch.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1.5 border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground hover:bg-muted/40 transition-colors"
              >
                <Minimize2 className="size-3.5" />
                <span>Exit Fullscreen</span>
                <kbd className="text-[10px] text-muted-foreground ml-1">Esc</kbd>
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            {renderSvgCanvas(true)}
            {renderInspector()}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
