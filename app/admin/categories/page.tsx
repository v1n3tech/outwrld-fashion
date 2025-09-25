import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Eye } from "lucide-react"

export default async function CategoriesPage() {
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

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
  }

  const productCounts: Record<string, number> = {}
  if (categories) {
    for (const category of categories) {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id)
      productCounts[category.id] = count || 0
    }
  }

  return (
    <div className="container max-w-screen-xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-2">Categories</h1>
          <p className="text-muted-foreground">Manage your product categories and organization.</p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>

      {categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="font-display text-lg mb-1">{category.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">/{category.slug}</p>
                  </div>
                  <Badge variant={category.is_active ? "default" : "secondary"}>
                    {category.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.image_url && (
                  <img
                    src={category.image_url || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-32 object-cover rounded border"
                  />
                )}

                {category.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Products: {productCounts[category.id] || 0}</span>
                  <span>Order: {category.sort_order}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                    <Link href={`/admin/categories/${category.id}`}>
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/categories/${category.slug}`}>
                      <Eye className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold mb-2">No categories yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first category to start organizing your products.
                </p>
                <Button asChild>
                  <Link href="/admin/categories/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Category
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
