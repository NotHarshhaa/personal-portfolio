import { ArrowUpRight } from 'lucide-react'
import { Frame, FrameHeader } from '@/components/frame'
import { Reveal } from '@/components/ui/reveal'
import { data } from '@/constants'
import { LINK_DESCRIPTIONS } from '@/data/personal'

const PRIMARY = ['GitHub', 'LinkedIn', 'Blog', 'Telegram', 'Resume']

/** External profiles presented as a connected strip of index cards. */
export function ConnectSection() {
  const links = data.links.filter(link => PRIMARY.includes(link.title))

  return (
    <Reveal>
      <Frame>
        <FrameHeader label="Elsewhere.">
          <span className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            select network
          </span>
        </FrameHeader>

        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-5">
          {links.map(link => {
            const Icon = link.icon

            return (
              <a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-6 bg-background p-4 transition-colors hover:bg-muted/25 sm:col-span-1 sm:p-5 sm:last:col-span-2 lg:last:col-span-1"
              >
                <div className="flex items-start justify-between">
                  <span className="flex size-8 items-center justify-center border border-border bg-background transition-colors group-hover:border-foreground/30">
                    <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </span>
                  <ArrowUpRight className="size-3.5 text-muted-foreground/40 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal group-hover:opacity-100" />
                </div>

                <div>
                  <p className="text-sm font-medium transition-colors group-hover:text-signal">
                    {link.title}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                    {LINK_DESCRIPTIONS[link.title] ?? 'Open profile'}
                  </p>
                </div>
              </a>
            )
          })}
        </div>
      </Frame>
    </Reveal>
  )
}
