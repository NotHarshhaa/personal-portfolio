'use client'

import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { animate } from 'framer-motion'
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
  type Activity,
} from '@/components/ui/contribution-graph'
import { Frame, FrameBody, FrameHeader } from './frame'
import {
  ArrowUpRight,
  Flame,
  CalendarDays,
  GitCommitHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const GITHUB_USERNAME = 'NotHarshhaa'
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`
const CONTRIBUTIONS_API = 'https://github-contributions-api.jogruber.de'

function computeStats(activities: Activity[]) {
  const sorted = [...activities].sort((a, b) => a.date.localeCompare(b.date))
  const total = sorted.reduce((sum, activity) => sum + activity.count, 0)
  const activeDays = sorted.filter(activity => activity.count > 0).length
  const bestDay = sorted.reduce(
    (best, activity) => (activity.count > best.count ? activity : best),
    { date: '', count: 0, level: 0 }
  )

  let currentStreak = 0
  const todayKey = format(new Date(), 'yyyy-MM-dd')
  let end = sorted.length - 1
  while (end >= 0 && sorted[end]!.date > todayKey) end--
  const currentStreakDates: string[] = []
  for (let i = end; i >= 0; i--) {
    if ((sorted[i]?.count ?? 0) > 0) {
      currentStreak++
      currentStreakDates.push(sorted[i]!.date)
    } else {
      break
    }
  }

  let bestStreak = 0
  let running = 0
  for (const activity of sorted) {
    if (activity.count > 0) {
      running++
      bestStreak = Math.max(bestStreak, running)
    } else {
      running = 0
    }
  }

  const streakDatesSet = new Set(currentStreakDates)

  const levelCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 }
  for (const a of sorted) {
    levelCounts[a.level] = (levelCounts[a.level] ?? 0) + 1
  }

  const year = sorted[0]?.date
    ? sorted[0].date.slice(0, 4)
    : String(new Date().getFullYear())

  return {
    total,
    activeDays,
    bestDay,
    currentStreak,
    bestStreak,
    streakDatesSet,
    levelCounts,
    year,
  }
}

const AnimatedStatNumber = memo(function AnimatedStatNumber({
  value,
}: {
  value: number
}) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (value === 0) return
    const controls = animate(0, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: latest => setDisplayValue(Math.round(latest)),
    })
    return () => controls.stop()
  }, [value])

  return (
    <span className="tabular-nums">{displayValue.toLocaleString('en')}</span>
  )
})

type HighlightType = 'contributions' | 'active' | 'streak' | 'peak'

const StatCell = memo(function StatCell({
  icon: Icon,
  label,
  numericValue,
  hint,
  isActive,
  highlightKey,
  onHighlightChange,
}: {
  icon: typeof Flame
  label: string
  numericValue: number
  hint?: string
  isActive?: boolean
  highlightKey: HighlightType
  onHighlightChange?: (key: HighlightType | null) => void
}) {
  return (
    <div
      onMouseEnter={() => onHighlightChange?.(highlightKey)}
      onMouseLeave={() => onHighlightChange?.(null)}
      className={cn(
        'group relative flex flex-col justify-between gap-3 bg-background p-3.5 select-none transition-colors duration-150 cursor-pointer overflow-hidden',
        isActive ? 'bg-muted/40' : 'hover:bg-muted/20'
      )}
    >
      {/* Top accent line sweep */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-signal transition-transform duration-200 origin-left',
          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        )}
      />

      {/* Blueprint corner bracket */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute -bottom-px -right-px size-1.5 border-b border-r transition-colors duration-150',
          isActive
            ? 'border-signal'
            : 'border-transparent group-hover:border-signal/80'
        )}
      />

      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase transition-colors group-hover:text-foreground">
          {label}
        </span>
        <Icon
          className={cn(
            'size-3.5 text-muted-foreground/50 transition-transform duration-200',
            isActive
              ? 'text-signal scale-110'
              : 'group-hover:text-signal group-hover:scale-110'
          )}
        />
      </div>

      <div>
        <p className="font-heading text-2xl font-semibold tracking-tight tabular-nums">
          <AnimatedStatNumber value={numericValue} />
        </p>
        {hint && (
          <p className="mt-0.5 font-mono text-[9px] text-muted-foreground/60 transition-colors group-hover:text-muted-foreground/80">
            {hint}
          </p>
        )}
      </div>
    </div>
  )
})

function parseDateClean(dateStr: string) {
  const parts = dateStr.split('-')
  const y = Number(parts[0])
  const m = Number(parts[1])
  const d = Number(parts[2])
  return new Date(y, (m || 1) - 1, d || 1)
}

/**
 * Isolated Telemetry HUD component.
 * Re-renders ONLY this component on cell hover, NEVER the left column or stat cards!
 */
const TelemetryHUD = memo(function TelemetryHUD({
  hoveredActivity,
  activeFilterLevel,
  highlightedType,
  stats,
  onResetFilter,
}: {
  hoveredActivity: Activity | null
  activeFilterLevel: number | null
  highlightedType: string | null
  stats: ReturnType<typeof computeStats>
  onResetFilter: () => void
}) {
  return (
    <div className="flex min-h-[26px] flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
      {hoveredActivity ? (
        <div className="flex items-center gap-2 font-mono text-[10.5px] tracking-wider text-foreground">
          <span className="size-2 rounded-full bg-signal" />
          <span className="font-semibold text-signal">
            {hoveredActivity.count}{' '}
            {hoveredActivity.count === 1 ? 'commit' : 'commits'}
          </span>
          <span className="text-muted-foreground">on</span>
          <span>
            {format(parseDateClean(hoveredActivity.date), 'EEEE, MMM d, yyyy')}
          </span>
          {hoveredActivity.date === stats.bestDay.date && (
            <span className="border border-signal/40 bg-signal/15 px-1 py-0.2 text-[9px] font-bold text-signal uppercase tracking-wider">
              ★ Year Peak
            </span>
          )}
          {stats.streakDatesSet.has(hoveredActivity.date) && (
            <span className="border border-amber-500/40 bg-amber-500/15 px-1 py-0.2 text-[9px] font-bold text-amber-500 uppercase tracking-wider">
              🔥 Streak
            </span>
          )}
        </div>
      ) : activeFilterLevel !== null ? (
        <div className="flex items-center gap-2 font-mono text-[10.5px] tracking-wider text-foreground">
          <span className="size-2 rounded-full bg-signal" />
          <span>
            Filtering Tier {activeFilterLevel} (
            {stats.levelCounts[activeFilterLevel] ?? 0} days in {stats.year})
          </span>
          <button
            type="button"
            onClick={onResetFilter}
            className="ml-1 cursor-pointer font-bold text-signal underline decoration-dotted underline-offset-2 hover:text-foreground text-[9.5px]"
          >
            Reset Filter
          </button>
        </div>
      ) : highlightedType ? (
        <div className="flex items-center gap-2 font-mono text-[10.5px] tracking-wider text-signal">
          <span className="size-2 rounded-full bg-signal" />
          <span className="font-semibold uppercase">
            {highlightedType === 'peak' &&
              `Peak day: ${stats.bestDay.count} commits on ${
                stats.bestDay.date
                  ? format(parseDateClean(stats.bestDay.date), 'dd MMM yyyy')
                  : '—'
              }`}
            {highlightedType === 'streak' &&
              `Current streak: ${stats.currentStreak} consecutive active days`}
            {highlightedType === 'active' &&
              `Active days: ${stats.activeDays} days with commits`}
            {highlightedType === 'contributions' &&
              `Total contributions: ${stats.total.toLocaleString('en')} commits`}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
          <span className="size-1.5 rounded-full bg-signal/70" />
          <span>
            {stats.total.toLocaleString('en')} contributions in {stats.year} ·
            hover cells or stats to inspect
          </span>
        </div>
      )}

      <span className="font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase">
        LIVE TELEMETRY
      </span>
    </div>
  )
})

type GraphStats = ReturnType<typeof computeStats>

/**
 * Isolated, memoized graph panel. Cell hovers live in the parent's
 * `hoveredActivity` state, but this component's props stay referentially
 * stable, so hovering never re-renders the graph or its 371 cells.
 */
const ContributionGraphPanel = memo(function ContributionGraphPanel({
  activities,
  stats,
  activeFilterLevel,
  onFilterLevelChange,
  highlightedType,
  onActivityHover,
}: {
  activities: Activity[]
  stats: GraphStats
  activeFilterLevel: number | null
  onFilterLevelChange: (level: number | null) => void
  highlightedType: HighlightType | null
  onActivityHover: (activity: Activity | null) => void
}) {
  return (
    <>
      <ContributionGraph
        className="w-full max-w-full min-w-0 py-1"
        data={activities}
        blockSize={13}
        blockMargin={4}
        blockRadius={1}
        peakDate={stats.bestDay.date || null}
        streakDates={stats.streakDatesSet}
        highlightedType={highlightedType}
        activeFilterLevel={activeFilterLevel}
        onActiveFilterLevelChange={onFilterLevelChange}
        onActivityHover={onActivityHover}
        levelCounts={stats.levelCounts}
      >
        <ContributionGraphCalendar
          className="px-1"
          title="GitHub Contributions"
        >
          {({ activity, dayIndex, weekIndex }) => (
            <ContributionGraphBlock
              activity={activity}
              dayIndex={dayIndex}
              weekIndex={weekIndex}
            />
          )}
        </ContributionGraphCalendar>

        <ContributionGraphFooter className="px-1 pt-1">
          <ContributionGraphTotalCount>
            {({ totalCount, year }) => (
              <div className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                {totalCount.toLocaleString('en')} contributions in {year} on{' '}
                <a
                  className="text-foreground underline decoration-current/30 underline-offset-2 transition-colors hover:decoration-current"
                  href={GITHUB_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </div>
            )}
          </ContributionGraphTotalCount>

          <ContributionGraphLegend />
        </ContributionGraphFooter>
      </ContributionGraph>

      <p className="flex flex-wrap items-center justify-between gap-1 border-t border-border/60 pt-3 font-mono text-[9px] tracking-[0.1em] text-muted-foreground/50 uppercase">
        <span>synced live from public api · interactive telemetry</span>
        <span className="sm:hidden font-mono text-signal/80 font-medium">
          ↔ scroll sideways
        </span>
      </p>
    </>
  )
})

export function GitHubActivity() {
  const [activities, setActivities] = useState<Activity[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [hoveredActivity, setHoveredActivity] = useState<Activity | null>(null)
  const [activeFilterLevel, setActiveFilterLevel] = useState<number | null>(
    null
  )
  const [highlightedType, setHighlightedType] = useState<HighlightType | null>(
    null
  )

  // Stable callbacks keep the memoized stat cards and graph panel from
  // re-rendering on every hover/scroll event.
  const handleHighlightChange = useCallback(
    (key: HighlightType | null) => setHighlightedType(key),
    []
  )
  const handleResetFilter = useCallback(() => setActiveFilterLevel(null), [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const year = new Date().getFullYear()
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 10000)

        const res = await fetch(
          `${CONTRIBUTIONS_API}/v4/${GITHUB_USERNAME}?y=${year}`,
          { signal: controller.signal }
        )
        clearTimeout(timeout)

        if (!res.ok)
          throw new Error(`GitHub contributions API error: ${res.status}`)
        const data = await res.json()
        if (!cancelled) setActivities(data.contributions ?? [])
      } catch {
        if (!cancelled) setFailed(true)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(
    () =>
      activities && activities.length > 0 ? computeStats(activities) : null,
    [activities]
  )

  return (
    <Frame id="github-activity" className="scroll-mt-24">
      <FrameHeader label="GitHub Activity">
        <a
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          @{GITHUB_USERNAME}
          <ArrowUpRight className="size-3" />
        </a>
      </FrameHeader>

      {activities && activities.length > 0 && stats ? (
        <FrameBody className="p-0">
          <div className="grid lg:grid-cols-[15rem_1fr]">
            {/* Left Column: Stat Cards (Memoized, completely isolated from cell hovers) */}
            <div className="grid grid-cols-2 gap-px border-b border-border bg-border lg:border-r lg:border-b-0">
              <StatCell
                icon={GitCommitHorizontal}
                label="Contributions"
                numericValue={stats.total}
                hint="in the current year"
                isActive={highlightedType === 'contributions'}
                highlightKey="contributions"
                onHighlightChange={handleHighlightChange}
              />
              <StatCell
                icon={CalendarDays}
                label="Active days"
                numericValue={stats.activeDays}
                hint="days with a commit"
                isActive={highlightedType === 'active'}
                highlightKey="active"
                onHighlightChange={handleHighlightChange}
              />
              <StatCell
                icon={Flame}
                label="Current streak"
                numericValue={stats.currentStreak}
                hint={`best ${stats.bestStreak} days`}
                isActive={highlightedType === 'streak'}
                highlightKey="streak"
                onHighlightChange={handleHighlightChange}
              />
              <StatCell
                icon={Flame}
                label="Peak day"
                numericValue={stats.bestDay.count}
                hint={
                  stats.bestDay.date
                    ? format(parseDateClean(stats.bestDay.date), 'dd MMM')
                    : '—'
                }
                isActive={highlightedType === 'peak'}
                highlightKey="peak"
                onHighlightChange={handleHighlightChange}
              />
            </div>

            {/* Right Column: Dynamic HUD & Fast Contribution Grid */}
            <div className="flex flex-col justify-center gap-4 p-4 sm:p-6 min-w-0 w-full overflow-hidden">
              <TelemetryHUD
                hoveredActivity={hoveredActivity}
                activeFilterLevel={activeFilterLevel}
                highlightedType={highlightedType}
                stats={stats}
                onResetFilter={handleResetFilter}
              />

              <ContributionGraphPanel
                activities={activities}
                stats={stats}
                activeFilterLevel={activeFilterLevel}
                onFilterLevelChange={setActiveFilterLevel}
                highlightedType={highlightedType}
                onActivityHover={setHoveredActivity}
              />
            </div>
          </div>
        </FrameBody>
      ) : (
        <FrameBody>
          {failed ? (
            <p className="text-sm text-muted-foreground">
              Couldn&apos;t load GitHub activity right now.{' '}
              <a
                className="text-foreground underline decoration-current/30 underline-offset-2 transition-colors hover:decoration-current"
                href={GITHUB_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                View the profile on GitHub
              </a>
              .
            </p>
          ) : (
            <div className="py-8">
              <div className="flex flex-col gap-3 opacity-60">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <div className="h-3 w-36 bg-muted-foreground/15" />
                  <div className="h-3 w-24 bg-muted-foreground/15" />
                </div>
                <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto py-2">
                  {Array.from({ length: 53 * 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="size-3 rounded-[1px] bg-muted-foreground/10"
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="h-2.5 w-44 bg-muted-foreground/15" />
                  <div className="h-2.5 w-28 bg-muted-foreground/15" />
                </div>
              </div>
            </div>
          )}
        </FrameBody>
      )}
    </Frame>
  )
}
