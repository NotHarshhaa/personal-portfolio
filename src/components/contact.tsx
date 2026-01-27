'use client'

import { useEffect, useRef } from 'react'
import { ContactForm } from '@/components/contact-form'
import { MailIcon, ArrowRight, SendIcon, PhoneIcon, MapPinIcon } from 'lucide-react'
import { motion, useInView, useAnimation } from 'framer-motion'
import Typed from 'typed.js'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative w-full py-6 sm:py-12 px-2 sm:px-4 md:px-0 space-y-8 sm:space-y-10 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className='flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center sm:justify-start'
      >
        <div className='flex items-center gap-3'>
          <div className='p-2 sm:p-2.5 rounded-xl bg-primary/10 border border-primary/20'>
            <MailIcon className='size-5 sm:size-6 stroke-[1.5] text-primary' />
          </div>
          <div className="flex flex-col">
            <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent'>
              <span ref={typedRef} />
            </h2>
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <span>Let&apos;s create something amazing together</span>
              <ArrowRight className="size-4" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Contact Info Cards */}
        <div className="lg:col-span-1 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="border-0 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500" />
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MailIcon className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Email</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Get in touch</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl border-primary/20 hover:bg-primary/5"
                  asChild
                >
                  <a href="mailto:contact@example.com">
                    Send Message
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="border-0 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <PhoneIcon className="size-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Phone</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Available for calls</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl border-blue-500/20 hover:bg-blue-500/5"
                  asChild
                >
                  <a href="tel:+1234567890">
                    Call Now
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Card className="border-0 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <MapPinIcon className="size-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Location</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Based remotely</p>
                  </div>
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Available for remote work worldwide
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 rounded-2xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-purple-500" />
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <SendIcon className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Send a Message</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">I&apos;ll get back to you as soon as possible</p>
                </div>
              </div>
              <ContactForm />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  )
}
