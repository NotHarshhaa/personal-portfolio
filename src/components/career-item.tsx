'use client'

import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ExternalLink } from 'lucide-react'
import { TypeAnimation } from 'react-type-animation'
import { type CareerProps } from '@/types'

interface CareerItemPropsWithIndex extends CareerProps {
  index: number
}

export function CareerItem({ link, company, jobs, badges, index }: CareerItemPropsWithIndex) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="relative ps-0 sm:ps-8 sm:border-s-2 sm:border-border pb-0 last:pb-0 group"
    >
      {/* Timeline Dot - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="hidden sm:block absolute size-4 rounded-full bg-gradient-to-tr from-primary to-primary/70 ring-4 ring-primary/20 mt-3 -start-[9px] border-2 border-white dark:border-neutral-950 group-hover:ring-6 group-hover:ring-primary/30 transition-all duration-300"
      />

      {/* Card */}
      <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-border/40 p-4 sm:p-6 hover:border-primary/30 transition-all duration-300">
        {/* Header - Company & Badge */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:items-center">
          <motion.h3
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {company}
          </motion.h3>
          <Badge
            variant="secondary"
            className="w-fit rounded-full bg-primary/10 text-primary font-semibold px-3 py-1 text-xs border border-primary/20"
          >
            {badges}
          </Badge>
        </div>

        {/* Job Roles */}
        <div className="space-y-4 sm:space-y-5">
          {jobs.map((job, jobIndex) => (
            <div key={jobIndex} className="space-y-2">
              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  <TypeAnimation
                    sequence={[job.title, 5000, '']}
                    speed={40}
                    repeat={Infinity}
                    cursor={true}
                    wrapper="span"
                  />
                </h4>
                <time className="text-xs sm:text-sm font-mono text-primary/90 block">
                  {job.start} — {job.end}
                </time>
              </div>
              <ul className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 space-y-1.5 pl-4 list-disc marker:text-primary/50">
                {job.description.map((item, i) => (
                  <li key={i} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Link Button - Compact */}
        {link && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="mt-4"
          >
            <Button
              variant="outline"
              size="sm"
              className="group px-4 py-2 h-auto rounded-lg bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/40 font-medium transition-all duration-300"
              asChild
            >
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <span className="text-primary text-xs sm:text-sm">View Profile</span>
                <ExternalLink className="size-3.5 sm:size-4 text-primary group-hover:translate-x-0.5 transition-transform duration-200" />
              </a>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
