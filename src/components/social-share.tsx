'use client'

import { Share2, Twitter, Linkedin, Link as LinkIcon, Mail } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface SocialShareProps {
  title?: string
  description?: string
  url?: string
}

export function SocialShare({ title, description, url }: SocialShareProps) {
  const [hasNativeShare, setHasNativeShare] = useState(false)
  
  useEffect(() => {
    setHasNativeShare(
      typeof navigator !== 'undefined' && 'share' in navigator
    )
  }, [])

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareTitle = title || 'Check out this portfolio!'
  const shareDescription = description || 'Amazing DevOps portfolio'

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank', 'noopener,noreferrer')
  }

  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer')
  }

  const shareViaEmail = () => {
    const emailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareDescription}\n\n${shareUrl}`)}`
    window.location.href = emailUrl
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl
        })
      } catch (err) {
        // User cancelled or error occurred
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err)
        }
      }
    } else {
      // Fallback to copy
      handleCopy()
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Share portfolio"
          className="size-9 hover:bg-primary/10 hover:text-primary transition-all duration-300"
        >
          <Share2 className="h-[1.5rem] w-[1.5rem] stroke-[1.5]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          'w-56 rounded-xl border border-border/50',
          'bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl',
          'shadow-lg p-2',
          'animate-in fade-in-0 zoom-in-95'
        )}
      >
        {hasNativeShare && (
          <>
            <DropdownMenuItem
              onClick={handleNativeShare}
              className={cn(
                'rounded-lg px-3 py-2.5 cursor-pointer',
                'hover:bg-primary/10 hover:text-primary',
                'transition-colors duration-200',
                'focus:bg-primary/10 focus:text-primary'
              )}
            >
              <Share2 className="mr-3 h-4 w-4" />
              <span className="font-medium">Share via...</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2 bg-border/50" />
          </>
        )}
        <DropdownMenuItem
          onClick={shareToTwitter}
          className={cn(
            'rounded-lg px-3 py-2.5 cursor-pointer',
            'hover:bg-primary/10 hover:text-primary',
            'transition-colors duration-200',
            'focus:bg-primary/10 focus:text-primary'
          )}
        >
          <Twitter className="mr-3 h-4 w-4" />
          <span className="font-medium">Share on Twitter</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={shareToLinkedIn}
          className={cn(
            'rounded-lg px-3 py-2.5 cursor-pointer',
            'hover:bg-primary/10 hover:text-primary',
            'transition-colors duration-200',
            'focus:bg-primary/10 focus:text-primary'
          )}
        >
          <Linkedin className="mr-3 h-4 w-4" />
          <span className="font-medium">Share on LinkedIn</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={shareViaEmail}
          className={cn(
            'rounded-lg px-3 py-2.5 cursor-pointer',
            'hover:bg-primary/10 hover:text-primary',
            'transition-colors duration-200',
            'focus:bg-primary/10 focus:text-primary'
          )}
        >
          <Mail className="mr-3 h-4 w-4" />
          <span className="font-medium">Share via Email</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-2 bg-border/50" />
        <DropdownMenuItem
          onClick={handleCopy}
          className={cn(
            'rounded-lg px-3 py-2.5 cursor-pointer',
            'hover:bg-primary/10 hover:text-primary',
            'transition-colors duration-200',
            'focus:bg-primary/10 focus:text-primary'
          )}
        >
          <LinkIcon className="mr-3 h-4 w-4" />
          <span className="font-medium">Copy Link</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

