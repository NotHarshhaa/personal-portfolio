'use client'

import { usePathname } from 'next/navigation'
import { Link } from 'next-view-transitions'
import { Button } from './ui/button'
import { ModeToggle } from './mode-toggle'
import { SocialShare } from './social-share'
import clsx from 'clsx'
import Image from 'next/image'
import { navLinks } from '@/constants'
import { motion } from 'framer-motion'

export function Header() {
  const pathname = usePathname()

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-4 left-0 right-0 z-50 px-6 md:px-8"
    >
      <div className="mx-auto w-full max-w-7xl rounded-2xl bg-white/80 dark:bg-black/40 backdrop-blur-xl shadow-lg border border-border/50 px-6 py-4 transition-all duration-300 hover:shadow-xl hover:bg-white/90 dark:hover:bg-black/50">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8 flex-wrap">
            <Link
              href="/"
              aria-label="Logo"
              className="group flex items-center gap-3 transition-all duration-300 ease-in-out hover:scale-105"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={36}
                  height={36}
                  className="rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300"
                />
              </motion.div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">HARSHHAA</span>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <div key={link.label} className="relative">
                  {link.external ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out hover:text-primary relative group"
                    >
                      {link.title}
                      <span className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-primary transform origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    </a>
                  ) : (
                    <Link
                      href={link.url}
                      aria-label={link.label}
                      className={clsx(
                        'px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out relative group',
                        {
                          'text-primary': pathname === link.url,
                          'hover:text-primary': pathname !== link.url
                        }
                      )}
                    >
                      {link.title}
                      <span 
                        className={clsx(
                          'absolute bottom-1.5 left-4 right-4 h-0.5 bg-primary transform origin-left transition-transform duration-300 ease-out',
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
          </div>

          {/* Right: Theme Toggle & Share */}
          <div className="ml-auto flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
          </div>
        </div>

        {/* Mobile nav */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 flex md:hidden justify-center flex-wrap gap-4"
        >
          {navLinks.map((link) => (
            <div key={link.label} className="relative">
              {link.external ? (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="px-3 py-1.5 text-sm font-medium transition-all duration-300 ease-in-out hover:text-primary relative group"
                >
                  {link.title}
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary transform origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </a>
              ) : (
                <Link
                  href={link.url}
                  aria-label={link.label}
                  className={clsx(
                    'px-3 py-1.5 text-sm font-medium transition-all duration-300 ease-in-out relative group',
                    {
                      'text-primary': pathname === link.url,
                      'hover:text-primary': pathname !== link.url
                    }
                  )}
                >
                  {link.title}
                  <span 
                    className={clsx(
                      'absolute bottom-0 left-3 right-3 h-0.5 bg-primary transform origin-left transition-transform duration-300 ease-out',
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
        </motion.nav>
      </div>
    </motion.header>
  )
}
