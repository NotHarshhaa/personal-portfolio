import { Hero } from '@/components/hero'
import { AboutSection } from '@/components/home/about-section'
import { FocusSection } from '@/components/home/focus-section'
import { ConnectSection } from '@/components/home/connect-section'
import { GitHubActivity } from '@/components/github-activity'
import { SkillsCategorized } from '@/components/skills-categorized'
import { ArchitectureDiagrams } from '@/components/architecture-diagrams'
import { FeaturedProjects } from '@/components/home/featured-projects'
import { LearningHub } from '@/components/home/learning-hub'

export default function Home() {
  return (
    <>
      <Hero />
      <section className="flex w-full flex-col gap-4 overflow-x-clip pb-4 sm:gap-5">
        <AboutSection />
        <FeaturedProjects />
        <FocusSection />
        <ConnectSection />
        <GitHubActivity />
        <SkillsCategorized />
        <ArchitectureDiagrams />
        <LearningHub />
      </section>
    </>
  )
}
