import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { EventTicketPurchase } from "@/components/events/event-ticket-purchase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Users, Clock, ArrowLeft, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

interface EventPageProps {
  params: {
    slug: string
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const supabase = await createClient()

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single()

  if (!event) {
    notFound()
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

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "launch":
        return "bg-primary/10 text-primary"
      case "sale":
        return "bg-green-500/10 text-green-600"
      case "collection":
        return "bg-purple-500/10 text-purple-600"
      case "collaboration":
        return "bg-blue-500/10 text-blue-600"
      default:
        return "bg-secondary/10 text-secondary"
    }
  }

  const isUpcoming = new Date(event.start_date) > new Date()
  const isLive = new Date(event.start_date) <= new Date() && new Date(event.end_date) >= new Date()
  const isPast = new Date(event.end_date) < new Date()
  const spotsRemaining = event.max_attendees ? event.max_attendees - event.current_attendees : null

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container max-w-screen-xl px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-foreground/70 hover:text-foreground">
            <Link href="/events" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="relative aspect-video overflow-hidden rounded-lg">
              {event.image_url ? (
                <Image
                  src={event.image_url || "/placeholder.svg"}
                  alt={event.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div
                  className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              )}

              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className={getEventTypeColor(event.event_type)}>{event.event_type}</Badge>
                {isLive && <Badge className="bg-red-500 text-white">LIVE</Badge>}
                {isPast && <Badge variant="secondary">ENDED</Badge>}
              </div>

              <div className="absolute top-4 right-4">
                <Button variant="secondary" size="icon" className="bg-background/90 hover:bg-background">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 text-balance">{event.name}</h1>
                {event.description && (
                  <p className="text-lg text-foreground/70 leading-relaxed text-pretty">{event.description}</p>
                )}
              </div>

              {/* Event Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{formatDate(event.start_date)}</p>
                      <p className="text-sm text-foreground/60">
                        {formatTime(event.start_date)} - {formatTime(event.end_date)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {event.location && (
                  <Card>
                    <CardContent className="p-4 flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-foreground/60">{event.location}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {event.max_attendees && (
                  <Card>
                    <CardContent className="p-4 flex items-center space-x-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Capacity</p>
                        <p className="text-sm text-foreground/60">
                          {event.current_attendees} / {event.max_attendees} attendees
                          {spotsRemaining && spotsRemaining > 0 && (
                            <span className="text-primary ml-1">({spotsRemaining} spots left)</span>
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {event.is_paid && event.ticket_price && (
                  <Card>
                    <CardContent className="p-4 flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Ticket Price</p>
                        <p className="text-sm text-foreground/60">{formatPrice(event.ticket_price)}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Additional Event Details */}
              <div className="prose prose-gray max-w-none">
                <h3 className="font-display text-xl font-semibold mb-4">About This Event</h3>
                <div className="space-y-4 text-foreground/70">
                  <p>
                    Join us for an exclusive OUTWRLD experience that celebrates the intersection of Nigerian culture and
                    contemporary streetwear. This event promises to be an unforgettable journey through fashion,
                    creativity, and community.
                  </p>
                  <p>
                    Whether you're a fashion enthusiast, cultural explorer, or simply looking for a unique experience,
                    this event offers something special for everyone. Connect with like-minded individuals and be part
                    of the OUTWRLD movement.
                  </p>
                  {event.event_type === "launch" && (
                    <p>
                      <strong>Product Launch:</strong> Be among the first to see and purchase our latest collection
                      pieces. Exclusive launch discounts available for attendees.
                    </p>
                  )}
                  {event.event_type === "collaboration" && (
                    <p>
                      <strong>Cultural Collaboration:</strong> Experience the fusion of traditional Nigerian artistry
                      with modern streetwear design. Meet the artists and designers behind the collaboration.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Ticket Purchase */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <EventTicketPurchase event={event} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
