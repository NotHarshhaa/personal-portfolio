'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8 max-w-md"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            404
          </h1>
        </motion.div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Page Not Found
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="h-5 w-5" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/projects">
              <Search className="h-5 w-5" />
              Browse Projects
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-8"
        >
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            If you believe this is an error, please{' '}
            <Link
              href="/contact"
              className="text-primary hover:underline font-medium"
            >
              contact me
            </Link>
            .
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

