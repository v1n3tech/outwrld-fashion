import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Shield, Eye, Lock, UserCheck } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal
              information.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Last updated: December 2024</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Information We Collect */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Information We Collect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Personal Information</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      When you create an account, make a purchase, or contact us, we may collect:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Name, email address, and phone number</li>
                      <li>Billing and shipping addresses</li>
                      <li>Payment information (processed securely through Paystack)</li>
                      <li>Order history and preferences</li>
                      <li>Communication preferences</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Automatically Collected Information</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      When you visit our website, we automatically collect:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>IP address and browser information</li>
                      <li>Device type and operating system</li>
                      <li>Pages visited and time spent on site</li>
                      <li>Referring website information</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* How We Use Your Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    How We Use Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    We use your information to provide and improve our services:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Service Delivery</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Process and fulfill orders</li>
                        <li>Send order confirmations and updates</li>
                        <li>Provide customer support</li>
                        <li>Manage your account</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Communication</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Send promotional emails (with consent)</li>
                        <li>Notify about new products and events</li>
                        <li>Respond to inquiries</li>
                        <li>Send important account updates</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Improvement</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Analyze website usage patterns</li>
                        <li>Improve our products and services</li>
                        <li>Personalize your experience</li>
                        <li>Prevent fraud and abuse</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Legal Compliance</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Comply with legal obligations</li>
                        <li>Resolve disputes</li>
                        <li>Enforce our terms of service</li>
                        <li>Protect our rights and property</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Information Sharing */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Information Sharing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    We do not sell your personal information. We may share your information in these limited
                    circumstances:
                  </p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-1">Service Providers</h4>
                      <p className="text-sm text-muted-foreground">
                        We work with trusted third-party service providers (payment processors, shipping companies,
                        email services) who help us operate our business.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-1">Legal Requirements</h4>
                      <p className="text-sm text-muted-foreground">
                        We may disclose information when required by law, court order, or to protect our rights and the
                        safety of others.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-1">Business Transfers</h4>
                      <p className="text-sm text-muted-foreground">
                        In the event of a merger, acquisition, or sale of assets, your information may be transferred as
                        part of the transaction.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Data Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    We implement appropriate security measures to protect your personal information:
                  </p>

                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>SSL encryption for data transmission</li>
                    <li>Secure payment processing through Paystack</li>
                    <li>Regular security audits and updates</li>
                    <li>Limited access to personal information</li>
                    <li>Employee training on data protection</li>
                  </ul>

                  <p className="text-muted-foreground text-sm">
                    While we strive to protect your information, no method of transmission over the internet is 100%
                    secure. We cannot guarantee absolute security.
                  </p>
                </CardContent>
              </Card>

              {/* Your Rights */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Your Rights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    You have the following rights regarding your personal information:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-1">Access</h4>
                      <p className="text-sm text-muted-foreground">
                        Request a copy of the personal information we hold about you.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-1">Correction</h4>
                      <p className="text-sm text-muted-foreground">
                        Update or correct inaccurate personal information.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-1">Deletion</h4>
                      <p className="text-sm text-muted-foreground">
                        Request deletion of your personal information (subject to legal requirements).
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-1">Opt-out</h4>
                      <p className="text-sm text-muted-foreground">
                        Unsubscribe from marketing communications at any time.
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm">
                    To exercise these rights, please contact us using the information provided in the sidebar.
                  </p>
                </CardContent>
              </Card>

              {/* Cookies */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Cookies and Tracking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    We use cookies and similar technologies to enhance your browsing experience:
                  </p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-1">Essential Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Required for the website to function properly (shopping cart, login sessions).
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-1">Analytics Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Help us understand how visitors use our website to improve performance.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-1">Marketing Cookies</h4>
                      <p className="text-sm text-muted-foreground">
                        Used to deliver relevant advertisements and track campaign effectiveness.
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm">
                    You can control cookies through your browser settings, but disabling certain cookies may affect
                    website functionality.
                  </p>
                </CardContent>
              </Card>

              {/* Changes to Policy */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Changes to This Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    We may update this privacy policy from time to time. We will notify you of any material changes by
                    posting the new policy on this page and updating the "Last updated" date. We encourage you to review
                    this policy periodically.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Questions about this privacy policy or how we handle your data?
                  </p>

                  <div className="space-y-3">
                    <Link href="/contact">
                      <Button className="w-full justify-start bg-transparent" variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Support
                      </Button>
                    </Link>

                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">Email:</p>
                      <p>privacy@outwrld.ng</p>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">Address:</p>
                      <p>
                        123 Fashion Street
                        <br />
                        Victoria Island, Lagos
                        <br />
                        Nigeria
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link
                    href="/terms"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/faq"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    FAQ
                  </Link>
                  <Link
                    href="/contact"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/account"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    My Account
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
