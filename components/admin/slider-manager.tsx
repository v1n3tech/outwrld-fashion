"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { createBrowserClient } from "@supabase/ssr"
import { Plus, Edit, Trash2, MoveUp, MoveDown, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface SliderImage {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  alt_text: string
  button_text: string | null
  button_link: string | null
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface SliderManagerProps {
  initialSliderImages: SliderImage[]
}

export function SliderManager({ initialSliderImages }: SliderManagerProps) {
  const [sliderImages, setSliderImages] = useState<SliderImage[]>(initialSliderImages)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<SliderImage | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const imageData = {
        title: formData.get("title") as string,
        subtitle: (formData.get("subtitle") as string) || null,
        image_url: formData.get("image_url") as string,
        alt_text: formData.get("alt_text") as string,
        button_text: (formData.get("button_text") as string) || null,
        button_link: (formData.get("button_link") as string) || null,
        is_active: formData.get("is_active") === "on",
      }

      if (editingImage) {
        const { data, error } = await supabase
          .from("hero_slider")
          .update(imageData)
          .eq("id", editingImage.id)
          .select()
          .single()

        if (error) throw error

        setSliderImages((prev) => prev.map((img) => (img.id === editingImage.id ? data : img)))
        toast.success("Slider image updated successfully")
      } else {
        const maxPosition = Math.max(...sliderImages.map((img) => img.position), 0)
        const { data, error } = await supabase
          .from("hero_slider")
          .insert({ ...imageData, position: maxPosition + 1 })
          .select()
          .single()

        if (error) throw error

        setSliderImages((prev) => [...prev, data])
        toast.success("Slider image added successfully")
      }

      setIsDialogOpen(false)
      setEditingImage(null)
    } catch (error) {
      console.error("Error saving slider image:", error)
      toast.error("Failed to save slider image")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slider image?")) return

    try {
      const { error } = await supabase.from("hero_slider").delete().eq("id", id)
      if (error) throw error

      setSliderImages((prev) => prev.filter((img) => img.id !== id))
      toast.success("Slider image deleted successfully")
    } catch (error) {
      console.error("Error deleting slider image:", error)
      toast.error("Failed to delete slider image")
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from("hero_slider").update({ is_active: !isActive }).eq("id", id)

      if (error) throw error

      setSliderImages((prev) => prev.map((img) => (img.id === id ? { ...img, is_active: !isActive } : img)))
      toast.success(`Slider image ${!isActive ? "activated" : "deactivated"}`)
    } catch (error) {
      console.error("Error toggling slider image:", error)
      toast.error("Failed to update slider image")
    }
  }

  const handleMovePosition = async (id: string, direction: "up" | "down") => {
    const currentIndex = sliderImages.findIndex((img) => img.id === id)
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === sliderImages.length - 1)
    )
      return

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    const newSliderImages = [...sliderImages]
    const [movedItem] = newSliderImages.splice(currentIndex, 1)
    newSliderImages.splice(newIndex, 0, movedItem)

    // Update positions in database
    try {
      const updates = newSliderImages.map((img, index) => ({
        id: img.id,
        position: index + 1,
      }))

      for (const update of updates) {
        await supabase.from("hero_slider").update({ position: update.position }).eq("id", update.id)
      }

      setSliderImages(
        newSliderImages.map((img, index) => ({
          ...img,
          position: index + 1,
        })),
      )
      toast.success("Slider order updated")
    } catch (error) {
      console.error("Error updating slider order:", error)
      toast.error("Failed to update slider order")
    }
  }

  const openEditDialog = (image: SliderImage) => {
    setEditingImage(image)
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingImage(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hero Slider Management</h1>
          <p className="text-muted-foreground">Manage the images displayed in the hero section</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Slider Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingImage ? "Edit" : "Add"} Slider Image</DialogTitle>
              <DialogDescription>
                {editingImage ? "Update the slider image details" : "Add a new image to the hero slider"}
              </DialogDescription>
            </DialogHeader>
            <form action={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" name="title" defaultValue={editingImage?.title || ""} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input id="subtitle" name="subtitle" defaultValue={editingImage?.subtitle || ""} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL *</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="url"
                  defaultValue={editingImage?.image_url || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alt_text">Alt Text *</Label>
                <Input id="alt_text" name="alt_text" defaultValue={editingImage?.alt_text || ""} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="button_text">Button Text</Label>
                  <Input id="button_text" name="button_text" defaultValue={editingImage?.button_text || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="button_link">Button Link</Label>
                  <Input id="button_link" name="button_link" defaultValue={editingImage?.button_link || ""} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="is_active" name="is_active" defaultChecked={editingImage?.is_active ?? true} />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : editingImage ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {sliderImages.map((image, index) => (
          <Card key={image.id}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={image.image_url || "/placeholder.svg"}
                    alt={image.alt_text}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold truncate">{image.title}</h3>
                    <Badge variant={image.is_active ? "default" : "secondary"}>
                      {image.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  {image.subtitle && <p className="text-sm text-muted-foreground truncate">{image.subtitle}</p>}
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    <span>Position: {image.position}</span>
                    {image.button_text && <span>Button: {image.button_text}</span>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMovePosition(image.id, "up")}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMovePosition(image.id, "down")}
                    disabled={index === sliderImages.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleToggleActive(image.id, image.is_active)}>
                    {image.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(image)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(image.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sliderImages.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No slider images found. Add your first image to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
