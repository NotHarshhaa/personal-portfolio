'use client'

import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ExternalLink, MapPinIcon, CalendarIcon, UsersIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './ui/card'
import { type CareerProps } from '@/types'

export function CareerItem({ link, company, jobs, badges }: CareerProps) {
  return (
    <div className="group relative ps-0 pb-0 sm:ps-8">
      <div className="absolute mt-3 -start-[9px] hidden size-3 border-2 border-background bg-foreground ring-4 ring-border sm:block" />

      <Card>
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center bg-muted">
                <span className="font-heading text-sm font-semibold tracking-wider">
                  {company.charAt(0)}
                </span>
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl">{company}</CardTitle>
                <CardDescription className="mt-1 flex items-center gap-2">
                  <MapPinIcon className="size-4" />
                  Remote/On-site
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary">{badges}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-4 sm:space-y-5">
            {jobs.map((job, jobIndex) => (
              <div key={jobIndex} className="space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="size-4 text-muted-foreground" />
                    <h4 className="font-heading text-base font-semibold tracking-wider uppercase sm:text-lg">
                      {job.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground sm:text-sm">
                    <CalendarIcon className="size-3" />
                    <span>
                      {job.start} — {job.end}
                    </span>
                  </div>
                </div>
                <ul className="list-disc space-y-1.5 pl-4 text-xs text-muted-foreground marker:text-muted-foreground sm:pl-8 sm:text-sm">
                  {job.description.map((item, i) => (
                    <li key={i} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {link && (
            <div className="border-t border-border pt-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  View Company Profile
                  <ExternalLink className="size-3.5 sm:size-4" />
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
