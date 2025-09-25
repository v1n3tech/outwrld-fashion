import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Recycle, Heart, Globe, Factory } from "lucide-react"

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-display font-bold mb-4">Our Commitment to Sustainability</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              At Outwrld, we believe fashion should not come at the cost of our planet. We're committed to creating
              sustainable streetwear that respects both people and the environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Environmental Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Environmental Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Recycle className="h-4 w-4 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Recycled Materials</p>
                      <p className="text-xs text-muted-foreground">
                        70% of our products use recycled or organic materials
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="h-4 w-4 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Carbon Neutral Shipping</p>
                      <p className="text-xs text-muted-foreground">
                        All deliveries offset through verified carbon credits
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Factory className="h-4 w-4 text-purple-600 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Clean Production</p>
                      <p className="text-xs text-muted-foreground">
                        Solar-powered facilities and water recycling systems
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Responsibility */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Social Responsibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Heart className="h-4 w-4 text-red-600 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Fair Labor Practices</p>
                      <p className="text-xs text-muted-foreground">
                        Living wages and safe working conditions for all workers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="h-4 w-4 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Local Communities</p>
                      <p className="text-xs text-muted-foreground">Supporting Nigerian artisans and local suppliers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Leaf className="h-4 w-4 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Education Programs</p>
                      <p className="text-xs text-muted-foreground">Teaching sustainable fashion practices in schools</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Our Goals */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-display">2025 Sustainability Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">100%</div>
                  <p className="text-sm font-medium">Sustainable Materials</p>
                  <p className="text-xs text-muted-foreground">All products made from eco-friendly materials</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">50%</div>
                  <p className="text-sm font-medium">Waste Reduction</p>
                  <p className="text-xs text-muted-foreground">Minimize production and packaging waste</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">25</div>
                  <p className="text-sm font-medium">Partner Artisans</p>
                  <p className="text-xs text-muted-foreground">Supporting local Nigerian craftspeople</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Take Action */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">How You Can Help</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Every purchase you make supports our mission. Here's how you can be part of the change:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Choose quality over quantity - our pieces are designed to last</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Care for your garments properly to extend their lifespan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Participate in our clothing recycling program</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Share our sustainability message with friends and family</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
