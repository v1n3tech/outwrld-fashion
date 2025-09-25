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

    const { event_id, quantity = 1, attendee_info, is_free = false } = body

    if (!event_id || !attendee_info) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { first_name, last_name, email, phone } = attendee_info

    if (!first_name || !last_name || !email || !phone) {
      return NextResponse.json({ error: "Missing attendee information" }, { status: 400 })
    }

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", event_id)
      .eq("is_active", true)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check if event has capacity
    if (event.max_attendees) {
      const spotsRemaining = event.max_attendees - event.current_attendees
      if (spotsRemaining < quantity) {
        return NextResponse.json({ error: "Not enough spots available" }, { status: 400 })
      }
    }

    // Check if event is in the future or currently live
    const now = new Date()
    const eventEnd = new Date(event.end_date)
    if (eventEnd < now) {
      return NextResponse.json({ error: "Event has ended" }, { status: 400 })
    }

    // Generate ticket codes and create attendee records
    const attendeeIds = []
    const attendeeRecords = []

    for (let i = 0; i < quantity; i++) {
      const ticketCode = `${event.slug.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

      attendeeRecords.push({
        event_id,
        user_id: user.id,
        first_name,
        last_name,
        email,
        phone,
        ticket_code: ticketCode,
        payment_status: is_free ? "completed" : "pending",
        attended: false,
      })
    }

    // Insert attendee records
    const { data: attendees, error: attendeeError } = await supabase
      .from("event_attendees")
      .insert(attendeeRecords)
      .select("id")

    if (attendeeError) {
      return NextResponse.json({ error: attendeeError.message }, { status: 400 })
    }

    attendees.forEach((attendee) => attendeeIds.push(attendee.id))

    // Update event current_attendees count
    const { error: updateError } = await supabase
      .from("events")
      .update({
        current_attendees: event.current_attendees + quantity,
      })
      .eq("id", event_id)

    if (updateError) {
      // Rollback attendee records if update fails
      await supabase.from("event_attendees").delete().in("id", attendeeIds)

      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      attendee_ids: attendeeIds,
      message: is_free ? "Successfully registered for event" : "Registration created, proceed to payment",
    })
  } catch (error) {
    console.error("Event registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
