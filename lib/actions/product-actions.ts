"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function createProduct(formData: FormData) {
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
  const base_price = Number.parseFloat(formData.get("base_price") as string)
  const cost_price = Number.parseFloat(formData.get("cost_price") as string) || null
  const category_id = formData.get("category_id") as string
  const sku = formData.get("sku") as string
  const barcode = (formData.get("barcode") as string) || null
  const track_inventory = formData.get("track_inventory") === "true"
  const inventory_quantity = Number.parseInt(formData.get("inventory_quantity") as string) || 0
  const low_stock_threshold = Number.parseInt(formData.get("low_stock_threshold") as string) || 0
  const weight = Number.parseFloat(formData.get("weight") as string) || null
  const dimensions = (formData.get("dimensions") as string) || null
  const seo_title = (formData.get("seo_title") as string) || null
  const seo_description = (formData.get("seo_description") as string) || null
  const is_featured = formData.get("is_featured") === "true"
  const is_active = formData.get("is_active") === "true"
  const imagesData = formData.get("images") as string
  const images = imagesData ? JSON.parse(imagesData) : []

  const slug = generateSlug(name)

  if (!name || !sku || !category_id || isNaN(base_price)) {
    throw new Error("Missing required fields: name, sku, category_id, and base_price are required")
  }

  try {
    // Create product
    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        description,
        base_price,
        cost_price,
        category_id,
        sku,
        barcode,
        track_inventory,
        inventory_quantity,
        low_stock_threshold,
        weight,
        dimensions,
        seo_title,
        seo_description,
        is_featured,
        is_active,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    if (images.length > 0) {
      const imageInserts = images.map((image: any) => ({
        product_id: product.id,
        image_url: image.image_url,
        alt_text: image.alt_text,
        position: image.position,
        is_primary: image.is_primary,
      }))

      const { error: imageError } = await supabase.from("product_images").insert(imageInserts)

      if (imageError) {
        // Don't fail the entire operation for image errors
      }
    }

    revalidatePath("/admin/products")
  } catch (error) {
    throw new Error(`Failed to create product: ${error instanceof Error ? error.message : "Unknown error"}`)
  }

  redirect("/admin/products")
}
