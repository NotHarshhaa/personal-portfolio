'use client'

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
  }, [pathname])

  return (
    <>
      <KeyboardShortcuts onShowModal={handleShowShortcuts} />
      <header className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="site-shell pt-3 sm:pt-4">
          <div className="relative flex h-12 items-center justify-between border border-border bg-background/90 px-4 sm:h-14 sm:px-5">
            <Corners />
            <Link
              href="/"
              aria-label="Home"
              onClick={closeMobileMenu}
              className="text-sm font-semibold tracking-[0.18em] uppercase"
            >
              Harshhaa
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.title}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.url}
                    className={cn(
                      'text-xs font-medium tracking-wide transition-colors',
                      pathname === link.url
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {link.title}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-2">
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
              className="relative -mt-px border border-t-0 border-border bg-background/95 md:hidden"
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
                  const itemClass = cn(
                    'group flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm transition-colors',
                    active
                      ? 'bg-muted/50 text-foreground'
                      : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                  )

                  return (
                    <li
                      key={link.label}
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
                          className={itemClass}
                        >
                          <span className="flex items-center gap-3">
                            <span className="font-mono text-[10px] tabular-nums tracking-wider text-muted-foreground/60">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            {link.title}
                          </span>
                          <ChevronRight className="size-3.5 shrink-0 opacity-40 transition-transform group-hover:translate-x-0.5" />
                        </a>
                      ) : (
                        <Link
                          href={link.url}
                          onClick={closeMobileMenu}
                          className={itemClass}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={cn(
                                'font-mono text-[10px] tabular-nums tracking-wider',
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
                              'size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5',
                              active ? 'opacity-70' : 'opacity-40'
                            )}
                          />
                        </Link>
                      )}
                    </li>
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
