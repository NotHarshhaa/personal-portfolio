'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type RotatingTextProps = {
  texts: string[]
  /** Time each line stays visible, in ms */
  interval?: number
  align?: 'left' | 'center' | 'right'
  className?: string
}

/** Vertical ticker that scrolls through a list of lines, one at a time.
 *  Ported from the RhythmDoshi v2 reference portfolio. */
export function RotatingText({
  texts,
  interval = 2500,
  align = 'left',
  className
}: RotatingTextProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % texts.length),
      interval
    )
    return () => clearInterval(id)
  }, [texts.length, interval])

  const alignClass = {
    left: 'justify-start text-left',
    center: 'justify-center text-center',
    right: 'justify-end text-right'
  }[align]

  return (
    <div
      className={cn(
        'relative h-8 w-full overflow-hidden text-sm font-medium',
        alignClass,
        className
      )}
    >
      <div
        className="transition-transform duration-700 ease-out"
        style={{ transform: `translateY(-${index * 2}rem)` }}
      >
        {texts.map((text, i) => (
          <div
            key={i}
            className={cn('flex h-8 items-center whitespace-nowrap', alignClass)}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  )
}
