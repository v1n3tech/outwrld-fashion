import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const collections = [
  {
    id: 1,
    name: "Heritage Series",
    description: "Traditional Nigerian patterns reimagined for modern streetwear",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop",
    itemCount: 24,
    slug: "heritage-series",
  },
  {
    id: 2,
    name: "Urban Edge",
    description: "Minimalist designs with bold architectural influences",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=800&fit=crop",
    itemCount: 18,
    slug: "urban-edge",
  },
  {
    id: 3,
    name: "Afrofuturism",
    description: "Futuristic aesthetics celebrating African innovation",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop",
    itemCount: 15,
    slug: "afrofuturism",
  },
  {
    id: 4,
    name: "Lagos Nights",
    description: "Vibrant pieces inspired by Nigeria's bustling nightlife",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop",
    itemCount: 21,
    slug: "lagos-nights",
  },
  {
    id: 5,
    name: "Sustainable Essentials",
    description: "Eco-conscious basics crafted from premium sustainable materials",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
    itemCount: 12,
    slug: "sustainable-essentials",
  },
  {
    id: 6,
    name: "Limited Drops",
    description: "Exclusive releases and collaborative pieces",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=800&fit=crop",
    itemCount: 8,
    slug: "limited-drops",
  },
]

export function CollectionGrid() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Card
              key={collection.id}
              className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display text-2xl font-bold text-white mb-2">{collection.name}</h3>
                  <p className="text-gray-200 text-sm mb-3 line-clamp-2">{collection.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-mono text-sm">{collection.itemCount} pieces</span>
                    <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                      <Link href={`/shop?collection=${collection.slug}`}>Explore</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
