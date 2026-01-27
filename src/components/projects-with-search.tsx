'use client'

import { useState, useEffect } from 'react'
import { usePagination } from '@/hook/use-pagination'
import { Button } from './ui/button'
import { ProjectCard } from './project-card'
import { ProjectPagination } from './project-pagination'
import { ProjectSearch } from './project-search'
import { TerminalIcon, GithubIcon, Loader2 } from 'lucide-react'
import { TypeAnimation } from 'react-type-animation'
import { motion } from 'framer-motion'
import type { ProjectProps } from '@/types'
import { getAllProjects } from '@/lib/github'

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
        
        // Count GitHub repos (those with stars property)
        const githubRepos = allProjects.filter(p => 'stars' in p)
        setGithubCount(githubRepos.length)
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

  // Calculate the starting index for the current page
  const startIndex = (page - 1) * 10

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
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
            <TerminalIcon className='size-5 sm:size-6 stroke-[1.5] text-primary' />
          </div>
          <div className="flex flex-col">
            <TypeAnimation
              sequence={['Projects & Crafts', 5000, '',]}
              wrapper='h2'
              cursor={true}
              repeat={Infinity}
              speed={50}
              className='text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent'
            />
            {!loading && (
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <GithubIcon className="size-4" />
                <span>{githubCount} repositories from GitHub</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-neutral-600 dark:text-neutral-400">Loading projects from GitHub...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="flex flex-col items-center gap-4">
            <p className="text-red-500 text-center">{error}</p>
            <Button variant='secondary' size='sm' onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        <>
          <ProjectSearch projects={projects} onFilterChange={setFilteredProjects} />

          {currentProjects.length === 0 ? (
            <div className="flex flex-col justify-center items-center min-h-[200px] space-y-4">
              <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                No projects found matching your search criteria.
              </p>
              <Button variant='secondary' size='sm' onClick={() => setFilteredProjects(projects)}>
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              <ProjectCard projects={currentProjects} startIndex={startIndex} />
              {totalPages > 1 && (
                <div className="flex justify-center pt-8">
                  <ProjectPagination
                    page={page}
                    totalPages={totalPages}
                    updatePage={updatePage}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </motion.section>
  )
}

