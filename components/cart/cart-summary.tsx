"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingBag, Tag, Loader2, Shield, Truck, RotateCcw, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface CartItem {
  id: string
  user_id: string
  product_id: string
  variant_id: string | null
  quantity: number
  products: {
    id: string
    name: string
    slug: string
    base_price: number
  }
  product_variants: {
    id: string
    name: string
    price: number
  } | null
}

interface CartSummaryProps {
  items: CartItem[]
}

interface ShippingCalculation {
  zone_name: string
  method_name: string
  calculated_rate: number
  is_free_shipping: boolean
  delivery_time: string
}

// Nigerian states for shipping calculation
const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
]

// Plateau State LGAs
const PLATEAU_LGAS = [
  "Barkin Ladi",
  "Bassa",
  "Bokkos",
  "Jos East",
  "Jos North",
  "Jos South",
  "Kanam",
  "Kanke",
  "Langtang North",
  "Langtang South",
  "Mangu",
  "Mikang",
  "Pankshin",
  "Qua'an Pan",
  "Riyom",
  "Shendam",
  "Wase",
]

export function CartSummary({ items }: CartSummaryProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [discountCode, setDiscountCode] = useState("")
  const [discountApplied, setDiscountApplied] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [selectedState, setSelectedState] = useState("Plateau")
  const [selectedCity, setSelectedCity] = useState("Jos North")
  const [shippingCalculation, setShippingCalculation] = useState<ShippingCalculation>({
    zone_name: "Jos North LGA",
    method_name: "Standard",
    calculated_rate: 0,
    is_free_shipping: true,
    delivery_time: "Same day",
  })
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false)
  const supabase = createClient()

  // Calculate totals
  const subtotal = items.reduce((total, item) => {
    const price = item.product_variants?.price || item.products?.base_price || 0
    return total + price * item.quantity
  }, 0)

  const shipping = shippingCalculation.calculated_rate
  const tax = 0 // No tax for now
  const discount = discountApplied ? Math.min(subtotal * 0.1, 5000) : 0 // 10% discount, max ₦5,000
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

    getUser()
  }, [supabase])

  useEffect(() => {
    const calculateShipping = async () => {
      if (subtotal === 0) return

      setIsCalculatingShipping(true)
      try {
        const response = await fetch("/api/shipping/calculate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subtotal,
            total_weight: items.reduce((weight, item) => weight + item.quantity * 0.5, 0), // Assume 0.5kg per item
            destination_state: selectedState,
            destination_city: selectedState === "Plateau" ? selectedCity : null,
            method_code: "standard",
          }),
        })

        if (response.ok) {
          const calculation = await response.json()
          setShippingCalculation(calculation)
        } else {
          // Fallback to simple calculation
          const fallbackShipping = subtotal >= 20000 ? 0 : 2000
          setShippingCalculation({
            zone_name: "Default Zone",
            method_name: "Standard",
            calculated_rate: fallbackShipping,
            is_free_shipping: fallbackShipping === 0,
            delivery_time: "3-5 days",
          })
        }
      } catch (error) {
        console.error("Shipping calculation failed:", error)
        // Fallback to simple calculation
        const fallbackShipping = subtotal >= 20000 ? 0 : 2000
        setShippingCalculation({
          zone_name: "Default Zone",
          method_name: "Standard",
          calculated_rate: fallbackShipping,
          is_free_shipping: fallbackShipping === 0,
          delivery_time: "3-5 days",
        })
      } finally {
        setIsCalculatingShipping(false)
      }
    }

    calculateShipping()
  }, [subtotal, selectedState, selectedCity, items])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const applyDiscount = () => {
    if (discountCode.toLowerCase() === "welcome10") {
      setDiscountApplied(true)
    }
  }

  const handleCheckout = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login?redirect=/cart")
      return
    }

    if (items.length === 0) {
      return
    }

    setIsLoading(true)
    try {
      // Create order with dynamic shipping
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart_items: items.map((item) => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
          })),
          shipping_address: {
            street: "123 Main St",
            city: selectedCity || selectedState,
            state: selectedState,
            country: "Nigeria",
            postal_code: "100001",
          },
          billing_address: {
            street: "123 Main St",
            city: selectedCity || selectedState,
            state: selectedState,
            country: "Nigeria",
            postal_code: "100001",
          },
          discount_code: discountApplied ? discountCode : null,
          shipping_calculation: shippingCalculation,
        }),
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || "Failed to create order")
      }

      const { order } = await orderResponse.json()

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
      window.location.href = authorization_url
    } catch (error) {
      alert(`Checkout failed: ${error instanceof Error ? error.message : "Please try again."}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Delivery Location
          </label>
          <div className="space-y-2">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {NIGERIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedState === "Plateau" && (
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select LGA" />
                </SelectTrigger>
                <SelectContent>
                  {PLATEAU_LGAS.map((lga) => (
                    <SelectItem key={lga} value={lga}>
                      {lga}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <div>Zone: {shippingCalculation.zone_name}</div>
            <div>Method: {shippingCalculation.method_name}</div>
            <div>Delivery: {shippingCalculation.delivery_time}</div>
          </div>
        </div>

        {/* Free Shipping Progress - Updated for dynamic calculation */}
        {!shippingCalculation.is_free_shipping && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-primary" />
              <span>Current shipping: {formatPrice(shipping)}</span>
            </div>
          </div>
        )}

        {/* Discount Code */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Discount Code</label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter code (try: WELCOME10)"
              className="flex-1"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              disabled={discountApplied}
            />
            <Button variant="outline" size="icon" onClick={applyDiscount} disabled={discountApplied || !discountCode}>
              <Tag className="h-4 w-4" />
            </Button>
          </div>
          {discountApplied && <p className="text-sm text-primary">✓ Discount code applied!</p>}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>
              Subtotal ({items.length} {items.length === 1 ? "item" : "items"})
            </span>
            <span className="font-mono">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Truck className="h-3 w-3" />
              Shipping
              {isCalculatingShipping && <Loader2 className="h-3 w-3 animate-spin" />}
            </span>
            <span className="font-mono">
              {shippingCalculation.is_free_shipping ? (
                <span className="text-primary font-medium">Free</span>
              ) : (
                formatPrice(shipping)
              )}
            </span>
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
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span className="font-mono text-primary">{formatPrice(total)}</span>
        </div>

        {/* Checkout Button */}
        <Button
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleCheckout}
          disabled={isLoading || items.length === 0 || isCalculatingShipping}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Proceed to Checkout
            </>
          )}
        </Button>

        {/* Trust Indicators */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Secure checkout with SSL encryption</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Truck className="h-3 w-3" />
            <span>Dynamic shipping rates based on location</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <RotateCcw className="h-3 w-3" />
            <span>30-day return policy</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
