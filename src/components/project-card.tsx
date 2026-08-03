import { ArrowUpRight, LinkIcon } from 'lucide-react'
import { Button } from './ui/button'
import { GitHubIcon } from './icons/github'
import type { ProjectProps } from '@/types'
import { Frame } from './frame'
import { HoverMark } from './hover-mark'

export function ProjectCard({
  projects
}: {
  projects: ProjectProps[]
  startIndex?: number
}) {
  return (
    <Frame className="overflow-visible">
      <ul>
        {projects.map((project, index) => {
          const isGitHubRepo = 'stars' in project
          const stars = isGitHubRepo ? (project as any).stars : null
          const language = isGitHubRepo ? (project as any).language : null
          const href = project.link.preview || project.link.github
          const label = project.link.preview
            ? 'Open demo'
            : project.link.github
              ? 'View code'
              : undefined

          return (
            <HoverMark
              as="li"
              key={project.title}
              label={label}
              disabled={!href}
              className={
                index < projects.length - 1
                  ? 'border-b border-border'
                  : undefined
              }
            >
              <div className="flex flex-col gap-4 px-4 py-7 sm:flex-row sm:items-start sm:justify-between sm:gap-10 sm:px-6 sm:py-8">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-base font-medium"
                      >
                        {project.title}
                        <ArrowUpRight className="size-3.5 opacity-40" />
                      </a>
                    ) : (
                      <h3 className="text-base font-medium">{project.title}</h3>
                    )}
                    {(language || stars != null) && (
                      <span className="font-mono text-xs text-muted-foreground">
                        {[language, stars != null ? `★ ${stars}` : null]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    )}
                  </div>

                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>

                  <ul className="flex flex-wrap gap-x-3 gap-y-1">
                    {project.tags.map((tag) => (
                      <li
                        key={tag.name}
                        className="text-xs text-muted-foreground/80"
                      >
                        {tag.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative z-20 flex shrink-0 gap-2">
                  {project.link.preview && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={project.link.preview}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <LinkIcon className="size-3.5" />
                        Demo
                      </a>
                    </Button>
                  )}
                  {project.link.github && (
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={project.link.github}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <GitHubIcon className="size-3.5" />
                        Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </HoverMark>
          )
        })}
      </ul>
    </Frame>
  )
}
