'use client'

import { ContactForm } from '@/components/contact-form'
import { data } from '@/constants'
import {
  ArrowUpRight,
  Clock as ClockIcon,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Send
} from 'lucide-react'
import { Frame, FrameBody, FrameHeader, CornerHeading } from './frame'
import { Clock } from './ui/clock'
import { CopyButton } from './ui/copy-button'
import { IconBox } from './ui/icon-box'

const contactIcons: Record<string, typeof Mail> = {
  Email: Mail,
  GitHub: Github,
  LinkedIn: Linkedin,
  Telegram: Send
}

const EMAIL = 'harshhaa03@gmail.com'

export function Contact() {
  const { links } = data
  const contactLinks = links.filter((l) =>
    ['Email', 'LinkedIn', 'Telegram', 'GitHub'].includes(l.title)
  )

  return (
    <section className="flex w-full flex-col gap-4 py-4 sm:py-6">
      <Frame>
        <FrameHeader label="Contact" />
        <FrameBody className="py-8 sm:py-10">
          <CornerHeading size="lg" className="w-fit max-w-3xl px-3 py-2 sm:px-4 sm:py-3">
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
              Let&apos;s build platforms and agentic systems.
            </h1>
          </CornerHeading>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            Open to collaborations on cloud platforms, AI infrastructure, IDPs,
            and agentic AI systems.
          </p>
        </FrameBody>
      </Frame>

      <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
        <Frame>
          <FrameHeader label="Direct" />
          <FrameBody>
            <ul className="space-y-3">
              {contactLinks.map((link) => {
                const Icon = contactIcons[link.title]
                const isEmail = link.title === 'Email'
                return (
                  <li key={link.title} className="group flex items-center gap-3">
                    <IconBox>
                      {Icon && <Icon className="size-3.5" />}
                    </IconBox>
                    <a
                      href={link.url}
                      target={isEmail ? undefined : '_blank'}
                      rel={isEmail ? undefined : 'noopener noreferrer'}
                      className="text-sm transition-colors hover:text-signal"
                    >
                      {isEmail ? EMAIL : link.title}
                    </a>
                    {isEmail && <CopyButton text={EMAIL} />}
                    {!isEmail && (
                      <ArrowUpRight className="size-3 shrink-0 opacity-40 transition-opacity group-hover:opacity-100" />
                    )}
                  </li>
                )
              })}
            </ul>

            <div className="border-border mt-5 space-y-3 border-t pt-5">
              <div className="flex items-center gap-3">
                <IconBox>
                  <MapPin className="size-3.5" />
                </IconBox>
                <span className="text-sm">Hyderabad, India</span>
              </div>
              <div className="flex items-center gap-3">
                <IconBox>
                  <ClockIcon className="size-3.5" />
                </IconBox>
                <Clock
                  timeZone="Asia/Kolkata"
                  className="text-sm tabular-nums"
                />
                <span className="text-xs text-muted-foreground">IST</span>
              </div>
            </div>
          </FrameBody>
        </Frame>

        <Frame>
          <FrameHeader label="Message" />
          <FrameBody>
            <ContactForm />
          </FrameBody>
        </Frame>
      </div>
    </section>
  )
}
