import { RotateCcw, X } from 'lucide-react'
import { CornerBadge } from '../frame'
import { Button } from '../ui/button'

interface AgentHeaderProps {
  /** Questions asked this session */
  userCount: number
  onReset: () => void
  onClose: () => void
}

export function AgentHeader({ userCount, onReset, onClose }: AgentHeaderProps) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-2.5 sm:px-5 sm:py-3">
      <div className="flex min-w-0 items-center gap-2">
        <CornerBadge size="sm" className="truncate text-[10px] sm:text-[11px]">
          AGENT / HARSHHAA-AI
        </CornerBadge>
        <span className="hidden items-center gap-1.5 font-mono text-[10px] text-muted-foreground tabular-nums sm:inline-flex">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          ONLINE
        </span>
        <span
          className="hidden font-mono text-[10px] text-muted-foreground/70 tabular-nums md:inline"
          title="Questions this session"
        >
          Q:{String(userCount).padStart(2, '0')}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          title="Reset chat"
          className="size-8 text-muted-foreground hover:text-foreground sm:size-7"
        >
          <RotateCcw className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          title="Close agent"
          className="size-8 text-muted-foreground hover:text-foreground sm:size-7"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}
