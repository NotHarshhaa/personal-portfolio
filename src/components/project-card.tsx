import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './ui/card'
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ArrowUpRightIcon, LinkIcon } from 'lucide-react'
import { GitHubIcon } from './icons/github'
import type { ProjectProps } from '@/types'
import { motion } from 'framer-motion'

export function ProjectCard({ projects, startIndex = 0 }: { projects: ProjectProps[]; startIndex?: number }) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 max-w-7xl mx-auto'>
      {projects.map((project, idx) => {
        const globalIndex = startIndex + idx
        const isGitHubRepo = 'stars' in project
        const stars = isGitHubRepo ? (project as any).stars : 0
        const forks = isGitHubRepo ? (project as any).forks : 0
        const language = isGitHubRepo ? (project as any).language : null
        
        return (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * globalIndex, duration: 0.6, ease: 'easeOut' }}
          >
            <Card className='group flex flex-col h-full border-0 w-full rounded-2xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden relative'>
              {/* Card accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500 group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300" />
            <CardHeader className='flex flex-col space-y-3 p-6 pb-4'>
              {/* Project number indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{globalIndex + 1}</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
                </div>
                <div className="flex items-center gap-1">
                  {project.link.preview && (
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  )}
                  {project.link.github && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                  {isGitHubRepo && (
                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <span>⭐</span> {stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>🔱</span> {forks}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <CardTitle className='text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-3 leading-tight'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {project.link.preview ? (
                      <a
                        href={project.link.preview}
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex items-center group gap-2 transition-all duration-300 hover:scale-105'
                      >
                        <span className="text-neutral-700 dark:text-neutral-300 group-hover:text-primary transition-colors line-clamp-1 font-medium">{project.title}</span>
                        <ArrowUpRightIcon className='size-5 text-neutral-400 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300' />
                      </a>
                    ) : (
                      project.link.github && (
                        <a
                          href={project.link.github}
                          target='_blank'
                          rel='noreferrer'
                          className='inline-flex items-center group gap-2 transition-all duration-300 hover:scale-105'
                        >
                          <span className="text-neutral-700 dark:text-neutral-300 group-hover:text-primary transition-colors line-clamp-1 font-medium">{project.title}</span>
                          <ArrowUpRightIcon className='size-5 text-neutral-400 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300' />
                        </a>
                      )
                    )}
                  </TooltipTrigger>
                  <TooltipContent className='p-1' side='bottom'>
                    {(project as any).image ? (
                      <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-primary/10 to-primary/0">
                        <Image
                          className='object-cover w-full h-40'
                          width={400}
                          height={160}
                          src={(project as any).image}
                          alt={`${project.title} project preview`}
                          loading='lazy'
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>
                    ) : (
                      (project as any).video && (
                        <video
                          className='rounded-xl object-cover w-full h-40 shadow-lg bg-gradient-to-br from-primary/10 to-primary/0'
                          width={400}
                          height={160}
                          muted
                          autoPlay
                          loop
                        >
                          <source src={(project as any).video} type='video/webm' />
                        </video>
                      )
                    )}
                  </TooltipContent>
                </Tooltip>
              </CardTitle>

              <CardDescription className='text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3 mt-2'>
                {project.description}
              </CardDescription>
              
              {/* GitHub repo stats */}
              {isGitHubRepo && (
                <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                  {language && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      {language}
                    </span>
                  )}
                  <span>Updated {new Date((project as any).updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </CardHeader>

            <CardContent className='flex flex-col space-y-5 p-6 pt-0 mt-auto'>
              <div className='flex flex-wrap gap-2'>
                {project.tags.map((tag, tagIndex) => (
                  <motion.div
                    key={tag.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * globalIndex + tagIndex * 0.05, duration: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge
                      className='px-3 py-1.5 gap-2 rounded-full transition-all duration-200 border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-medium text-xs shadow-sm hover:shadow-md'
                      variant='secondary'
                    >
                      <tag.icon className='size-3' />
                      <span>{tag.name}</span>
                    </Badge>
                  </motion.div>
                ))}
              </div>

              <div className='flex gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800'>
                {project.link.preview && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className='flex-1'
                  >
                    <Button
                      variant='default'
                      size='sm'
                      className='w-full h-10 rounded-xl bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200'
                      asChild
                    >
                      <a
                        href={project.link.preview}
                        target='_blank'
                        rel='noreferrer'
                        className='flex items-center justify-center gap-2'
                      >
                        <LinkIcon className='size-4' />
                        <span className='font-medium'>Live Demo</span>
                      </a>
                    </Button>
                  </motion.div>
                )}
                {project.link.github && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className='flex-1'
                  >
                    <Button
                      variant='outline'
                      size='sm'
                      className='w-full h-10 rounded-xl border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-sm hover:shadow-md transition-all duration-200'
                      asChild
                    >
                      <a
                        href={project.link.github}
                        target='_blank'
                        rel='noreferrer'
                        className='flex items-center justify-center gap-2'
                      >
                        <GitHubIcon className='size-4' />
                        <span className='font-medium'>Source Code</span>
                      </a>
                    </Button>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        )
      })}
    </div>
  )
}
