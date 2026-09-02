'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'
import { Corners } from '../frame'
import type { ArchitectureSystem } from '@/data/architectures'

interface SystemSelectorProps {
  architectures: ArchitectureSystem[]
  selectedArchId: string
  activeArch: ArchitectureSystem
  selectedNodeId: string
  isTraceMode: boolean
  simulateFlow: boolean
  onToggleTraceMode: () => void
  onToggleSimulateFlow: () => void
  onSelectArch: (archId: string) => void
  onSelectNode: (nodeId: string) => void
}

export function SystemSelector({
  architectures,
  selectedArchId,
  activeArch,
  selectedNodeId,
  isTraceMode,
  simulateFlow,
  onToggleTraceMode,
  onToggleSimulateFlow,
  onSelectArch,
  onSelectNode
}: SystemSelectorProps) {
  return (
    <>
      {/* Frame Header Action Controls */}
      <div className="flex items-center gap-2">
        {/* Trace Walkthrough Toggle */}
        <button
          onClick={onToggleTraceMode}
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
          onClick={onToggleSimulateFlow}
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
    </>
  )
}

interface ArchitectureTabsProps {
  architectures: ArchitectureSystem[]
  selectedArchId: string
  activeArch: ArchitectureSystem
  selectedNodeId: string
  onSelectArch: (archId: string) => void
  onSelectNode: (nodeId: string) => void
}

export function ArchitectureTabs({
  architectures,
  selectedArchId,
  activeArch,
  selectedNodeId,
  onSelectArch,
  onSelectNode
}: ArchitectureTabsProps) {
  return (
    <div className="space-y-6">
      {/* Architecture Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {architectures.map((arch, idx) => {
          const isCurrent = arch.id === selectedArchId
          return (
            <button
              key={arch.id}
              type="button"
              onClick={() => onSelectArch(arch.id)}
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

      {/* Mobile Quick Node Ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:hidden scrollbar-none">
        <span className="shrink-0 text-[10px] font-mono text-muted-foreground uppercase">Nodes:</span>
        {activeArch.nodes.map((node) => {
          const isSelected = node.id === selectedNodeId
          return (
            <button
              key={node.id}
              onClick={() => onSelectNode(node.id)}
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
    </div>
  )
}
