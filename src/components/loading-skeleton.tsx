import { motion } from 'framer-motion'

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-white/80 dark:bg-black/40 backdrop-blur-xl shadow-lg p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2 animate-pulse" />
        </div>
        <div className="h-8 w-8 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6 animate-pulse" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-6 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}

export function ProjectsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <ProjectCardSkeleton />
        </motion.div>
      ))}
    </div>
  )
}

