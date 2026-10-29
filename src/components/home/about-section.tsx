import { Link } from 'next-view-transitions'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { Frame, FrameHeader } from '@/components/frame'
import { data } from '@/constants'
import { Pillars } from './pillars'
import { Reveal } from '@/components/ui/reveal'

/** About section: a short narrative, expandable deep-dive, impact note and pillars. */
export function AboutSection() {
  const { about, links } = data
  const paragraphs = about.description
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

  const [intro, ...deepDive] = paragraphs
  const github = links.find(link => link.title === 'GitHub')

  return (
    <Reveal>
      <Frame id="about" className="scroll-mt-24">
        <FrameHeader label="About.">
          <Link
            href="/career"
            className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            Career timeline
            <ArrowUpRight className="size-3" />
          </Link>
        </FrameHeader>

        <div className="grid lg:grid-cols-[1.45fr_0.55fr]">
          <div className="border-b border-border p-5 sm:p-7 lg:border-r lg:border-b-0 lg:p-8">
            <p className="font-heading max-w-2xl text-lg leading-relaxed tracking-tight text-balance sm:text-xl">
              {intro}
            </p>

            <details className="group mt-6 border-t border-border pt-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
                <span>Full engineering profile</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-muted-foreground/50 group-open:hidden">
                    expand
                  </span>
                  <span className="hidden text-muted-foreground/50 group-open:inline">
                    collapse
                  </span>
                  <ChevronDown className="size-3.5 transition-transform duration-200 group-open:rotate-180" />
                </span>
              </summary>

              <div className="mt-4 space-y-3 border-l border-border pl-4">
                {deepDive.map(paragraph => (
                  <p
                    key={paragraph.slice(0, 24)}
                    className="text-sm leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </details>
          </div>

          <aside className="bg-background bg-hatch flex flex-col justify-between gap-8 p-5 sm:p-6">
            <div>
              <p className="font-mono text-[9px] tracking-[0.18em] text-signal uppercase">
                Open-source impact
              </p>
              <p className="font-heading mt-3 text-5xl font-semibold tracking-tight tabular-nums">
                250K+
              </p>
              <p className="mt-2 max-w-[22ch] text-sm leading-relaxed text-muted-foreground">
                engineers reached through 40+ production blueprints, docs, and
                developer tooling.
              </p>
            </div>

            {github && (
              <a
                href={github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-between gap-3 border-t border-border pt-4 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                <span>Explore the repositories</span>
                <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
              </a>
            )}
          </aside>
        </div>

        <Pillars />
      </Frame>
    </Reveal>
  )
}
