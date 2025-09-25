"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from "@supabase/ssr"
import { MapPin, Truck, Calculator, Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface ShippingZone {
  id: string
  name: string
  type: "local" | "state" | "national"
  is_active: boolean
  created_at: string
}

interface ShippingMethod {
  id: string
  name: string
  description: string
  is_active: boolean
  estimated_days_min: number
  estimated_days_max: number
}

interface ShippingRate {
  id: string
  zone_id: string
  method_id: string
  base_rate: number
  weight_rate: number
  weight_threshold?: number
  free_shipping_threshold: number
  surge_multiplier?: number
  surge_active?: boolean
  is_active: boolean
  zone: ShippingZone
  method: ShippingMethod
}

export default function AdminShippingPage() {
  const [zones, setZones] = useState<ShippingZone[]>([])
  const [methods, setMethods] = useState<ShippingMethod[]>([])
  const [rates, setRates] = useState<ShippingRate[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("zones")
  const [editingRate, setEditingRate] = useState<ShippingRate | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    zone_id: "",
    method_id: "",
    base_rate: "",
    weight_rate: "",
    weight_threshold: "",
    free_shipping_threshold: "",
    surge_multiplier: "1.0",
    surge_active: false,
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch zones
      const { data: zonesData } = await supabase.from("shipping_zones").select("*").order("name")

      // Fetch methods
      const { data: methodsData } = await supabase.from("shipping_methods").select("*").order("name")

      // Fetch rates with related data
      const { data: ratesData } = await supabase
        .from("shipping_rates")
        .select(`
          *,
          zone:shipping_zones(*),
          method:shipping_methods(*)
        `)
        .order("created_at", { ascending: false })

      setZones(zonesData || [])
      setMethods(methodsData || [])
      setRates(ratesData || [])
    } catch (error) {
      console.error("Error fetching shipping data:", error)
      toast.error("Failed to load shipping data")
    } finally {
      setLoading(false)
    }
  }

  const toggleZoneStatus = async (zoneId: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from("shipping_zones").update({ is_active: !isActive }).eq("id", zoneId)

      if (error) throw error

      toast.success(`Zone ${!isActive ? "activated" : "deactivated"} successfully`)
      fetchData()
    } catch (error) {
      console.error("Error updating zone:", error)
      toast.error("Failed to update zone")
    }
  }

  const toggleMethodStatus = async (methodId: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from("shipping_methods").update({ is_active: !isActive }).eq("id", methodId)

      if (error) throw error

      toast.success(`Method ${!isActive ? "activated" : "deactivated"} successfully`)
      fetchData()
    } catch (error) {
      console.error("Error updating method:", error)
      toast.error("Failed to update method")
    }
  }

  const toggleRateStatus = async (rateId: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from("shipping_rates").update({ is_active: !isActive }).eq("id", rateId)

      if (error) throw error

      toast.success(`Rate ${!isActive ? "activated" : "deactivated"} successfully`)
      fetchData()
    } catch (error) {
      console.error("Error updating rate:", error)
      toast.error("Failed to update rate")
    }
  }

  const resetForm = () => {
    setFormData({
      zone_id: "",
      method_id: "",
      base_rate: "",
      weight_rate: "",
      weight_threshold: "",
      free_shipping_threshold: "",
      surge_multiplier: "1.0",
      surge_active: false,
    })
    setEditingRate(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (rate: ShippingRate) => {
    setEditingRate(rate)
    setFormData({
      zone_id: rate.zone_id,
      method_id: rate.method_id,
      base_rate: rate.base_rate.toString(),
      weight_rate: rate.weight_rate.toString(),
      weight_threshold: rate.weight_threshold?.toString() || "0",
      free_shipping_threshold: rate.free_shipping_threshold?.toString() || "0",
      surge_multiplier: rate.surge_multiplier?.toString() || "1.0",
      surge_active: rate.surge_active || false,
    })
    setIsDialogOpen(true)
  }

  const handleSaveRate = async () => {
    try {
      const rateData = {
        zone_id: formData.zone_id,
        method_id: formData.method_id,
        base_rate: Number.parseFloat(formData.base_rate),
        weight_rate: Number.parseFloat(formData.weight_rate),
        weight_threshold: Number.parseFloat(formData.weight_threshold) || 0,
        free_shipping_threshold: Number.parseFloat(formData.free_shipping_threshold) || 0,
        surge_multiplier: Number.parseFloat(formData.surge_multiplier) || 1.0,
        surge_active: formData.surge_active,
        is_active: true,
      }

      let error
      if (editingRate) {
        const result = await supabase.from("shipping_rates").update(rateData).eq("id", editingRate.id)
        error = result.error
      } else {
        const result = await supabase.from("shipping_rates").insert([rateData])
        error = result.error
      }

      if (error) throw error

      toast.success(`Rate ${editingRate ? "updated" : "created"} successfully`)
      setIsDialogOpen(false)
      resetForm()
      fetchData()
    } catch (error) {
      console.error("Error saving rate:", error)
      toast.error("Failed to save rate")
    }
  }

  const handleDeleteRate = async (rateId: string) => {
    if (!confirm("Are you sure you want to delete this rate?")) return

    try {
      const { error } = await supabase.from("shipping_rates").delete().eq("id", rateId)

      if (error) throw error

      toast.success("Rate deleted successfully")
      fetchData()
    } catch (error) {
      console.error("Error deleting rate:", error)
      toast.error("Failed to delete rate")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading shipping data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipping Management</h1>
          <p className="text-muted-foreground">Manage shipping zones, methods, and rates for your store</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="zones" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Zones ({zones.length})
          </TabsTrigger>
          <TabsTrigger value="methods" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Methods ({methods.length})
          </TabsTrigger>
          <TabsTrigger value="rates" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Rates ({rates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="zones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Zones</CardTitle>
              <CardDescription>
                Manage delivery zones including Plateau State LGAs and other Nigerian states
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zone Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell className="font-medium">{zone.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={zone.type === "local" ? "default" : zone.type === "state" ? "secondary" : "outline"}
                        >
                          {zone.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={zone.is_active ? "default" : "secondary"}>
                          {zone.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => toggleZoneStatus(zone.id, zone.is_active)}>
                          {zone.is_active ? "Deactivate" : "Activate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Methods</CardTitle>
              <CardDescription>Manage available shipping methods and delivery options</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Delivery Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {methods.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell className="font-medium">{method.name}</TableCell>
                      <TableCell>{method.description}</TableCell>
                      <TableCell>
                        {method.estimated_days_min}-{method.estimated_days_max} days
                      </TableCell>
                      <TableCell>
                        <Badge variant={method.is_active ? "default" : "secondary"}>
                          {method.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleMethodStatus(method.id, method.is_active)}
                        >
                          {method.is_active ? "Deactivate" : "Activate"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Shipping Rates</CardTitle>
                  <CardDescription>Manage shipping rates for different zones and methods</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openCreateDialog}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Rate
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>{editingRate ? "Edit" : "Create"} Shipping Rate</DialogTitle>
                      <DialogDescription>
                        {editingRate ? "Update the" : "Add a new"} shipping rate for a zone and method combination.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="zone">Zone</Label>
                          <Select
                            value={formData.zone_id}
                            onValueChange={(value) => setFormData({ ...formData, zone_id: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select zone" />
                            </SelectTrigger>
                            <SelectContent>
                              {zones
                                .filter((z) => z.is_active)
                                .map((zone) => (
                                  <SelectItem key={zone.id} value={zone.id}>
                                    {zone.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="method">Method</Label>
                          <Select
                            value={formData.method_id}
                            onValueChange={(value) => setFormData({ ...formData, method_id: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              {methods
                                .filter((m) => m.is_active)
                                .map((method) => (
                                  <SelectItem key={method.id} value={method.id}>
                                    {method.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="base_rate">Base Rate (₦)</Label>
                          <Input
                            id="base_rate"
                            type="number"
                            step="0.01"
                            value={formData.base_rate}
                            onChange={(e) => setFormData({ ...formData, base_rate: e.target.value })}
                            placeholder="2000.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight_rate">Weight Rate (₦/kg)</Label>
                          <Input
                            id="weight_rate"
                            type="number"
                            step="0.01"
                            value={formData.weight_rate}
                            onChange={(e) => setFormData({ ...formData, weight_rate: e.target.value })}
                            placeholder="100.00"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="weight_threshold">Weight Threshold (kg)</Label>
                          <Input
                            id="weight_threshold"
                            type="number"
                            step="0.1"
                            value={formData.weight_threshold}
                            onChange={(e) => setFormData({ ...formData, weight_threshold: e.target.value })}
                            placeholder="1.0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="free_shipping_threshold">Free Shipping Threshold (₦)</Label>
                          <Input
                            id="free_shipping_threshold"
                            type="number"
                            step="0.01"
                            value={formData.free_shipping_threshold}
                            onChange={(e) => setFormData({ ...formData, free_shipping_threshold: e.target.value })}
                            placeholder="20000.00"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveRate}>{editingRate ? "Update" : "Create"} Rate</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zone</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Base Rate</TableHead>
                    <TableHead>Weight Rate</TableHead>
                    <TableHead>Free Shipping</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rates.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell className="font-medium">{rate.zone.name}</TableCell>
                      <TableCell>{rate.method.name}</TableCell>
                      <TableCell>₦{rate.base_rate.toLocaleString()}</TableCell>
                      <TableCell>₦{rate.weight_rate}/kg</TableCell>
                      <TableCell>
                        {rate.free_shipping_threshold > 0
                          ? `₦${rate.free_shipping_threshold.toLocaleString()}+`
                          : "None"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={rate.is_active ? "default" : "secondary"}>
                          {rate.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(rate)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => toggleRateStatus(rate.id, rate.is_active)}>
                            {rate.is_active ? "Deactivate" : "Activate"}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteRate(rate.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
