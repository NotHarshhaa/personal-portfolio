'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

type CopyButtonProps = {
  text: string
  className?: string
  /** Always visible; otherwise revealed on parent `group` hover */
  alwaysVisible?: boolean
}

/** Copy-to-clipboard button with a transient check confirmation.
 *  Ported from the RhythmDoshi v2 reference portfolio. */
export function CopyButton({
  text,
  className,
  alwaysVisible = false
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className={cn(
        'text-muted-foreground transition-all duration-200 hover:text-foreground',
        alwaysVisible
          ? 'inline-flex'
          : 'translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
        className
      )}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </button>
  )
}
