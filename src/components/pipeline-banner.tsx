'use client'

import { Fragment, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const STEPS = ['Build', 'Ship', 'Automate']
const STEP_INTERVAL = 1600

/**
 * Terminal-style pipeline animation for the hero banner:
 * a shell prompt followed by the three pipeline stages, each lighting up in
 * sequence (marker fills + word highlights) with a blinking cursor at the end.
 */
export function PipelineBanner({ className }: { className?: string }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % STEPS.length)
    }, STEP_INTERVAL)
    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className={cn(
        'font-mono flex items-center text-sm tracking-[0.08em] sm:text-lg',
        className
      )}
    >
      <span aria-hidden className="mr-2 hidden text-muted-foreground/40 sm:mr-3 sm:inline">
        ~$
      </span>

      {STEPS.map((step, i) => (
        <Fragment key={step}>
          {i > 0 && (
            <span
              aria-hidden
              className={cn(
                'mx-1.5 transition-colors duration-500 sm:mx-2.5',
                i <= active ? 'text-signal/70' : 'text-muted-foreground/30'
              )}
            >
              →
            </span>
          )}
          <span
            aria-current={i === active ? 'step' : undefined}
            className={cn(
              'flex items-center gap-1.5 transition-colors duration-500 sm:gap-2',
              i === active ? 'text-foreground' : 'text-muted-foreground/50'
            )}
          >
            <span
              aria-hidden
              className={cn(
                'size-1.5 shrink-0 transition-colors duration-500 sm:size-2',
                i === active ? 'bg-signal' : 'bg-muted-foreground/30'
              )}
            />
            {step}
          </span>
        </Fragment>
      ))}

      {/* Blinking terminal cursor */}
      <span
        aria-hidden
        className="ml-1.5 inline-block h-[1.1em] w-[2px] animate-pulse bg-signal sm:ml-2"
      />
    </div>
  )
}
