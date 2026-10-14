import { cn } from '@/lib/utils'

type StripedDividerProps = {
  className?: string
}

/** Thin decorative strip filled with diagonal hatching.
 *  Ported from the RhythmDoshi v2 reference's StripedBox. */
export function StripedDivider({ className }: StripedDividerProps) {
  return (
    <div
      aria-hidden
      className={cn('border-border relative h-6 w-full overflow-hidden border-y', className)}
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, var(--border) 0, var(--border) 1px, transparent 1px, transparent 8px)'
        }}
      />
    </div>
  )
}
