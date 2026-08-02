import { Section } from '@/components/_custom/section'
import { Career } from '@/components/career'

export default function CareerPage() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <Section id="career" className="w-full !mx-0 !max-w-none pb-16">
        <Career />
      </Section>
    </div>
  )
}
