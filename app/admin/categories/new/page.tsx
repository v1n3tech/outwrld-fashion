import { createClient } from "@/lib/supabase/server"
import { CategoryForm } from "@/components/admin/category-form"
import { redirect } from "next/navigation"
import { createCategory } from "@/lib/actions/category-actions"

export default async function NewCategoryPage() {
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

  // Fetch existing categories for parent selection
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name")

  return (
    <div className="container max-w-screen-xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold mb-2">Add New Category</h1>
        <p className="text-muted-foreground">Create a new category to organize your products.</p>
      </div>

      <CategoryForm categories={categories || []} action={createCategory} />
    </div>
  )
}
