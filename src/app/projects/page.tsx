import { Suspense } from 'react'
import { Section } from '@/components/ui/section'
import { Loader } from '@/components/ui/loader'
import { ProjectsWithSearch } from '@/components/projects-with-search'

export default function ProjectsPage() {
  return (
    <div className='flex flex-col flex-1 w-full items-center'>
      <Section id='projects' className='pb-24 w-full px-4 md:px-0'>
        <Suspense fallback={<Loader />}>
          <ProjectsWithSearch />
        </Suspense>
      </Section>
    </div>
  )
}
