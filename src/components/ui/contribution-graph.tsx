'use client'

import {
  createContext,
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import type { Day as WeekDay } from 'date-fns'
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  formatISO,
  getDay,
  getMonth,
  getYear,
  nextDay,
  parseISO,
  subWeeks,
} from 'date-fns'

import { cn } from '@/lib/utils'

export type Activity = {
  date: string
  count: number
  level: number
}

type Week = Array<Activity | undefined>

export type Labels = {
  months?: string[]
  weekdays?: string[]
  totalCount?: string
  legend?: {
    less?: string
    more?: string
  }
}

type MonthLabel = {
  weekIndex: number
  label: string
}

const DEFAULT_MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const DEFAULT_LABELS: Labels = {
  months: DEFAULT_MONTH_LABELS,
  weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  totalCount: '{{count}} activities in {{year}}',
  legend: {
    less: 'Less',
    more: 'More',
  },
}

const THEME = cn(
  'data-[level="0"]:fill-muted-foreground/10 dark:data-[level="0"]:fill-muted-foreground/5',
  'data-[level="1"]:fill-signal/25',
  'data-[level="2"]:fill-signal/45',
  'data-[level="3"]:fill-signal/70',
  'data-[level="4"]:fill-signal/95'
)

export type HoveredActivity = {
  activity: Activity
  dayIndex: number
  weekIndex: number
  x: number
  y: number
}

type ContributionGraphContextType = {
  data: Activity[]
  weeks: Week[]
  blockMargin: number
  blockRadius: number
  blockSize: number
  fontSize: number
  labels: Labels
  labelHeight: number
  maxLevel: number
  totalCount: number
  weekStart: WeekDay
  year: number
  width: number
  height: number
  activeFilterLevel: number | null
  setActiveFilterLevel: (
    level: number | null | ((prev: number | null) => number | null)
  ) => void
  peakDate: string | null
  streakDates: Set<string> | null
  highlightedType?: string | null
  levelCounts?: Record<number, number>
  onActivityHover?: (activity: Activity | null) => void
}

const ContributionGraphContext =
  createContext<ContributionGraphContextType | null>(null)

export const useContributionGraph = () => {
  const context = useContext(ContributionGraphContext)
  if (!context) {
    throw new Error(
      'ContributionGraph components must be used within a ContributionGraph'
    )
  }
  return context
}

const fillHoles = (activities: Activity[]): Activity[] => {
  if (activities.length === 0) return []

  const sortedActivities = [...activities].sort((a, b) =>
    a.date.localeCompare(b.date)
  )
  const calendar = new Map<string, Activity>(activities.map(a => [a.date, a]))
  const firstActivity = sortedActivities[0] as Activity
  const lastActivity = sortedActivities.at(-1)

  if (!lastActivity) return []

  return eachDayOfInterval({
    start: parseISO(firstActivity.date),
    end: parseISO(lastActivity.date),
  }).map(day => {
    const date = formatISO(day, { representation: 'date' })
    if (calendar.has(date)) {
      return calendar.get(date) as Activity
    }
    return {
      date,
      count: 0,
      level: 0,
    }
  })
}

const groupByWeeks = (
  activities: Activity[],
  weekStart: WeekDay = 0
): Week[] => {
  if (activities.length === 0) return []

  const normalizedActivities = fillHoles(activities)
  const firstActivity = normalizedActivities[0] as Activity
  const firstDate = parseISO(firstActivity.date)
  const firstCalendarDate =
    getDay(firstDate) === weekStart
      ? firstDate
      : subWeeks(nextDay(firstDate, weekStart), 1)

  const paddedActivities = [
    ...(new Array(differenceInCalendarDays(firstDate, firstCalendarDate)).fill(
      undefined
    ) as Activity[]),
    ...normalizedActivities,
  ]

  const numberOfWeeks = Math.ceil(paddedActivities.length / 7)

  return new Array(numberOfWeeks)
    .fill(undefined)
    .map((_, weekIndex) =>
      paddedActivities.slice(weekIndex * 7, weekIndex * 7 + 7)
    )
}

