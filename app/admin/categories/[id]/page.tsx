import { createClient } from "@/lib/supabase/server"
import { CategoryForm } from "@/components/admin/category-form"
import { redirect, notFound } from "next/navigation"
import { updateCategory } from "@/lib/actions/category-actions"

interface EditCategoryPageProps {
  params: {
    id: string
  }
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
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

  // Fetch the category to edit
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("id", params.id)
    .single()

  if (categoryError || !category) {
    notFound()
  }

  // Fetch existing categories for parent selection
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name")

  // Create bound action with category ID
  const updateCategoryWithId = updateCategory.bind(null, params.id)

  return (
    <div className="container max-w-screen-xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold mb-2">Edit Category</h1>
        <p className="text-muted-foreground">Update category information and settings.</p>
      </div>

      <CategoryForm category={category} categories={categories || []} action={updateCategoryWithId} />
    </div>
  )
}
