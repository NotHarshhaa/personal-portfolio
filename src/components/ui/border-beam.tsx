'use client'

import { cn } from '@/lib/utils'

interface BorderBeamProps {
  className?: string
  /** Duration of one full loop in seconds */
  duration?: number
  /** Border beam width in px */
  borderWidth?: number
  /** Color of the trailing tail */
  colorFrom?: string
  /** Color of the leading head */
  colorTo?: string
}

/**
 * A luminous light beam that traces continuously around the perimeter of its container.
 */
export function BorderBeam({
  className,
  duration = 4,
  borderWidth = 1.5,
  colorFrom = 'var(--signal)',
  colorTo = '#ffffff',
}: BorderBeamProps) {
  return (
    <div
      aria-hidden
      style={{
        padding: `${borderWidth}px`,
        WebkitMask:
          'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
      }}
      className={cn(
        'pointer-events-none absolute -inset-px z-20 overflow-hidden',
        className
      )}
    >
      <div
        className="absolute -inset-[150%] animate-border-beam-spin"
        style={{
          animationDuration: `${duration}s`,
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, ${colorFrom} 325deg, ${colorTo} 355deg, transparent 360deg)`,
          filter: `drop-shadow(0 0 6px ${colorFrom})`,
        }}
      />
    </div>
  )
}
