import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, MapPin, Ticket, Mail } from "lucide-react"
import Link from "next/link"

interface TicketSuccessPageProps {
  searchParams: {
    event?: string
    free?: string
    reference?: string
  }
}

export default async function TicketSuccessPage({ searchParams }: TicketSuccessPageProps) {
  const supabase = await createClient()
  const { event: eventSlug, free, reference } = searchParams

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container max-w-screen-xl px-4 py-16">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-foreground/70 mb-8">Please log in to view your tickets.</p>
            <Button asChild>
              <Link href="/auth/login">Log In</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  let event = null
  let tickets = []

  if (eventSlug) {
    // Get event details
    const { data: eventData } = await supabase.from("events").select("*").eq("slug", eventSlug).single()

    event = eventData

    if (event) {
      // Get user's tickets for this event
      const { data: ticketData } = await supabase
        .from("event_attendees")
        .select("*")
        .eq("event_id", event.id)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      tickets = ticketData || []
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container max-w-screen-xl px-4 py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="font-display text-3xl font-bold">
              {free === "true" ? "Registration Successful!" : "Payment Successful!"}
            </h1>
            <p className="text-lg text-foreground/70">
              {free === "true"
                ? "You've successfully registered for the event. Check your email for confirmation details."
                : "Your payment has been processed and your tickets are confirmed. Check your email for details."}
            </p>
          </div>

          {/* Event Details */}
          {event && (
            <Card>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{event.name}</h3>
                  {event.description && <p className="text-foreground/70 mt-1">{event.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">{formatDate(event.start_date)}</p>
                      <p className="text-foreground/60">
                        {formatTime(event.start_date)} - {formatTime(event.end_date)}
                      </p>
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-foreground/60">{event.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                {event.is_paid && event.ticket_price && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span>Ticket Price × {tickets.length}</span>
                      <span className="font-semibold">{formatPrice(event.ticket_price * tickets.length)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tickets */}
          {tickets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Your Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tickets.map((ticket, index) => (
                  <div key={ticket.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Ticket #{index + 1}</p>
                        <p className="text-sm text-foreground/60">
                          {ticket.first_name} {ticket.last_name}
                        </p>
                      </div>
                      <Badge variant={ticket.payment_status === "completed" ? "default" : "secondary"}>
                        {ticket.payment_status}
                      </Badge>
                    </div>
                    <div className="text-xs font-mono bg-muted p-2 rounded">{ticket.ticket_code}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Check Your Email</p>
                    <p className="text-sm text-foreground/70">
                      We've sent a confirmation email with your ticket details and QR codes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Add to Calendar</p>
                    <p className="text-sm text-foreground/70">
                      Don't forget to add this event to your calendar so you don't miss it.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Ticket className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Bring Your Ticket</p>
                    <p className="text-sm text-foreground/70">
                      Present your ticket code or QR code at the event entrance.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/events">Browse More Events</Link>
            </Button>
            <Button asChild>
              <Link href="/account">View My Account</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
