import { createClient } from "@/lib/supabase/server"
import { ProductList } from "@/components/admin/product-list"
import { redirect } from "next/navigation"

export default async function AdminProductsPage() {
  const supabase = await createClient()

  // Check authentication and admin role
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    redirect("/")
  }

  // Fetch products and categories
  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      base_price,
      inventory_quantity,
      is_active,
      is_featured,
      created_at,
      categories (
        name
      ),
      product_images (
        image_url,
        is_primary
      )
    `)
    .order("created_at", { ascending: false })
    .limit(50)

  const { data: categories } = await supabase.from("categories").select("id, name").eq("is_active", true).order("name")

  return (
    <div className="container max-w-screen-xl px-4 py-8">
      <ProductList initialProducts={products || []} categories={categories || []} />
    </div>
  )
}
