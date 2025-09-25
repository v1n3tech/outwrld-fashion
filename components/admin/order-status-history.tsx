"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User } from "lucide-react"

interface StatusChange {
  id: string
  from_status: string
  to_status: string
  changed_by: string
  changed_at: string
  notes?: string
}

interface OrderStatusHistoryProps {
  orderId: string
  currentStatus: string
  createdAt: string
  updatedAt: string
}

export function OrderStatusHistory({ orderId, currentStatus, createdAt, updatedAt }: OrderStatusHistoryProps) {
  const [statusHistory, setStatusHistory] = useState<StatusChange[]>([])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  // For now, we'll create a simple history based on the order dates
  // In a real implementation, you'd store status changes in a separate table
  const getSimulatedHistory = () => {
    const history = [
      {
        id: "1",
        from_status: "",
        to_status: "pending",
        changed_by: "System",
        changed_at: createdAt,
        notes: "Order created",
      },
    ]

    if (currentStatus !== "pending") {
      history.push({
        id: "2",
        from_status: "pending",
        to_status: currentStatus,
        changed_by: "Admin",
        changed_at: updatedAt,
        notes: `Status updated to ${currentStatus}`,
      })
    }

    return history
  }

  useEffect(() => {
    // In a real implementation, you'd fetch the actual status history from the database
    setStatusHistory(getSimulatedHistory())
  }, [orderId, currentStatus, createdAt, updatedAt])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Status History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusHistory.map((change, index) => (
            <div key={change.id} className="flex items-start space-x-3">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 bg-primary rounded-full" />
                {index < statusHistory.length - 1 && <div className="w-px h-8 bg-muted mt-2" />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  {change.from_status && (
                    <>
                      <Badge variant="outline" className="text-xs">
                        {change.from_status}
                      </Badge>
                      <span className="text-muted-foreground">→</span>
                    </>
                  )}
                  <Badge className={getStatusColor(change.to_status)}>{change.to_status}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>{change.changed_by}</span>
                  <span>•</span>
                  <span>{formatDate(change.changed_at)}</span>
                </div>
                {change.notes && <p className="text-sm text-muted-foreground">{change.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
