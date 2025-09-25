import { OrderFulfillmentDashboard } from "@/components/admin/order-fulfillment-dashboard"

export default function FulfillmentPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Order Fulfillment</h1>
        <p className="text-muted-foreground">Manage and process orders efficiently</p>
      </div>

      <OrderFulfillmentDashboard />
    </div>
  )
}
