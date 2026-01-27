'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { data } from '../constants'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { GithubIcon, MailIcon, GlobeIcon, CloudIcon, CpuIcon, PenToolIcon, BotIcon, BrainIcon, TrophyIcon, UsersIcon, BookOpenIcon, StarIcon } from 'lucide-react'

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
      className="relative w-full py-6 sm:py-12 px-2 sm:px-4 md:px-0 space-y-8 sm:space-y-12 overflow-hidden"
    >
      {/* Hero Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="lg:col-span-1 space-y-6"
        >
          <Card className="border-0 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500" />
            <CardContent className="p-6 space-y-6">
              {/* Avatar */}
              <div className="flex justify-center">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="relative"
                >
                  <Avatar className="size-24 sm:size-32 border-4 border-white/50 dark:border-neutral-800/50">
                    <AvatarImage 
                      alt={`${avatar.name} - Portfolio Avatar`} 
                      src="/assets/avatar.png"
                      className="object-cover"
                    />
                    <AvatarFallback className="font-mono font-bold text-2xl">
                      {avatar.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-neutral-900 flex items-center justify-center">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </div>
                </motion.div>
              </div>

              {/* Name and Status */}
              <div className="text-center space-y-3">
                <div className="h-16 flex items-center justify-center">
                  <TypingText
                    text="Harshhaa Vardhan Reddy"
                    className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div className="flex justify-center">
                  <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                    Available for Work
                  </Badge>
                </div>
                <div className="text-sm font-medium text-primary">
                  {about.title}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="space-y-1">
                  <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">4+</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">Years</div>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">50+</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">Projects</div>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">10+</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">Clients</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Card */}
          <Card className="border-0 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500" />
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <TrophyIcon className="size-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Achievements</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Community Impact</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {/* GitHub Followers */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                  <GithubIcon className="size-4 text-neutral-700 dark:text-neutral-300" />
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">2.5K+ followers</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">GitHub Community</div>
                  </div>
                </div>

                {/* LinkedIn Followers */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                  <UsersIcon className="size-4 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">3K+ followers</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">LinkedIn Network</div>
                  </div>
                </div>

                {/* Dev.to Followers */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                  <BookOpenIcon className="size-4 text-purple-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">13K+ followers</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">Dev.to Community</div>
                  </div>
                </div>

                {/* Dev.to Milestone */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                  <TrophyIcon className="size-4 text-purple-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">First DevOps Blogger</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">1M+ reads in Dev Community</div>
                  </div>
                </div>

                {/* GitHub Stars */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                  <StarIcon className="size-4 text-yellow-500" />
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">3.5K+ stars & 3.4K+ forks</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">DevOps Projects GitHub</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Content Cards */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* About Card */}
          <Card className="border-0 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <GlobeIcon className="size-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">About Me</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Professional Overview</p>
                </div>
              </div>
              <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                {cleanParagraph}
              </p>
            </CardContent>
          </Card>

          {/* Skills Card */}
          <Card className="border-0 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <GithubIcon className="size-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Core Technologies</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Technical Expertise</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.65 + index * 0.05, duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-xs border border-primary/20 hover:bg-primary/20 transition-colors">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Services Card */}
          <Card className="border-0 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-orange-500" />
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                  <CpuIcon className="size-5 text-pink-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">What I Do</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Services & Expertise</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Cloud & DevOps Specialist */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CloudIcon className="size-4 text-blue-500" />
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">🌩️ Cloud & DevOps Specialist</span>
                  </div>
                  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400 pl-6">
                    <li>• Architecting scalable infrastructures</li>
                    <li>• AWS, Azure, Kubernetes expert</li>
                  </ul>
                </div>

                {/* Automation Enthusiast */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BotIcon className="size-4 text-green-500" />
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">🤖 Automation Enthusiast</span>
                  </div>
                  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400 pl-6">
                    <li>• CI/CD pipelines</li>
                    <li>• Infrastructure as Code (IaC)</li>
                  </ul>
                </div>

                {/* Content Creator */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <PenToolIcon className="size-4 text-purple-500" />
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">📝 Content Creator</span>
                  </div>
                  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400 pl-6">
                    <li>• Technical blogs</li>
                    <li>• DevOps tutorials</li>
                    <li>• Open-source projects</li>
                  </ul>
                </div>

                {/* MLOps Engineer */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BrainIcon className="size-4 text-orange-500" />
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">🧠 MLOps Engineer</span>
                  </div>
                  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400 pl-6">
                    <li>• ML pipeline automation</li>
                    <li>• Model deployment & scaling</li>
                    <li>• Kubernetes for ML workloads</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connect Card */}
          <Card className="border-0 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500" />
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <MailIcon className="size-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Let's Connect</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Get in Touch</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {links.map((link, index) => (
                  <motion.div
                    key={link.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 + index * 0.08, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-4 py-2 rounded-xl border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-300"
                      asChild
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <link.icon className="size-4 text-primary" />
                        <span className="text-sm font-medium text-primary">{link.title}</span>
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  )
}
