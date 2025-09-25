"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X } from "lucide-react"

interface Event {
  id?: string
  name: string
  slug: string
  description?: string
  image_url?: string
  event_type: string
  start_date: string
  end_date: string
  location?: string
  is_paid: boolean
  ticket_price?: number
  max_attendees?: number
  is_active: boolean
}

interface EventFormProps {
  event?: Event
  action: (formData: FormData) => Promise<void>
  isLoading?: boolean
}

export function EventForm({ event, action, isLoading }: EventFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: event?.name || "",
    slug: event?.slug || "",
    description: event?.description || "",
    image_url: event?.image_url || "",
    event_type: event?.event_type || "sale",
    start_date: event?.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : "",
    end_date: event?.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : "",
    location: event?.location || "",
    is_paid: event?.is_paid || false,
    ticket_price: event?.ticket_price?.toString() || "",
    max_attendees: event?.max_attendees?.toString() || "",
    is_active: event?.is_active !== false,
  })

  const [uploadingImage, setUploadingImage] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (name: string) => {
    handleInputChange("name", name)
    if (!event) {
      // Auto-generate slug for new events
      handleInputChange("slug", generateSlug(name))
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        console.error("Upload failed:", await response.text())
        return
      }

      const result = await response.json()
      handleInputChange("image_url", result.url)
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = () => {
    handleInputChange("image_url", "")
  }

  return (
    <form action={action} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Event Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter event name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="event-url-slug"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Detailed event description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event_type">Event Type</Label>
                  <Select
                    name="event_type"
                    value={formData.event_type}
                    onValueChange={(value) => handleInputChange("event_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="launch">Product Launch</SelectItem>
                      <SelectItem value="collection">Collection Drop</SelectItem>
                      <SelectItem value="collaboration">Collaboration</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Event location or 'Online'"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Date & Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date & Time *</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange("start_date", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date & Time *</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange("end_date", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ticketing */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Ticketing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_paid">Paid Event</Label>
                <Switch
                  id="is_paid"
                  checked={formData.is_paid}
                  onCheckedChange={(checked) => handleInputChange("is_paid", checked)}
                />
                <input type="hidden" name="is_paid" value={formData.is_paid.toString()} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.is_paid && (
                  <div className="space-y-2">
                    <Label htmlFor="ticket_price">Ticket Price (₦) *</Label>
                    <Input
                      id="ticket_price"
                      name="ticket_price"
                      type="number"
                      value={formData.ticket_price}
                      onChange={(e) => handleInputChange("ticket_price", e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required={formData.is_paid}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="max_attendees">Max Attendees</Label>
                  <Input
                    id="max_attendees"
                    name="max_attendees"
                    type="number"
                    value={formData.max_attendees}
                    onChange={(e) => handleInputChange("max_attendees", e.target.value)}
                    placeholder="Unlimited"
                    min="1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Status & Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                />
                <input type="hidden" name="is_active" value={formData.is_active.toString()} />
              </div>
            </CardContent>
          </Card>

          {/* Event Image */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Event Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.image_url ? (
                  <div className="space-y-2">
                    <img
                      src={formData.image_url || "/placeholder.svg"}
                      alt="Event"
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button type="button" variant="outline" onClick={removeImage} className="w-full bg-transparent">
                      <X className="mr-2 h-4 w-4" />
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingImage}
                    />
                    <Button type="button" variant="outline" className="w-full bg-transparent" disabled={uploadingImage}>
                      <Upload className="mr-2 h-4 w-4" />
                      {uploadingImage ? "Uploading..." : "Upload Image"}
                    </Button>
                  </div>
                )}

                <input type="hidden" name="image_url" value={formData.image_url} />

                <p className="text-xs text-muted-foreground">Upload a high-quality event banner image.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {isLoading ? "Saving..." : event ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  )
}
