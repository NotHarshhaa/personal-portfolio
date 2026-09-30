'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
  type Activity
} from '@/components/ui/contribution-graph'
import { Frame, FrameBody, FrameHeader } from './frame'
import { ArrowUpRight } from 'lucide-react'

const GITHUB_USERNAME = 'NotHarshhaa'
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`
const CONTRIBUTIONS_API = 'https://github-contributions-api.jogruber.de'

export function GitHubActivity() {
  const [activities, setActivities] = useState<Activity[] | null>(null)
  const [failed, setFailed] = useState(false)

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

        if (!res.ok) throw new Error(`GitHub contributions API error: ${res.status}`)
        const data = await res.json()
        if (!cancelled) setActivities(data.contributions ?? [])
      } catch {
        // On fetch failure (timeout, network error, etc.) show the fallback message
        if (!cancelled) setFailed(true)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Frame>
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
      <FrameBody>
        {activities && activities.length > 0 ? (
          <ContributionGraph
            className="mx-auto py-2"
            data={activities}
            blockSize={12}
            blockMargin={3}
            blockRadius={1}
          >
            <ContributionGraphCalendar
              className="px-2"
              title="GitHub Contributions"
            >
              {({ activity, dayIndex, weekIndex }) => (
                <ContributionGraphBlock
                  activity={activity}
                  dayIndex={dayIndex}
                  weekIndex={weekIndex}
                >
                  <title>{`${activity.count} contribution${activity.count !== 1 ? 's' : ''} on ${format(new Date(activity.date), 'dd MMM yyyy')}`}</title>
                </ContributionGraphBlock>
              )}
            </ContributionGraphCalendar>

            <ContributionGraphFooter className="px-2">
              <ContributionGraphTotalCount>
                {({ totalCount, year }) => (
                  <div className="text-sm text-muted-foreground">
                    {totalCount.toLocaleString('en')} contributions in {year} on{' '}
                    <a
                      className="text-foreground underline decoration-current/30 underline-offset-2 transition-colors hover:decoration-current"
                      href={GITHUB_PROFILE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                    .
                  </div>
                )}
              </ContributionGraphTotalCount>

              <ContributionGraphLegend />
            </ContributionGraphFooter>
          </ContributionGraph>
        ) : failed ? (
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
          <div className="font-mono flex h-40 w-full items-center justify-center text-xs text-muted-foreground">
            loading github activity…
          </div>
        )}
      </FrameBody>
    </Frame>
  )
}
