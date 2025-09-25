"use client"

import { useState, useEffect } from "react"
import { CartItems } from "./cart-items"
import { CartSummary } from "./cart-summary"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Loader2, Trash2 } from "lucide-react"
import Link from "next/link"
import { getCartItems, clearCart } from "@/lib/actions/cart-actions"

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

export function CartContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clearing, setClearing] = useState(false)

  const loadCartItems = async () => {
    try {
      setError(null)
      const items = await getCartItems()
      setCartItems(items)
    } catch (error) {
      console.error("Error loading cart items:", error)
      setError("Failed to load cart items. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear your entire cart?")) {
      return
    }

    setClearing(true)
    try {
      await clearCart()
      await loadCartItems()
      // toast notification would be handled by the cart items component
    } catch (error) {
      console.error("Error clearing cart:", error)
      setError("Failed to clear cart. Please try again.")
    } finally {
      setClearing(false)
    }
  }

  useEffect(() => {
    loadCartItems()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/4 mx-auto"></div>
                <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <h3 className="font-display text-xl font-semibold text-destructive">Error Loading Cart</h3>
            <p className="text-foreground/60">{error}</p>
            <Button onClick={loadCartItems} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="space-y-6">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-semibold">Your cart is empty</h3>
              <p className="text-foreground/60 text-pretty">
                Discover our amazing products and add some items to get started.
              </p>
            </div>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/shop">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Start Shopping
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {cartItems.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-xl font-semibold">Cart Items ({cartItems.length})</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCart}
              disabled={clearing}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
            >
              {clearing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cart
                </>
              )}
            </Button>
          </div>
        )}
        <CartItems items={cartItems} onItemsChange={loadCartItems} />
      </div>
      <div>
        <CartSummary items={cartItems} />
      </div>
    </div>
  )
}
