import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCcw, Clock, CheckCircle, XCircle, Package, RefreshCw } from "lucide-react"

export default function ReturnsPage() {
  const returnProcess = [
    {
      step: 1,
      title: "Initiate Return",
      description: "Contact us within 30 days of delivery",
      icon: RotateCcw,
    },
    {
      step: 2,
      title: "Get Return Label",
      description: "We'll email you a prepaid return label",
      icon: Package,
    },
    {
      step: 3,
      title: "Ship Item Back",
      description: "Pack securely and ship using our label",
      icon: RefreshCw,
    },
    {
      step: 4,
      title: "Receive Refund",
      description: "Refund processed within 5-7 business days",
      icon: CheckCircle,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-display font-bold mb-4">Returns & Exchanges</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Not completely satisfied with your purchase? We offer hassle-free returns and exchanges to ensure you love
              your Outwrld pieces.
            </p>
          </div>

          {/* Return Policy Overview */}
          <Card className="mb-8 bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-medium text-sm">30-Day Window</p>
                  <p className="text-xs text-muted-foreground">Return items within 30 days of delivery</p>
                </div>
                <div>
                  <Package className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-medium text-sm">Free Returns</p>
                  <p className="text-xs text-muted-foreground">We provide prepaid return labels</p>
                </div>
                <div>
                  <RefreshCw className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-medium text-sm">Easy Exchange</p>
                  <p className="text-xs text-muted-foreground">Swap for different size or color</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Return Process */}
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold mb-6">How to Return an Item</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {returnProcess.map((step, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-xs font-bold">
                      {step.step}
                    </div>
                    <h3 className="font-medium text-sm mb-2">{step.title}</h3>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Return Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Returnable Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm">Items in original condition with tags attached</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm">Unworn items without signs of use</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm">Items returned within 30 days of delivery</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm">Items in original packaging when applicable</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Non-Returnable Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm">Underwear and intimate apparel</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm">Items damaged by normal wear</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm">Customized or personalized items</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm">Items returned after 30 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exchange Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-display">Exchanges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Want a different size or color? Exchanges are easy and free within Nigeria.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Size Exchanges</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Same item, different size</li>
                      <li>• Subject to availability</li>
                      <li>• No additional shipping cost</li>
                      <li>• Processed within 3-5 business days</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Color/Style Exchanges</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Same price point items only</li>
                      <li>• Price difference charged/refunded</li>
                      <li>• Subject to stock availability</li>
                      <li>• Contact us to arrange exchange</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact for Returns */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Start Your Return</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Ready to return or exchange an item? Contact our customer service team to get started.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Start Return Process
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    Contact Support
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>Email: returns@outwrld.com | Phone: +234 (0) 123 456 7890</p>
                  <p>Have your order number ready for faster service</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
