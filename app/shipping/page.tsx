import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Clock, MapPin, Package, Globe } from "lucide-react"

export default function ShippingPage() {
  const shippingZones = [
    {
      zone: "Lagos State",
      methods: [
        { name: "Express Delivery", time: "Same Day", price: "₦2,500" },
        { name: "Standard Delivery", time: "1-2 Days", price: "₦1,500" },
      ],
    },
    {
      zone: "Nigeria (Other States)",
      methods: [
        { name: "Express Delivery", time: "1-2 Days", price: "₦3,500" },
        { name: "Standard Delivery", time: "3-5 Days", price: "₦2,500" },
      ],
    },
    {
      zone: "West Africa",
      methods: [
        { name: "International Express", time: "3-7 Days", price: "₦8,500" },
        { name: "International Standard", time: "7-14 Days", price: "₦5,500" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-display font-bold mb-4">Shipping Information</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We deliver your Outwrld pieces with care and speed. Check our shipping options, delivery times, and costs
              for your location.
            </p>
          </div>

          {/* Free Shipping Banner */}
          <Card className="mb-8 bg-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Truck className="h-5 w-5 text-primary" />
                <span className="font-display font-semibold text-primary">Free Shipping Available</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Enjoy free standard shipping on orders over ₦50,000 within Nigeria
              </p>
            </CardContent>
          </Card>

          {/* Shipping Zones */}
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold mb-6">Shipping Zones & Rates</h2>
            <div className="space-y-6">
              {shippingZones.map((zone, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="font-display flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      {zone.zone}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {zone.methods.map((method, methodIndex) => (
                        <div key={methodIndex} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{method.name}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {method.time}
                            </div>
                          </div>
                          <Badge variant="secondary">{method.price}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Processing & Delivery Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Order Processing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">Processing Time</p>
                    <p className="text-xs text-muted-foreground">1-2 business days for order preparation</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Cut-off Time</p>
                    <p className="text-xs text-muted-foreground">Orders placed before 2 PM ship same day</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Business Days</p>
                    <p className="text-xs text-muted-foreground">Monday to Friday (excluding public holidays)</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Order Tracking</p>
                    <p className="text-xs text-muted-foreground">Tracking number provided via email and SMS</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  International Shipping
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">Available Countries</p>
                    <p className="text-xs text-muted-foreground">Ghana, Benin, Togo, Ivory Coast, Senegal</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Customs & Duties</p>
                    <p className="text-xs text-muted-foreground">Customer responsible for import duties</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Delivery Time</p>
                    <p className="text-xs text-muted-foreground">3-14 days depending on location and method</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Restrictions</p>
                    <p className="text-xs text-muted-foreground">Some items may have shipping restrictions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Important Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Important Shipping Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Delivery Requirements</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Someone must be available to receive the package</li>
                      <li>• Valid phone number required for delivery coordination</li>
                      <li>• Signature required for orders over ₦100,000</li>
                      <li>• ID verification may be required</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Shipping Delays</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Weather conditions may cause delays</li>
                      <li>• Public holidays extend processing time</li>
                      <li>• Remote areas may require additional time</li>
                      <li>• Peak seasons (holidays) may be slower</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">
                    <strong>Need help with shipping?</strong> Contact our customer service team at{" "}
                    <span className="text-primary">support@outwrld.com</span> or call{" "}
                    <span className="text-primary">+234 (0) 123 456 7890</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
