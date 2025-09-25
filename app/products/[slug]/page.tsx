import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProductGallery } from "@/components/product-gallery"
import { ProductInfo } from "@/components/product-info"
import { RelatedProducts } from "@/components/related-products"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      description,
      short_description,
      base_price,
      compare_price,
      sku,
      inventory_quantity,
      material,
      care_instructions,
      tags,
      product_images (
        id,
        image_url,
        alt_text,
        position,
        is_primary
      ),
      product_variants (
        id,
        name,
        sku,
        price,
        inventory_quantity,
        variant_options (
          option_name,
          option_value
        )
      ),
      categories (
        name,
        slug
      )
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container max-w-screen-xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductGallery images={product.product_images} productName={product.name} />
          <ProductInfo product={product} />
        </div>

        <RelatedProducts currentProductId={product.id} categoryId={product.categories?.slug} />
      </main>

      <Footer />
    </div>
  )
}
