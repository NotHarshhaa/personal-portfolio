'use client'

import { data } from '@/constants'
import { ArrowUpRight } from 'lucide-react'
import { Frame, FrameBody, FrameHeader } from './frame'
import { HoverMark } from './hover-mark'

export function Career() {
  const { career } = data

  return (
    <section className="flex w-full flex-col gap-4 py-4 sm:py-6">
      <Frame>
        <FrameHeader label="Career / Experience" />
        <FrameBody className="py-10 sm:py-12">
          <h1 className="max-w-2xl font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
            Experience across platform engineering, cloud, and AI infrastructure.
          </h1>
        </FrameBody>
      </Frame>

      <Frame className="overflow-visible">
        <ul>
          {career.map((item, index) => (
            <HoverMark
              as="li"
              key={item.company}
              label={item.link ? 'Open link' : undefined}
              disabled={!item.link}
              className={
                index < career.length - 1 ? 'border-b border-border' : undefined
              }
            >
              <div className="grid gap-6 px-4 py-8 sm:grid-cols-[11rem_1fr] sm:gap-10 sm:px-6 sm:py-10">
                <div>
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-base font-medium"
                    >
                      {item.company}
                      <ArrowUpRight className="size-3.5 opacity-40" />
                    </a>
                  ) : (
                    <p className="text-base font-medium">{item.company}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.badges.join(' · ')}
                  </p>
                </div>

                <div className="space-y-8">
                  {item.jobs.map((job, i) => (
                    <div key={i}>
                      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                        <h2 className="text-base font-medium">{job.title}</h2>
                        <p className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                          {job.start} — {job.end}
                        </p>
                      </div>
                      <ul className="space-y-2">
                        {job.description.map((line, j) => (
                          <li
                            key={j}
                            className="text-sm leading-relaxed text-muted-foreground"
                          >
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </HoverMark>
          ))}
        </ul>
      </Frame>
    </section>
  )
}
