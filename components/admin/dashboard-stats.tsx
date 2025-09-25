import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, DollarSign } from "lucide-react"

export async function DashboardStats() {
  const supabase = await createClient()

  // Fetch dashboard statistics
  const [{ count: totalProducts }, { count: totalOrders }, { count: totalCustomers }, { data: recentOrders }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
      supabase
        .from("orders")
        .select("total_amount")
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    ])

  // Calculate total revenue
  const totalRevenue = recentOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      description: "Last 30 days",
    },
    {
      title: "Orders",
      value: totalOrders?.toString() || "0",
      change: "+8.2%",
      trend: "up" as const,
      icon: ShoppingCart,
      description: "Total orders",
    },
    {
      title: "Products",
      value: totalProducts?.toString() || "0",
      change: "+2.1%",
      trend: "up" as const,
      icon: Package,
      description: "Active products",
    },
    {
      title: "Customers",
      value: totalCustomers?.toString() || "0",
      change: "+15.3%",
      trend: "up" as const,
      icon: Users,
      description: "Registered users",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Badge
                variant={stat.trend === "up" ? "default" : "destructive"}
                className={`flex items-center space-x-1 ${
                  stat.trend === "up" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                }`}
              >
                {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{stat.change}</span>
              </Badge>
              <span>{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
