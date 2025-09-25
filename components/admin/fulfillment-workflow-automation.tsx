"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Settings, Zap, Clock, Mail, Package } from "lucide-react"

interface AutomationRule {
  id: string
  name: string
  enabled: boolean
  trigger: string
  action: string
  delay?: number
}

export function FulfillmentWorkflowAutomation() {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: "1",
      name: "Auto-confirm paid orders",
      enabled: true,
      trigger: "payment_received",
      action: "confirm_order",
    },
    {
      id: "2",
      name: "Auto-process confirmed orders",
      enabled: false,
      trigger: "order_confirmed",
      action: "start_processing",
      delay: 30, // minutes
    },
    {
      id: "3",
      name: "Send shipping notifications",
      enabled: true,
      trigger: "order_shipped",
      action: "send_email",
    },
    {
      id: "4",
      name: "Request delivery confirmation",
      enabled: true,
      trigger: "order_delivered",
      action: "send_feedback_email",
      delay: 24, // hours
    },
  ])

  const [newRule, setNewRule] = useState({
    name: "",
    trigger: "",
    action: "",
    delay: 0,
  })

  const toggleRule = (ruleId: string) => {
    setAutomationRules((rules) =>
      rules.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)),
    )
    toast({
      title: "Automation updated",
      description: "Workflow automation rule has been updated.",
    })
  }

  const addRule = () => {
    if (!newRule.name || !newRule.trigger || !newRule.action) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const rule: AutomationRule = {
      id: Date.now().toString(),
      name: newRule.name,
      enabled: true,
      trigger: newRule.trigger,
      action: newRule.action,
      delay: newRule.delay || undefined,
    }

    setAutomationRules((rules) => [...rules, rule])
    setNewRule({ name: "", trigger: "", action: "", delay: 0 })

    toast({
      title: "Rule added",
      description: "New automation rule has been created.",
    })
  }

  const removeRule = (ruleId: string) => {
    setAutomationRules((rules) => rules.filter((rule) => rule.id !== ruleId))
    toast({
      title: "Rule removed",
      description: "Automation rule has been deleted.",
    })
  }

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case "payment_received":
        return <Package className="h-4 w-4 text-green-600" />
      case "order_confirmed":
        return <Zap className="h-4 w-4 text-blue-600" />
      case "order_shipped":
        return <Mail className="h-4 w-4 text-purple-600" />
      case "order_delivered":
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return <Settings className="h-4 w-4 text-muted-foreground" />
    }
  }

  const formatTrigger = (trigger: string) => {
    return trigger.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const formatAction = (action: string) => {
    return action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Workflow Automation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {automationRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getTriggerIcon(rule.trigger)}
                <div>
                  <h4 className="font-medium">{rule.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    When {formatTrigger(rule.trigger)} → {formatAction(rule.action)}
                    {rule.delay && ` (after ${rule.delay} ${rule.trigger.includes("delivered") ? "hours" : "minutes"})`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                <Button variant="ghost" size="sm" onClick={() => removeRule(rule.id)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Automation Rule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rule-name">Rule Name</Label>
              <Input
                id="rule-name"
                placeholder="Enter rule name"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rule-delay">Delay (optional)</Label>
              <Input
                id="rule-delay"
                type="number"
                placeholder="0"
                value={newRule.delay}
                onChange={(e) => setNewRule({ ...newRule, delay: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rule-trigger">Trigger</Label>
              <Select value={newRule.trigger} onValueChange={(value) => setNewRule({ ...newRule, trigger: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment_received">Payment Received</SelectItem>
                  <SelectItem value="order_confirmed">Order Confirmed</SelectItem>
                  <SelectItem value="order_shipped">Order Shipped</SelectItem>
                  <SelectItem value="order_delivered">Order Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rule-action">Action</Label>
              <Select value={newRule.action} onValueChange={(value) => setNewRule({ ...newRule, action: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirm_order">Confirm Order</SelectItem>
                  <SelectItem value="start_processing">Start Processing</SelectItem>
                  <SelectItem value="send_email">Send Email</SelectItem>
                  <SelectItem value="send_feedback_email">Send Feedback Email</SelectItem>
                  <SelectItem value="update_inventory">Update Inventory</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={addRule} className="w-full">
            Add Automation Rule
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
