"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Ticket, Loader2, Users, Calendar, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface Event {
  id: string
  name: string
  slug: string
  start_date: string
  end_date: string
  is_paid: boolean
  ticket_price: number | null
  max_attendees: number | null
  current_attendees: number
  location: string | null
}

interface EventTicketPurchaseProps {
  event: Event
}

export function EventTicketPurchase({ event }: EventTicketPurchaseProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [userEmail, setUserEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const supabase = createClient()

  const isUpcoming = new Date(event.start_date) > new Date()
  const isLive = new Date(event.start_date) <= new Date() && new Date(event.end_date) >= new Date()
  const isPast = new Date(event.end_date) < new Date()
  const spotsRemaining = event.max_attendees ? event.max_attendees - event.current_attendees : null
  const isSoldOut = spotsRemaining !== null && spotsRemaining <= 0

  const maxQuantity = spotsRemaining ? Math.min(spotsRemaining, 5) : 5
  const ticketPrice = event.ticket_price || 0
  const total = ticketPrice * quantity

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)

        // Try to get user profile for pre-filling
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name, phone")
          .eq("id", user.id)
          .single()

        if (profile) {
          setFirstName(profile.first_name || "")
          setLastName(profile.last_name || "")
          setPhone(profile.phone || "")
        }
      }
    }

    getUser()
  }, [supabase])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handlePurchase = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push(`/auth/login?redirect=/events/${event.slug}`)
      return
    }

    if (!firstName || !lastName || !phone) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    try {
      if (event.is_paid && ticketPrice > 0) {
        // For paid events, create event attendee record and initialize payment
        const attendeeResponse = await fetch("/api/events/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_id: event.id,
            quantity,
            attendee_info: {
              first_name: firstName,
              last_name: lastName,
              email: userEmail,
              phone,
            },
          }),
        })

        if (!attendeeResponse.ok) {
          const errorData = await attendeeResponse.json().catch(() => ({ error: "Unknown error" }))
          throw new Error(errorData.error || "Failed to register for event")
        }

        const { attendee_ids } = await attendeeResponse.json()

        // Initialize payment
        const paymentResponse = await fetch("/api/payments/initialize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            amount: total,
            callback_url: `${window.location.origin}/events/ticket-success`,
            metadata: {
              event_id: event.id,
              attendee_ids,
              event_name: event.name,
              quantity,
            },
          }),
        })

        if (!paymentResponse.ok) {
          throw new Error("Failed to initialize payment")
        }

        const { authorization_url } = await paymentResponse.json()
        window.location.href = authorization_url
      } else {
        // For free events, directly register
        const attendeeResponse = await fetch("/api/events/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_id: event.id,
            quantity,
            attendee_info: {
              first_name: firstName,
              last_name: lastName,
              email: userEmail,
              phone,
            },
            is_free: true,
          }),
        })

        if (!attendeeResponse.ok) {
          const errorData = await attendeeResponse.json().catch(() => ({ error: "Unknown error" }))
          throw new Error(errorData.error || "Failed to register for event")
        }

        // Redirect to success page
        router.push(`/events/ticket-success?event=${event.slug}&free=true`)
      }
    } catch (error) {
      alert(`Registration failed: ${error instanceof Error ? error.message : "Please try again."}`)
    } finally {
      setIsLoading(false)
    }
  }

  const canPurchase = !isPast && !isSoldOut && (isUpcoming || isLive)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          {event.is_paid ? "Purchase Tickets" : "Register for Event"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Event Quick Info */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-2 text-foreground/60">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(event.start_date)} at {formatTime(event.start_date)}
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
                {event.current_attendees} / {event.max_attendees} registered
                {spotsRemaining && spotsRemaining > 0 && (
                  <span className="text-primary ml-1">({spotsRemaining} spots left)</span>
                )}
              </span>
            </div>
          )}
        </div>

        {canPurchase && (
          <>
            {/* Quantity Selection */}
            {event.max_attendees && (
              <div className="space-y-2">
                <Label htmlFor="quantity">Number of Tickets</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={maxQuantity}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.min(maxQuantity, Math.max(1, Number.parseInt(e.target.value) || 1)))
                    }
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                    disabled={quantity >= maxQuantity}
                  >
                    +
                  </Button>
                </div>
                <p className="text-xs text-foreground/60">Maximum {maxQuantity} tickets per person</p>
              </div>
            )}

            {/* Attendee Information */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Attendee Information</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName" className="text-xs">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-xs">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone" className="text-xs">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 xxx xxx xxxx"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-xs">
                  Email
                </Label>
                <Input id="email" value={userEmail} disabled className="bg-muted" />
              </div>
            </div>

            {event.is_paid && ticketPrice > 0 && (
              <>
                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Ticket Price × {quantity}</span>
                    <span className="font-mono">{formatPrice(ticketPrice * quantity)}</span>
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="font-mono text-primary">{formatPrice(total)}</span>
                </div>
              </>
            )}

            {/* Purchase/Register Button */}
            <Button
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handlePurchase}
              disabled={isLoading || !firstName || !lastName || !phone}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Ticket className="mr-2 h-4 w-4" />
                  {event.is_paid ? `Purchase for ${formatPrice(total)}` : "Register for Free"}
                </>
              )}
            </Button>
          </>
        )}

        {/* Status Messages */}
        {isPast && (
          <div className="text-center py-4">
            <p className="text-foreground/60">This event has ended</p>
          </div>
        )}

        {isSoldOut && !isPast && (
          <div className="text-center py-4">
            <p className="text-foreground/60 font-medium">This event is sold out</p>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="space-y-2 pt-4 border-t text-xs text-foreground/60">
          <p>✓ Secure registration and payment processing</p>
          <p>✓ Instant ticket confirmation via email</p>
          <p>✓ Customer support available</p>
        </div>
      </CardContent>
    </Card>
  )
}
