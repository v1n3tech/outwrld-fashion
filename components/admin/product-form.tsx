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
import { Separator } from "@/components/ui/separator"
import { Upload, X } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductFormProps {
  product?: any
  categories: Category[]
  action: (formData: FormData) => Promise<void>
  isLoading?: boolean
}

export function ProductForm({ product, categories, action, isLoading }: ProductFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    short_description: product?.short_description || "",
    category_id: product?.category_id || "",
    base_price: product?.base_price || "",
    compare_price: product?.compare_price || "",
    cost_price: product?.cost_price || "",
    barcode: product?.barcode || "",
    track_inventory: product?.track_inventory !== false,
    low_stock_threshold: product?.low_stock_threshold || 5,
    weight: product?.weight || "",
    dimensions: product?.dimensions || "",
    seo_title: product?.seo_title || "",
    seo_description: product?.seo_description || "",
    sku: product?.sku || "",
    inventory_quantity: product?.inventory_quantity || 0,
    material: product?.material || "",
    care_instructions: product?.care_instructions || "",
    tags: product?.tags || [],
    is_featured: product?.is_featured || false,
    is_active: product?.is_active !== false,
  })

  const [newTag, setNewTag] = useState("")
  const [images, setImages] = useState(product?.product_images || [])
  const [uploadingImages, setUploadingImages] = useState(false)

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
    if (!product) {
      // Auto-generate slug for new products
      handleInputChange("slug", generateSlug(name))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange("tags", [...formData.tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    handleInputChange(
      "tags",
      formData.tags.filter((tag) => tag !== tagToRemove),
    )
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploadingImages(true)

    try {
      const uploadedImages = []

      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          console.error("Upload failed:", await response.text())
          continue
        }

        const result = await response.json()

        uploadedImages.push({
          id: Math.random().toString(36).substring(2),
          image_url: result.url,
          alt_text: file.name,
          is_primary: images.length === 0 && uploadedImages.length === 0,
          position: images.length + uploadedImages.length + 1,
        })
      }

      setImages((prev) => [...prev, ...uploadedImages])
    } catch (error) {
      console.error("Error uploading images:", error)
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  const setPrimaryImage = (imageId: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        is_primary: img.id === imageId,
      })),
    )
  }

  return (
    <form action={action} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Product Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="Product SKU"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="product-url-slug"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Product description"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  name="short_description"
                  value={formData.short_description}
                  onChange={(e) => handleInputChange("short_description", e.target.value)}
                  placeholder="Brief product summary"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    name="material"
                    value={formData.material}
                    onChange={(e) => handleInputChange("material", e.target.value)}
                    placeholder="Product material"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    name="barcode"
                    value={formData.barcode}
                    onChange={(e) => handleInputChange("barcode", e.target.value)}
                    placeholder="Product barcode"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="care_instructions">Care Instructions</Label>
                <Textarea
                  id="care_instructions"
                  name="care_instructions"
                  value={formData.care_instructions}
                  onChange={(e) => handleInputChange("care_instructions", e.target.value)}
                  placeholder="How to care for this product"
                  rows={3}
                />
              </div>

              {/* Tags Section */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                      >
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <input type="hidden" name="tags" value={JSON.stringify(formData.tags)} />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base_price">Base Price (₦) *</Label>
                  <Input
                    id="base_price"
                    name="base_price"
                    type="number"
                    value={formData.base_price}
                    onChange={(e) => handleInputChange("base_price", e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compare_price">Compare Price (₦)</Label>
                  <Input
                    id="compare_price"
                    name="compare_price"
                    type="number"
                    value={formData.compare_price}
                    onChange={(e) => handleInputChange("compare_price", e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost_price">Cost Price (₦)</Label>
                  <Input
                    id="cost_price"
                    name="cost_price"
                    type="number"
                    value={formData.cost_price}
                    onChange={(e) => handleInputChange("cost_price", e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inventory_quantity">Stock Quantity</Label>
                  <Input
                    id="inventory_quantity"
                    name="inventory_quantity"
                    type="number"
                    value={formData.inventory_quantity}
                    onChange={(e) => handleInputChange("inventory_quantity", e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="low_stock_threshold">Low Stock Alert</Label>
                  <Input
                    id="low_stock_threshold"
                    name="low_stock_threshold"
                    type="number"
                    value={formData.low_stock_threshold}
                    onChange={(e) => handleInputChange("low_stock_threshold", e.target.value)}
                    placeholder="5"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    placeholder="0.0"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions (JSON format)</Label>
                <Input
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={(e) => handleInputChange("dimensions", e.target.value)}
                  placeholder='{"length": 30, "width": 20, "height": 10}'
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="track_inventory">Track Inventory</Label>
                <Switch
                  id="track_inventory"
                  name="track_inventory"
                  checked={formData.track_inventory}
                  onCheckedChange={(checked) => handleInputChange("track_inventory", checked)}
                />
                <input type="hidden" name="track_inventory" value={formData.track_inventory.toString()} />
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo_title">SEO Title</Label>
                <Input
                  id="seo_title"
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={(e) => handleInputChange("seo_title", e.target.value)}
                  placeholder="SEO optimized title"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">{formData.seo_title.length}/60 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo_description">SEO Description</Label>
                <Textarea
                  id="seo_description"
                  name="seo_description"
                  value={formData.seo_description}
                  onChange={(e) => handleInputChange("seo_description", e.target.value)}
                  placeholder="SEO meta description"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">{formData.seo_description.length}/160 characters</p>
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
              <div className="space-y-2">
                <Label htmlFor="category_id">Category *</Label>
                {categories.length === 0 && (
                  <p className="text-sm text-yellow-600 mb-2">
                    [DEBUG] No categories found. Categories length: {categories.length}
                  </p>
                )}
                <Select
                  name="category_id"
                  value={formData.category_id}
                  onValueChange={(value) => handleInputChange("category_id", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                />
                <input type="hidden" name="is_active" value={formData.is_active.toString()} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured">Featured</Label>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                />
                <input type="hidden" name="is_featured" value={formData.is_featured.toString()} />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadingImages}
                  />
                  <Button type="button" variant="outline" className="w-full bg-transparent" disabled={uploadingImages}>
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadingImages ? "Uploading..." : "Upload Images"}
                  </Button>
                </div>

                {images.length > 0 && (
                  <div className="space-y-2">
                    {images.map((image, index) => (
                      <div key={image.id} className="flex items-center gap-2 p-2 border rounded">
                        <img
                          src={image.image_url || "/placeholder.svg"}
                          alt={image.alt_text}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 text-sm">
                          <p className="truncate">{image.alt_text}</p>
                          {image.is_primary && <span className="text-xs text-green-600">Primary</span>}
                        </div>
                        <div className="flex gap-1">
                          {!image.is_primary && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => setPrimaryImage(image.id)}
                              className="text-xs"
                            >
                              Set Primary
                            </Button>
                          )}
                          <Button type="button" size="sm" variant="ghost" onClick={() => removeImage(image.id)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <input type="hidden" name="images" value={JSON.stringify(images)} />

                <p className="text-xs text-muted-foreground">
                  Upload high-quality images. First image will be the primary image.
                </p>
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
          {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  )
}
