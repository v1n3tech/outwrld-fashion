"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, Minus } from "lucide-react"
import { updateCartItemQuantity, removeFromCart, getCartItems } from "@/lib/actions/cart-actions"

export function CartItems() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const loadCartItems = async () => {
    try {
      const items = await getCartItems()
      setCartItems(items)
    } catch (error) {
      console.error("Error loading cart items:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCartItems()
  }, [])

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      await updateCartItemQuantity(itemId, newQuantity)
      await loadCartItems() // Refresh cart items
    } catch (error) {
      console.error("Error updating quantity:", error)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId)
      await loadCartItems() // Refresh cart items
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>Loading cart items...</p>
        </CardContent>
      </Card>
    )
  }

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <h3 className="font-display text-xl font-semibold">Your cart is empty</h3>
            <p className="text-foreground/60">Add some items to get started.</p>
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {cartItems.map((item) => {
        const product = item.products
        const variant = item.product_variants
        const primaryImage = product?.product_images?.find((img: any) => img.is_primary) || product?.product_images?.[0]
        const currentPrice = variant?.price || product?.base_price || 0
        const variantName = variant?.name

        return (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="relative aspect-square w-full sm:w-24 h-24 rounded-md overflow-hidden">
                  <Image
                    src={primaryImage?.image_url || "/placeholder.svg"}
                    alt={primaryImage?.alt_text || product?.name || "Product"}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 space-y-2">
                  <div>
                    <Link
                      href={`/products/${product?.slug}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {product?.name}
                    </Link>
                    {variantName && <p className="text-sm text-foreground/60">{variantName}</p>}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <span className="w-8 text-center font-mono">{item.quantity}</span>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className="font-mono font-semibold text-primary">
                        {formatPrice(currentPrice * item.quantity)}
                      </span>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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
