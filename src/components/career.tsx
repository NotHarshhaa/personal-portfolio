'use client'

import { CareerItem } from './career-item'
import { Briefcase, CalendarIcon, TrendingUpIcon } from 'lucide-react'
import { data } from '@/constants'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { Card, CardContent } from '@/components/ui/card'

export function Career() {
  const { career } = data

  // Hardcoded correct values based on your career data
  const totalCompanies = 4 // DEV Community, Hashnode, TCS, IBM
  const totalJobs = 3 // 3 professional roles (excluding education)
  const totalYears = "4.3" // Approximate years of professional experience

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className='relative w-full py-6 sm:py-12 px-2 sm:px-4 md:px-0 space-y-8 sm:space-y-12 overflow-hidden'
    >
      {/* Header - Compact and Modern */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center sm:justify-start'
      >
        <div className='flex items-center gap-3'>
          <div className='p-2 sm:p-2.5 rounded-xl bg-primary/10 border border-primary/20'>
            <Briefcase className='size-5 sm:size-6 stroke-[1.5] text-primary' />
          </div>
          <TypeAnimation
            sequence={['Career & Experience', 5000, '']}
            speed={50}
            repeat={Infinity}
            cursor={true}
            wrapper='h2'
            className='text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent'
          />
        </div>
      </motion.div>

      {/* Career Stats Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="border-0 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500" />
            <CardContent className="p-3 sm:p-6 text-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Briefcase className="size-4 sm:size-6 text-primary" />
              </div>
              <div className="text-xl sm:text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">{totalCompanies}</div>
              <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Companies</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="border-0 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            <CardContent className="p-3 sm:p-6 text-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <CalendarIcon className="size-4 sm:size-6 text-blue-500" />
              </div>
              <div className="text-xl sm:text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">{totalYears}+</div>
              <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Years Experience</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Card className="border-0 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <CardContent className="p-3 sm:p-6 text-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <TrendingUpIcon className="size-4 sm:size-6 text-purple-500" />
              </div>
              <div className="text-xl sm:text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">{totalJobs}</div>
              <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Roles</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto">
        <ol className='ml-0 sm:ml-[11.5px] flex flex-col gap-y-6 sm:gap-y-10'>
          {career.map((item, index) => (
            <motion.li
              key={index}
              className='sm:ms-[30px] relative'
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <CareerItem {...item} />
            </motion.li>
          ))}
        </ol>
      </div>
    </motion.section>
  )
}
