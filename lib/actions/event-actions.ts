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

export async function createEvent(formData: FormData) {
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
  const event_type = formData.get("event_type") as string
  const start_date = formData.get("start_date") as string
  const end_date = formData.get("end_date") as string
  const location = formData.get("location") as string
  const max_attendees = Number.parseInt(formData.get("max_attendees") as string) || null
  const ticket_price = Number.parseFloat(formData.get("ticket_price") as string) || 0
  const is_paid = formData.get("is_paid") === "true"
  const is_active = formData.get("is_active") === "true"
  const image_url = formData.get("image_url") as string

  const slug = generateSlug(name)

  if (!name || !event_type || !start_date || !location) {
    throw new Error("Missing required fields: name, event_type, start_date, and location are required")
  }

  try {
    // Create event
    const { data: event, error } = await supabase
      .from("events")
      .insert({
        name,
        description,
        slug,
        event_type,
        start_date,
        end_date,
        location,
        max_attendees,
        ticket_price: is_paid ? ticket_price : null,
        is_paid,
        is_active,
        image_url,
        current_attendees: 0,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    revalidatePath("/admin/events")
  } catch (error) {
    throw new Error(`Failed to create event: ${error instanceof Error ? error.message : "Unknown error"}`)
  }

  redirect("/admin/events")
}

export async function updateEvent(id: string, formData: FormData) {
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
  const event_type = formData.get("event_type") as string
  const start_date = formData.get("start_date") as string
  const end_date = formData.get("end_date") as string
  const location = formData.get("location") as string
  const max_attendees = Number.parseInt(formData.get("max_attendees") as string) || null
  const ticket_price = Number.parseFloat(formData.get("ticket_price") as string) || 0
  const is_paid = formData.get("is_paid") === "true"
  const is_active = formData.get("is_active") === "true"
  const image_url = formData.get("image_url") as string

  const slug = generateSlug(name)

  if (!name || !event_type || !start_date || !location) {
    throw new Error("Missing required fields: name, event_type, start_date, and location are required")
  }

  try {
    // Update event
    const { data: event, error } = await supabase
      .from("events")
      .update({
        name,
        description,
        slug,
        event_type,
        start_date,
        end_date,
        location,
        max_attendees,
        ticket_price: is_paid ? ticket_price : null,
        is_paid,
        is_active,
        image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    revalidatePath("/admin/events")
  } catch (error) {
    throw new Error(`Failed to update event: ${error instanceof Error ? error.message : "Unknown error"}`)
  }

  redirect("/admin/events")
}

export async function deleteEvent(id: string) {
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
    // Delete event
    const { error } = await supabase.from("events").delete().eq("id", id)

    if (error) {
      throw new Error("Error deleting event")
    }

    revalidatePath("/admin/events")
  } catch (error) {
    throw new Error("Failed to delete event")
  }
}
