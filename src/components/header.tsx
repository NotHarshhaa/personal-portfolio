'use client'

import { usePathname } from 'next/navigation'
import { Link } from 'next-view-transitions'
import { Button } from './ui/button'
import { ModeToggle } from './mode-toggle'
import { SocialShare } from './social-share'
import { KeyboardShortcutsModal } from './keyboard-shortcuts-modal'
import { KeyboardShortcuts } from './keyboard-shortcuts'
import { Keyboard as KeyboardIcon, Menu, X } from 'lucide-react'
import clsx from 'clsx'
import Image from 'next/image'
import { navLinks } from '@/constants'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'

export function Header() {
  const pathname = usePathname()
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleShowShortcuts = useCallback(() => {
    setShowShortcuts(true)
  }, [])

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <>
      <KeyboardShortcuts onShowModal={handleShowShortcuts} />
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-3 md:top-4 left-0 right-0 z-50 px-3 sm:px-4 md:px-8"
      >
        <div className="mx-auto w-full max-w-7xl rounded-xl md:rounded-2xl bg-white/80 dark:bg-black/40 backdrop-blur-xl shadow-lg border border-border/50 px-3 sm:px-4 md:px-6 py-2.5 md:py-4 transition-all duration-300 hover:shadow-xl hover:bg-white/90 dark:hover:bg-black/50">
          <div className="flex items-center justify-between">
            {/* Left: Logo */}
            <Link
              href="/"
              aria-label="Logo"
              className="group flex items-center gap-2 sm:gap-3 transition-all duration-300 ease-in-out hover:scale-105"
              onClick={closeMobileMenu}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={28}
                  height={28}
                  className="sm:w-9 sm:h-9 md:w-[36px] md:h-[36px] rounded-lg sm:rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300"
                />
              </motion.div>
              <span className="font-bold text-base sm:text-lg md:text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">HARSHHAA</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => (
                <div key={link.label} className="relative">
                  {link.external ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="px-3 lg:px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out hover:text-primary relative group"
                    >
                      {link.title}
                      <span className="absolute bottom-1.5 left-3 lg:left-4 right-3 lg:right-4 h-0.5 bg-primary transform origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    </a>
                  ) : (
                    <Link
                      href={link.url}
                      aria-label={link.label}
                      className={clsx(
                        'px-3 lg:px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out relative group',
                        {
                          'text-primary': pathname === link.url,
                          'hover:text-primary': pathname !== link.url
                        }
                      )}
                    >
                      {link.title}
                      <span 
                        className={clsx(
                          'absolute bottom-1.5 left-3 lg:left-4 right-3 lg:right-4 h-0.5 bg-primary transform origin-left transition-transform duration-300 ease-out',
                          {
                            'scale-x-100': pathname === link.url,
                            'scale-x-0 group-hover:scale-x-100': pathname !== link.url
                          }
                        )}
                      />
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:block"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowShortcuts(true)}
                  className="size-8 md:size-9 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                  aria-label="Show keyboard shortcuts"
                  title="Keyboard shortcuts (?)"
                >
                  <KeyboardIcon className="h-4 w-4 md:h-[1.5rem] md:w-[1.5rem] stroke-[1.5]" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:block"
              >
                <SocialShare
                  title="Harshhaa Vardhan Reddy - DevOps Engineer Portfolio"
                  description="DevOps Engineer focused on automation, scalability, and cloud infrastructure. Check out my projects and experience!"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ModeToggle />
              </motion.div>
              
              {/* Mobile Menu Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="md:hidden"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMobileMenu}
                  className="size-8 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                  aria-label="Toggle mobile menu"
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden md:hidden"
              >
                <motion.nav 
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  exit={{ y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="pt-4 pb-2 space-y-1 border-t border-border/50 mt-3"
                >
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative"
                    >
                      {link.external ? (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.label}
                          onClick={closeMobileMenu}
                          className="block px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out hover:text-primary hover:bg-primary/5 rounded-lg relative group"
                        >
                          {link.title}
                          <span className="absolute bottom-2 left-3 right-3 h-0.5 bg-primary transform origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                        </a>
                      ) : (
                        <Link
                          href={link.url}
                          aria-label={link.label}
                          onClick={closeMobileMenu}
                          className={clsx(
                            'block px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-primary/5 rounded-lg relative group',
                            {
                              'text-primary': pathname === link.url,
                              'hover:text-primary': pathname !== link.url
                            }
                          )}
                        >
                          {link.title}
                          <span 
                            className={clsx(
                              'absolute bottom-2 left-3 right-3 h-0.5 bg-primary transform origin-left transition-transform duration-300 ease-out',
                              {
                                'scale-x-100': pathname === link.url,
                                'scale-x-0 group-hover:scale-x-100': pathname !== link.url
                              }
                            )}
                          />
                        </Link>
                      )}
                    </motion.div>
                  ))}
                  
                  {/* Mobile-only actions */}
                  <div className="pt-2 mt-2 border-t border-border/50 flex items-center justify-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowShortcuts(true)
                        closeMobileMenu()
                      }}
                      className="hover:bg-primary/10 hover:text-primary transition-all duration-300 text-xs"
                    >
                      <KeyboardIcon className="h-4 w-4 mr-2" />
                      Shortcuts
                    </Button>
                    <SocialShare
                      title="Harshhaa Vardhan Reddy - DevOps Engineer Portfolio"
                      description="DevOps Engineer focused on automation, scalability, and cloud infrastructure. Check out my projects and experience!"
                    />
                  </div>
                </motion.nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
      <KeyboardShortcutsModal isOpen={showShortcuts} onOpenChange={setShowShortcuts} />
    </>
  )
}
