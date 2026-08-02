export function LoadingSkeleton() {
  return (
    <div className="space-y-4 bg-card p-6 shadow-sm ring-1 ring-foreground/5">
      <div className="flex items-start justify-between">
        <div className="w-full space-y-2">
          <div className="h-6 w-3/4 animate-pulse bg-muted" />
          <div className="h-4 w-1/2 animate-pulse bg-muted" />
        </div>
        <div className="size-8 shrink-0 animate-pulse bg-muted" />
      </div>
      <div className="space-y-2">
        <div className="h-4 animate-pulse bg-muted" />
        <div className="h-4 w-5/6 animate-pulse bg-muted" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-6 w-20 animate-pulse bg-muted" />
        ))}
      </div>
    </div>
  )
}
