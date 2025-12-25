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

export function ProjectCard({ projects }: { projects: ProjectProps[] }) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 max-w-7xl mx-auto'>
      {projects.map(({ title, description, tags, image, video, link }, idx) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * idx, duration: 0.6, ease: 'easeOut' }}
        >
          <Card className='group flex flex-col h-full border border-border/50 w-full rounded-xl sm:rounded-2xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl hover:-translate-y-1 hover:border-primary/40 transition-all duration-300'>
            <CardHeader className='flex flex-col space-y-2 p-4 sm:p-6 pb-3'>
              <CardTitle className='text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent flex items-center gap-2'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {link.preview ? (
                      <a
                        href={link.preview}
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex items-center group gap-1.5 sm:gap-2 transition-all duration-300 hover:scale-[1.02] hover:underline underline-offset-4'
                      >
                        <span className="group-hover:text-primary dark:group-hover:text-primary transition-colors line-clamp-1">{title}</span>
                        <ArrowUpRightIcon className='size-4 sm:size-5 text-primary/70 group-hover:text-primary flex-shrink-0' />
                      </a>
                    ) : (
                      link.github && (
                        <a
                          href={link.github}
                          target='_blank'
                          rel='noreferrer'
                          className='inline-flex items-center group gap-1.5 sm:gap-2 hover:underline underline-offset-4'
                        >
                          <span className="group-hover:text-primary dark:group-hover:text-primary transition-colors line-clamp-1">{title}</span>
                          <ArrowUpRightIcon className='size-4 sm:size-5 text-primary/70 group-hover:text-primary flex-shrink-0' />
                        </a>
                      )
                    )}
                  </TooltipTrigger>
                  <TooltipContent className='p-1' side='bottom'>
                    {image ? (
                      <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-primary/10 to-primary/0">
                        <Image
                          className='object-cover w-full h-40'
                          width={400}
                          height={160}
                          src={image}
                          alt={`${title} project preview`}
                          loading='lazy'
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>
                    ) : (
                      video && (
                        <video
                          className='rounded-xl object-cover w-full h-40 shadow-lg bg-gradient-to-br from-primary/10 to-primary/0'
                          width={400}
                          height={160}
                          muted
                          autoPlay
                          loop
                        >
                          <source src={video} type='video/webm' />
                        </video>
                      )
                    )}
                  </TooltipContent>
                </Tooltip>
              </CardTitle>

              <CardDescription className='text-xs sm:text-sm dark:text-neutral-400 text-neutral-700 leading-relaxed line-clamp-2'>
                {description}
              </CardDescription>
            </CardHeader>

            <CardContent className='flex flex-col space-y-4 sm:space-y-5 p-4 sm:p-6 pt-0 mt-auto'>
              <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                {tags.map((tag) => (
                  <Badge
                    className='px-2 sm:px-3 py-1 gap-1 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-primary/15 cursor-pointer border border-primary/20 bg-primary/5 text-primary font-medium text-xs'
                    variant='secondary'
                    key={tag.name}
                  >
                    <tag.icon className='size-3 sm:size-3.5' />
                    <span>{tag.name}</span>
                  </Badge>
                ))}
              </div>

              <div className='flex gap-2 sm:gap-3'>
                {link.preview && (
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1 sm:flex-none h-9 px-3 sm:px-4 rounded-lg transition-all duration-300 bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/40 font-medium'
                    asChild
                  >
                    <a
                      href={link.preview}
                      target='_blank'
                      rel='noreferrer'
                      className='flex items-center gap-1.5 sm:gap-2'
                    >
                      <LinkIcon className='size-3.5 sm:size-4 text-primary' />
                      <span className='text-primary text-xs sm:text-sm'>Preview</span>
                    </a>
                  </Button>
                )}
                {link.github && (
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1 sm:flex-none h-9 px-3 sm:px-4 rounded-lg transition-all duration-300 bg-neutral-900/5 dark:bg-neutral-100/5 border-neutral-900/20 dark:border-neutral-100/20 hover:bg-neutral-900/10 dark:hover:bg-neutral-100/10 hover:border-neutral-900/40 dark:hover:border-neutral-100/40 font-medium'
                    asChild
                  >
                    <a
                      href={link.github}
                      target='_blank'
                      rel='noreferrer'
                      className='flex items-center gap-1.5 sm:gap-2'
                    >
                      <GitHubIcon className='size-3.5 sm:size-4' />
                      <span className='text-xs sm:text-sm'>GitHub</span>
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
