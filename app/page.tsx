import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import WorkGallery, { OrgActivities } from '@/components/WorkGallery'
import {
  AboutSection,
  AwardsSection,
  EducationSection,
  SkillsSection,
  PersonalSkillsSection,
} from '@/components/Sections'
import Contact from '@/components/Contact'
import FadeInSection from '@/components/FadeInSection'
import Intro from '@/components/Intro'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Intro />
      <Navbar />
      <Hero />
      <FadeInSection>
        <AboutSection />
      </FadeInSection>
      <FadeInSection>
        <EducationSection />
      </FadeInSection>
      <FadeInSection>
        <WorkGallery />
      </FadeInSection>
      <FadeInSection>
        <OrgActivities />
      </FadeInSection>
      <FadeInSection>
        <AwardsSection />
      </FadeInSection>
      <FadeInSection>
        <SkillsSection />
      </FadeInSection>
      <FadeInSection>
        <PersonalSkillsSection />
      </FadeInSection>
      <FadeInSection>
        <Contact />
      </FadeInSection>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-[var(--card-border)]">
        <p className="text-[var(--muted)] text-sm">
          © {new Date().getFullYear()} Alma Kiara All rights reserved.
        </p>
      </footer>
    </main>
  )
}