const getMonthLabels = (
  weeks: Week[],
  monthNames: string[] = DEFAULT_MONTH_LABELS
): MonthLabel[] => {
  return weeks
    .reduce<MonthLabel[]>((labels, week, weekIndex) => {
      const firstActivity = week.find(activity => activity !== undefined)
      // A sparse API response can leave an all-padding week; skip it rather
      // than throwing and taking down the whole section.
      if (!firstActivity) return labels

      const month = monthNames[getMonth(parseISO(firstActivity.date))]
      if (!month) {
        const monthName = new Date(firstActivity.date).toLocaleString('en-US', {
          month: 'short',
        })
        throw new Error(
          `Unexpected error: undefined month label for ${monthName}.`
        )
      }

      const prevLabel = labels.at(-1)
      if (weekIndex === 0 || !prevLabel || prevLabel.label !== month) {
        return labels.concat({ weekIndex, label: month })
      }
      return labels
    }, [])
    .filter(({ weekIndex }, index, labels) => {
      const minWeeks = 3
      if (index === 0) {
        return labels[1] && labels[1].weekIndex - weekIndex >= minWeeks
      }
      if (index === labels.length - 1) {
        return weeks.slice(weekIndex).length >= minWeeks
      }
      return true
    })
}

export type ContributionGraphProps = HTMLAttributes<HTMLDivElement> & {
  data: Activity[]
  blockMargin?: number
  blockRadius?: number
  blockSize?: number
  fontSize?: number
  labels?: Labels
  maxLevel?: number
  style?: CSSProperties
  totalCount?: number
  weekStart?: WeekDay
  children: ReactNode
  className?: string
  activeFilterLevel?: number | null
  onActiveFilterLevelChange?: (level: number | null) => void
  onActivityHover?: (activity: Activity | null) => void
  peakDate?: string | null
  streakDates?: Set<string> | null
  highlightedType?: string | null
  levelCounts?: Record<number, number>
}

export const ContributionGraph = ({
  data,
  blockMargin = 4,
  blockRadius = 2,
  blockSize = 12,
  fontSize = 14,
  labels: labelsProp = undefined,
  maxLevel: maxLevelProp = 4,
  style = {},
  totalCount: totalCountProp = undefined,
  weekStart = 0,
  className,
  activeFilterLevel: externalFilterLevel,
  onActiveFilterLevelChange,
  onActivityHover,
  peakDate = null,
  streakDates = null,
  highlightedType = null,
  levelCounts,
  ...props
}: ContributionGraphProps) => {
  const maxLevel = Math.max(1, maxLevelProp)
  const weeks = useMemo(() => groupByWeeks(data, weekStart), [data, weekStart])
  const LABEL_MARGIN = 8

  const [internalFilterLevel, setInternalFilterLevel] = useState<number | null>(
    null
  )

  const activeFilterLevel =
    externalFilterLevel !== undefined
      ? externalFilterLevel
      : internalFilterLevel

  const setActiveFilterLevel = useCallback(
    (updater: number | null | ((prev: number | null) => number | null)) => {
      const next =
        typeof updater === 'function' ? updater(activeFilterLevel) : updater
      if (onActiveFilterLevelChange) {
        onActiveFilterLevelChange(next)
      } else {
        setInternalFilterLevel(next)
      }
    },
    [activeFilterLevel, onActiveFilterLevelChange]
  )

  const labels = useMemo(
    () => ({ ...DEFAULT_LABELS, ...labelsProp }),
    [labelsProp]
  )
  const labelHeight = fontSize + LABEL_MARGIN

  const year = data[0]
    ? getYear(parseISO(data[0].date))
    : new Date().getFullYear()

  const totalCount =
    typeof totalCountProp === 'number'
      ? totalCountProp
      : data.reduce((sum, activity) => sum + activity.count, 0)

  const width = weeks.length * (blockSize + blockMargin) - blockMargin
  const height = labelHeight + (blockSize + blockMargin) * 7 - blockMargin

  // Keep the context value referentially stable. All 371 blocks consume this
  // context, so a fresh object on every parent render would re-render them all.
  const contextValue = useMemo<ContributionGraphContextType>(
    () => ({
      data,
      weeks,
      blockMargin,
      blockRadius,
      blockSize,
      fontSize,
      labels,
      labelHeight,
      maxLevel,
      totalCount,
      weekStart,
      year,
      width,
      height,
      activeFilterLevel,
      setActiveFilterLevel,
      peakDate,
      streakDates,
      highlightedType,
      levelCounts,
      onActivityHover,
    }),
    [
      data,
      weeks,
      blockMargin,
      blockRadius,
      blockSize,
      fontSize,
      labels,
      labelHeight,
      maxLevel,
      totalCount,
      weekStart,
      year,
      width,
      height,
      activeFilterLevel,
      setActiveFilterLevel,
      peakDate,
      streakDates,
      highlightedType,
      levelCounts,
      onActivityHover,
    ]
  )

  if (data.length === 0) {
    return null
  }

  return (
    <ContributionGraphContext.Provider value={contextValue}>
      <div
        className={cn(
          'flex w-full max-w-full min-w-0 flex-col gap-2',
          className
        )}
        data-filter={activeFilterLevel !== null ? activeFilterLevel : undefined}
        data-highlight={highlightedType || undefined}
        style={{ fontSize, ...style }}
        {...props}
      />
    </ContributionGraphContext.Provider>
  )
}

