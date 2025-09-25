import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { OrderStatusTimeline } from "@/components/order/order-status-timeline"
import { OrderProgressBar } from "@/components/order/order-progress-bar"
import { ArrowLeft, Package, MapPin, CreditCard, Phone, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { redirect, notFound } from "next/navigation"

interface CustomerOrderDetailPageProps {
  params: {
    id: string
  }
}

export default async function CustomerOrderDetailPage({ params }: CustomerOrderDetailPageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  try {
    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          product_id,
          variant_id,
          product_name,
          variant_name,
          sku,
          price,
          quantity,
          total,
          products (
            slug,
            product_images (
              image_url,
              alt_text,
              is_primary
            )
          )
        )
      `)
      .eq("id", params.id)
      .eq("user_id", user.id) // Ensure user can only see their own orders
      .single()

    if (error || !order) {
      notFound()
    }

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
      }).format(amount)
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    const getStatusColor = (status: string) => {
      switch (status) {
        case "confirmed":
          return "bg-green-500/10 text-green-600"
        case "processing":
          return "bg-blue-500/10 text-blue-600"
        case "shipped":
          return "bg-purple-500/10 text-purple-600"
        case "delivered":
          return "bg-green-500/10 text-green-600"
        case "cancelled":
          return "bg-red-500/10 text-red-600"
        default:
          return "bg-yellow-500/10 text-yellow-600"
      }
    }

    return (
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="container max-w-screen-xl px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/account">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                <span className="text-primary">ORDER</span>{" "}
                <span className="text-foreground">{order.order_number}</span>
              </h1>
              <p className="text-foreground/70">Placed on {formatDate(order.created_at)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
              <Badge variant={order.payment_status === "paid" ? "default" : "secondary"}>{order.payment_status}</Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <OrderProgressBar status={order.status} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status Timeline */}
              <OrderStatusTimeline
                status={order.status}
                paymentStatus={order.payment_status}
                createdAt={order.created_at}
                shippedAt={order.shipped_at}
                deliveredAt={order.delivered_at}
                trackingNumber={order.tracking_number}
              />

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.order_items?.map((item) => {
                    const primaryImage =
                      item.products?.product_images?.find((img) => img.is_primary) || item.products?.product_images?.[0]

                    return (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={primaryImage?.image_url || "/placeholder.svg?height=64&width=64&query=product"}
                            alt={primaryImage?.alt_text || item.product_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product_name}</h4>
                          {item.variant_name && <p className="text-sm text-muted-foreground">{item.variant_name}</p>}
                          {item.sku && <p className="text-xs text-muted-foreground font-mono">SKU: {item.sku}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Qty: {item.quantity}</p>
                          <p className="text-sm text-muted-foreground">{formatCurrency(item.price)} each</p>
                          <p className="font-semibold">{formatCurrency(item.total)}</p>
                        </div>
                      </div>
                    )
                  })}

                  <Separator />

                  {/* Order Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    {order.tax_amount > 0 && (
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>{formatCurrency(order.tax_amount)}</span>
                      </div>
                    )}
                    {order.shipping_amount > 0 && (
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{formatCurrency(order.shipping_amount)}</span>
                      </div>
                    )}
                    {order.discount_amount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatCurrency(order.discount_amount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(order.total_amount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={order.payment_status === "paid" ? "default" : "secondary"} className="mb-3">
                    {order.payment_status}
                  </Badge>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Paid</span>
                      <span className="font-mono font-semibold">{formatCurrency(order.total_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Currency</span>
                      <span>{order.currency}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              {order.shipping_first_name && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">
                        {order.shipping_first_name} {order.shipping_last_name}
                      </p>
                      {order.shipping_company && <p>{order.shipping_company}</p>}
                      <p>{order.shipping_address_1}</p>
                      {order.shipping_address_2 && <p>{order.shipping_address_2}</p>}
                      <p>
                        {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                      </p>
                      <p>{order.shipping_country}</p>
                      {order.shipping_phone && (
                        <div className="flex items-center gap-2 mt-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{order.shipping_phone}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Have questions about your order? We're here to help.
                  </p>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/contact">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Support
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    )
  } catch (error) {
    console.error("Error loading order:", error)
    notFound()
  }
}
