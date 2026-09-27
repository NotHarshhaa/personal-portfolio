import { useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import type { ProjectProps } from '@/types'

function parsePageParam(value: string | null): number {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : 1
}

export function usePagination({ projects }: { projects: ProjectProps[] }) {
  const searchParams = useSearchParams()
  const [page, setPage] = useState<number>(() =>
    parsePageParam(searchParams.get('page'))
  )

  const limit = 10

  // Filters changed the result set: go back to the first page.
  // Render-phase reset (React's "adjusting state when props change" pattern) —
  // avoids a cascading effect render after every filter change.
  const [prevProjects, setPrevProjects] = useState(projects)
  if (prevProjects !== projects) {
    setPrevProjects(projects)
    setPage(1)
  }

  // Memoize expensive calculations
  const { totalPages, currentProjects, safePage } = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(projects.length / limit))
    // Clamp so a stale page number never renders an empty slice
    const safePage = Math.min(Math.max(1, page), totalPages)
    const offset = (safePage - 1) * limit
    const currentProjects = projects.slice(offset, offset + limit)

    return { totalPages, currentProjects, safePage }
  }, [projects, page, limit])

  // Memoize the update function
  const updatePage = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage)
        // Keep the URL shareable without triggering a full navigation
        window.history.replaceState(null, '', `?page=${newPage}`)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    [totalPages]
  )

  return { currentProjects, page: safePage, totalPages, updatePage }
}
