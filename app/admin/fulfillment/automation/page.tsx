import { FulfillmentWorkflowAutomation } from "@/components/admin/fulfillment-workflow-automation"

export default function FulfillmentAutomationPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Fulfillment Automation</h1>
        <p className="text-muted-foreground">Configure automated workflows to streamline order processing</p>
      </div>

      <FulfillmentWorkflowAutomation />
    </div>
  )
}
