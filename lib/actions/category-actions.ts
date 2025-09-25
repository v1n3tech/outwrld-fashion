"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createCategory(formData: FormData) {
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

  // Extract form data
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const slug = formData.get("slug") as string
  const parent_id = (formData.get("parent_id") as string) || null
  const image_url = (formData.get("image_url") as string) || null
  const sort_order = Number.parseInt(formData.get("sort_order") as string) || 0
  const is_active = formData.get("is_active") === "true"

  try {
    // Create category
    const { data: category, error } = await supabase
      .from("categories")
      .insert({
        name,
        description,
        slug,
        parent_id,
        image_url,
        sort_order,
        is_active,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    revalidatePath("/admin/categories")
    redirect("/admin/categories")
  } catch (error) {
    console.error("Error creating category:", error)
    throw new Error("Failed to create category")
  }
}

export async function updateCategory(id: string, formData: FormData) {
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

  // Extract form data
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const slug = formData.get("slug") as string
  const parent_id = (formData.get("parent_id") as string) || null
  const image_url = (formData.get("image_url") as string) || null
  const sort_order = Number.parseInt(formData.get("sort_order") as string) || 0
  const is_active = formData.get("is_active") === "true"

  try {
    // Update category
    const { data: category, error } = await supabase
      .from("categories")
      .update({
        name,
        description,
        slug,
        parent_id,
        image_url,
        sort_order,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw error
    }

    revalidatePath("/admin/categories")
    redirect("/admin/categories")
  } catch (error) {
    console.error("Error updating category:", error)
    throw new Error("Failed to update category")
  }
}

export async function deleteCategory(id: string) {
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

  try {
    // Check if category has products
    const { data: products } = await supabase.from("products").select("id").eq("category_id", id).limit(1)

    if (products && products.length > 0) {
      throw new Error("Cannot delete category with existing products")
    }

    // Delete category
    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) {
      throw error
    }

    revalidatePath("/admin/categories")
  } catch (error) {
    console.error("Error deleting category:", error)
    throw new Error("Failed to delete category")
  }
}
