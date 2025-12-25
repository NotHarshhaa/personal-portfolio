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
          <TypeAnimation
            sequence={['Projects & Crafts', 5000, '',]}
            wrapper='h2'
            cursor={true}
            repeat={Infinity}
            speed={50}
            className='text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent'
          />
        </div>
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

