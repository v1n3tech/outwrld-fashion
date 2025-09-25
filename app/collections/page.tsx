import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CollectionGrid } from "@/components/collections/collection-grid"
import { CollectionHero } from "@/components/collections/collection-hero"

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <CollectionHero />
        <CollectionGrid />
      </main>
      <Footer />
    </div>
  )
}
