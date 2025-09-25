import { createClient } from "@/lib/supabase/server"
import { EventsList } from "@/components/admin/events-list"
import { redirect } from "next/navigation"

export default async function AdminEventsPage() {
  const supabase = await createClient()

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

  const { data: events } = await supabase.from("events").select("*").order("created_at", { ascending: false })

  return (
    <div className="p-6">
      <EventsList initialEvents={events || []} />
    </div>
  )
}
