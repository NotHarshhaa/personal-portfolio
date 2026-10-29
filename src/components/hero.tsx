'use client'

import { Link } from 'next-view-transitions'
import { ArrowUpRight, FileDown } from 'lucide-react'
import { Button } from './ui/button'
import {
  Frame,
  FrameBody,
  FrameHeader,
  CornerBadge,
  SectionTicks
} from './frame'
import { FlipWords } from './flip-words'
import { ViewsBadge } from './views-badge'
import { PipelineBanner } from './pipeline-banner'
import { Magnet } from './ui/magnet'
import { Reveal } from './ui/reveal'
import { data } from '../constants'
import { IMPACT_STATS, LINK_DESCRIPTIONS } from '../data/personal'
import { IdentityCard } from './home/identity-card'

const SOCIALS = ['GitHub', 'LinkedIn', 'Blog']

export function Hero() {
  const { avatar, about, links, specialties } = data

  const socials = links.filter((link) => SOCIALS.includes(link.title))
  const resume = links.find((link) => link.title === 'Resume')

  return (
    <section className="relative flex w-full flex-col gap-4 py-4 sm:gap-5 sm:py-6">
      {/* Blueprint banner strip, flush-connected to the hero frame below */}
      <div className="flex flex-col">
        <div className="bg-dot-grid border-border bg-background relative flex h-24 w-full shrink-0 items-center justify-center overflow-hidden border sm:h-28">
          <SectionTicks />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/70"
          />
          <span className="absolute top-2 left-3 hidden font-mono text-[9px] tracking-[0.16em] text-muted-foreground/35 uppercase sm:inline">
            sys / portfolio
          </span>
          <span className="absolute top-2 right-3 hidden font-mono text-[9px] tracking-[0.16em] text-muted-foreground/35 uppercase sm:inline">
            rev 2026.10
          </span>
          <span
            aria-hidden
            className="font-mono absolute bottom-1.5 left-3 hidden text-[10px] tracking-[0.14em] text-muted-foreground/40 sm:inline"
          >
            {'// harshhaa.pipeline'}
          </span>
          <span
            aria-hidden
            className="font-mono absolute right-3 bottom-1.5 hidden text-[10px] tracking-[0.14em] text-muted-foreground/40 sm:inline"
          >
            status: operational
          </span>
          <PipelineBanner />
        </div>

        <Frame className="border-t-0">
          <FrameHeader label="Portfolio / Home">
            <ViewsBadge />
          </FrameHeader>

          <FrameBody className="p-0">
            <div className="grid lg:grid-cols-[1.45fr_0.55fr]">
              <Reveal className="p-5 sm:p-8 lg:p-10 xl:p-12">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="inline-flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-500/5 px-2 py-1 font-mono text-[9px] tracking-[0.16em] text-emerald-700 uppercase dark:text-emerald-400">
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                    </span>
                    available for work
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.16em] text-muted-foreground/60 uppercase">
                    Hyderabad, IN · UTC+5:30
                  </span>
                </div>

                <h1 className="font-heading mt-5 text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.92] font-semibold tracking-[-0.045em]">
                  Hey, I&apos;m
                  <br />
                  <span className="text-signal">Harshhaa</span>
                  <span className="text-muted-foreground/30">.</span>
                </h1>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-mono text-sm text-muted-foreground/40">
                    /
                  </span>
                  <div className="font-heading text-xl font-medium tracking-tight text-muted-foreground sm:text-2xl">
                    <FlipWords words={about.roles ?? [about.role]} />
                  </div>
                </div>

                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {about.headline}
                </p>

                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {specialties.map((item) => (
                    <li
                      key={item}
                      className="border border-border/80 px-2 py-1 font-mono text-[9px] tracking-[0.1em] text-muted-foreground uppercase transition-colors hover:border-foreground/40 hover:text-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Magnet padding={40} magnetStrength={3}>
                    <Button asChild>
                      <Link href="/projects" className="group/cta">
                        Explore the work
                        <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                      </Link>
                    </Button>
                  </Magnet>
                  <Magnet padding={40} magnetStrength={3}>
                    <Button variant="outline" asChild>
                      <Link href="/contact" className="group/cta-alt">
                        Start a conversation
                        <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover/cta-alt:translate-x-0.5 group-hover/cta-alt:-translate-y-0.5" />
                      </Link>
                    </Button>
                  </Magnet>

                  <div className="ml-1 flex items-center gap-1.5">
                    {socials.map((link) => {
                      const Icon = link.icon
                      return (
                        <a
                          key={link.title}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.title}
                          title={`${link.title} — ${LINK_DESCRIPTIONS[link.title] ?? ''}`}
                          className="flex size-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-muted/30 hover:text-foreground"
                        >
                          <Icon className="size-4" />
                        </a>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
                  {IMPACT_STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="group bg-background px-3 py-3 transition-colors hover:bg-muted/20"
                    >
                      <p className="font-heading text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">
                        {stat.value}
                      </p>
                      <p className="mt-0.5 font-mono text-[8px] leading-snug tracking-[0.1em] text-muted-foreground uppercase">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>

              <div className="relative border-t border-border p-5 sm:p-7 lg:border-t-0 lg:border-l lg:p-6 xl:p-8">
                <div className="sticky top-24 space-y-3">
                  <div className="flex items-center justify-between">
                    <CornerBadge className="text-[10px]">
                      Operator Profile
                    </CornerBadge>
                    <span className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground/50 uppercase">
                      live
                    </span>
                  </div>
                  <IdentityCard avatar={avatar} role="Platform & AI Engineer" />
                  {resume && (
                    <a
                      href={resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between border border-border px-3 py-2.5 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:border-foreground/40 hover:text-foreground"
                    >
                      <span className="inline-flex items-center gap-2">
                        <FileDown className="size-3.5" />
                        Download resume
                      </span>
                      <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </FrameBody>
        </Frame>
      </div>
    </section>
  )
}
