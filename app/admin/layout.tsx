import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
    <div className="min-h-screen bg-background">
      <AdminSidebar />

      {/* Main Content */}
      <div className="lg:pl-64">
        <AdminHeader mobileMenuTrigger={<AdminSidebar />} />
        <main className="flex-1 min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  )
}
