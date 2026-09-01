'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Link } from 'next-view-transitions'
import { Button } from './ui/button'
import { ModeToggle } from './mode-toggle'
import { KeyboardShortcutsModal } from './keyboard-shortcuts-modal'
import { KeyboardShortcuts } from './keyboard-shortcuts'
import { ChevronRight, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navLinks } from '@/constants'
import { useState, useCallback, useEffect } from 'react'
import { HoverMark } from './hover-mark'
import { CornerBadge } from './frame'

function Corners() {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute -top-px -left-px z-10 size-2.5 border-t-2 border-l-2 border-foreground/45 sm:size-3"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -top-px -right-px z-10 size-2.5 border-t-2 border-r-2 border-foreground/45 sm:size-3"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-px -left-px z-10 size-2.5 border-b-2 border-l-2 border-foreground/45 sm:size-3"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-px -bottom-px z-10 size-2.5 border-b-2 border-r-2 border-foreground/45 sm:size-3"
      />
    </>
  )
}

export function Header() {
  const pathname = usePathname()
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleShowShortcuts = useCallback(() => {
    setShowShortcuts(true)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    setMobileMenuOpen(false)
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [pathname])

  return (
    <>
      <KeyboardShortcuts onShowModal={handleShowShortcuts} />
      <header className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="site-shell pt-3 sm:pt-4">
          <div className="relative flex h-12 items-center justify-between overflow-visible border border-border bg-background/90 px-4 sm:h-14 sm:px-5">
            <Corners />
            <Link
              href="/"
              aria-label="Home"
              onClick={closeMobileMenu}
              className="relative z-10 flex items-center gap-2 text-sm font-semibold tracking-[0.18em] uppercase transition-opacity hover:opacity-90"
            >
              <Image
                src="/logo.svg"
                alt="Logo"
                width={24}
                height={24}
                priority
                className="size-6 sm:size-7 object-contain"
              />
              <CornerBadge size="sm" className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-semibold tracking-[0.18em]">
                Harshhaa
              </CornerBadge>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) =>
                link.external ? (
                  <HoverMark key={link.label} className="px-2.5 py-1.5">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => (e.currentTarget as HTMLElement)?.blur()}
                      className="text-xs font-medium tracking-wide text-muted-foreground transition-colors group-hover/mark:text-foreground"
                    >
                      {link.title}
                    </a>
                  </HoverMark>
                ) : (
                  <HoverMark key={link.label} className="px-2.5 py-1.5">
                    <Link
                      href={link.url}
                      onClick={(e) => (e.currentTarget as HTMLElement)?.blur()}
                      className={cn(
                        'text-xs font-medium tracking-wide transition-colors',
                        pathname === link.url
                          ? 'text-foreground'
                          : 'text-muted-foreground group-hover/mark:text-foreground'
                      )}
                    >
                      {link.title}
                    </Link>
                  </HoverMark>
                )
              )}
            </nav>

            <div className="relative z-10 flex items-center gap-2">
              <ModeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="size-4" />
                ) : (
                  <Menu className="size-4" />
                )}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav
              className="relative -mt-px overflow-visible border border-t-0 border-border bg-background/95 md:hidden"
              aria-label="Mobile"
            >
              <Corners />
              <div className="border-b border-border px-4 py-3">
                <span className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Navigate
                </span>
              </div>
              <ul className="flex flex-col">
                {navLinks.map((link, index) => {
                  const active = !link.external && pathname === link.url

                  return (
                    <HoverMark
                      as="li"
                      key={link.label}
                      label={link.external ? 'Open' : 'Go'}
                      className={
                        index < navLinks.length - 1
                          ? 'border-b border-border'
                          : undefined
                      }
                    >
                      {link.external ? (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={closeMobileMenu}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm text-muted-foreground transition-colors group-hover/mark:text-foreground"
                        >
                          <span className="flex items-center gap-3">
                            <span className="font-mono text-[10px] tracking-wider text-muted-foreground/60 tabular-nums">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            {link.title}
                          </span>
                          <ChevronRight className="size-3.5 shrink-0 opacity-40 transition-transform group-hover/mark:translate-x-0.5" />
                        </a>
                      ) : (
                        <Link
                          href={link.url}
                          onClick={closeMobileMenu}
                          className={cn(
                            'flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm transition-colors',
                            active
                              ? 'text-foreground'
                              : 'text-muted-foreground group-hover/mark:text-foreground'
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={cn(
                                'font-mono text-[10px] tracking-wider tabular-nums',
                                active
                                  ? 'text-foreground'
                                  : 'text-muted-foreground/60'
                              )}
                            >
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            {link.title}
                          </span>
                          <ChevronRight
                            className={cn(
                              'size-3.5 shrink-0 transition-transform group-hover/mark:translate-x-0.5',
                              active ? 'opacity-70' : 'opacity-40'
                            )}
                          />
                        </Link>
                      )}
                    </HoverMark>
                  )
                })}
              </ul>
            </nav>
          )}
        </div>
      </header>
      <KeyboardShortcutsModal
        isOpen={showShortcuts}
        onOpenChange={setShowShortcuts}
      />
    </>
  )
}
