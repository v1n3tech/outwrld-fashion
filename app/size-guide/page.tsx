import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ruler, User, Shirt, Users } from "lucide-react"

export default function SizeGuidePage() {
  const mensSizes = [
    { size: "XS", chest: "86-91", waist: "71-76", length: "66" },
    { size: "S", chest: "91-96", waist: "76-81", length: "68" },
    { size: "M", chest: "96-101", waist: "81-86", length: "70" },
    { size: "L", chest: "101-106", waist: "86-91", length: "72" },
    { size: "XL", chest: "106-111", waist: "91-96", length: "74" },
    { size: "XXL", chest: "111-116", waist: "96-101", length: "76" },
  ]

  const womensSizes = [
    { size: "XS", chest: "81-86", waist: "66-71", hips: "91-96", length: "61" },
    { size: "S", chest: "86-91", waist: "71-76", hips: "96-101", length: "63" },
    { size: "M", chest: "91-96", waist: "76-81", hips: "101-106", length: "65" },
    { size: "L", chest: "96-101", waist: "81-86", hips: "106-111", length: "67" },
    { size: "XL", chest: "101-106", waist: "86-91", hips: "111-116", length: "69" },
    { size: "XXL", chest: "106-111", waist: "91-96", hips: "116-121", length: "71" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-display font-bold mb-4">Size Guide</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find your perfect fit with our comprehensive size guide. All measurements are in centimeters and based on
              body measurements, not garment measurements.
            </p>
          </div>

          {/* How to Measure */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Ruler className="h-5 w-5 text-primary" />
                How to Measure Yourself
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-sm mb-2">Chest/Bust</h4>
                  <p className="text-xs text-muted-foreground">
                    Measure around the fullest part of your chest, keeping the tape horizontal
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-sm mb-2">Waist</h4>
                  <p className="text-xs text-muted-foreground">
                    Measure around your natural waistline, the narrowest part of your torso
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-sm mb-2">Hips</h4>
                  <p className="text-xs text-muted-foreground">
                    Measure around the fullest part of your hips, about 8cm below your waist
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shirt className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-sm mb-2">Length</h4>
                  <p className="text-xs text-muted-foreground">
                    Measure from the highest point of your shoulder to your desired length
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Men's Size Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Men's Size Chart
                <Badge variant="secondary">All measurements in CM</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Size</th>
                      <th className="text-left py-2 font-medium">Chest</th>
                      <th className="text-left py-2 font-medium">Waist</th>
                      <th className="text-left py-2 font-medium">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mensSizes.map((size, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3">
                          <Badge variant="outline">{size.size}</Badge>
                        </td>
                        <td className="py-3 text-muted-foreground">{size.chest}</td>
                        <td className="py-3 text-muted-foreground">{size.waist}</td>
                        <td className="py-3 text-muted-foreground">{size.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Women's Size Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Users className="h-5 w-5 text-pink-600" />
                Women's Size Chart
                <Badge variant="secondary">All measurements in CM</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Size</th>
                      <th className="text-left py-2 font-medium">Bust</th>
                      <th className="text-left py-2 font-medium">Waist</th>
                      <th className="text-left py-2 font-medium">Hips</th>
                      <th className="text-left py-2 font-medium">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {womensSizes.map((size, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3">
                          <Badge variant="outline">{size.size}</Badge>
                        </td>
                        <td className="py-3 text-muted-foreground">{size.chest}</td>
                        <td className="py-3 text-muted-foreground">{size.waist}</td>
                        <td className="py-3 text-muted-foreground">{size.hips}</td>
                        <td className="py-3 text-muted-foreground">{size.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Fit Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Fit Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Regular Fit</h4>
                  <p className="text-xs text-muted-foreground">
                    Our standard fit with comfortable room for movement. Not too tight, not too loose.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Oversized Fit</h4>
                  <p className="text-xs text-muted-foreground">
                    Deliberately loose and relaxed fit. Consider sizing down for a more fitted look.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Slim Fit</h4>
                  <p className="text-xs text-muted-foreground">
                    Closer to the body with a tailored silhouette. Size up if you prefer more room.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display">Size Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">Between Sizes?</p>
                    <p className="text-xs text-muted-foreground">We recommend sizing up for comfort</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Shrinkage</p>
                    <p className="text-xs text-muted-foreground">
                      Our garments are pre-shrunk, minimal shrinkage expected
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Still Unsure?</p>
                    <p className="text-xs text-muted-foreground">Contact us for personalized sizing advice</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Free Exchanges</p>
                    <p className="text-xs text-muted-foreground">Wrong size? Exchange for free within 30 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact for Help */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Need Help with Sizing?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Our customer service team is here to help you find the perfect fit.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Sizing Help</Button>
                  <Button variant="outline" className="bg-transparent">
                    View Size Chart PDF
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>Email: sizing@outwrld.com | WhatsApp: +234 (0) 123 456 7890</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
