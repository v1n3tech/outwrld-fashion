"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface OrderFilters {
  search?: string
  status?: string
  payment_status?: string
  date_from?: string
  date_to?: string
}

export async function getOrders(filters?: OrderFilters, limit = 50, offset = 0) {
  const supabase = await createClient()

  let query = supabase
    .from("orders")
    .select(`
      id,
      order_number,
      email,
      status,
      payment_status,
      subtotal,
      tax_amount,
      shipping_amount,
      discount_amount,
      total_amount,
      currency,
      tracking_number,
      shipped_at,
      delivered_at,
      created_at,
      updated_at,
      profiles (
        first_name,
        last_name
      )
    `)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  // Apply filters
  if (filters?.search) {
    query = query.or(`order_number.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
  }

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status)
  }

  if (filters?.payment_status && filters.payment_status !== "all") {
    query = query.eq("payment_status", filters.payment_status)
  }

  if (filters?.date_from) {
    query = query.gte("created_at", filters.date_from)
  }

  if (filters?.date_to) {
    query = query.lte("created_at", filters.date_to)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching orders:", error)
    throw new Error("Failed to fetch orders")
  }

  return data || []
}

export async function getOrderById(orderId: string) {
  const supabase = await createClient()

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      profiles (
        first_name,
        last_name,
        phone
      ),
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
    .single()

  if (error) {
    console.error("Error fetching order:", error)
    throw new Error("Failed to fetch order")
  }

  return order
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient()

  const updates: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  // Set timestamps based on status
  if (status === "shipped" && !updates.shipped_at) {
    updates.shipped_at = new Date().toISOString()
  }

  if (status === "delivered" && !updates.delivered_at) {
    updates.delivered_at = new Date().toISOString()
  }

  const { error } = await supabase.from("orders").update(updates).eq("id", orderId)

  if (error) {
    console.error("Error updating order status:", error)
    throw new Error("Failed to update order status")
  }

  revalidatePath("/admin/orders")
  revalidatePath(`/admin/orders/${orderId}`)
  return { success: true }
}

export async function updateOrderPaymentStatus(orderId: string, paymentStatus: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: paymentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  if (error) {
    console.error("Error updating payment status:", error)
    throw new Error("Failed to update payment status")
  }

  revalidatePath("/admin/orders")
  revalidatePath(`/admin/orders/${orderId}`)
  return { success: true }
}

export async function updateOrderTracking(orderId: string, trackingNumber: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("orders")
    .update({
      tracking_number: trackingNumber,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  if (error) {
    console.error("Error updating tracking number:", error)
    throw new Error("Failed to update tracking number")
  }

  revalidatePath("/admin/orders")
  revalidatePath(`/admin/orders/${orderId}`)
  return { success: true }
}

export async function addOrderNote(orderId: string, note: string) {
  const supabase = await createClient()

  // Get current notes
  const { data: order } = await supabase.from("orders").select("notes").eq("id", orderId).single()

  const currentNotes = order?.notes || ""
  const timestamp = new Date().toISOString()
  const newNote = `[${timestamp}] ${note}`
  const updatedNotes = currentNotes ? `${currentNotes}\n${newNote}` : newNote

  const { error } = await supabase
    .from("orders")
    .update({
      notes: updatedNotes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  if (error) {
    console.error("Error adding order note:", error)
    throw new Error("Failed to add order note")
  }

  revalidatePath(`/admin/orders/${orderId}`)
  return { success: true }
}

export async function getOrderStats() {
  const supabase = await createClient()

  const { data: stats, error } = await supabase.from("orders").select("status, payment_status, total_amount")

  if (error) {
    console.error("Error fetching order stats:", error)
    return {
      total_orders: 0,
      total_revenue: 0,
      pending_orders: 0,
      completed_orders: 0,
    }
  }

  const totalOrders = stats.length
  const totalRevenue = stats
    .filter((order) => order.payment_status === "paid")
    .reduce((sum, order) => sum + Number.parseFloat(order.total_amount), 0)

  const pendingOrders = stats.filter((order) => order.status === "pending" || order.status === "confirmed").length

  const completedOrders = stats.filter((order) => order.status === "delivered").length

  return {
    total_orders: totalOrders,
    total_revenue: totalRevenue,
    pending_orders: pendingOrders,
    completed_orders: completedOrders,
  }
}

export async function exportOrders(filters?: OrderFilters) {
  const orders = await getOrders(filters, 1000) // Get up to 1000 orders for export

  // Convert to CSV format
  const headers = ["Order Number", "Customer", "Email", "Status", "Payment Status", "Total Amount", "Created At"]

  const csvData = orders.map((order) => [
    order.order_number,
    order.profiles?.first_name && order.profiles?.last_name
      ? `${order.profiles.first_name} ${order.profiles.last_name}`
      : "Guest",
    order.email,
    order.status,
    order.payment_status,
    order.total_amount,
    new Date(order.created_at).toLocaleDateString(),
  ])

  return {
    headers,
    data: csvData,
  }
}
