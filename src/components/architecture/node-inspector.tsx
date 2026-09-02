'use client'

import React from 'react'
import {
  Layers,
  Cpu,
  Shield,
  Activity,
  Code,
  Share2,
  Copy,
  Check,
  FileCode
} from 'lucide-react'
import { Corners, CornerBadge } from '../frame'
import type { ArchitectureNode, ArchitectureSystem } from '@/data/architectures'
import { generateMermaidDiagram } from '@/data/architectures'

interface NodeInspectorProps {
  activeNode: ArchitectureNode
  activeArch: ArchitectureSystem
  upstreamNodes: ArchitectureNode[]
  downstreamNodes: ArchitectureNode[]
  onSelectNode: (nodeId: string) => void
  inspectorTab: 'specs' | 'code' | 'mermaid'
  setInspectorTab: (tab: 'specs' | 'code' | 'mermaid') => void
  copiedCode: boolean
  copiedMermaid: boolean
  onCopyCode: () => void
  onCopyMermaid: () => void
}

export function NodeInspector({
  activeNode,
  activeArch,
  upstreamNodes,
  downstreamNodes,
  onSelectNode,
  inspectorTab,
  setInspectorTab,
  copiedCode,
  copiedMermaid,
  onCopyCode,
  onCopyMermaid
}: NodeInspectorProps) {
  return (
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
            onClick={onCopyMermaid}
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
                      onClick={() => onSelectNode(un.id)}
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
                      onClick={() => onSelectNode(dn.id)}
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
                  onClick={onCopyCode}
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
                onClick={onCopyMermaid}
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
}
