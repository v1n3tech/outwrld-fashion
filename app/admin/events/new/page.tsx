import { createClient } from "@/lib/supabase/server"
import { EventForm } from "@/components/admin/event-form"
import { redirect } from "next/navigation"
import { createEvent } from "@/lib/actions/event-actions"

export default async function NewEventPage() {
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

  return (
    <div className="container max-w-screen-xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold mb-2">Create New Event</h1>
        <p className="text-muted-foreground">Create a new event for your store.</p>
      </div>

      <EventForm action={createEvent} />
    </div>
  )
}
