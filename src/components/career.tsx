'use client'

import { CareerItem } from './career-item'
import { Briefcase } from 'lucide-react'
import { data } from '@/constants'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'

export function Career() {
  const { career } = data

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

      {/* Timeline */}
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
            <CareerItem {...item} index={index} />
          </motion.li>
        ))}
      </ol>
    </motion.section>
  )
}
