'use client'

import { Link } from 'next-view-transitions'
import { navLinks } from '@/constants'
import { Frame, FrameBody } from './frame'
import { TelemetryWidget } from './telemetry-widget'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto w-full pt-4 pb-2">
      <Frame>
        <FrameBody className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <p className="text-xs text-muted-foreground">© {year} Harshhaa</p>
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
      </Frame>
    </footer>
  )
}
