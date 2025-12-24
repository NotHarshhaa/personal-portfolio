'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface CopyToClipboardProps {
  text: string
  label?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function CopyToClipboard({
  text,
  label,
  variant = 'outline',
  size = 'icon',
  className
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Copied to clipboard!', {
        description: text.length > 50 ? `${text.substring(0, 50)}...` : text
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy to clipboard')
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Button
      onClick={handleCopy}
      variant={variant}
      size={size}
      className={cn('gap-2', className)}
      aria-label={`Copy ${label || text} to clipboard`}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          {label && 'Copied!'}
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {label && 'Copy'}
        </>
      )}
    </Button>
  )
}

