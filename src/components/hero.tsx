'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Button } from './ui/button'
import { data } from '../constants'
import clsx from 'clsx'
import { motion } from 'framer-motion'

// Typing text effect
type TypingTextProps = {
  text: string
  speed?: number
  className?: string
}

const TypingText = ({ text, speed = 80, className = '' }: TypingTextProps) => {
  const [displayedText, setDisplayedText] = useState('')
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, currentIndex + 1))
      currentIndex++
      if (currentIndex === text.length) {
        clearInterval(interval)
        setTimeout(() => {
          setDisplayedText('')
          setCycle((prev) => prev + 1)
        }, 5000)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, cycle])

  return (
    <h1
      className={clsx(
        'text-center text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-snug break-words',
        className
      )}
    >
      {displayedText}
      <span className="animate-pulse">|</span>
    </h1>
  )
}

export default TypingText

// Hero section
export function Hero() {
  const { avatar, about, links } = data

  const cleanParagraph = about.description
    .split('\n')
    .filter(Boolean)
    .map((line) => line.replace(/^[-•]\s*/, ''))
    .join(' ')

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative w-full pt-8 pb-16 sm:pt-20 sm:pb-24 md:pt-16 md:pb-32 overflow-hidden"
    >
      <div className="relative w-full max-w-6xl lg:max-w-7xl mx-auto flex flex-col gap-10 text-center md:text-left">
        {/* Avatar with floating animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7, type: 'spring' }}
          className="flex flex-col md:flex-row items-center gap-6 md:gap-10 justify-center md:justify-start"
        >
          <motion.a
            href="https://github.com/NotHarshhaa"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full shrink-0 transition-transform duration-300 group"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <div className="relative">
              <Avatar className="size-40 md:size-48 shadow-xl border-4 border-white dark:border-neutral-900 relative z-10 group-hover:scale-105 transition-transform duration-300">
                <AvatarImage 
                  alt={`${avatar.name} - Portfolio Avatar`} 
                  src="/assets/avatar.png"
                  className="object-cover"
                />
                <AvatarFallback className="font-mono font-bold" aria-label={avatar.name}>
                  {avatar.initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </motion.a>
        </motion.div>

        {/* Heading + Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex flex-col items-center md:items-start gap-6"
        >
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
            <TypingText
              text="Harshhaa Vardhan Reddy"
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent drop-shadow-sm"
            />
            <Button
              variant='default'
              size={null}
              className='font-mono font-bold text-xs px-3 py-1.5 rounded-full hover:scale-105 transition-all ease-in-out duration-300 shadow-md bg-gradient-to-r from-primary to-primary/80 text-white dark:text-black border border-primary/30 hover:shadow-lg'
              asChild
            >
              <a
                href="https://linkedin.com/in/harshhaa-vardhan-reddy"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5"
              >
                <span className="size-2 bg-green-400 rounded-full animate-pulse" />
                Available
              </a>
            </Button>
          </div>

          {/* Description with glass effect */}
          <div className="w-full flex flex-col font-mono gap-2.5 sm:gap-3 dark:text-neutral-200 text-neutral-800 text-pretty sm:backdrop-blur-sm sm:bg-white/30 sm:dark:bg-neutral-900/30 p-5 sm:p-6 md:p-8 sm:rounded-2xl sm:border sm:border-white/20 sm:dark:border-neutral-800/30 sm:shadow-xl">
            <p className="font-semibold text-lg sm:text-lg md:text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{about.title}</p>
            <h3 className="text-base sm:text-base md:text-lg leading-relaxed opacity-90">{cleanParagraph}</h3>
          </div>
        </motion.div>

        {/* Social Links with modern grid layout */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:flex md:flex-row md:items-center md:justify-center gap-3 sm:gap-4"
        >
          {links.map((link, index) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              className="w-full md:w-auto flex justify-center"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size={null}
                    className="w-full md:w-auto min-w-[160px] xs:min-w-[180px] sm:min-w-[180px] px-4 xs:px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-sm shadow-lg rounded-xl hover:scale-105 transition-all duration-300 border border-primary/20 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm hover:shadow-primary/20"
                    asChild
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.title}
                      className="flex items-center justify-center gap-2.5 sm:gap-3"
                    >
                      <link.icon className="size-[1.3rem] sm:size-5 stroke-[1.5] text-primary" />
                      <p className="font-semibold text-primary/80">{link.title}</p>
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="md:hidden">
                  <p>{link.title}</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          ))}
        </motion.nav>
      </div>
    </motion.section>
  )
}
