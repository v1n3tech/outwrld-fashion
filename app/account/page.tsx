import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AccountProfile } from "@/components/account/account-profile"
import { AccountOrders } from "@/components/account/account-orders"
import { redirect } from "next/navigation"

export default async function AccountPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container max-w-screen-xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="text-primary">MY</span> <span className="text-foreground">ACCOUNT</span>
          </h1>
          <p className="text-foreground/70">Manage your profile, orders, and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <AccountProfile user={user} profile={profile} />
          </div>
          <div className="lg:col-span-2">
            <AccountOrders userId={user.id} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