export type ContributionGraphBlockProps = HTMLAttributes<SVGRectElement> & {
  activity: Activity
  dayIndex: number
  weekIndex: number
}

/**
 * Pure, memoized SVG block. It only reads the stable config context, never the
 * local hover state, so hovering a cell does not re-render the other 370 cells.
 * Its <title> lives here so callers don't pass a new `children` prop on every
 * render (which would defeat React.memo).
 */
export const ContributionGraphBlock = memo(function ContributionGraphBlock({
  activity,
  dayIndex,
  weekIndex,
  className,
  ...props
}: ContributionGraphBlockProps) {
  const {
    blockSize,
    blockMargin,
    blockRadius,
    labelHeight,
    maxLevel,
    peakDate,
    streakDates,
  } = useContributionGraph()

  if (activity.level < 0 || activity.level > maxLevel) {
    throw new RangeError(
      `Provided activity level ${activity.level} for ${activity.date} is out of range.`
    )
  }

  const x = (blockSize + blockMargin) * weekIndex
  const y = labelHeight + (blockSize + blockMargin) * dayIndex
  const isPeak = peakDate === activity.date
  const isStreak = streakDates ? streakDates.has(activity.date) : false

  return (
    <rect
      aria-label={`${activity.count} contribution${activity.count !== 1 ? 's' : ''} on ${activity.date}`}
      className={cn(THEME, 'contrib-cell', className)}
      data-count={activity.count}
      data-date={activity.date}
      data-level={activity.level}
      data-day-index={dayIndex}
      data-week-index={weekIndex}
      data-peak={isPeak ? 'true' : undefined}
      data-streak={isStreak ? 'true' : undefined}
      height={blockSize}
      rx={blockRadius}
      ry={blockRadius}
      width={blockSize}
      x={x}
      y={y}
      {...props}
    >
      <title>{`${activity.count} contribution${activity.count !== 1 ? 's' : ''} on ${formatSafeDate(activity.date)}`}</title>
    </rect>
  )
})

function formatSafeDate(dateStr: string) {
  const parts = dateStr.split('-')
  const y = Number(parts[0])
  const m = Number(parts[1])
  const d = Number(parts[2])
  const dt = new Date(y, (m || 1) - 1, d || 1)
  return format(dt, 'EEEE, MMM d, yyyy')
}

export type ContributionGraphCalendarProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  hideMonthLabels?: boolean
  className?: string
  children: (props: {
    activity: Activity
    dayIndex: number
    weekIndex: number
  }) => ReactNode
}

