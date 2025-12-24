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
    <div className='flex flex-col gap-8'>
      {projects.map(({ title, description, tags, image, video, link }, idx) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * idx, duration: 0.6, ease: 'easeOut' }}
        >
          <Card className='group flex flex-col border border-border/60 shadow-lg w-full max-w-4xl mx-auto rounded-2xl bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl hover:shadow-2xl hover:-translate-y-1 hover:border-primary/40 transition-all duration-300'>
            <CardHeader className='flex flex-col space-y-2 p-6 pb-2'>
              <CardTitle className='text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent flex items-center gap-2'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {link.preview ? (
                      <a
                        href={link.preview}
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex items-center group gap-2 transition-all duration-300 hover:scale-[1.03] hover:underline underline-offset-4'
                      >
                        <span className="group-hover:text-primary dark:group-hover:text-primary transition-colors">{title}</span>
                        <ArrowUpRightIcon className='size-5 text-primary/70 group-hover:text-primary' />
                      </a>
                    ) : (
                      link.github && (
                        <a
                          href={link.github}
                          target='_blank'
                          rel='noreferrer'
                          className='inline-flex items-center group gap-2 hover:underline underline-offset-4'
                        >
                          <span className="group-hover:text-primary dark:group-hover:text-primary transition-colors">{title}</span>
                          <ArrowUpRightIcon className='size-5 text-primary/70 group-hover:text-primary' />
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

              <CardDescription className='font-mono dark:text-neutral-400 text-neutral-700 text-base mt-1'>
                {description}
              </CardDescription>
            </CardHeader>

            <CardContent className='flex flex-col space-y-6 p-6 pt-0'>
              <div className='flex flex-wrap gap-2'>
                {tags.map((tag) => (
                  <Badge
                    className='px-3 py-1 gap-1 rounded-full shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md dark:hover:bg-primary/10 hover:bg-primary/10 cursor-pointer border border-primary/20 bg-white/80 dark:bg-neutral-900/60 text-primary font-semibold text-xs'
                    variant='secondary'
                    key={tag.name}
                  >
                    <tag.icon className='size-4' />
                    <span>{tag.name}</span>
                  </Badge>
                ))}
              </div>

              <div className='flex gap-x-3'>
                {link.preview && (
                  <Button
                    variant='default'
                    size={null}
                    className='px-4 py-2 rounded-lg shadow-md transition-all duration-300 bg-primary text-white dark:text-black hover:scale-105 hover:shadow-lg hover:bg-primary/90 dark:hover:bg-primary/80 font-semibold flex items-center gap-2'
                    asChild
                  >
                    <a
                      href={link.preview}
                      target='_blank'
                      rel='noreferrer'
                      className='flex items-center gap-2'
                    >
                      <LinkIcon className='size-4' />
                      <span>Preview</span>
                    </a>
                  </Button>
                )}
                {link.github && (
                  <Button
                    variant='default'
                    size={null}
                    className='px-4 py-2 rounded-lg shadow-md transition-all duration-300 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black hover:scale-105 hover:shadow-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 font-semibold flex items-center gap-2'
                    asChild
                  >
                    <a
                      href={link.github}
                      target='_blank'
                      rel='noreferrer'
                      className='flex items-center gap-2'
                    >
                      <GitHubIcon className='size-4' />
                      <span>GitHub</span>
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
