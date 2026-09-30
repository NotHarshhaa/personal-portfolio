import { cn } from '@/lib/utils'
import type { HTMLAttributes, ReactNode } from 'react'

export type CornerSize = 'sm' | 'default' | 'lg'
export type CornerWeight = 'thin' | 'normal'

export function Corners({
  className,
  size = 'default',
  offset = 'border'
}: {
  className?: string
  size?: CornerSize
  offset?: 'border' | 'none'
  /** Kept for API compatibility; brackets are always 1px like the reference */
  weight?: CornerWeight
  /** Kept for API compatibility; brackets always use muted-foreground/50 */
  light?: boolean
}) {
  const sizeClasses = {
    sm: 'size-2',
    default: 'size-2 sm:size-2.5',
    lg: 'size-2.5 sm:size-3'
  }[size]

  const colorClass = 'border-muted-foreground/50'

  const borderStyles = {
    tl: 'border-t border-l',
    tr: 'border-t border-r',
    bl: 'border-b border-l',
    br: 'border-b border-r'
  }

  const pos =
    offset === 'border'
      ? {
        tl: '-top-px -left-px',
        tr: '-top-px -right-px',
        bl: '-bottom-px -left-px',
        br: '-right-px -bottom-px'
      }
      : {
        tl: 'top-0 left-0',
        tr: 'top-0 right-0',
        bl: 'bottom-0 left-0',
        br: 'right-0 bottom-0'
      }

  return (
    <>
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute z-10',
          borderStyles.tl,
          pos.tl,
          sizeClasses,
          colorClass,
          className
        )}
      />
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute z-10',
          borderStyles.tr,
          pos.tr,
          sizeClasses,
          colorClass,
          className
        )}
      />
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute z-10',
          borderStyles.bl,
          pos.bl,
          sizeClasses,
          colorClass,
          className
        )}
      />
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute z-10',
          borderStyles.br,
          pos.br,
          sizeClasses,
          colorClass,
          className
        )}
      />
    </>
  )
}

type FrameProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  /** Draw corner L-brackets */
  corners?: boolean
}

/** Blueprint-style content box with reference-style corner ticks */
export function Frame({
  children,
  className,
  corners = true,
  ...props
}: FrameProps) {
  return (
    <div
      className={cn(
        'border-border relative border bg-background',
        className
      )}
      {...props}
    >
      {corners && <SectionTicks />}
      {children}
    </div>
  )
}

type CornerHeadingProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  corners?: boolean
  size?: CornerSize
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'span'
}

/** Blueprint corner frame for titles and headings: lightish, thin 1px corner brackets */
export function CornerHeading({
  children,
  className,
  corners = true,
  size = 'default',
  as: Comp = 'div',
  ...props
}: CornerHeadingProps) {
  return (
    <Comp
      className={cn(
        'relative inline-block px-3 py-1.5 sm:px-4 sm:py-2',
        className
      )}
      {...props}
    >
      {corners && <Corners size={size} offset="none" weight="thin" light />}
      {children}
    </Comp>
  )
}

/** Small corner-framed badge for category labels and header titles: lightish, thin 1px corner brackets */
export function CornerBadge({
  children,
  className,
  size = 'sm',
  as: Comp = 'div',
  ...props
}: HTMLAttributes<HTMLDivElement> & { size?: CornerSize; as?: any }) {
  return (
    <Comp
      className={cn(
        'relative inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] font-semibold tracking-[0.18em] text-foreground uppercase',
        className
      )}
      {...props}
    >
      <Corners size={size} offset="none" weight="thin" light />
      {children}
    </Comp>
  )
}

type FrameHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode
  label?: string
}

/** Small corner ticks sitting on the outer edges of a bordered section.
 *  Exact copy of the reference portfolio's SectionBorders component. */
export function SectionTicks({ className }: { className?: string }) {
  return (
    <>
      <div
        aria-hidden
        className={cn(
          'border-muted-foreground/50 absolute -top-px -left-px z-5 h-2 w-2 border-l',
          className
        )}
      />
      <div
        aria-hidden
        className={cn(
          'border-muted-foreground/50 absolute -top-px -right-px z-5 h-2 w-2 border-r',
          className
        )}
      />
      <div
        aria-hidden
        className={cn(
          'border-muted-foreground/50 absolute -bottom-px -left-px z-5 h-2 w-2 border-b border-l',
          className
        )}
      />
      <div
        aria-hidden
        className={cn(
          'border-muted-foreground/50 absolute -right-px -bottom-px z-5 h-2 w-2 border-r border-b',
          className
        )}
      />
    </>
  )
}

/** Labeled top bar inside a frame: large reference-style section title
 *  ("About Me." style) framed by thin corner brackets */
export function FrameHeader({
  children,
  label,
  className,
  ...props
}: FrameHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border px-4 py-3 sm:px-6',
        className
      )}
      {...props}
    >
      {label && (
        <CornerHeading as="h2" size="sm" className="px-1.5 py-0.5">
          <span className="font-heading text-xl font-medium tracking-tight sm:text-2xl md:text-3xl">
            {label.endsWith('.') ? label : `${label}.`}
          </span>
        </CornerHeading>
      )}
      {children}
    </div>
  )
}

export function FrameBody({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-4 py-6 sm:px-6 sm:py-8', className)} {...props}>
      {children}
    </div>
  )
}

/** Horizontal rule that spans a frame cell */
export function FrameDivider({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-border', className)} />
}
