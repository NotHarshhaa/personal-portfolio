import type { RefObject } from 'react'
import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import { Corners } from '../frame'

interface AgentLauncherProps {
  launcherRef: RefObject<HTMLButtonElement | null>
  onOpen: () => void
}

/** Floating launcher button (rendered while the drawer is closed) */
export function AgentLauncher({ launcherRef, onOpen }: AgentLauncherProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.96 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      suppressHydrationWarning
      className="fixed right-3 bottom-3 z-40 max-w-[calc(100vw-1.5rem)] sm:right-6 sm:bottom-6"
    >
      <button
        ref={launcherRef}
        onClick={onOpen}
        aria-label="Ask Harshhaa's Agent"
        aria-haspopup="dialog"
        className="group relative flex items-center gap-2 border border-border bg-background/95 px-2.5 py-2 shadow-xl backdrop-blur-xs transition-all transform-gpu hover:border-foreground/40 hover:bg-background sm:gap-2.5 sm:px-3.5 sm:py-2.5"
      >
        <Corners size="sm" offset="border" weight="thin" light />
        <span className="relative flex size-2 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        <Bot className="size-3.5 shrink-0 text-foreground transition-transform group-hover:scale-110 sm:size-4" />
        <span className="truncate text-[11px] font-semibold tracking-[0.14em] text-foreground uppercase sm:text-xs">
          Ask Harshhaa&apos;s Agent
        </span>
      </button>
    </motion.div>
  )
}
