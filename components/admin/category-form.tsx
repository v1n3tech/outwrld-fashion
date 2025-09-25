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

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string
  image_url?: string
  sort_order: number
  is_active: boolean
}

interface CategoryFormProps {
  category?: Category
  categories: Category[]
  action: (formData: FormData) => Promise<void>
  isLoading?: boolean
}

export function CategoryForm({ category, categories, action, isLoading }: CategoryFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    parent_id: category?.parent_id || "",
    image_url: category?.image_url || "",
    sort_order: category?.sort_order || 0,
    is_active: category?.is_active !== false,
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
    if (!category) {
      // Auto-generate slug for new categories
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

  // Filter out current category from parent options to prevent circular references
  const parentOptions = categories.filter((cat) => cat.id !== category?.id)

  return (
    <form action={action} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Category Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Category Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter category name"
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
                    placeholder="category-url-slug"
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
                  placeholder="Category description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parent_id">Parent Category</Label>
                  <Select
                    name="parent_id"
                    value={formData.parent_id}
                    onValueChange={(value) => handleInputChange("parent_id", value === "none" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Parent (Top Level)</SelectItem>
                      {parentOptions.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    name="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => handleInputChange("sort_order", Number.parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
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

          {/* Category Image */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Category Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.image_url ? (
                  <div className="space-y-2">
                    <img
                      src={formData.image_url || "/placeholder.svg"}
                      alt="Category"
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

                <p className="text-xs text-muted-foreground">Upload a high-quality image to represent this category.</p>
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
          {isLoading ? "Saving..." : category ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </form>
  )
}
