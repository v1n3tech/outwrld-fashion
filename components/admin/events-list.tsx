"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Eye, Trash2, Plus, Search, Calendar } from "lucide-react"

interface Event {
  id: string
  name: string
  slug: string
  event_type: string
  start_date: string
  end_date: string
  is_paid: boolean
  ticket_price: number | null
  max_attendees: number | null
  current_attendees: number
  is_active: boolean
  created_at: string
}

interface EventsListProps {
  initialEvents: Event[]
}

export function EventsList({ initialEvents }: EventsListProps) {
  const [events, setEvents] = useState(initialEvents)
  const [search, setSearch] = useState("")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  const getEventStatus = (event: Event) => {
    const now = new Date()
    const start = new Date(event.start_date)
    const end = new Date(event.end_date)

    if (now < start) return { label: "Upcoming", color: "bg-blue-500/10 text-blue-600" }
    if (now >= start && now <= end) return { label: "Live", color: "bg-green-500/10 text-green-600" }
    return { label: "Ended", color: "bg-gray-500/10 text-gray-600" }
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setEvents(events.filter((e) => e.id !== eventId))
      } else {
        console.error("Failed to delete event")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
    }
  }

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.slug.toLowerCase().includes(search.toLowerCase()) ||
      event.event_type.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Events</h1>
          <p className="text-muted-foreground">Manage fashion shows, launches, and special events</p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/admin/events/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => {
                const status = getEventStatus(event)
                return (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{event.name}</div>
                        <div className="text-sm text-muted-foreground">{event.slug}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEventTypeColor(event.event_type)}>{event.event_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={status.color}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(event.start_date)}</div>
                        <div className="text-muted-foreground">to {formatDate(event.end_date)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {event.max_attendees ? (
                        <div className="text-sm">
                          <div>
                            {event.current_attendees} / {event.max_attendees}
                          </div>
                          <div className="text-muted-foreground">
                            {((event.current_attendees / event.max_attendees) * 100).toFixed(0)}% full
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Unlimited</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {event.is_paid && event.ticket_price ? (
                        <span className="font-mono">{formatPrice(event.ticket_price)}</span>
                      ) : (
                        <Badge variant="outline">Free</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/events/${event.slug}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/events/${event.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(event.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">
                {search ? "No events found" : "No events found"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {search ? "Try adjusting your search terms." : "Create your first event to get started."}
              </p>
              {!search && (
                <Button asChild>
                  <Link href="/admin/events/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Event
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
