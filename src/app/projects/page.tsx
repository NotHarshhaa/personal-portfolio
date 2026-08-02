import { Suspense } from 'react'
import { Section } from '@/components/_custom/section'
import { Loader } from '@/components/_custom/loader'
import { ProjectsWithSearch } from '@/components/projects-with-search'

export default function ProjectsPage() {
  return (
    <Section id="projects" className="pb-16">
      <Suspense fallback={<Loader />}>
        <ProjectsWithSearch />
      </Suspense>
    </Section>
  )
}
