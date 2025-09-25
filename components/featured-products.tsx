import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  short_description: string | null
  base_price: number
  compare_price: number | null
  product_images: Array<{
    image_url: string
    alt_text: string | null
    is_primary: boolean
  }>
}

export async function FeaturedProducts() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      short_description,
      base_price,
      compare_price,
      product_images (
        image_url,
        alt_text,
        is_primary
      )
    `)
    .eq("is_featured", true)
    .eq("is_active", true)
    .limit(4)

  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-screen-xl px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div className="space-y-4">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-balance">
              <span className="text-primary">FEATURED</span> <span className="text-foreground">COLLECTION</span>
            </h2>
            <p className="text-foreground/70 max-w-2xl text-pretty">
              Discover our most popular pieces that define the Outwrld aesthetic. Each item represents our commitment to
              quality and cultural authenticity.
            </p>
          </div>

          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            asChild
          >
            <Link href="/shop">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