export const ContributionGraphCalendar = ({
  title = 'Contribution Graph',
  hideMonthLabels = false,
  className,
  children,
  ...props
}: ContributionGraphCalendarProps) => {
  const {
    weeks,
    width,
    height,
    blockSize,
    blockMargin,
    blockRadius,
    labels,
    labelHeight,
    peakDate,
    streakDates,
    onActivityHover,
  } = useContributionGraph()

  const [hovered, setHovered] = useState<HoveredActivity | null>(null)

  const monthLabels = useMemo(
    () => getMonthLabels(weeks, labels.months),
    [weeks, labels.months]
  )

  // Event delegation on the SVG: one handler for all cells instead of 371
  // closures. Touch input is ignored — swiping sideways fires pointerover on
  // every cell and would re-render the HUD continuously while scrolling.
  const handlePointerOver = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (e.pointerType === 'touch') return
      const target = e.target as SVGElement
      if (target && target.tagName === 'rect' && target.dataset.date) {
        const date = target.dataset.date
        const count = Number(target.dataset.count || 0)
        const level = Number(target.dataset.level || 0)
        const dayIndex = Number(target.dataset.dayIndex || 0)
        const weekIndex = Number(target.dataset.weekIndex || 0)
        const x = Number(target.getAttribute('x') || 0) + blockSize / 2
        const y = Number(target.getAttribute('y') || 0) + blockSize / 2

        setHovered({
          activity: { date, count, level },
          dayIndex,
          weekIndex,
          x,
          y,
        })
        onActivityHover?.({ date, count, level })
      }
    },
    [blockSize, onActivityHover]
  )

  const clearHover = useCallback(() => {
    setHovered(null)
    onActivityHover?.(null)
  }, [onActivityHover])

  // Determine active month label based on hovered block
  const activeMonthIndex = useMemo(() => {
    if (!hovered) return null
    let foundIndex = 0
    for (let i = 0; i < monthLabels.length; i++) {
      const curr = monthLabels[i]!
      const next = monthLabels[i + 1]
      if (
        hovered.weekIndex >= curr.weekIndex &&
        (!next || hovered.weekIndex < next.weekIndex)
      ) {
        foundIndex = curr.weekIndex
        break
      }
    }
    return foundIndex
  }, [hovered, monthLabels])

  // Build the cell elements once. Local hover state only re-renders the tiny
  // tooltip/reticle below — never these 371 memoized blocks.
  const renderedBlocks = useMemo(
    () =>
      weeks.flatMap((week, weekIndex) =>
        week.map((activity, dayIndex) =>
          activity ? (
            <Fragment key={`${weekIndex}-${dayIndex}`}>
              {children({ activity, dayIndex, weekIndex })}
            </Fragment>
          ) : null
        )
      ),
    [weeks, children]
  )

  // Clamped tooltip coordinates. Extra margin keeps the tooltip inside the
  // horizontal scroller instead of being clipped at its edges.
  const isNearTop = hovered ? hovered.dayIndex <= 2 : false
  const clampedX = hovered ? Math.max(120, Math.min(width - 120, hovered.x)) : 0
  const tooltipY = hovered
    ? isNearTop
      ? hovered.y + blockSize + 6
      : hovered.y - 6
    : 0
  const arrowOffset = hovered ? hovered.x - clampedX : 0

  const isPeak = hovered ? peakDate === hovered.activity.date : false
  const isStreak = hovered ? streakDates?.has(hovered.activity.date) : false

  const scrollRef = useRef<HTMLDivElement>(null)

  // On mobile viewports, jump to the most recent activity (the right edge).
  // Deferred to the next frame so the scroll width is measured after layout.
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 768) return
    const frame = requestAnimationFrame(() => {
      const el = scrollRef.current
      if (el) el.scrollLeft = el.scrollWidth
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div
      ref={scrollRef}
      className={cn(
        'relative max-w-full overflow-x-auto overflow-y-hidden select-none pb-2 sm:pb-1',
        className
      )}
      style={{
        // Keep horizontal swipes inside the graph instead of chaining them to
        // the page (the "stuck" feeling), and keep momentum scrolling on iOS.
        overscrollBehaviorX: 'contain',
        WebkitOverflowScrolling: 'touch',
      }}
      onMouseLeave={clearHover}
      onPointerCancel={clearHover}
      onScroll={clearHover}
      {...props}
    >
      <div className="relative inline-block min-w-full py-1">
        <svg
          className="block overflow-visible"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          onPointerOver={handlePointerOver}
        >
          <title>{title}</title>

          {/* Month Labels */}
          {!hideMonthLabels && (
            <g className="selection:fill-foreground">
              {monthLabels.map(({ label, weekIndex }) => {
                const isActive = activeMonthIndex === weekIndex
                return (
                  <text
                    dominantBaseline="hanging"
                    key={weekIndex}
                    x={(blockSize + blockMargin) * weekIndex}
                    className={cn(
                      'text-[10px] font-mono tracking-wider uppercase transition-colors duration-150',
                      isActive
                        ? 'fill-signal font-semibold'
                        : 'fill-muted-foreground/60'
                    )}
                  >
                    {label}
                  </text>
                )
              })}
            </g>
          )}

          {/* All 371 Contribution Blocks (memoized) */}
          {renderedBlocks}

          {/* Active Reticle and Guide Lines (High-speed hardware accelerated, NO filters) */}
          {hovered && (
            <g className="pointer-events-none">
              <line
                x1={
                  (blockSize + blockMargin) * hovered.weekIndex + blockSize / 2
                }
                y1={labelHeight - 3}
                x2={
                  (blockSize + blockMargin) * hovered.weekIndex + blockSize / 2
                }
                y2={
                  labelHeight + (blockSize + blockMargin) * 7 - blockMargin + 1
                }
                className="stroke-signal/25 stroke-1 stroke-dasharray-[2,2]"
              />
              <line
                x1={0}
                y1={
                  labelHeight +
                  (blockSize + blockMargin) * hovered.dayIndex +
                  blockSize / 2
                }
                x2={width}
                y2={
                  labelHeight +
                  (blockSize + blockMargin) * hovered.dayIndex +
                  blockSize / 2
                }
                className="stroke-signal/20 stroke-1 stroke-dasharray-[2,2]"
              />
              <rect
                x={(blockSize + blockMargin) * hovered.weekIndex - 2}
                y={
                  labelHeight + (blockSize + blockMargin) * hovered.dayIndex - 2
                }
                width={blockSize + 4}
                height={blockSize + 4}
                rx={blockRadius + 1}
                className="fill-none stroke-signal stroke-[1.5]"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip — positioned with transform only (no left/top
            transition or backdrop blur) so it never triggers layout/paint work
            while the graph is being scrolled. */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transform: hovered
              ? `translate3d(${clampedX}px, ${tooltipY}px, 0) translate(-50%, ${
                  isNearTop ? '0' : '-100%'
                })`
              : 'translate3d(0, 0, 0) translate(-50%, 0)',
            willChange: 'transform',
            transition: 'opacity 100ms ease',
            pointerEvents: 'none',
            zIndex: 40,
            opacity: hovered ? 1 : 0,
            visibility: hovered ? 'visible' : 'hidden',
          }}
          className="whitespace-nowrap"
        >
          {hovered && (
            <div
              className={cn(
                'relative rounded-none border border-border bg-popover px-3 py-2 text-popover-foreground shadow-md',
                isNearTop ? 'mt-2' : 'mb-2'
              )}
            >
              {/* Corner Brackets */}
              <span className="pointer-events-none absolute -top-px -left-px size-1.5 border-t border-l border-signal/70" />
              <span className="pointer-events-none absolute -top-px -right-px size-1.5 border-t border-r border-signal/70" />
              <span className="pointer-events-none absolute -bottom-px -left-px size-1.5 border-b border-l border-signal/70" />
              <span className="pointer-events-none absolute -right-px -bottom-px size-1.5 border-r border-b border-signal/70" />

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'size-2 shrink-0 rounded-full',
                    hovered.activity.level === 0 && 'bg-muted-foreground/30',
                    hovered.activity.level === 1 && 'bg-signal/40',
                    hovered.activity.level === 2 && 'bg-signal/60',
                    hovered.activity.level === 3 && 'bg-signal/85',
                    hovered.activity.level === 4 && 'bg-signal'
                  )}
                />
                <span className="font-heading text-xs font-semibold tracking-tight text-foreground">
                  {hovered.activity.count === 0
                    ? 'No contributions'
                    : `${hovered.activity.count} contribution${hovered.activity.count === 1 ? '' : 's'}`}
                </span>
                {isPeak && (
                  <span className="ml-1 inline-flex items-center gap-0.5 border border-signal/40 bg-signal/15 px-1 py-0.2 font-mono text-[8.5px] font-bold uppercase tracking-wider text-signal">
                    ★ Peak Day
                  </span>
                )}
                {isStreak && (
                  <span className="ml-1 inline-flex items-center gap-0.5 border border-amber-500/40 bg-amber-500/15 px-1 py-0.2 font-mono text-[8.5px] font-bold uppercase tracking-wider text-amber-500">
                    🔥 Streak
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-center justify-between gap-3 font-mono text-[9.5px] text-muted-foreground">
                <span>{formatSafeDate(hovered.activity.date)}</span>
                <span className="uppercase text-muted-foreground/60 tracking-wider">
                  {hovered.activity.level === 0
                    ? 'Rest'
                    : hovered.activity.level === 4
                      ? 'Tier 4'
                      : `Tier ${hovered.activity.level}`}
                </span>
              </div>

              {/* Arrow notch */}
              <div
                style={{ left: `calc(50% + ${arrowOffset}px)` }}
                className={cn(
                  'pointer-events-none absolute size-2 -translate-x-1/2 rotate-45 border-border bg-popover',
                  isNearTop
                    ? '-top-1 border-t border-l'
                    : '-bottom-1 border-b border-r'
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export type ContributionGraphFooterProps = HTMLAttributes<HTMLDivElement>

export const ContributionGraphFooter = ({
  className,
  ...props
}: ContributionGraphFooterProps) => (
  <div
    className={cn(
      'flex flex-wrap items-center justify-between gap-2 whitespace-nowrap',
      className
    )}
    {...props}
  />
)

export type ContributionGraphTotalCountProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  children?: (props: { totalCount: number; year: number }) => ReactNode
}

export const ContributionGraphTotalCount = ({
  className,
  children,
  ...props
}: ContributionGraphTotalCountProps) => {
  const { totalCount, year, labels } = useContributionGraph()

  if (children) {
    return <>{children({ totalCount, year })}</>
  }

  return (
    <div className={cn('text-muted-foreground', className)} {...props}>
      {labels.totalCount
        ? labels.totalCount
            .replace('{{count}}', String(totalCount))
            .replace('{{year}}', String(year))
        : `${totalCount} activities in ${year}`}
    </div>
  )
}

export type ContributionGraphLegendProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  children?: (props: { level: number }) => ReactNode
}

export const ContributionGraphLegend = ({
  className,
  children,
  ...props
}: ContributionGraphLegendProps) => {
  const {
    labels,
    maxLevel,
    blockSize,
    blockRadius,
    activeFilterLevel,
    setActiveFilterLevel,
    levelCounts,
  } = useContributionGraph()

  return (
    <div
      className={cn(
        'flex items-center gap-1 font-mono text-[10px] select-none',
        className
      )}
      {...props}
    >
      <span className="text-muted-foreground mr-0.5">
        {labels.legend?.less || 'Less'}
      </span>
      {new Array(maxLevel + 1).fill(undefined).map((_, level) => {
        const isFiltered = activeFilterLevel === level
        const count = levelCounts?.[level]

        if (children) {
          return <Fragment key={level}>{children({ level })}</Fragment>
        }

        return (
          <button
            key={level}
            type="button"
            aria-label={`Level ${level} filter`}
            onClick={() => {
              setActiveFilterLevel(prev => (prev === level ? null : level))
            }}
            title={`Level ${level}${count !== undefined ? `: ${count} days` : ''} · Click to filter`}
            className={cn(
              'group relative rounded-none p-0.5 transition-transform duration-100 cursor-pointer focus-visible:outline-none',
              isFiltered && 'scale-125 z-10'
            )}
          >
            <svg
              height={blockSize}
              width={blockSize}
              className="block overflow-visible"
            >
              <rect
                className={cn(
                  THEME,
                  'transition-all duration-100',
                  isFiltered && 'stroke-foreground stroke-1.5'
                )}
                data-level={level}
                height={blockSize}
                rx={blockRadius}
                ry={blockRadius}
                width={blockSize}
              />
            </svg>
          </button>
        )
      })}
      <span className="text-muted-foreground ml-0.5">
        {labels.legend?.more || 'More'}
      </span>

      {activeFilterLevel !== null && (
        <button
          type="button"
          onClick={() => setActiveFilterLevel(null)}
          className="ml-1 cursor-pointer text-[9px] text-muted-foreground hover:text-foreground underline decoration-dotted underline-offset-2"
        >
          Reset
        </button>
      )}
    </div>
  )
}
