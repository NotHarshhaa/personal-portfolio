'use client'

import { Link } from 'next-view-transitions'
import { navLinks } from '@/constants'
import { Frame, FrameBody, CornerBadge } from './frame'
import { RotatingText } from './ui/rotating-text'
import { StripedDivider } from './striped-divider'
import { TelemetryWidget } from './telemetry-widget'

const footerStatusLines = [
  'Open to new opportunities — let\u2019s talk.',
  'Building platforms & agentic systems.',
  'DevOps \u00b7 Cloud \u00b7 AI Infrastructure.',
  'Thanks for scrolling this far.'
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto w-full pt-4 pb-2">
      <StripedDivider className="mb-4" />
      <Frame>
        <FrameBody className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <p className="text-xs text-muted-foreground" suppressHydrationWarning>
              © {year} Harshhaa
            </p>
            <span className="hidden sm:inline-block text-border">•</span>
            <TelemetryWidget />
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.title}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.url}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.title}
                </Link>
              )
            )}
          </nav>
        </FrameBody>
        <div className="border-border flex items-center gap-3 border-t px-4 py-2.5 sm:px-6">
          <CornerBadge className="hidden sm:inline-flex">Status</CornerBadge>
          <RotatingText
            texts={footerStatusLines}
            align="center"
            className="text-muted-foreground sm:text-left"
          />
        </div>
      </Frame>
    </footer>
  )
}
