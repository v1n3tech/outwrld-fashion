import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { cart_items, shipping_address, billing_address, discount_code, shipping_calculation } = body

    if (!cart_items || !Array.isArray(cart_items) || cart_items.length === 0) {
      return NextResponse.json({ error: "Cart items are required" }, { status: 400 })
    }

    let subtotal = 0
    const orderItems = []

    for (const item of cart_items) {
      if (!item.product_id || !item.quantity) {
        continue
      }

      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id, name, base_price")
        .eq("id", item.product_id)
        .single()

      if (productError) {
        continue
      }

      if (product) {
        const itemTotal = product.base_price * item.quantity
        subtotal += itemTotal
        orderItems.push({
          product_id: product.id,
          product_name: product.name,
          quantity: item.quantity,
          price: product.base_price,
          total: itemTotal,
        })
      }
    }

    if (orderItems.length === 0) {
      return NextResponse.json({ error: "No valid products found in cart" }, { status: 400 })
    }

    let shipping = 0
    if (shipping_calculation && typeof shipping_calculation.calculated_rate === "number") {
      shipping = shipping_calculation.calculated_rate
    } else {
      // Fallback to simple calculation
      shipping = subtotal >= 20000 ? 0 : 2000
    }

    const total = subtotal + shipping

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        email: user.email,
        subtotal: subtotal,
        shipping_amount: shipping,
        total_amount: total,
        // Shipping address fields
        shipping_first_name: shipping_address?.first_name,
        shipping_last_name: shipping_address?.last_name,
        shipping_company: shipping_address?.company,
        shipping_address_1: shipping_address?.address_1,
        shipping_address_2: shipping_address?.address_2,
        shipping_city: shipping_address?.city,
        shipping_state: shipping_address?.state,
        shipping_postal_code: shipping_address?.postal_code,
        shipping_country: shipping_address?.country || "Nigeria",
        shipping_phone: shipping_address?.phone,
        // Billing address fields
        billing_first_name: billing_address?.first_name,
        billing_last_name: billing_address?.last_name,
        billing_company: billing_address?.company,
        billing_address_1: billing_address?.address_1,
        billing_address_2: billing_address?.address_2,
        billing_city: billing_address?.city,
        billing_state: billing_address?.state,
        billing_postal_code: billing_address?.postal_code,
        billing_country: billing_address?.country || "Nigeria",
        billing_phone: billing_address?.phone,
        status: "pending",
        payment_status: "pending",
        notes: shipping_calculation
          ? `Shipping Zone: ${shipping_calculation.zone_name}, Method: ${shipping_calculation.method_name}, Delivery: ${shipping_calculation.delivery_time}`
          : null,
      })
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 400 })
    }

    const orderItemsWithOrderId = orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItemsWithOrderId)

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 400 })
    }

    await supabase.from("cart_items").delete().eq("user_id", user.id)

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
