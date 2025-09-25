import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentOrders } from "@/components/admin/recent-orders"
import { LowStockProducts } from "@/components/admin/low-stock-products"

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold">
          <span className="text-primary">ADMIN</span> <span className="text-foreground">DASHBOARD</span>
        </h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats */}
      <DashboardStats />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders />
        <LowStockProducts />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 border border-border rounded-lg bg-card">
          <h3 className="font-display font-semibold mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <a
              href="/admin/products/new"
              className="block text-sm text-primary hover:text-primary/80 transition-colors"
            >
              + Add New Product
            </a>
            <a href="/admin/events/new" className="block text-sm text-primary hover:text-primary/80 transition-colors">
              + Create Event
            </a>
            <a href="/admin/orders" className="block text-sm text-primary hover:text-primary/80 transition-colors">
              → View All Orders
            </a>
          </div>
        </div>

        <div className="p-6 border border-border rounded-lg bg-card">
          <h3 className="font-display font-semibold mb-2">Store Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Store Status:</span>
              <span className="text-green-600">Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Backup:</span>
              <span>2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">System Health:</span>
              <span className="text-green-600">Good</span>
            </div>
          </div>
        </div>

        <div className="p-6 border border-border rounded-lg bg-card">
          <h3 className="font-display font-semibold mb-2">Recent Activity</h3>
          <div className="space-y-2 text-sm">
            <div className="text-muted-foreground">New order #OW20250105001</div>
            <div className="text-muted-foreground">Product "Lagos Nights Hoodie" updated</div>
            <div className="text-muted-foreground">Customer John Doe registered</div>
          </div>
        </div>
      </div>
    </div>
  )
}
