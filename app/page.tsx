import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { NewsletterSection } from "@/components/newsletter-section"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch active slider images
  const { data: sliderImages } = await supabase
    .from("hero_slider")
    .select("*")
    .eq("is_active", true)
    .order("position", { ascending: true })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection sliderImages={sliderImages || []} />
        <FeaturedProducts />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}
