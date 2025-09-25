import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Briefcase } from "lucide-react"

export default function CareersPage() {
  const openPositions = [
    {
      title: "Senior Fashion Designer",
      department: "Design",
      location: "Lagos, Nigeria",
      type: "Full-time",
      description:
        "Lead our design team in creating innovative streetwear collections that define the future of Nigerian fashion.",
    },
    {
      title: "E-commerce Manager",
      department: "Marketing",
      location: "Lagos, Nigeria",
      type: "Full-time",
      description:
        "Drive our online presence and manage digital marketing campaigns to reach fashion enthusiasts globally.",
    },
    {
      title: "Production Coordinator",
      department: "Operations",
      location: "Lagos, Nigeria",
      type: "Full-time",
      description:
        "Oversee production processes and ensure quality standards while maintaining our sustainability commitments.",
    },
    {
      title: "Social Media Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Contract",
      description: "Create engaging content and build our community across social media platforms.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-display font-bold mb-4">Join Our Team</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Be part of a revolutionary fashion brand that's redefining Nigerian streetwear. We're looking for
              passionate individuals who share our vision for sustainable, innovative fashion.
            </p>
          </div>

          {/* Company Culture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Our Culture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">Innovation First</p>
                    <p className="text-xs text-muted-foreground">We encourage creative thinking and bold ideas</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Sustainability Minded</p>
                    <p className="text-xs text-muted-foreground">Every decision considers environmental impact</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Collaborative Spirit</p>
                    <p className="text-xs text-muted-foreground">We work together to achieve extraordinary results</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Growth Focused</p>
                    <p className="text-xs text-muted-foreground">Continuous learning and development opportunities</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">Competitive Salary</p>
                    <p className="text-xs text-muted-foreground">Market-leading compensation packages</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Health Insurance</p>
                    <p className="text-xs text-muted-foreground">Comprehensive medical coverage for you and family</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Flexible Work</p>
                    <p className="text-xs text-muted-foreground">Hybrid and remote work options available</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Product Discounts</p>
                    <p className="text-xs text-muted-foreground">50% off all Outwrld products</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Open Positions */}
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold mb-6">Open Positions</h2>
            <div className="space-y-4">
              {openPositions.map((position, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display font-semibold">{position.title}</h3>
                          <Badge variant="secondary">{position.department}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{position.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {position.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {position.type}
                          </div>
                        </div>
                      </div>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Application Process */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Application Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                    1
                  </div>
                  <p className="font-medium text-sm mb-1">Submit Application</p>
                  <p className="text-xs text-muted-foreground">Send us your resume and cover letter</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                    2
                  </div>
                  <p className="font-medium text-sm mb-1">Initial Interview</p>
                  <p className="text-xs text-muted-foreground">Phone or video call with our HR team</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                    3
                  </div>
                  <p className="font-medium text-sm mb-1">Final Interview</p>
                  <p className="text-xs text-muted-foreground">Meet the team and discuss your role</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Don't see a position that fits? We're always looking for talented individuals.
                </p>
                <Button variant="outline" className="bg-transparent">
                  Send General Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
