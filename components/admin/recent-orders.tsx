import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export async function RecentOrders() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      total_amount,
      status,
      payment_status,
      created_at,
      profiles (
        first_name,
        last_name
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display">Recent Orders</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium font-mono">{order.order_number}</span>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.profiles?.first_name && order.profiles?.last_name
                      ? `${order.profiles.first_name} ${order.profiles.last_name}`
                      : "Guest Order"}
                  </div>
                  <div className="text-xs text-muted-foreground">{formatDate(order.created_at)}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold font-mono">{formatCurrency(order.total_amount)}</div>
                  <Badge variant={order.payment_status === "paid" ? "default" : "secondary"} className="text-xs">
                    {order.payment_status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recent orders</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
