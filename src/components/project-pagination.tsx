'use client'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function ProjectPagination({
  page,
  totalPages,
  updatePage
}: {
  page: number
  totalPages: number
  updatePage: (page: number) => void
}) {
  const isFirst = page === 1
  const isLast = page === totalPages
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <Pagination>
      <PaginationContent className="flex flex-wrap items-center justify-center gap-2">
        <PaginationItem>
          <PaginationPrevious
            className={cn(isFirst && 'pointer-events-none opacity-50')}
            isActive={!isFirst}
            onClick={() => {
              if (!isFirst) updatePage(page - 1)
            }}
            href={!isFirst ? `?page=${page - 1}` : '#'}
            tabIndex={isFirst ? -1 : 0}
            aria-disabled={isFirst}
            aria-label="Previous Page"
          />
        </PaginationItem>

        {pageNumbers.map((num) => (
          <PaginationItem key={num}>
            <Button
              variant={num === page ? 'default' : 'ghost'}
              size="sm"
              onClick={() => updatePage(num)}
              aria-current={num === page ? 'page' : undefined}
            >
              {num}
            </Button>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            className={cn(isLast && 'pointer-events-none opacity-50')}
            isActive={!isLast}
            onClick={() => {
              if (!isLast) updatePage(page + 1)
            }}
            href={!isLast ? `?page=${page + 1}` : '#'}
            tabIndex={isLast ? -1 : 0}
            aria-disabled={isLast}
            aria-label="Next Page"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
