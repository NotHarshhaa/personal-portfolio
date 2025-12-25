'use client'

import { useEffect, useRef } from 'react'
import { ContactForm } from '@/components/contact-form'
import { MailIcon, ArrowRight } from 'lucide-react'
import { motion, useInView, useAnimation } from 'framer-motion'
import Typed from 'typed.js'

export function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()
  const typedRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 })
    }
  }, [isInView, controls])

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: ['Contact me', 'Let\'s collaborate 💼', 'Reach out anytime!'],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
    })

    return () => {
      typed.destroy()
    }
  }, [])

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative space-y-6 sm:space-y-8 py-6 sm:py-12 px-2 sm:px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center space-y-3 sm:space-y-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 border border-primary/20"
        >
          <MailIcon className="size-6 sm:size-7 text-primary stroke-[1.5]" />
        </motion.div>

        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <span ref={typedRef} />
        </motion.h2>

        <motion.p
          className="mx-auto max-w-2xl text-neutral-600 dark:text-neutral-300 text-pretty text-center text-sm sm:text-base md:text-lg leading-relaxed px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Feel free to reach out to me for questions, inquiries, or
          collaborations. Open to new opportunities and challenges.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center justify-center gap-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400"
        >
          <span>Let's create something amazing together</span>
          <ArrowRight className="size-3.5 sm:size-4" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="relative"
      >
        <ContactForm />
      </motion.div>
    </motion.section>
  )
}
