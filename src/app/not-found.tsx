'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Frame, FrameBody, FrameHeader, CornerHeading } from '@/components/frame'

export default function NotFound() {
  return (
    <section className="flex w-full flex-col gap-4 py-4 sm:py-6">
      <Frame>
        <FrameHeader label="Error / 404" />
        <FrameBody className="py-12 sm:py-16">
          <CornerHeading size="lg" className="mb-4 inline-block px-3 py-2 sm:px-4 sm:py-3">
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-5xl">
              Page not found
            </h1>
          </CornerHeading>
          <p className="mb-8 max-w-md text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/">Go home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/projects">Projects</Link>
            </Button>
          </div>
        </FrameBody>
      </Frame>
    </section>
  )
}
