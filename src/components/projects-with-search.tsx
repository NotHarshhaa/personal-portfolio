'use client'

import { useState, useEffect } from 'react'
import { usePagination } from '@/hook/use-pagination'
import { Button } from './ui/button'
import { ProjectCard } from './project-card'
import { ProjectPagination } from './project-pagination'
import { ProjectSearch } from './project-search'
import { Loader2 } from 'lucide-react'
import type { ProjectProps } from '@/types'
import { getAllProjects } from '@/lib/github'
import { Frame, FrameBody, FrameHeader } from './frame'

export function ProjectsWithSearch() {
  const [projects, setProjects] = useState<ProjectProps[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ProjectProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [githubCount, setGithubCount] = useState(0)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        setError(null)
        const allProjects = await getAllProjects()
        setProjects(allProjects)
        setFilteredProjects(allProjects)
        setGithubCount(allProjects.filter((p) => 'stars' in p).length)
      } catch (err) {
        setError('Failed to load projects from GitHub')
        console.error('Error loading projects:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const { currentProjects, page, totalPages, updatePage } = usePagination({
    projects: filteredProjects
  })

  return (
    <section className="flex w-full flex-col gap-4 py-4 sm:py-6">
      <Frame>
        <FrameHeader label="Projects / Crafts">
          {!loading && (
            <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
              {githubCount} repos
            </span>
          )}
        </FrameHeader>
        <FrameBody className="py-10 sm:py-12">
          <h1 className="max-w-2xl font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
            Selected work and open-source crafts.
          </h1>
        </FrameBody>
      </Frame>

      {loading ? (
        <Frame>
          <FrameBody className="flex min-h-[200px] flex-col items-center justify-center gap-3">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading projects…</p>
          </FrameBody>
        </Frame>
      ) : error ? (
        <Frame>
          <FrameBody className="flex min-h-[200px] flex-col items-center justify-center gap-4">
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
          </FrameBody>
        </Frame>
      ) : (
        <>
          <Frame>
            <FrameHeader label="Filter" />
            <FrameBody className="py-5">
              <ProjectSearch
                projects={projects}
                onFilterChange={setFilteredProjects}
              />
            </FrameBody>
          </Frame>

          {currentProjects.length === 0 ? (
            <Frame>
              <FrameBody className="flex min-h-[160px] flex-col items-center justify-center gap-4">
                <p className="text-sm text-muted-foreground">
                  No projects match your filters.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilteredProjects(projects)}
                >
                  Clear filters
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
        </>
      )}
    </section>
  )
}
