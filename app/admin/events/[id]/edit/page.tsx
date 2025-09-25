import { createClient } from "@/lib/supabase/server"
import { EventForm } from "@/components/admin/event-form"
import { redirect } from "next/navigation"
import { updateEvent } from "@/lib/actions/event-actions"

interface EditEventPageProps {
  params: {
    id: string
  }
}

export default async function EditEventPage({ params }: EditEventPageProps) {
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

  // Fetch the event to edit
  const { data: event, error } = await supabase.from("events").select("*").eq("id", params.id).single()

  if (error || !event) {
    redirect("/admin/events")
  }

  // Create a bound action with the event ID
  const updateEventWithId = updateEvent.bind(null, params.id)

  return (
    <div className="container max-w-screen-xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold mb-2">Edit Event</h1>
        <p className="text-muted-foreground">Update event details and settings.</p>
      </div>

      <EventForm event={event} action={updateEventWithId} />
    </div>
  )
}
