'use client'

import { useState, useMemo } from 'react'
import {
  ARCHITECTURES,
  type ArchitectureSystem,
  type ArchitectureNode
} from '@/data/architecture-data'
import { Corners, CornerBadge, Frame, FrameHeader, FrameBody } from './frame'
import {
  Play,
  Pause,
  Layers,
  Cpu,
  Shield,
  Activity,
  Maximize2,
  Info,
  CheckCircle2,
  ExternalLink
} from 'lucide-react'

export function ArchitectureDiagrams() {
  const [selectedArchId, setSelectedArchId] = useState<string>('agentic-mcp')
  const [selectedNodeId, setSelectedNodeId] = useState<string>('orchestrator')
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [simulateFlow, setSimulateFlow] = useState<boolean>(true)

  const activeArch: ArchitectureSystem = useMemo(() => {
    return ARCHITECTURES.find((a) => a.id === selectedArchId) || ARCHITECTURES[0]!
  }, [selectedArchId])

  const activeNode: ArchitectureNode = useMemo(() => {
    return (
      activeArch.nodes.find((n) => n.id === selectedNodeId) ||
      activeArch.nodes[0]!
    )
  }, [activeArch, selectedNodeId])

  // Map coordinates to 1000x480 SVG canvas
  const getNodePos = (node: ArchitectureNode) => {
    return {
      cx: (node.x / 100) * 1000,
      cy: (node.y / 100) * 480
    }
  }

  return (
    <Frame id="architectures" className="w-full scroll-mt-24">
      <FrameHeader label="System Architectures / Blueprints">
        <div className="flex items-center gap-2">
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
            <span className="hidden sm:inline">Traffic Pulse:</span>
            <span>{simulateFlow ? 'ON' : 'PAUSED'}</span>
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
                onClick={() => {
                  setSelectedArchId(arch.id)
                  setSelectedNodeId(arch.nodes[1]?.id || arch.nodes[0]?.id || '')
                }}
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

        {/* Interactive SVG Diagram Canvas */}
        <div className="relative overflow-hidden border border-border bg-muted/5">
          <Corners size="default" offset="none" weight="thin" light />

          {/* Canvas Header Bar */}
          <div className="flex items-center justify-between border-b border-border/70 bg-background/90 px-3 py-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Topology View • Interactive Nodes</span>
            </div>
            <span className="hidden sm:inline text-muted-foreground/60">
              Click any node to inspect SRE specs
            </span>
          </div>

          {/* Scrollable Canvas for Mobile */}
          <div className="w-full overflow-x-auto scrollbar-thin">
            <div className="min-w-[760px] p-4 sm:p-6 select-none">
              <svg
                viewBox="0 0 1000 480"
                className="w-full h-auto overflow-visible"
                style={{ maxHeight: '460px' }}
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

                  {/* Marker Arrow */}
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

                  const isConnectedToActive =
                    sourceNode.id === selectedNodeId ||
                    targetNode.id === selectedNodeId ||
                    sourceNode.id === hoveredNodeId ||
                    targetNode.id === hoveredNodeId

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
                        strokeWidth={isConnectedToActive ? 2 : 1.2}
                        className={`transition-colors ${
                          isConnectedToActive
                            ? 'text-foreground stroke-2'
                            : 'text-border/80'
                        }`}
                        markerEnd="url(#arrowhead)"
                      />

                      {/* Animated Flow Pulse (Simulated Traffic) */}
                      {simulateFlow && (
                        <path
                          d={pathData}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={isConnectedToActive ? 2.5 : 1.5}
                          strokeDasharray="6 14"
                          className="text-emerald-500 animate-[dash_1.5s_linear_infinite]"
                          style={{
                            animation: 'dash 1.8s linear infinite'
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
                            x="-32"
                            y="-9"
                            width="64"
                            height="18"
                            fill="currentColor"
                            className="text-background border border-border"
                            rx="2"
                          />
                          <text
                            x="0"
                            y="3.5"
                            textAnchor="middle"
                            className="font-mono text-[9px] font-medium fill-muted-foreground select-none uppercase tracking-wider"
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

                  const width = 150
                  const height = 66
                  const rx = cx - width / 2
                  const ry = cy - height / 2

                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      className="cursor-pointer transition-all duration-200"
                    >
                      {/* Node Box */}
                      <rect
                        x={rx}
                        y={ry}
                        width={width}
                        height={height}
                        fill="currentColor"
                        className={`transition-all ${
                          isSelected
                            ? 'text-background stroke-foreground stroke-2'
                            : isHovered
                            ? 'text-background stroke-foreground/60 stroke-1'
                            : 'text-background stroke-border stroke-1'
                        }`}
                        rx="1"
                      />

                      {/* Blueprint Corner Ticks on Active Node */}
                      {isSelected && (
                        <>
                          <path
                            d={`M ${rx - 3} ${ry + 6} L ${rx - 3} ${ry - 3} L ${rx + 6} ${ry - 3}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-foreground"
                          />
                          <path
                            d={`M ${rx + width + 3} ${ry + 6} L ${rx + width + 3} ${ry - 3} L ${rx + width - 6} ${ry - 3}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-foreground"
                          />
                          <path
                            d={`M ${rx - 3} ${ry + height - 6} L ${rx - 3} ${ry + height + 3} L ${rx + 6} ${ry + height + 3}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-foreground"
                          />
                          <path
                            d={`M ${rx + width + 3} ${ry + height - 6} L ${rx + width + 3} ${ry + height + 3} L ${rx + width - 6} ${ry + height + 3}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-foreground"
                          />
                        </>
                      )}

                      {/* Category Label Pill */}
                      <rect
                        x={rx + 8}
                        y={ry + 8}
                        width="54"
                        height="14"
                        fill="currentColor"
                        className="text-muted/60"
                        rx="1"
                      />
                      <text
                        x={rx + 12}
                        y={ry + 18}
                        className="font-mono text-[8px] font-semibold uppercase fill-muted-foreground tracking-wider"
                      >
                        {node.category}
                      </text>

                      {/* Status indicator dot */}
                      <circle
                        cx={rx + width - 14}
                        cy={ry + 14}
                        r="3"
                        className="fill-emerald-500"
                      />

                      {/* Node Title */}
                      <text
                        x={rx + 10}
                        y={ry + 38}
                        className={`font-mono text-[11px] font-semibold tracking-tight transition-colors ${
                          isSelected ? 'fill-foreground' : 'fill-foreground/90'
                        }`}
                      >
                        {node.label}
                      </text>

                      {/* Protocol / Tech pill */}
                      <text
                        x={rx + 10}
                        y={ry + 54}
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

        {/* Selected Node Blueprint Technical Inspector */}
        <div className="relative border border-border bg-background/95 p-4 sm:p-6 space-y-4">
          <Corners size="sm" offset="border" weight="thin" light />

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

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              {activeNode.tech.map((t) => (
                <span
                  key={t}
                  className="border border-border bg-muted/30 px-2 py-0.5 text-[10px] font-mono text-foreground font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
            {activeNode.description}
          </p>

          {/* 4 Technical Architecture Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
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
        </div>
      </FrameBody>
    </Frame>
  )
}
