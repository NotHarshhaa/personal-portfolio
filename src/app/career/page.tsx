import { Section } from '@/components/ui/section'
import { Career } from '@/components/career'

export default function CareerPage() {
  return (
    <div className='flex flex-col flex-1 items-center px-2 md:px-8 lg:px-12 xl:px-16'>
      <Section id='career' className='pb-24 w-full !max-w-none !mx-0'>
        <Career />
      </Section>
    </div>
  )
}
