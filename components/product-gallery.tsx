"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductImage {
  id: string
  image_url: string
  alt_text: string | null
  position: number
  is_primary: boolean
}

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const sortedImages = images.sort((a, b) => a.position - b.position)

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % sortedImages.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + sortedImages.length) % sortedImages.length)
  }

  if (!sortedImages.length) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">No image available</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="relative aspect-square overflow-hidden group">
        <Image
          src={sortedImages[selectedImage]?.image_url || "/placeholder.svg"}
          alt={sortedImages[selectedImage]?.alt_text || productName}
          fill
          className="object-cover"
          priority
        />

        {sortedImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </Card>

      {/* Thumbnail Images */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                selectedImage === index ? "border-primary" : "border-border hover:border-primary/50"
              }`}
            >
              <Image
                src={image.image_url || "/placeholder.svg"}
                alt={image.alt_text || productName}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
