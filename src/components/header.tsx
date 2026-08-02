'use client'

import { usePathname } from 'next/navigation'
import { Link } from 'next-view-transitions'
import { Button } from './ui/button'
import { ModeToggle } from './mode-toggle'
import { KeyboardShortcutsModal } from './keyboard-shortcuts-modal'
import { KeyboardShortcuts } from './keyboard-shortcuts'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navLinks } from '@/constants'
import { useState, useCallback } from 'react'

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

  return (
    <>
      <KeyboardShortcuts onShowModal={handleShowShortcuts} />
      <header className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="site-shell pt-3 sm:pt-4">
          <div className="relative flex h-12 items-center justify-between border border-border bg-background/90 px-4 sm:h-14 sm:px-5">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-px -left-px size-2.5 border-t-2 border-l-2 border-foreground/45 sm:size-3"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -top-px -right-px size-2.5 border-t-2 border-r-2 border-foreground/45 sm:size-3"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-px -left-px size-2.5 border-b-2 border-l-2 border-foreground/45 sm:size-3"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -right-px -bottom-px size-2.5 border-b-2 border-r-2 border-foreground/45 sm:size-3"
            />
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

            <div className="flex items-center gap-1">
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
            <nav className="relative -mt-px border border-t-0 border-border bg-background/95">
              <div className="flex flex-col px-4 py-2">
                {navLinks.map((link) =>
                  link.external ? (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                      className="py-3 text-sm text-muted-foreground"
                    >
                      {link.title}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.url}
                      onClick={closeMobileMenu}
                      className={cn(
                        'py-3 text-sm',
                        pathname === link.url
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      {link.title}
                    </Link>
                  )
                )}
              </div>
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
