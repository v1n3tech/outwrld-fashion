import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"

interface RelatedProductsProps {
  currentProductId: string
  categoryId?: string | null
}

export async function RelatedProducts({ currentProductId, categoryId }: RelatedProductsProps) {
  const supabase = await createClient()

  let query = supabase
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
    .eq("is_active", true)
    .neq("id", currentProductId)
    .limit(4)

  // If we have a category, try to get products from the same category first
  if (categoryId) {
    query = query.eq("categories.slug", categoryId)
  }

  const { data: products } = await query

  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="mt-16 pt-16 border-t border-border">
      <div className="mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
          <span className="text-primary">YOU MIGHT</span> <span className="text-foreground">ALSO LIKE</span>
        </h2>
        <p className="text-foreground/70">Discover more pieces from our collection that complement your style.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
