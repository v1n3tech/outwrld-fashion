import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    const offset = (page - 1) * limit

    let query = supabase
      .from("products")
      .select(`
        *,
        categories (
          id,
          name,
          slug
        ),
        product_images (
          id,
          image_url,
          alt_text,
          is_primary
        ),
        product_variants (
          id,
          name,
          price,
          inventory_quantity
        )
      `)
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false })

    if (category) {
      query = query.eq("category_id", category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (status === "active") {
      query = query.eq("is_active", true)
    } else if (status === "inactive") {
      query = query.eq("is_active", false)
    }

    const { data: products, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Get total count for pagination
    let countQuery = supabase.from("products").select("*", { count: "exact", head: true })

    if (category) {
      countQuery = countQuery.eq("category_id", category)
    }

    if (search) {
      countQuery = countQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (status === "active") {
      countQuery = countQuery.eq("is_active", true)
    } else if (status === "inactive") {
      countQuery = countQuery.eq("is_active", false)
    }

    const { count } = await countQuery

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || !["admin", "super_admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const {
      name,
      slug,
      description,
      short_description,
      category_id,
      base_price,
      compare_price,
      sku,
      inventory_quantity,
      material,
      care_instructions,
      tags,
      is_featured,
      is_active,
      images,
      variants,
    } = body

    // Create product
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        description,
        short_description,
        category_id,
        base_price,
        compare_price,
        sku,
        inventory_quantity,
        material,
        care_instructions,
        tags,
        is_featured: is_featured || false,
        is_active: is_active !== false,
      })
      .select()
      .single()

    if (productError) {
      return NextResponse.json({ error: productError.message }, { status: 400 })
    }

    // Add images if provided
    if (images && images.length > 0) {
      const imageInserts = images.map((image: any, index: number) => ({
        product_id: product.id,
        image_url: image.url,
        alt_text: image.alt_text || name,
        position: index,
        is_primary: index === 0,
      }))

      await supabase.from("product_images").insert(imageInserts)
    }

    // Add variants if provided
    if (variants && variants.length > 0) {
      const variantInserts = variants.map((variant: any, index: number) => ({
        product_id: product.id,
        name: variant.name,
        sku: variant.sku,
        price: variant.price || base_price,
        inventory_quantity: variant.inventory_quantity || 0,
        position: index,
      }))

      const { data: createdVariants } = await supabase.from("product_variants").insert(variantInserts).select()

      // Add variant options
      if (createdVariants) {
        const optionInserts: any[] = []
        createdVariants.forEach((createdVariant, index) => {
          const variant = variants[index]
          if (variant.options) {
            variant.options.forEach((option: any) => {
              optionInserts.push({
                variant_id: createdVariant.id,
                option_name: option.name,
                option_value: option.value,
              })
            })
          }
        })

        if (optionInserts.length > 0) {
          await supabase.from("variant_options").insert(optionInserts)
        }
      }
    }

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
