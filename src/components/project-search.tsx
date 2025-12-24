'use client'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ProjectProps } from '@/types'

interface ProjectSearchProps {
  projects: ProjectProps[]
  onFilterChange: (filteredProjects: ProjectProps[]) => void
}

export function ProjectSearch({ projects, onFilterChange }: ProjectSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())

  // Get all unique tags from projects
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>()
    projects.forEach((project) => {
      project.tags.forEach((tag) => {
        tagsSet.add(tag.name)
      })
    })
    return Array.from(tagsSet).sort()
  }, [projects])

  // Filter projects based on search query and selected tags
  const filteredProjects = useMemo(() => {
    let filtered = projects

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags.some((tag) => tag.name.toLowerCase().includes(query))
      )
    }

    // Filter by selected tags
    if (selectedTags.size > 0) {
      filtered = filtered.filter((project) =>
        project.tags.some((tag) => selectedTags.has(tag.name))
      )
    }

    return filtered
  }, [projects, searchQuery, selectedTags])

  // Notify parent of filtered projects
  useMemo(() => {
    onFilterChange(filteredProjects)
  }, [filteredProjects, onFilterChange])

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(tagName)) {
        newSet.delete(tagName)
      } else {
        newSet.add(tagName)
      }
      return newSet
    })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTags(new Set())
  }

  const hasActiveFilters = searchQuery.trim() !== '' || selectedTags.size > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-4 mb-8"
    >
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-neutral-500 z-10" />
        <Input
          type="text"
          placeholder="Search projects by name, description, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "pl-10 pr-10 h-12 text-base",
            "border-neutral-200 dark:border-neutral-700",
            "bg-white/50 dark:bg-neutral-900/50",
            "focus-visible:border-primary dark:focus-visible:border-primary",
            "backdrop-blur-sm"
          )}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Tags Filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          Filter by tags:
        </span>
        {allTags.map((tagName) => {
          const isSelected = selectedTags.has(tagName)
          return (
            <Badge
              key={tagName}
              variant={isSelected ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-all duration-200 hover:scale-105',
                isSelected && 'bg-primary text-white dark:text-black'
              )}
              onClick={() => toggleTag(tagName)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleTag(tagName)
                }
              }}
            >
              {tagName}
            </Badge>
          )
        })}
      </div>

      {/* Results Count and Clear Button */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between"
          >
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-sm"
            >
              Clear filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

