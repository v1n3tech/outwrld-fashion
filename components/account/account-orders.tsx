"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCustomerOrders, getCustomerOrderStats } from "@/lib/actions/customer-order-actions"
import Link from "next/link"
import { Eye, Package, Search, Loader2 } from "lucide-react"

interface AccountOrdersProps {
  userId: string
}

export function AccountOrders({ userId }: AccountOrdersProps) {
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, statsData] = await Promise.all([
          getCustomerOrders(userId, 50),
          getCustomerOrderStats(userId),
        ])
        setOrders(ordersData)
        setStats(statsData)
      } catch (error) {
        console.error("Error loading orders:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [userId])

  useEffect(() => {
    let filtered = orders

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.order_items?.some((item: any) => item.product_name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display">Order History</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Order Stats */}
      {stats.total_orders > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total_orders}</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{formatCurrency(stats.total_spent)}</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.pending_orders}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed_orders}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Order History */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display">Order History</CardTitle>
          {orders.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium font-mono">{order.order_number}</span>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{formatDate(order.created_at)}</div>
                      {order.tracking_number && (
                        <div className="text-xs text-muted-foreground font-mono">Tracking: {order.tracking_number}</div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-semibold font-mono">{formatCurrency(order.total_amount)}</div>
                        <Badge variant={order.payment_status === "paid" ? "default" : "secondary"} className="text-xs">
                          {order.payment_status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/account/orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {order.order_items && order.order_items.length > 0 && (
                    <div className="pt-2 border-t border-border">
                      <div className="text-sm text-muted-foreground">
                        {order.order_items.length} item{order.order_items.length !== 1 ? "s" : ""} •{" "}
                        {order.order_items.slice(0, 2).map((item: any, index: number) => (
                          <span key={item.id}>
                            {item.product_name}
                            {index < Math.min(order.order_items.length, 2) - 1 && ", "}
                          </span>
                        ))}
                        {order.order_items.length > 2 && ` +${order.order_items.length - 2} more`}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="text-center py-8">
              <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No orders match your search criteria.</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
              <Button asChild>
                <Link href="/shop">Browse Products</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
