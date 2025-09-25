"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface FulfillmentStats {
  total_orders: number
  pending_fulfillment: number
  processing: number
  shipped_today: number
  average_fulfillment_time: number
}

export async function getFulfillmentStats(): Promise<FulfillmentStats> {
  const supabase = await createClient()

  const { data: orders, error } = await supabase
    .from("orders")
    .select("status, created_at, shipped_at")
    .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

  if (error) {
    console.error("Error fetching fulfillment stats:", error)
    return {
      total_orders: 0,
      pending_fulfillment: 0,
      processing: 0,
      shipped_today: 0,
      average_fulfillment_time: 0,
    }
  }

  const totalOrders = orders.length
  const pendingFulfillment = orders.filter((o) => o.status === "confirmed").length
  const processing = orders.filter((o) => o.status === "processing").length

  const today = new Date().toDateString()
  const shippedToday = orders.filter((o) => o.shipped_at && new Date(o.shipped_at).toDateString() === today).length

  // Calculate average fulfillment time (from created to shipped)
  const shippedOrders = orders.filter((o) => o.shipped_at)
  const avgFulfillmentTime =
    shippedOrders.length > 0
      ? shippedOrders.reduce((sum, order) => {
          const created = new Date(order.created_at).getTime()
          const shipped = new Date(order.shipped_at!).getTime()
          return sum + (shipped - created)
        }, 0) /
        shippedOrders.length /
        (1000 * 60 * 60 * 24) // Convert to days
      : 0

  return {
    total_orders: totalOrders,
    pending_fulfillment: pendingFulfillment,
    processing,
    shipped_today: shippedToday,
    average_fulfillment_time: Math.round(avgFulfillmentTime * 10) / 10, // Round to 1 decimal
  }
}

export async function bulkUpdateOrderStatus(orderIds: string[], newStatus: string) {
  const supabase = await createClient()

  const updates: any = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  }

  // Set timestamps based on status
  if (newStatus === "shipped" && !updates.shipped_at) {
    updates.shipped_at = new Date().toISOString()
  }

  if (newStatus === "delivered" && !updates.delivered_at) {
    updates.delivered_at = new Date().toISOString()
  }

  const { error } = await supabase.from("orders").update(updates).in("id", orderIds)

  if (error) {
    console.error("Error bulk updating orders:", error)
    throw new Error("Failed to update orders")
  }

  revalidatePath("/admin/orders")
  revalidatePath("/admin/fulfillment")
  return { success: true }
}

export async function getOrdersReadyForFulfillment(limit = 50) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      email,
      status,
      payment_status,
      total_amount,
      created_at,
      profiles (
        first_name,
        last_name
      )
    `)
    .in("status", ["confirmed", "processing"])
    .eq("payment_status", "paid")
    .order("created_at", { ascending: true })
    .limit(limit)

  if (error) {
    console.error("Error fetching orders for fulfillment:", error)
    throw new Error("Failed to fetch orders")
  }

  return data || []
}

export async function markOrdersAsProcessing(orderIds: string[]) {
  return bulkUpdateOrderStatus(orderIds, "processing")
}

export async function markOrdersAsShipped(orderIds: string[]) {
  return bulkUpdateOrderStatus(orderIds, "shipped")
}

export async function generatePickingList(orderIds: string[]) {
  const supabase = await createClient()

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      order_items (
        product_name,
        variant_name,
        sku,
        quantity,
        products (
          name,
          sku
        )
      )
    `)
    .in("id", orderIds)

  if (error) {
    console.error("Error generating picking list:", error)
    throw new Error("Failed to generate picking list")
  }

  // Aggregate items across all orders
  const itemMap = new Map()

  orders?.forEach((order) => {
    order.order_items?.forEach((item) => {
      const key = item.sku || `${item.product_name}-${item.variant_name || "default"}`
      const existing = itemMap.get(key)

      if (existing) {
        existing.quantity += item.quantity
        existing.orders.push(order.order_number)
      } else {
        itemMap.set(key, {
          product_name: item.product_name,
          variant_name: item.variant_name,
          sku: item.sku,
          quantity: item.quantity,
          orders: [order.order_number],
        })
      }
    })
  })

  return Array.from(itemMap.values())
}
