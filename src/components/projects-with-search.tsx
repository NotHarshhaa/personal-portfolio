'use client'

import { useState } from 'react'
import { usePagination } from '@/hook/use-pagination'
import { Button } from './ui/button'
import { ProjectCard } from './project-card'
import { ProjectPagination } from './project-pagination'
import { ProjectSearch } from './project-search'
import { TerminalIcon } from 'lucide-react'
import { data } from '@/constants'
import { TypeAnimation } from 'react-type-animation'
import { motion } from 'framer-motion'
import type { ProjectProps } from '@/types'

export function ProjectsWithSearch() {
  const { projects } = data
  const [filteredProjects, setFilteredProjects] = useState<ProjectProps[]>(projects)
  
  const { currentProjects, page, totalPages, updatePage } = usePagination({
    projects: filteredProjects
  })

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative w-full py-12 px-2 md:px-0 space-y-10 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className='flex items-center gap-x-4 mb-8 justify-center md:justify-start'
      >
        <TerminalIcon className='size-7 animate-pulse stroke-[1.5] text-primary' />
        <TypeAnimation
          sequence={['Projects & Crafts', 5000, '',]}
          wrapper='h2'
          cursor={true}
          repeat={Infinity}
          speed={50}
          className='text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow'
        />
      </motion.div>

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
          <ProjectCard projects={currentProjects} />
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
    </motion.section>
  )
}

