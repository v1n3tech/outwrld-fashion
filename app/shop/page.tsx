import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"

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
  categories: {
    name: string
    slug: string
  } | null
}

export default async function ShopPage() {
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
      ),
      categories (
        name,
        slug
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("sort_order")

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container max-w-screen-xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-primary">SHOP</span> <span className="text-foreground">COLLECTION</span>
          </h1>
          <p className="text-foreground/70 max-w-2xl">
            Discover our complete range of avant-garde streetwear pieces that blend Nigerian cultural heritage with
            contemporary urban style.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-card rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-foreground/60" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>

          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-foreground/60">
                Showing {products.length} product{products.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="font-display text-xl font-semibold mb-2">No Products Found</h3>
            <p className="text-foreground/60 mb-6">Check back soon for new arrivals.</p>
            <Button asChild>
              <a href="/">Return Home</a>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
