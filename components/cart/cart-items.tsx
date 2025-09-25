"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, Minus, Loader2 } from "lucide-react"
import { updateCartItemQuantity, removeFromCart } from "@/lib/actions/cart-actions"
import { toast } from "@/hooks/use-toast"

interface CartItem {
  id: string
  user_id: string
  product_id: string
  variant_id: string | null
  quantity: number
  created_at: string
  updated_at: string
  products: {
    id: string
    name: string
    slug: string
    base_price: number
    product_images: Array<{
      image_url: string
      alt_text: string
      is_primary: boolean
    }>
  }
  product_variants: {
    id: string
    name: string
    price: number
  } | null
}

interface CartItemsProps {
  items: CartItem[]
  onItemsChange: () => void
}

export function CartItems({ items, onItemsChange }: CartItemsProps) {
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set())

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const setItemLoading = (itemId: string, loading: boolean) => {
    setLoadingItems((prev) => {
      const newSet = new Set(prev)
      if (loading) {
        newSet.add(itemId)
      } else {
        newSet.delete(itemId)
      }
      return newSet
    })
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setItemLoading(itemId, true)
    try {
      await updateCartItemQuantity(itemId, newQuantity)
      await onItemsChange()
      toast({
        title: "Cart updated",
        description: "Item quantity has been updated.",
      })
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast({
        title: "Update failed",
        description: "Failed to update item quantity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setItemLoading(itemId, false)
    }
  }

  const removeItem = async (itemId: string) => {
    setItemLoading(itemId, true)
    try {
      await removeFromCart(itemId)
      await onItemsChange()
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      })
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Remove failed",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setItemLoading(itemId, false)
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const product = item.products
        const variant = item.product_variants
        const primaryImage = product?.product_images?.find((img) => img.is_primary) || product?.product_images?.[0]
        const currentPrice = variant?.price || product?.base_price || 0
        const variantName = variant?.name
        const isLoading = loadingItems.has(item.id)

        return (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="relative aspect-square w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={primaryImage?.image_url || "/placeholder.svg?height=96&width=96&query=product"}
                    alt={primaryImage?.alt_text || product?.name || "Product"}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <Link
                      href={`/products/${product?.slug}`}
                      className="font-medium hover:text-primary transition-colors line-clamp-2"
                    >
                      {product?.name}
                    </Link>
                    {variantName && <p className="text-sm text-muted-foreground mt-1">{variantName}</p>}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium">Qty:</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isLoading}
                        >
                          {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Minus className="h-3 w-3" />}
                        </Button>

                        <span className="w-12 text-center font-mono font-medium">{item.quantity}</span>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isLoading}
                        >
                          {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <div className="font-mono font-semibold text-primary text-lg">
                          {formatPrice(currentPrice * item.quantity)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-muted-foreground">{formatPrice(currentPrice)} each</div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(item.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
