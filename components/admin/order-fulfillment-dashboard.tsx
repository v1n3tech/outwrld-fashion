"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getOrders, updateOrderStatus, exportOrders } from "@/lib/actions/order-actions"
import { toast } from "@/hooks/use-toast"
import { Package, Truck, CheckCircle, Clock, Download, Loader2 } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  order_number: string
  email: string
  status: string
  payment_status: string
  total_amount: number
  created_at: string
  profiles?: {
    first_name?: string
    last_name?: string
  }
}

export function OrderFulfillmentDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)

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
      month: "short",
      day: "numeric",
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

  const loadOrders = async () => {
    try {
      const data = await getOrders({ status: "confirmed" }, 100) // Focus on orders ready for fulfillment
      setOrders(data)
    } catch (error) {
      console.error("Error loading orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    const newSelected = new Set(selectedOrders)
    if (checked) {
      newSelected.add(orderId)
    } else {
      newSelected.delete(orderId)
    }
    setSelectedOrders(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(new Set(orders.map((order) => order.id)))
    } else {
      setSelectedOrders(new Set())
    }
  }

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedOrders.size === 0) {
      toast({
        title: "No orders selected",
        description: "Please select orders to update.",
        variant: "destructive",
      })
      return
    }

    setBulkActionLoading(true)
    try {
      const promises = Array.from(selectedOrders).map((orderId) => updateOrderStatus(orderId, newStatus))
      await Promise.all(promises)

      toast({
        title: "Orders updated",
        description: `${selectedOrders.size} orders updated to ${newStatus}.`,
      })

      setSelectedOrders(new Set())
      await loadOrders()
    } catch (error) {
      console.error("Error updating orders:", error)
      toast({
        title: "Update failed",
        description: "Failed to update orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const { headers, data } = await exportOrders()

      // Create CSV content
      const csvContent = [headers.join(","), ...data.map((row) => row.join(","))].join("\n")

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Export successful",
        description: "Orders have been exported to CSV.",
      })
    } catch (error) {
      console.error("Error exporting orders:", error)
      toast({
        title: "Export failed",
        description: "Failed to export orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setExportLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const fulfillmentStats = {
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">{fulfillmentStats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{fulfillmentStats.confirmed}</div>
            <div className="text-sm text-muted-foreground">Ready to Process</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{fulfillmentStats.processing}</div>
            <div className="text-sm text-muted-foreground">Processing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Truck className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{fulfillmentStats.shipped}</div>
            <div className="text-sm text-muted-foreground">Shipped</div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.size > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{selectedOrders.size} orders selected</span>
                <Select onValueChange={handleBulkStatusUpdate}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Bulk action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Mark as Processing</SelectItem>
                    <SelectItem value="shipped">Mark as Shipped</SelectItem>
                    <SelectItem value="delivered">Mark as Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancel Orders</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={() => setSelectedOrders(new Set())}>
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order Fulfillment Queue</CardTitle>
            <Button variant="outline" onClick={handleExport} disabled={exportLoading}>
              {exportLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedOrders.size === orders.length && orders.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedOrders.has(order.id)}
                      onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium font-mono">{order.order_number}</div>
                      <div className="text-sm text-muted-foreground">{order.id.slice(0, 8)}...</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {order.profiles?.first_name && order.profiles?.last_name
                          ? `${order.profiles.first_name} ${order.profiles.last_name}`
                          : "Guest"}
                      </div>
                      <div className="text-sm text-muted-foreground">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.payment_status === "paid" ? "default" : "secondary"}>
                      {order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono font-semibold">{formatCurrency(order.total_amount)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(order.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/orders/${order.id}`}>View</Link>
                      </Button>
                      {order.status === "confirmed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBulkStatusUpdate("processing")}
                          disabled={bulkActionLoading}
                        >
                          Process
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">No orders to fulfill</h3>
              <p className="text-muted-foreground">Orders ready for fulfillment will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
