'use client'

import { usePagination } from '@/hook/use-pagination'
import { Button } from './ui/button'
import { ProjectCard } from './project-card'
import { ProjectPagination } from './project-pagination'
import { data } from '@/constants'
import { Frame, FrameBody, FrameHeader, CornerHeading } from './frame'

export function Projects() {
  const { projects } = data
  const { currentProjects, page, totalPages, updatePage } = usePagination({
    projects
  })

  return (
    <section className="flex w-full flex-col gap-4 py-4 sm:py-6">
      <Frame>
        <FrameHeader label="Projects / Crafts" />
        <FrameBody className="py-8 sm:py-10">
          <CornerHeading size="lg" className="w-fit max-w-3xl px-3 py-2 sm:px-4 sm:py-3">
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
              Selected work and open-source crafts.
            </h1>
          </CornerHeading>
        </FrameBody>
      </Frame>

      {currentProjects.length === 0 || page < 1 || page > totalPages ? (
        <Frame>
          <FrameBody className="flex min-h-[160px] items-center justify-center">
            <Button variant="ghost" size="sm" asChild>
              <a href="/projects">No projects found</a>
            </Button>
          </FrameBody>
        </Frame>
      ) : (
        <>
          <ProjectCard projects={currentProjects} />
          {totalPages > 1 && (
            <Frame>
              <FrameBody className="flex justify-center py-4">
                <ProjectPagination
                  page={page}
                  totalPages={totalPages}
                  updatePage={updatePage}
                />
              </FrameBody>
            </Frame>
          )}
        </>
      )}
    </section>
  )
}
