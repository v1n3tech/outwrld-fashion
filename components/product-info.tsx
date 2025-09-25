"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingBag, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { addToCart } from "@/lib/actions/cart-actions"
import { useRouter } from "next/navigation"

interface ProductVariant {
  id: string
  name: string
  sku: string
  price: number
  inventory_quantity: number
  variant_options: Array<{
    option_name: string
    option_value: string
  }>
}

interface ProductInfoProps {
  product: {
    id: string
    name: string
    description: string | null
    short_description: string | null
    base_price: number
    compare_price: number | null
    sku: string | null
    inventory_quantity: number
    material: string | null
    care_instructions: string | null
    tags: string[] | null
    product_variants: ProductVariant[]
    categories: {
      name: string
      slug: string
    } | null
  }
}

export function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter()
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

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

  const currentVariant = selectedVariant ? product.product_variants.find((v) => v.id === selectedVariant) : null

  const currentPrice = currentVariant ? currentVariant.price : product.base_price
  const currentStock = currentVariant ? currentVariant.inventory_quantity : product.inventory_quantity
  const isInStock = currentStock > 0

  // Group variants by option type (size, color, etc.)
  const variantOptions = product.product_variants.reduce(
    (acc, variant) => {
      variant.variant_options.forEach((option) => {
        if (!acc[option.option_name]) {
          acc[option.option_name] = new Set()
        }
        acc[option.option_name].add(option.option_value)
      })
      return acc
    },
    {} as Record<string, Set<string>>,
  )

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      await addToCart(product.id, selectedVariant || undefined, quantity)
      setAddedToCart(true)
      setTimeout(() => {
        setAddedToCart(false)
      }, 3000)
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Failed to add item to cart. Please try again.")
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        {product.categories && (
          <Badge variant="secondary" className="bg-secondary/20 text-secondary">
            {product.categories.name}
          </Badge>
        )}
        <h1 className="font-display text-3xl md:text-4xl font-bold text-balance">{product.name}</h1>
        {product.short_description && <p className="text-lg text-foreground/70">{product.short_description}</p>}
      </div>

      {/* Price */}
      <div className="flex items-center space-x-3">
        <span className="font-mono text-2xl font-bold text-primary">{formatPrice(currentPrice)}</span>
        {hasDiscount && (
          <>
            <span className="text-lg text-foreground/50 line-through">{formatPrice(product.compare_price!)}</span>
            <Badge className="bg-primary text-primary-foreground">-{discountPercentage}%</Badge>
          </>
        )}
      </div>

      {/* Variants */}
      {Object.keys(variantOptions).length > 0 && (
        <div className="space-y-4">
          {Object.entries(variantOptions).map(([optionName, values]) => (
            <div key={optionName} className="space-y-2">
              <label className="text-sm font-medium">{optionName}</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${optionName.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(values).map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Quantity</label>
            <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number.parseInt(value))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: Math.min(10, currentStock) }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-foreground/60">{isInStock ? `${currentStock} in stock` : "Out of stock"}</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            className={`flex-1 transition-all duration-300 ${
              addedToCart
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
            disabled={!isInStock || isAddingToCart}
            onClick={handleAddToCart}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            {isAddingToCart ? "Adding..." : addedToCart ? "Added to Cart!" : isInStock ? "Add to Cart" : "Out of Stock"}
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
          >
            <Heart className="mr-2 h-4 w-4" />
            Wishlist
          </Button>

          <Button size="lg" variant="outline">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-display font-semibold">Product Details</h3>

          {product.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-foreground/70">{product.description}</p>
            </div>
          )}

          {product.material && (
            <div>
              <h4 className="font-medium mb-2">Material</h4>
              <p className="text-sm text-foreground/70">{product.material}</p>
            </div>
          )}

          {product.care_instructions && (
            <div>
              <h4 className="font-medium mb-2">Care Instructions</h4>
              <p className="text-sm text-foreground/70">{product.care_instructions}</p>
            </div>
          )}

          {product.sku && (
            <div>
              <h4 className="font-medium mb-2">SKU</h4>
              <p className="text-sm font-mono text-foreground/70">{product.sku}</p>
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping & Returns */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Free Shipping</h4>
                <p className="text-xs text-foreground/60">On orders over ₦20,000</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                <RotateCcw className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Easy Returns</h4>
                <p className="text-xs text-foreground/60">30-day return policy</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Authentic</h4>
                <p className="text-xs text-foreground/60">100% genuine products</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
