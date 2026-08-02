'use client'

import { ContactForm } from '@/components/contact-form'
import { data } from '@/constants'
import { ArrowUpRight } from 'lucide-react'
import { Frame, FrameBody, FrameHeader } from './frame'

export function Contact() {
  const { links } = data
  const contactLinks = links.filter((l) =>
    ['Email', 'LinkedIn', 'Telegram', 'GitHub'].includes(l.title)
  )

  return (
    <section className="flex w-full flex-col gap-4 py-4 sm:py-6">
      <Frame>
        <FrameHeader label="Contact" />
        <FrameBody className="py-10 sm:py-12">
          <h1 className="max-w-2xl font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
            Let&apos;s build platforms and agentic systems.
          </h1>
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
              {contactLinks.map((link) => (
                <li key={link.title}>
                  <a
                    href={link.url}
                    target={link.title === 'Email' ? undefined : '_blank'}
                    rel={
                      link.title === 'Email'
                        ? undefined
                        : 'noopener noreferrer'
                    }
                    className="inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-60"
                  >
                    {link.title}
                    <ArrowUpRight className="size-3 opacity-40" />
                  </a>
                </li>
              ))}
            </ul>
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
