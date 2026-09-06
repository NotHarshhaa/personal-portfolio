import { Metadata } from 'next'
import { Section } from '@/components/_custom/section'
import { ArchitectureStudio } from '@/components/architecture/architecture-studio'

export const metadata: Metadata = {
  title: 'Architecture Lab | HARSHHAA',
  description:
    'Interactive systems architecture lab featuring Enterprise GitOps IDPs, Agentic MCP platforms, Production LLMOps pipelines, and Cloud IaC topologies with live packet flow simulations and manifest inspectors.'
}

export default function ArchitecturePage() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <Section id="architecture-lab" className="w-full !mx-0 !max-w-none pb-16">
        <ArchitectureStudio />
      </Section>
    </div>
  )
}
