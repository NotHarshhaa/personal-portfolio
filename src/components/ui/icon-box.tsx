import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/** Small square icon container for info rows. Sharp-cornered to match the
 *  blueprint frame system. Ported from the RhythmDoshi v2 reference. */
export function IconBox({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'border-border bg-muted/40 flex size-7 shrink-0 items-center justify-center border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
