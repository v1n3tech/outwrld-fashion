import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock } from "lucide-react"

interface EventCardProps {
  event: {
    id: string
    name: string
    slug: string
    description: string | null
    image_url: string | null
    event_type: string
    start_date: string
    end_date: string
    is_paid: boolean
    ticket_price: number | null
    max_attendees: number | null
    current_attendees: number
    location: string | null
  }
}

export function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
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
  const spotsRemaining = event.max_attendees ? event.max_attendees - event.current_attendees : null

  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        {event.image_url ? (
          <Image
            src={event.image_url || "/placeholder.svg"}
            alt={event.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
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

        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={getEventTypeColor(event.event_type)}>{event.event_type}</Badge>
          {isLive && <Badge className="bg-red-500 text-white">LIVE</Badge>}
        </div>

        {event.is_paid && event.ticket_price && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/90 text-foreground">
              {formatPrice(event.ticket_price)}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-display text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/events/${event.slug}`}>{event.name}</Link>
          </h3>

          {event.description && <p className="text-sm text-foreground/70 line-clamp-2">{event.description}</p>}
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-2 text-foreground/60">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.start_date)}</span>
          </div>

          <div className="flex items-center space-x-2 text-foreground/60">
            <Clock className="h-4 w-4" />
            <span>
              {formatTime(event.start_date)} - {formatTime(event.end_date)}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center space-x-2 text-foreground/60">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}

          {event.max_attendees && (
            <div className="flex items-center space-x-2 text-foreground/60">
              <Users className="h-4 w-4" />
              <span>
                {event.current_attendees} / {event.max_attendees} attendees
                {spotsRemaining && spotsRemaining > 0 && (
                  <span className="text-primary ml-1">({spotsRemaining} spots left)</span>
                )}
              </span>
            </div>
          )}
        </div>

        <div className="pt-2">
          <Button
            asChild
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={spotsRemaining === 0}
          >
            <Link href={`/events/${event.slug}`}>
              {spotsRemaining === 0 ? "Sold Out" : isLive ? "Join Now" : "Learn More"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
