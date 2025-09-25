"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addToCart(productId: string, variantId?: string, quantity = 1) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Must be logged in to add items to cart")
  }

  try {
    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .eq("variant_id", variantId || null)
      .single()

    if (existingItem) {
      // Update quantity if item exists
      const { error } = await supabase
        .from("cart_items")
        .update({
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id)

      if (error) throw error
    } else {
      // Insert new item
      const { error } = await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: productId,
        variant_id: variantId || null,
        quantity,
      })

      if (error) throw error
    }

    revalidatePath("/cart")
    return { success: true }
  } catch (error) {
    console.error("Error adding to cart:", error)
    throw new Error("Failed to add item to cart")
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Must be logged in")
  }

  try {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId).eq("user_id", user.id)

      if (error) throw error
    } else {
      // Update quantity
      const { error } = await supabase
        .from("cart_items")
        .update({
          quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", itemId)
        .eq("user_id", user.id)

      if (error) throw error
    }

    revalidatePath("/cart")
    return { success: true }
  } catch (error) {
    console.error("Error updating cart item:", error)
    throw new Error("Failed to update cart item")
  }
}

export async function removeFromCart(itemId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Must be logged in")
  }

  try {
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId).eq("user_id", user.id)

    if (error) throw error

    revalidatePath("/cart")
    return { success: true }
  } catch (error) {
    console.error("Error removing from cart:", error)
    throw new Error("Failed to remove item from cart")
  }
}

export async function getCartItems() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        *,
        products (
          id,
          name,
          slug,
          base_price,
          product_images (
            image_url,
            alt_text,
            is_primary
          )
        ),
        product_variants (
          id,
          name,
          price
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching cart items:", error)
    return []
  }
}

export async function clearCart() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Must be logged in")
  }

  try {
    const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id)

    if (error) throw error

    revalidatePath("/cart")
    return { success: true }
  } catch (error) {
    console.error("Error clearing cart:", error)
    throw new Error("Failed to clear cart")
  }
}

export async function getCartItemCount() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return 0
  }

  try {
    const { data, error } = await supabase.from("cart_items").select("quantity").eq("user_id", user.id)

    if (error) throw error

    return data?.reduce((total, item) => total + item.quantity, 0) || 0
  } catch (error) {
    console.error("Error fetching cart count:", error)
    return 0
  }
}
