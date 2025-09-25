"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Tag } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { getCartItems } from "@/lib/actions/cart-actions"

export function CartSummary() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [discountCode, setDiscountCode] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [cartItems, setCartItems] = useState<any[]>([])
  const supabase = createClient()

  const subtotal = cartItems.reduce((total, item) => {
    const price = item.product_variants?.price || item.products?.base_price || 0
    return total + price * item.quantity
  }, 0)

  const shipping = subtotal >= 20000 ? 0 : 2000 // Free shipping over ₦20,000
  const tax = 0
  const discount = 0
  const total = subtotal + shipping + tax - discount

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
    }

    const loadCartItems = async () => {
      try {
        const items = await getCartItems()
        setCartItems(items)
      } catch (error) {
        console.error("Error loading cart items:", error)
      }
    }

    getUser()
    loadCartItems()
  }, [supabase])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleCheckout = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login?redirect=/cart")
      return
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty")
      return
    }

    setIsLoading(true)
    try {
      console.log("[v0] Starting checkout with cart items:", cartItems)

      // Create order first
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart_items: cartItems.map((item) => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
          })),
          shipping_address: {
            street: "123 Main St",
            city: "Lagos",
            state: "Lagos",
            country: "Nigeria",
            postal_code: "100001",
          },
          billing_address: {
            street: "123 Main St",
            city: "Lagos",
            state: "Lagos",
            country: "Nigeria",
            postal_code: "100001",
          },
          discount_code: discountCode || null,
        }),
      })

      console.log("[v0] Order response status:", orderResponse.status)

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({ error: "Unknown error" }))
        console.log("[v0] Order creation failed:", errorData)
        throw new Error(errorData.error || "Failed to create order")
      }

      const { order } = await orderResponse.json()
      console.log("[v0] Order created successfully:", order.id)

      // Initialize payment
      const paymentResponse = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          amount: total,
          callback_url: `${window.location.origin}/payment/success`,
          metadata: {
            order_id: order.id,
          },
        }),
      })

      if (!paymentResponse.ok) {
        throw new Error("Failed to initialize payment")
      }

      const { authorization_url } = await paymentResponse.json()

      // Redirect to Paystack payment page
      window.location.href = authorization_url
    } catch (error) {
      console.error("[v0] Checkout error:", error)
      alert(`Checkout failed: ${error instanceof Error ? error.message : "Please try again."}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="font-display">Order Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Discount Code */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Discount Code</label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter code"
              className="flex-1"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <Button variant="outline" size="icon">
              <Tag className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-mono">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span className="font-mono">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>

          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span className="font-mono">{formatPrice(tax)}</span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between text-sm text-primary">
              <span>Discount</span>
              <span className="font-mono">-{formatPrice(discount)}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span className="font-mono text-primary">{formatPrice(total)}</span>
        </div>

        {/* Checkout Button */}
        <Button
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleCheckout}
          disabled={isLoading || cartItems.length === 0}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          {isLoading ? "Processing..." : "Proceed to Checkout"}
        </Button>

        {/* Shipping Info */}
        <div className="text-xs text-foreground/60 space-y-1">
          <p>• Free shipping on orders over ₦20,000</p>
          <p>• Delivery within 3-5 business days</p>
          <p>• 30-day return policy</p>
        </div>
      </CardContent>
    </Card>
  )
}
