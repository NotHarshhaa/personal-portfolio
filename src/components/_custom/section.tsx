import { cn } from '@/lib/utils'
import type React from 'react'

export function Section({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn('flex w-full min-h-0 scroll-mt-24 flex-col', className)}
      {...props}
    />
  )
}
