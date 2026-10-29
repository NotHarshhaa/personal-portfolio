'use client'

import React, { useState, useMemo } from 'react'
import { Frame, FrameHeader, CornerBadge } from './frame'
import { CATEGORIZED_SKILLS, type SkillCategory } from '@/data/skills'
import {
  Activity,
  Bot,
  Cloud,
  Cpu,
  FileCode2,
  GitBranch,
  Layers,
  Search,
  Sparkles,
  Terminal,
  Users,
  X
} from 'lucide-react'

const CATEGORY_ICONS: Record<string, typeof Layers> = {
  'Platform Engineering & IDP': Layers,
  'DevOps & CI/CD': GitBranch,
  'AI Infrastructure & LLMOps': Cpu,
  'GenAI, AI Agents & MCP': Bot,
  'AI Product Development': Sparkles,
  'Cloud & Containers': Cloud,
  'Infrastructure as Code': FileCode2,
  'Observability & SRE': Activity,
  'Languages & Scripting': Terminal,
  'Community & Open Source': Users
}

export function SkillsCategorized() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredCategories = useMemo(() => {
    let list: SkillCategory[] = CATEGORIZED_SKILLS

    if (activeCategory !== 'all') {
      list = list.filter((c) => c.category === activeCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list
        .map((cat) => ({
          ...cat,
          items: cat.items.filter((item) => item.toLowerCase().includes(q))
        }))
        .filter((cat) => cat.items.length > 0)
    }

    return list
  }, [activeCategory, searchQuery])

  const totalSkillsCount = useMemo(() => {
    return CATEGORIZED_SKILLS.reduce((acc, cat) => acc + cat.items.length, 0)
  }, [])

  const smFillers = (2 - (filteredCategories.length % 2)) % 2
  const lgFillers = (3 - (filteredCategories.length % 3)) % 3

  return (
    <Frame className="overflow-visible">
      <FrameHeader label="Technical Skills Taxonomy">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
            {totalSkillsCount} core skills · 10 categories
          </span>
        </div>
      </FrameHeader>

      <div className="border-b border-border bg-muted/20 p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills (e.g. MCP, Kubernetes, vLLM, Terraform)..."
              aria-label="Search skills"
              className="h-8 w-full border border-border bg-background pl-8 pr-8 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:outline-none focus:ring-0 font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Quick reset + result count */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <span className="font-mono text-[10px] tracking-wide text-muted-foreground/60 tabular-nums">
              {filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0)}{' '}
              matches
            </span>
            {(activeCategory !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all')
                  setSearchQuery('')
                }}
                className="font-mono text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`border px-2 py-1 font-mono text-[10px] tracking-wide uppercase transition-colors ${
              activeCategory === 'all'
                ? 'border-foreground bg-foreground text-background font-medium'
                : 'border-border bg-background text-muted-foreground hover:border-foreground/50 hover:text-foreground'
            }`}
          >
            All Categories ({CATEGORIZED_SKILLS.length})
          </button>
          {CATEGORIZED_SKILLS.map((cat) => {
            const isSelected = activeCategory === cat.category
            return (
              <button
                key={cat.category}
                type="button"
                onClick={() => setActiveCategory(isSelected ? 'all' : cat.category)}
                className={`border px-2 py-1 font-mono text-[10px] tracking-wide transition-colors ${
                  isSelected
                    ? 'border-foreground bg-foreground text-background font-medium'
                    : 'border-border bg-background text-muted-foreground hover:border-foreground/50 hover:text-foreground'
                }`}
              >
                {cat.category}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid of Categories */}
      {filteredCategories.length === 0 ? (
        <div className="p-8 text-center">
          <Layers className="mx-auto size-8 text-muted-foreground/40 mb-2" />
          <p className="text-sm font-medium text-muted-foreground">No matching skills found</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Try adjusting your search query or selecting &quot;All Categories&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-y-0 sm:gap-px sm:bg-border lg:grid-cols-3">
          {filteredCategories.map((group) => {
            const CategoryIcon = CATEGORY_ICONS[group.category] ?? Layers

            return (
            <div
              key={group.category}
              className="flex flex-col bg-background p-4 sm:p-5 transition-colors hover:bg-muted/10"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-start gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center border border-border bg-muted/20">
                    <CategoryIcon className="size-3.5 text-muted-foreground" />
                  </span>
                  <CornerBadge className="text-[10px] sm:text-[11px] font-mono leading-tight">
                    {group.category}
                  </CornerBadge>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground/70 tabular-nums">
                  {group.items.length} items
                </span>
              </div>

              <ul className="flex flex-wrap gap-1.5 mt-auto pt-2">
                {group.items.map((skill) => {
                  const isMatch =
                    searchQuery.trim().length > 0 &&
                    skill.toLowerCase().includes(searchQuery.toLowerCase())
                  return (
                    <li
                      key={skill}
                      className={`inline-flex items-center border px-2 py-0.5 text-xs transition-colors ${
                        isMatch
                          ? 'border-foreground bg-foreground/10 text-foreground font-semibold'
                          : 'border-border/70 bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground'
                      }`}
                    >
                      <span className="text-[10px] text-foreground/40 mr-1.5 select-none">•</span>
                      <span>{skill}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
            )
          })}

          {Array.from({ length: smFillers }).map((_, index) => (
            <div
              key={`sm-filler-${index}`}
              aria-hidden
              className="hidden bg-background sm:block lg:hidden"
            />
          ))}
          {Array.from({ length: lgFillers }).map((_, index) => (
            <div
              key={`lg-filler-${index}`}
              aria-hidden
              className="hidden bg-background lg:block"
            />
          ))}
        </div>
      )}
    </Frame>
  )
}
