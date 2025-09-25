"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { updateOrderStatus } from "@/lib/actions/order-actions"
import { toast } from "@/hooks/use-toast"
import { Package, Loader2 } from "lucide-react"

interface OrderStatusManagerProps {
  orderId: string
  currentStatus: string
}

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-yellow-500/10 text-yellow-600" },
  { value: "confirmed", label: "Confirmed", color: "bg-green-500/10 text-green-600" },
  { value: "processing", label: "Processing", color: "bg-blue-500/10 text-blue-600" },
  { value: "shipped", label: "Shipped", color: "bg-purple-500/10 text-purple-600" },
  { value: "delivered", label: "Delivered", color: "bg-green-500/10 text-green-600" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500/10 text-red-600" },
  { value: "refunded", label: "Refunded", color: "bg-gray-500/10 text-gray-600" },
]

export function OrderStatusManager({ orderId, currentStatus }: OrderStatusManagerProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [updating, setUpdating] = useState(false)

  const handleStatusUpdate = async () => {
    if (selectedStatus === currentStatus) return

    setUpdating(true)
    try {
      await updateOrderStatus(orderId, selectedStatus)
      toast({
        title: "Status updated",
        description: `Order status has been updated to ${selectedStatus}.`,
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Update failed",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      })
      setSelectedStatus(currentStatus) // Reset on error
    } finally {
      setUpdating(false)
    }
  }

  const currentStatusOption = statusOptions.find((option) => option.value === currentStatus)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Current Status</p>
          <Badge className={currentStatusOption?.color}>{currentStatusOption?.label}</Badge>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Update Status</p>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleStatusUpdate} disabled={selectedStatus === currentStatus || updating} className="w-full">
          {updating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Status"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
