import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AboutHero } from "@/components/about/about-hero"
import { AboutStory } from "@/components/about/about-story"
import { AboutValues } from "@/components/about/about-values"
import { AboutFounder } from "@/components/about/about-founder"
import { AboutSocial } from "@/components/about/about-social"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <AboutHero />
        <AboutStory />
        <AboutFounder />
        <AboutValues />
        <AboutSocial />
      </main>
      <Footer />
    </div>
  )
}
