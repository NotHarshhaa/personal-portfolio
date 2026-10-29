'use client'

import { useState } from 'react'
import { Link } from 'next-view-transitions'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, FolderGit2 } from 'lucide-react'
import { Frame, FrameBody, FrameHeader } from '@/components/frame'
import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/utils'
import { data } from '@/constants'

/** Tabbed project log: one category on stage at a time, featured item first. */
export function FeaturedProjects() {
  const [active, setActive] = useState(0)
  const groups = data.featuredProjects
  const group = groups[active]!

  return (
    <Reveal>
      <Frame id="featured-projects" className="scroll-mt-24">
        <FrameHeader label="Featured Projects.">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            All projects
            <ArrowUpRight className="size-3" />
          </Link>
        </FrameHeader>

        <div
          role="group"
          aria-label="Project categories"
          className="flex gap-0 overflow-x-auto border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {groups.map((item, index) => (
            <button
              key={item.category}
              type="button"
              aria-pressed={active === index}
              onClick={() => setActive(index)}
              className={cn(
                'relative shrink-0 border-r border-border px-4 py-3 text-left font-mono text-[10px] tracking-[0.12em] uppercase transition-colors last:border-r-0 sm:px-5',
                active === index
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
              )}
            >
              <span className="mr-2 opacity-50">
                {String(index + 1).padStart(2, '0')}
              </span>
              {item.category}
              <span
                className={cn(
                  'ml-2 text-[9px] tabular-nums',
                  active === index ? 'opacity-60' : 'opacity-40'
                )}
              >
                {item.items.length}
              </span>
            </button>
          ))}
        </div>

        <div>
          <p className="sr-only" aria-live="polite">
            Showing {group.category} projects
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <FrameBody className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                    <FolderGit2 className="size-3.5 text-signal" />
                    {group.category}
                  </p>
                  <span className="font-mono text-[10px] text-muted-foreground/60 tabular-nums">
                    {String(active + 1).padStart(2, '0')} /{' '}
                    {String(groups.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {group.items.map((project, index) => (
                    <a
                      key={project.title}
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'group relative flex flex-col justify-between overflow-hidden border border-border bg-background p-4 transition-colors hover:border-foreground/30 hover:bg-muted/20 sm:p-5',
                        index === 0 && 'md:col-span-3 md:min-h-[9.5rem]'
                      )}
                    >
                      {index === 0 && (
                        <span
                          aria-hidden
                          className="pointer-events-none absolute -top-6 -right-2 font-heading text-[8rem] leading-none font-semibold tracking-tighter text-foreground/[0.045] select-none"
                        >
                          01
                        </span>
                      )}

                      <div className="relative flex items-start justify-between gap-4">
                        <span className="font-mono text-[9px] tracking-[0.16em] text-muted-foreground/50 tabular-nums">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <ArrowUpRight className="size-3.5 text-muted-foreground/40 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
                      </div>

                      <div
                        className={cn(
                          'relative mt-5 space-y-1.5',
                          index === 0 && 'max-w-xl md:mt-6'
                        )}
                      >
                        <h3
                          className={cn(
                            'font-heading font-semibold tracking-tight transition-colors group-hover:text-signal',
                            index === 0 ? 'text-xl sm:text-2xl' : 'text-sm'
                          )}
                        >
                          {project.title}
                        </h3>
                        <p
                          className={cn(
                            'leading-relaxed text-muted-foreground',
                            index === 0 ? 'text-sm' : 'text-xs'
                          )}
                        >
                          {project.description}
                        </p>
                      </div>

                      <div className="relative mt-5 flex items-center justify-between border-t border-border/60 pt-3">
                        <span className="font-mono text-[9px] tracking-[0.16em] text-muted-foreground/60 uppercase transition-colors group-hover:text-foreground">
                          view repository
                        </span>
                        <span className="h-px w-8 bg-border transition-all duration-200 group-hover:w-12 group-hover:bg-signal" />
                      </div>
                    </a>
                  ))}
                </div>
              </FrameBody>
            </motion.div>
          </AnimatePresence>
        </div>
      </Frame>
    </Reveal>
  )
}
