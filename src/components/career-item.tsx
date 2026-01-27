'use client'

import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ExternalLink, MapPinIcon, CalendarIcon, UsersIcon } from 'lucide-react'
import { TypeAnimation } from 'react-type-animation'
import { Card, CardContent, CardHeader } from './ui/card'
import { type CareerProps } from '@/types'

interface CareerItemPropsWithIndex extends CareerProps {
}

export function CareerItem({ link, company, jobs, badges }: CareerItemPropsWithIndex) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="relative ps-0 sm:ps-8 pb-0 last:pb-0 group"
    >
      {/* Timeline Dot - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="hidden sm:block absolute size-4 rounded-full bg-gradient-to-tr from-primary to-primary/70 ring-4 ring-primary/20 mt-3 -start-[9px] border-2 border-white dark:border-neutral-950 group-hover:ring-6 group-hover:ring-primary/30 transition-all duration-300"
      />

      {/* Enhanced Card */}
      <Card className="border-0 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-purple-500" />
        
        <CardHeader className='flex flex-col space-y-3 p-6 pb-4'>
          {/* Company Header */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{company.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {company}
                </h3>
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <MapPinIcon className="size-4" />
                  <span>Remote/On-site</span>
                </div>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="w-fit rounded-full bg-primary/10 text-primary font-semibold px-3 py-1.5 text-xs border border-primary/20"
            >
              {badges}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className='flex flex-col space-y-4 p-6 pt-0'>
          {/* Job Roles */}
          <div className="space-y-4 sm:space-y-5">
            {jobs.map((job, jobIndex) => (
              <div key={jobIndex} className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <UsersIcon className="size-4 text-blue-500" />
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      <TypeAnimation
                        sequence={[job.title, 5000, '']}
                        speed={40}
                        repeat={Infinity}
                        cursor={true}
                        wrapper="span"
                      />
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-primary/90">
                    <CalendarIcon className="size-3" />
                    <span>{job.start} — {job.end}</span>
                  </div>
                </div>
                <ul className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 space-y-1.5 pl-4 sm:pl-8 list-disc marker:text-primary/50">
                  {job.description.map((item, i) => (
                    <li key={i} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Link Button */}
          {link && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="pt-2 border-t border-neutral-100 dark:border-neutral-800"
            >
              <Button
                variant="outline"
                size="sm"
                className="group px-4 py-2 h-auto rounded-xl bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/40 font-medium transition-all duration-300"
                asChild
              >
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <span className="text-primary text-xs sm:text-sm">View Company Profile</span>
                  <ExternalLink className="size-3.5 sm:size-4 text-primary group-hover:translate-x-0.5 transition-transform duration-200" />
                </a>
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
