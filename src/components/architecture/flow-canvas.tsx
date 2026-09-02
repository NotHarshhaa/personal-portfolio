'use client'

import React from 'react'
import { Maximize2 } from 'lucide-react'
import { Corners } from '../frame'
import type { ArchitectureSystem, TraceStep } from '@/data/architectures'
import { getCategoryIcon, getNodePos } from './types'
import { TraceController } from './trace-controller'

interface FlowCanvasProps {
  activeArch: ArchitectureSystem
  selectedNodeId: string
  hoveredNodeId: string | null
  setSelectedNodeId: (id: string) => void
  setHoveredNodeId: (id: string | null) => void
  simulateFlow: boolean
  isTraceMode: boolean
  activeStep: TraceStep | null
  currentTraceStep: number
  isAutoPlayingTrace: boolean
  onPrevStep: () => void
  onNextStep: () => void
  onTogglePlay: () => void
  isModal?: boolean
  onOpenFullscreen?: () => void
}

export function FlowCanvas({
  activeArch,
  selectedNodeId,
  hoveredNodeId,
  setSelectedNodeId,
  setHoveredNodeId,
  simulateFlow,
  isTraceMode,
  activeStep,
  currentTraceStep,
  isAutoPlayingTrace,
  onPrevStep,
  onNextStep,
  onTogglePlay,
  isModal = false,
  onOpenFullscreen
}: FlowCanvasProps) {
  return (
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
          {!isModal && onOpenFullscreen && (
            <button
              onClick={onOpenFullscreen}
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
        <TraceController
          activeStep={activeStep}
          totalSteps={activeArch.traceSteps.length}
          currentTraceStep={currentTraceStep}
          isAutoPlayingTrace={isAutoPlayingTrace}
          onPrevStep={onPrevStep}
          onNextStep={onNextStep}
          onTogglePlay={onTogglePlay}
        />
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

                  {/* Category Label Pill */}
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
}
