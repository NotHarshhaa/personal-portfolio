'use client'

import { Link } from 'next-view-transitions'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Frame, FrameBody, FrameHeader, CornerHeading, CornerBadge, Corners } from './frame'
import { ArchitectureDiagrams } from './architecture-diagrams'
import { data } from '../constants'
import { ArrowUpRight } from 'lucide-react'

export function Hero() {
  const {
    avatar,
    about,
    links,
    specialties,
    techStack,
    currentFocus,
    expertise,
    featuredProjects,
    learningHub
  } = data

  const aboutParagraphs = about.description
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const primaryLinks = links.filter((l) =>
    ['GitHub', 'LinkedIn', 'Blog', 'Telegram', 'Resume'].includes(l.title)
  )

  return (
      <section className="relative flex w-full flex-col gap-4 py-4 sm:gap-5 sm:py-6">
      <Frame>
          <FrameHeader label="Portfolio / Home">
            <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
              Platform
            </span>
          </FrameHeader>
          <FrameBody className="space-y-8 py-10 sm:py-14 md:py-16">
            <div className="flex items-center gap-4">
              <div className="relative inline-flex p-1">
                <Corners size="default" offset="none" weight="thin" light />
                <Avatar className="size-14 rounded-none border border-border after:rounded-none sm:size-16">
                  <AvatarImage
                    src="/assets/avatar.png"
                    alt={avatar.name}
                    className="rounded-none object-cover"
                  />
                  <AvatarFallback className="rounded-none bg-muted font-heading text-sm font-semibold tracking-wider">
                    {avatar.initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  Harshhaa Vardhan Reddy
                </p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {about.role}
                </p>
              </div>
            </div>

            <CornerHeading size="lg" className="w-fit max-w-4xl px-3 py-2 sm:px-4 sm:py-3">
              <h1 className="font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
                {about.headline}
              </h1>
            </CornerHeading>

            <ul className="flex flex-wrap gap-x-3 gap-y-2">
              {specialties.map((item) => (
                <li
                  key={item}
                  className="border border-border px-2.5 py-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase"
                >
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/projects">
                  View work
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact</Link>
              </Button>
            </div>
          </FrameBody>
        </Frame>

      <div className="grid gap-4 md:grid-cols-2">
        <Frame>
          <FrameHeader label="About" />
          <FrameBody className="space-y-4">
            {aboutParagraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="text-sm leading-relaxed text-muted-foreground sm:text-base"
              >
                {paragraph}
              </p>
            ))}
          </FrameBody>
        </Frame>

        <Frame>
          <FrameHeader label="Elsewhere" />
          <FrameBody className="py-5">
            <ul className="flex flex-col gap-3">
              {primaryLinks.map((link) => (
                <li key={link.title}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-foreground transition-opacity hover:opacity-60"
                  >
                    {link.title}
                    <ArrowUpRight className="size-3 opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </FrameBody>
        </Frame>
      </div>

      <Frame>
        <FrameHeader label="Tech Stack" />
        <FrameBody className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {techStack.map((group) => (
            <div key={group.label} className="space-y-3">
              <div>
                <CornerBadge className="text-[9px] sm:text-[10px]">
                  {group.label}
                </CornerBadge>
              </div>
              <ul className="space-y-1.5">
                {group.items.map((item) => (
                  <li key={item} className="text-xs sm:text-sm text-foreground/90">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </FrameBody>
      </Frame>

      <Frame>
        {/* Divided Header Bar */}
        <div className="grid grid-cols-2 border-b border-border">
          <div className="flex items-center justify-between border-r border-border px-3 py-2.5 sm:px-6 sm:py-3">
            <CornerBadge className="text-[9px] sm:text-[10px] md:text-[11px] truncate">
              Current Focus
            </CornerBadge>
            <span className="hidden sm:inline-flex text-[10px] font-mono text-muted-foreground/70 tabular-nums">
              {currentFocus.length} items
            </span>
          </div>

          <div className="flex items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3">
            <CornerBadge className="text-[9px] sm:text-[10px] md:text-[11px] truncate">
              Areas of Expertise
            </CornerBadge>
            <span className="hidden sm:inline-flex text-[10px] font-mono text-muted-foreground/70 tabular-nums">
              {expertise.length} items
            </span>
          </div>
        </div>

        {/* Divided Body: Side by Side on Mobile, Tablet & Desktop */}
        <div className="grid grid-cols-2 divide-x divide-border">
          {/* Current Focus Column */}
          <div className="p-3 sm:p-5 md:p-6">
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-x-4">
              {currentFocus.map((item) => (
                <li
                  key={item}
                  className="border-b border-border/50 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors flex items-start gap-1.5 leading-snug last:border-b-0 lg:odd:pr-3 lg:even:pl-3"
                >
                  <span className="text-foreground/40 select-none text-[10px] leading-tight pt-0.5">•</span>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas of Expertise Column */}
          <div className="p-3 sm:p-5 md:p-6">
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-x-4">
              {expertise.map((item) => (
                <li
                  key={item}
                  className="border-b border-border/50 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors flex items-start gap-1.5 leading-snug last:border-b-0 lg:odd:pr-3 lg:even:pl-3"
                >
                  <span className="text-foreground/40 select-none text-[10px] leading-tight pt-0.5">•</span>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Frame>

      <ArchitectureDiagrams />

      <Frame>
        <FrameHeader label="Featured Projects">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            All projects
            <ArrowUpRight className="size-3" />
          </Link>
        </FrameHeader>
        <FrameBody className="grid gap-8 lg:grid-cols-2">
          {featuredProjects.map((group) => (
            <div key={group.category} className="space-y-4">
              <div>
                <CornerBadge className="text-[10px]">
                  {group.category}
                </CornerBadge>
              </div>
              <ul className="divide-y divide-border border-y border-border">
                {group.items.map((project) => (
                  <li key={project.title}>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start justify-between gap-4 py-3 transition-opacity hover:opacity-70"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{project.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {project.description}
                        </p>
                      </div>
                      <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 opacity-40" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </FrameBody>
      </Frame>

      <Frame>
        <FrameHeader label="Learning Hub" />
        <FrameBody>
          <ul className="grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
            {learningHub.map((item) => (
              <li
                key={item.title}
                className="border-border sm:odd:border-r lg:[&:nth-child(3n)]:border-r-0 lg:border-r"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full flex-col justify-between gap-2 border-b border-border px-0 py-4 transition-opacity hover:opacity-70 sm:px-4"
                >
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <ArrowUpRight className="size-3.5 opacity-40" />
                </a>
              </li>
            ))}
          </ul>
        </FrameBody>
      </Frame>
    </section>
  )
}
