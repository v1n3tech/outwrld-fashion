import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/events/event-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users } from "lucide-react"

export default async function EventsPage() {
  const supabase = await createClient()

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("is_active", true)
    .gte("end_date", new Date().toISOString())
    .order("start_date", { ascending: true })

  const upcomingEvents = events?.filter((event) => new Date(event.start_date) > new Date()) || []
  const currentEvents =
    events?.filter((event) => new Date(event.start_date) <= new Date() && new Date(event.end_date) >= new Date()) || []

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container max-w-screen-xl px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center space-y-6">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-balance">
            <span className="text-primary">OUTWRLD</span> <span className="text-foreground">EVENTS</span>
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-pretty">
            Experience the future of fashion at our exclusive events. From runway shows to cultural collaborations, join
            us in redefining Nigerian streetwear.
          </p>
        </div>

        {/* Current Events */}
        {currentEvents.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center space-x-3 mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold">Happening Now</h2>
              <Badge className="bg-primary text-primary-foreground">LIVE</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <section className="mb-16">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* No Events */}
        {(!events || events.length === 0) && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="font-display text-2xl font-bold mb-4">No Events Scheduled</h3>
            <p className="text-foreground/70 mb-8 max-w-md mx-auto">
              Stay tuned for exciting upcoming events. Follow us on social media to be the first to know about new
              announcements.
            </p>
            <Button asChild>
              <a href="https://instagram.com/outwrldng" target="_blank" rel="noopener noreferrer">
                Follow @outwrldng
              </a>
            </Button>
          </div>
        )}

        {/* Event Types Info */}
        <section className="mt-16 pt-16 border-t border-border">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">Event Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold">Fashion Shows</h3>
              <p className="text-foreground/70">
                Exclusive runway presentations showcasing our latest collections and collaborations with Nigerian
                artists.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-display text-xl font-semibold">Pop-up Stores</h3>
              <p className="text-foreground/70">
                Limited-time retail experiences in unique locations across Lagos and other major Nigerian cities.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold">Cultural Collaborations</h3>
              <p className="text-foreground/70">
                Special events celebrating Nigerian heritage through fashion, music, and art partnerships.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
