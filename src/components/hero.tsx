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

  // Extract key technologies/skills from description
  const skills = ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'Docker', 'DevOps', 'Cloud Infrastructure']

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative w-full pt-6 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-24 overflow-hidden"
    >
      <div className="relative w-full max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Content Container */}
        <div className="flex flex-col items-center gap-8 lg:gap-10">
          {/* Avatar Section - Centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, type: 'spring' }}
            className="flex-shrink-0 w-full flex justify-center"
          >
            <motion.a
              href="https://github.com/NotHarshhaa"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div className="relative">
                <Avatar className="relative size-32 sm:size-40 md:size-48 lg:size-52 border-4 border-white/50 dark:border-neutral-800/50 group-hover:scale-105 transition-all duration-300 z-10">
                  <AvatarImage 
                    alt={`${avatar.name} - Portfolio Avatar`} 
                    src="/assets/avatar.png"
                    className="object-cover"
                  />
                  <AvatarFallback className="font-mono font-bold text-2xl" aria-label={avatar.name}>
                    {avatar.initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </motion.a>
          </motion.div>

          {/* Content Section - Below Avatar */}
          <div className="w-full max-w-5xl space-y-6">
            {/* Name and Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center">
                <TypingText
                  text="Harshhaa Vardhan Reddy"
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent"
                />
                <Button
                  variant='default'
                  size={null}
                  className='font-mono font-bold text-xs px-3 py-1.5 rounded-full hover:scale-105 transition-all ease-in-out duration-300 shadow-md bg-gradient-to-r from-primary to-primary/80 text-white dark:text-black border border-primary/30 hover:shadow-lg hover:shadow-primary/30'
                  asChild
                >
                  <a
                    href="https://linkedin.com/in/harshhaa-vardhan-reddy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5"
                  >
                    <span className="size-2 bg-green-400 rounded-full animate-pulse" />
                    Available
                  </a>
                </Button>
              </div>

              {/* Title Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex justify-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 backdrop-blur-sm">
                  <span className="text-sm font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {about.title}
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Description Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="relative"
            >
              <div className="relative backdrop-blur-xl bg-white/60 dark:bg-neutral-900/60 border border-white/20 dark:border-neutral-800/30 rounded-2xl p-6 sm:p-8 transition-all duration-300 overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <p className="text-base sm:text-lg leading-relaxed text-neutral-700 dark:text-neutral-300 font-medium">
                    {cleanParagraph}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Skills/Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="space-y-3"
            >
              <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 text-center">
                Core Technologies
              </p>
              <div className="flex flex-wrap items-center gap-2 justify-center">
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.65 + index * 0.05, duration: 0.3 }}
                    className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary backdrop-blur-sm transition-all duration-200 hover:scale-105 cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="flex flex-wrap items-center gap-3 justify-center pt-2"
            >
              {links.map((link, index) => (
                <motion.div
                  key={link.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 + index * 0.08, duration: 0.5 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="group relative overflow-hidden px-5 py-2.5 h-auto rounded-xl border border-primary/20 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/40 hover:scale-105 transition-all duration-300"
                        asChild
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.title}
                          className="flex items-center gap-2.5"
                        >
                          <link.icon className="size-4 sm:size-5 stroke-[1.5] text-primary group-hover:scale-110 transition-transform duration-300" />
                          <span className="font-semibold text-sm text-primary/90 group-hover:text-primary transition-colors duration-300">
                            {link.title}
                          </span>
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
        </div>
      </div>
    </motion.section>
  )
}
