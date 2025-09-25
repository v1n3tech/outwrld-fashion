"use server"

import { createClient } from "@/lib/supabase/server"

export async function getCustomerOrders(userId: string, limit = 20, offset = 0) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      total_amount,
      status,
      payment_status,
      created_at,
      shipped_at,
      delivered_at,
      tracking_number,
      order_items (
        id,
        product_name,
        variant_name,
        quantity,
        price,
        total
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching customer orders:", error)
    throw new Error("Failed to fetch orders")
  }

  return data || []
}

export async function getCustomerOrderById(orderId: string, userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        product_id,
        variant_id,
        product_name,
        variant_name,
        sku,
        price,
        quantity,
        total,
        products (
          slug,
          product_images (
            image_url,
            alt_text,
            is_primary
          )
        )
      )
    `)
    .eq("id", orderId)
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching customer order:", error)
    throw new Error("Failed to fetch order")
  }

  return data
}

export async function getCustomerOrderStats(userId: string) {
  const supabase = await createClient()

  const { data: orders, error } = await supabase
    .from("orders")
    .select("status, payment_status, total_amount")
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching customer order stats:", error)
    return {
      total_orders: 0,
      total_spent: 0,
      pending_orders: 0,
      completed_orders: 0,
    }
  }

  const totalOrders = orders.length
  const totalSpent = orders
    .filter((order) => order.payment_status === "paid")
    .reduce((sum, order) => sum + Number.parseFloat(order.total_amount), 0)

  const pendingOrders = orders.filter(
    (order) => order.status === "pending" || order.status === "confirmed" || order.status === "processing",
  ).length

  const completedOrders = orders.filter((order) => order.status === "delivered").length

  return {
    total_orders: totalOrders,
    total_spent: totalSpent,
    pending_orders: pendingOrders,
    completed_orders: completedOrders,
  }
}
