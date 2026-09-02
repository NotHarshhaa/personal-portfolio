'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  ARCHITECTURES,
  type ArchitectureSystem,
  type ArchitectureNode,
  generateMermaidDiagram
} from '@/data/architectures'
import { CornerBadge, Frame, FrameHeader, FrameBody } from '../frame'
import { Minimize2 } from 'lucide-react'
import { SystemSelector, ArchitectureTabs } from './system-selector'
import { FlowCanvas } from './flow-canvas'
import { NodeInspector } from './node-inspector'

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

  const handleToggleTraceMode = () => {
    const nextMode = !isTraceMode
    setIsTraceMode(nextMode)
    if (nextMode) {
      setCurrentTraceStep(0)
      setIsAutoPlayingTrace(true)
    } else {
      setIsAutoPlayingTrace(false)
    }
  }

  return (
    <>
      <Frame id="architectures" className="w-full scroll-mt-24">
        <FrameHeader label="System Architectures / Blueprints">
          <SystemSelector
            architectures={ARCHITECTURES}
            selectedArchId={selectedArchId}
            activeArch={activeArch}
            selectedNodeId={selectedNodeId}
            isTraceMode={isTraceMode}
            simulateFlow={simulateFlow}
            onToggleTraceMode={handleToggleTraceMode}
            onToggleSimulateFlow={() => setSimulateFlow(!simulateFlow)}
            onSelectArch={handleSelectArch}
            onSelectNode={setSelectedNodeId}
          />
        </FrameHeader>

        <FrameBody className="space-y-6 py-6 sm:py-8">
          <ArchitectureTabs
            architectures={ARCHITECTURES}
            selectedArchId={selectedArchId}
            activeArch={activeArch}
            selectedNodeId={selectedNodeId}
            onSelectArch={handleSelectArch}
            onSelectNode={setSelectedNodeId}
          />

          {/* Interactive SVG Canvas */}
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
            onOpenFullscreen={() => setIsFullscreen(true)}
          />

          {/* Selected Node Blueprint Technical Inspector */}
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
              isModal={true}
            />

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
        </div>,
        document.body
      )}
    </>
  )
}
