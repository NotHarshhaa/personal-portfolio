'use client'

import React from 'react'
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react'
import type { TraceStep } from '@/data/architectures'

interface TraceControllerProps {
  activeStep: TraceStep | null
  totalSteps: number
  currentTraceStep: number
  isAutoPlayingTrace: boolean
  onPrevStep: () => void
  onNextStep: () => void
  onTogglePlay: () => void
}

export function TraceController({
  activeStep,
  totalSteps,
  currentTraceStep,
  isAutoPlayingTrace,
  onPrevStep,
  onNextStep,
  onTogglePlay
}: TraceControllerProps) {
  if (!activeStep) return null

  return (
    <div className="border-b border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-mono text-emerald-400 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <span className="inline-flex size-1.5 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-semibold uppercase tracking-wider shrink-0 text-[11px]">
          Step {activeStep.step}/{totalSteps}: {activeStep.title}
        </span>
        <span className="hidden sm:inline text-muted-foreground/80 truncate">
          — {activeStep.action} ({activeStep.narrative})
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onPrevStep}
          disabled={currentTraceStep === 0}
          title="Previous Step"
          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <SkipBack className="size-3.5" />
        </button>
        <button
          onClick={onTogglePlay}
          title={isAutoPlayingTrace ? 'Pause Walkthrough' : 'Play Walkthrough'}
          className="p-1 text-emerald-400 hover:text-emerald-300"
        >
          {isAutoPlayingTrace ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
        </button>
        <button
          onClick={onNextStep}
          disabled={currentTraceStep === totalSteps - 1}
          title="Next Step"
          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <SkipForward className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
