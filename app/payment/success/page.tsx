"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, ArrowRight, AlertCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "failed">("loading")
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const reference = searchParams.get("reference")

    if (reference) {
      verifyPayment(reference)
    } else {
      setVerificationStatus("failed")
      setErrorMessage("No payment reference found in URL")
    }
  }, [searchParams])

  const verifyPayment = async (reference: string) => {
    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reference }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Payment verification failed")
      }

      const data = await response.json()

      if (data.status === "success") {
        setVerificationStatus("success")
        setOrderDetails(data.order)
      } else {
        setVerificationStatus("failed")
        setErrorMessage(`Payment status: ${data.status}`)
      }
    } catch (error) {
      console.error("Payment verification error:", error)
      setVerificationStatus("failed")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred")
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (verificationStatus === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Verifying your payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (verificationStatus === "failed") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
            <CardTitle className="text-destructive">Payment Verification Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              We couldn't verify your payment. Please contact support if you believe this is an error.
            </p>
            {errorMessage && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                Error: {errorMessage}
              </div>
            )}
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/cart">Return to Cart</Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-display font-bold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Thank you for your order. We've received your payment and will process your order shortly.
            </p>
          </div>

          {/* Order Details */}
          {orderDetails && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="font-display">Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono">{orderDetails.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-mono font-semibold">{formatPrice(orderDetails.total_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status</span>
                  <span className="text-green-600 font-medium capitalize">{orderDetails.payment_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Status</span>
                  <span className="text-blue-600 font-medium capitalize">{orderDetails.order_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Reference</span>
                  <span className="font-mono text-xs">{orderDetails.payment_reference}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Package className="h-5 w-5" />
                What's Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <p className="font-medium">Order Confirmation</p>
                  <p className="text-sm text-muted-foreground">
                    You'll receive an email confirmation shortly with your order details.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <p className="font-medium">Processing</p>
                  <p className="text-sm text-muted-foreground">
                    We'll prepare your order for shipping within 1-2 business days.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <p className="font-medium">Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    Your order will be delivered within 3-5 business days.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1">
              <Link href="/account/orders">
                View Order History
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1 bg-transparent">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
