'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import type { ProjectProps } from '@/types'

interface ProjectSearchProps {
  projects: ProjectProps[]
  onFilterChange: (filteredProjects: ProjectProps[]) => void
}

export function ProjectSearch({
  projects,
  onFilterChange
}: ProjectSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>()
    projects.forEach((project) => {
      project.tags.forEach((tag) => tagsSet.add(tag.name))
    })
    return Array.from(tagsSet).sort()
  }, [projects])

  const filteredProjects = useMemo(() => {
    let filtered = projects

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags.some((tag) => tag.name.toLowerCase().includes(query))
      )
    }

    if (selectedTags.size > 0) {
      filtered = filtered.filter((project) =>
        project.tags.some((tag) => selectedTags.has(tag.name))
      )
    }

    return filtered
  }, [projects, searchQuery, selectedTags])

  useEffect(() => {
    onFilterChange(filteredProjects)
  }, [filteredProjects, onFilterChange])

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev)
      if (next.has(tagName)) next.delete(tagName)
      else next.add(tagName)
      return next
    })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTags(new Set())
  }

  const hasActiveFilters = searchQuery.trim() !== '' || selectedTags.size > 0

  return (
    <div className="space-y-5">
      <div className="relative border-b border-border">
        <Search className="absolute top-1/2 left-0 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search projects…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-11 border-0 pl-6 shadow-none focus-visible:ring-0"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute top-1/2 right-0 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {allTags.map((tagName) => {
          const isSelected = selectedTags.has(tagName)
          return (
            <button
              key={tagName}
              type="button"
              onClick={() => toggleTag(tagName)}
              className={
                isSelected
                  ? 'text-xs font-medium text-foreground underline underline-offset-4'
                  : 'text-xs text-muted-foreground transition-colors hover:text-foreground'
              }
            >
              {tagName}
            </button>
          )
        })}
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {filteredProjects.length} of {projects.length}
          </p>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      )}
    </div>
  )
}
