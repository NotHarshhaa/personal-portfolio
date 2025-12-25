import { Section } from '@/components/ui/section'
import { Contact } from '@/components/contact'

export default function ContactPage() {
  return (
    <div className='flex flex-col flex-1 items-center'>
      <Section id='contact' className='pb-24 w-full px-4 md:px-0'>
        <Contact />
      </Section>
    </div>
  )
}
