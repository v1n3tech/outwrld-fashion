"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateOrderTracking } from "@/lib/actions/order-actions"
import { toast } from "@/hooks/use-toast"
import { Truck, Loader2 } from "lucide-react"

interface OrderTrackingManagerProps {
  orderId: string
  currentTracking?: string | null
  status: string
}

export function OrderTrackingManager({ orderId, currentTracking, status }: OrderTrackingManagerProps) {
  const [trackingNumber, setTrackingNumber] = useState(currentTracking || "")
  const [updating, setUpdating] = useState(false)

  const handleTrackingUpdate = async () => {
    if (trackingNumber === currentTracking) return

    setUpdating(true)
    try {
      await updateOrderTracking(orderId, trackingNumber)
      toast({
        title: "Tracking updated",
        description: "Tracking number has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating tracking:", error)
      toast({
        title: "Update failed",
        description: "Failed to update tracking number. Please try again.",
        variant: "destructive",
      })
      setTrackingNumber(currentTracking || "") // Reset on error
    } finally {
      setUpdating(false)
    }
  }

  const canUpdateTracking = status === "shipped" || status === "processing"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentTracking && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Tracking</p>
            <p className="font-mono text-sm bg-muted p-2 rounded">{currentTracking}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="tracking">Tracking Number</Label>
          <Input
            id="tracking"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number"
            disabled={!canUpdateTracking}
          />
          {!canUpdateTracking && (
            <p className="text-xs text-muted-foreground">
              Tracking can only be updated for processing or shipped orders
            </p>
          )}
        </div>

        <Button
          onClick={handleTrackingUpdate}
          disabled={trackingNumber === currentTracking || updating || !canUpdateTracking}
          className="w-full"
        >
          {updating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Tracking"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
