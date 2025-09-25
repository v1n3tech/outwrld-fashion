"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Circle, Clock, Package, Truck, MapPin, XCircle } from "lucide-react"

interface OrderStatusTimelineProps {
  status: string
  paymentStatus: string
  createdAt: string
  shippedAt?: string | null
  deliveredAt?: string | null
  trackingNumber?: string | null
}

const statusSteps = [
  {
    key: "pending",
    label: "Order Placed",
    description: "Your order has been received",
    icon: Clock,
  },
  {
    key: "confirmed",
    label: "Order Confirmed",
    description: "Payment confirmed and order verified",
    icon: CheckCircle,
  },
  {
    key: "processing",
    label: "Processing",
    description: "Your order is being prepared",
    icon: Package,
  },
  {
    key: "shipped",
    label: "Shipped",
    description: "Your order is on its way",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Delivered",
    description: "Your order has been delivered",
    icon: MapPin,
  },
]

export function OrderStatusTimeline({
  status,
  paymentStatus,
  createdAt,
  shippedAt,
  deliveredAt,
  trackingNumber,
}: OrderStatusTimelineProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStepStatus = (stepKey: string) => {
    const statusOrder = ["pending", "confirmed", "processing", "shipped", "delivered"]
    const currentIndex = statusOrder.indexOf(status)
    const stepIndex = statusOrder.indexOf(stepKey)

    if (status === "cancelled") {
      return stepIndex === 0 ? "completed" : "cancelled"
    }

    if (stepIndex <= currentIndex) {
      return "completed"
    } else if (stepIndex === currentIndex + 1) {
      return "current"
    } else {
      return "upcoming"
    }
  }

  const getStepDate = (stepKey: string) => {
    switch (stepKey) {
      case "pending":
      case "confirmed":
        return createdAt
      case "shipped":
        return shippedAt
      case "delivered":
        return deliveredAt
      default:
        return null
    }
  }

  const getStatusColor = (stepStatus: string) => {
    switch (stepStatus) {
      case "completed":
        return "text-green-600"
      case "current":
        return "text-blue-600"
      case "cancelled":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getIconComponent = (stepKey: string, stepStatus: string) => {
    const IconComponent = statusSteps.find((step) => step.key === stepKey)?.icon || Circle

    if (status === "cancelled" && stepKey !== "pending") {
      return <XCircle className="h-5 w-5 text-red-600" />
    }

    if (stepStatus === "completed") {
      return <CheckCircle className="h-5 w-5 text-green-600 fill-green-100" />
    } else if (stepStatus === "current") {
      return <IconComponent className="h-5 w-5 text-blue-600" />
    } else {
      return <Circle className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Current Status Badge */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Order Status</h3>
              <Badge
                variant={status === "delivered" ? "default" : status === "cancelled" ? "destructive" : "secondary"}
                className="text-sm"
              >
                {status}
              </Badge>
            </div>
            {paymentStatus && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Payment</p>
                <Badge variant={paymentStatus === "paid" ? "default" : "secondary"}>{paymentStatus}</Badge>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {statusSteps.map((step, index) => {
              const stepStatus = getStepStatus(step.key)
              const stepDate = getStepDate(step.key)
              const isLast = index === statusSteps.length - 1

              return (
                <div key={step.key} className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex flex-col items-center">
                    {getIconComponent(step.key, stepStatus)}
                    {!isLast && (
                      <div className={`w-px h-8 mt-2 ${stepStatus === "completed" ? "bg-green-200" : "bg-muted"}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${getStatusColor(stepStatus)}`}>{step.label}</h4>
                      {stepDate && stepStatus === "completed" && (
                        <span className="text-sm text-muted-foreground">{formatDate(stepDate)}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>

                    {/* Special content for shipped status */}
                    {step.key === "shipped" && trackingNumber && stepStatus === "completed" && (
                      <div className="mt-2 p-2 bg-muted rounded text-sm">
                        <span className="font-medium">Tracking: </span>
                        <span className="font-mono">{trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Cancelled Status */}
          {status === "cancelled" && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Order Cancelled</span>
              </div>
              <p className="text-sm text-red-600 mt-1">This order has been cancelled and will not be processed.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
