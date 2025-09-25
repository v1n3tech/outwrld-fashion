import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    short_description: string | null
    base_price: number
    compare_price: number | null
    product_images: Array<{
      image_url: string
      alt_text: string | null
      is_primary: boolean
    }>
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.product_images.find((img) => img.is_primary) || product.product_images[0]
  const hasDiscount = product.compare_price && product.compare_price > product.base_price
  const discountPercentage = hasDiscount
    ? Math.round(((product.compare_price! - product.base_price) / product.compare_price!) * 100)
    : 0

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        {primaryImage && (
          <Image
            src={primaryImage.image_url || "/placeholder.svg"}
            alt={primaryImage.alt_text || product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {hasDiscount && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">-{discountPercentage}%</Badge>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href={`/products/${product.slug}`}>Quick View</Link>
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>

          {product.short_description && (
            <p className="text-sm text-foreground/60 line-clamp-2">{product.short_description}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-semibold text-primary">{formatPrice(product.base_price)}</span>
            {hasDiscount && (
              <span className="text-sm text-foreground/50 line-through">{formatPrice(product.compare_price!)}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
