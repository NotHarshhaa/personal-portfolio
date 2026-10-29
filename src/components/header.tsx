'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Link } from 'next-view-transitions'
import { Button } from './ui/button'
import { ModeToggle } from './mode-toggle'
import { KeyboardShortcutsModal } from './keyboard-shortcuts-modal'
import { KeyboardShortcuts } from './keyboard-shortcuts'
import { ChevronRight, Menu, X, Search, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navLinks, data } from '@/constants'
import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion, useScroll } from 'framer-motion'
import { useTheme } from 'next-themes'
import { HoverMark } from './hover-mark'
import { CornerBadge } from './frame'
import { TelemetryWidget } from './telemetry-widget'

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

/** Compact light/dark switch for the md–lg range, where the three-way
 *  ModeToggle would crowd the navigation. Icons swap via the `dark` class,
 *  so there is no hydration mismatch. */
function ThemeCycleButton() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      title="Toggle theme"
      className="inline-flex size-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </button>
  )
}

export function Header() {
  const pathname = usePathname()
  const { scrollYProgress } = useScroll()
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

  // Escape closes the mobile sheet without trapping keyboard users.
  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileMenuOpen])

  // Elevation once the page scrolls: keeps the bar readable over content
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let raf = 0

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8)
        raf = 0
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const isActive = (url: string, external?: boolean) =>
    !external && (pathname === url || (url !== '/' && pathname.startsWith(`${url}/`)))

  const openPalette = () => {
    setMobileMenuOpen(false)
    window.dispatchEvent(new CustomEvent('open-command-palette'))
  }

  return (
    <>
      <KeyboardShortcuts onShowModal={handleShowShortcuts} />
      <header className="fixed top-0 right-0 left-0 z-50 pointer-events-none">
        <div className="site-shell pt-3 sm:pt-4 pointer-events-auto">
          <div className="relative">
            <div
              className={cn(
                'relative flex h-12 items-center justify-between overflow-visible border border-border px-3 backdrop-blur-md transition-[background-color,box-shadow] duration-300 sm:h-14 sm:px-5',
                scrolled
                  ? 'bg-background/90 shadow-[0_12px_32px_-20px_oklch(0_0_0/0.4)]'
                  : 'bg-background/75'
              )}
            >
              <Corners />

              <Link
                href="/"
                aria-label="Home"
                onClick={closeMobileMenu}
                className="relative z-10 flex shrink-0 items-center gap-2 text-sm font-semibold tracking-[0.18em] uppercase transition-opacity hover:opacity-90"
              >
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={24}
                  height={24}
                  priority
                  className="size-6 object-contain sm:size-7"
                />
                <CornerBadge
                  size="sm"
                  className="px-2 py-0.5 text-[11px] font-semibold tracking-[0.18em] sm:px-2.5 sm:py-1 sm:text-xs"
                >
                  Harshhaa
                </CornerBadge>
              </Link>

              <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
                {navLinks.map((link) =>
                  link.external ? (
                    <HoverMark key={link.label} className="px-1.5 py-1.5 lg:px-2.5">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.currentTarget.blur()}
                        className="inline-flex items-center gap-1 text-xs font-medium tracking-wide text-muted-foreground transition-colors group-hover/mark:text-foreground"
                      >
                        {link.title}
                      </a>
                    </HoverMark>
                  ) : (
                    <HoverMark key={link.label} className="px-1.5 py-1.5 lg:px-2.5">
                      <Link
                        href={link.url}
                        onClick={(e) => e.currentTarget.blur()}
                        aria-current={isActive(link.url) ? 'page' : undefined}
                        className={cn(
                          'relative inline-flex items-center gap-1.5 py-0.5 text-xs font-medium tracking-wide transition-colors',
                          isActive(link.url)
                            ? 'text-foreground'
                            : 'text-muted-foreground group-hover/mark:text-foreground'
                        )}
                      >
                        {isActive(link.url) && (
                          <>
                            <span aria-hidden className="size-1 bg-signal" />
                            <motion.span
                              aria-hidden
                              layoutId="nav-active"
                              className="absolute inset-x-0 -bottom-0.5 h-px bg-foreground"
                              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                            />
                          </>
                        )}
                        {link.title}
                      </Link>
                    </HoverMark>
                  )
                )}
              </nav>

              <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/contact"
                  className="hidden items-center gap-1.5 border border-border/70 bg-background/60 px-2 py-1 font-mono text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:border-foreground/40 hover:text-foreground xl:inline-flex"
                >
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Open to work
                </Link>

                <button
                  type="button"
                  onClick={openPalette}
                  title="Command Palette (⌘K / Ctrl+K)"
                  aria-label="Open Command Palette"
                  className="hidden items-center gap-1.5 border border-border/70 px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground active:bg-muted/40 md:flex"
                >
                  <Search className="size-3 text-muted-foreground/70" />
                  <kbd className="text-[10px] font-semibold tracking-wider">⌘K</kbd>
                </button>

                <div className="hidden items-center lg:flex">
                  <TelemetryWidget variant="header" />
                </div>

                <div className="hidden items-center md:flex lg:hidden">
                  <ThemeCycleButton />
                </div>

                <ModeToggle className="hidden lg:inline-flex" />

                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={openPalette}
                  aria-label="Open Command Palette"
                >
                  <Search className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative md:hidden"
                  onClick={() => setMobileMenuOpen((v) => !v)}
                  aria-label="Toggle menu"
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-menu"
                >
                  {mobileMenuOpen ? (
                    <X className="size-4" />
                  ) : (
                    <Menu className="size-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Read-position indicator: a single signal line under the bar */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 origin-left bg-signal"
              style={{ scaleX: scrollYProgress }}
            />
          </div>

          <AnimatePresence initial={false}>
            {mobileMenuOpen && (
              <motion.nav
                id="mobile-menu"
                key="mobile-menu"
                aria-label="Mobile"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="relative -mt-px max-h-[calc(100dvh-5.5rem)] overflow-y-auto border border-t-0 border-border bg-background/95 backdrop-blur-md md:hidden"
              >
                <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    Navigate
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground/60 uppercase">
                    01—{String(navLinks.length).padStart(2, '0')}
                  </span>
                </div>
                <ul className="flex flex-col">
                  {navLinks.map((link, index) => {
                    const active = isActive(link.url, link.external)

                    return (
                      <HoverMark
                        as="li"
                        key={link.label}
                        label={link.external ? 'Open' : 'Go'}
                        className={cn(
                          index < navLinks.length - 1 && 'border-b border-border',
                          active && 'bg-muted/20'
                        )}
                      >
                        {link.external ? (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeMobileMenu}
                            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm text-muted-foreground transition-colors group-hover/mark:text-foreground"
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
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                              'flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors',
                              active
                                ? 'text-foreground'
                                : 'text-muted-foreground group-hover/mark:text-foreground'
                            )}
                          >
                            <span className="flex items-center gap-3">
                              <span
                                className={cn(
                                  'font-mono text-[10px] tracking-wider tabular-nums',
                                  active ? 'text-foreground' : 'text-muted-foreground/60'
                                )}
                              >
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              {active && <span aria-hidden className="size-1 bg-signal" />}
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

                <div className="border-t border-border bg-muted/10 p-3">
                  <div className="flex flex-col gap-2">
                    <div className="px-1 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                      Platform Tools
                    </div>

                    <button
                      type="button"
                      onClick={openPalette}
                      className="flex w-full items-center justify-between border border-border bg-background px-3 py-2.5 text-left font-mono text-xs transition-colors hover:bg-muted/40 active:bg-muted/60"
                    >
                      <div className="flex items-center gap-2.5">
                        <Search className="size-3.5 text-foreground/70" />
                        <span className="font-semibold text-foreground">Command Palette & CLI</span>
                      </div>
                      <kbd className="border border-border/80 bg-muted px-1.5 py-0.5 text-[10px] font-semibold">
                        ⌘K
                      </kbd>
                    </button>

                    <div className="flex items-center justify-between border border-border bg-background px-3 py-2 font-mono text-xs">
                      <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                        Status
                      </span>
                      <TelemetryWidget variant="footer" />
                    </div>

                    <div className="flex items-center justify-between gap-3 border border-border bg-background px-3 py-2">
                      <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                        Appearance
                      </span>
                      <ModeToggle />
                    </div>

                    <div className="grid grid-cols-4 border border-border bg-background">
                      {data.links.slice(0, 4).map(({ title, url, icon: Icon }) => (
                        <a
                          key={title}
                          href={url}
                          target={url.startsWith('mailto:') ? undefined : '_blank'}
                          rel="noopener noreferrer"
                          aria-label={title}
                          title={title}
                          className="flex items-center justify-center border-r border-border py-2.5 text-muted-foreground transition-colors last:border-r-0 hover:bg-muted/40 hover:text-foreground"
                        >
                          <Icon className="size-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>
      <KeyboardShortcutsModal isOpen={showShortcuts} onOpenChange={setShowShortcuts} />
    </>
  )
}
