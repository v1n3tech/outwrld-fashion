import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, FileText, Scale, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Scale className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These terms govern your use of our website and services. Please read them carefully before making a
              purchase or using our services.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Last updated: December 2024</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Acceptance of Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Acceptance of Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    By accessing and using the Outwrld website ("Service"), you accept and agree to be bound by the
                    terms and provision of this agreement. If you do not agree to abide by the above, please do not use
                    this service.
                  </p>

                  <p className="text-muted-foreground text-sm">
                    These Terms of Service ("Terms") apply to all visitors, users, and others who access or use the
                    Service. By accessing or using our Service, you agree to be bound by these Terms.
                  </p>
                </CardContent>
              </Card>

              {/* Use of Service */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Use of Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Permitted Use</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      You may use our Service for lawful purposes only. You agree to use the Service in accordance with:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>All applicable local, state, national, and international laws and regulations</li>
                      <li>These Terms of Service and our Privacy Policy</li>
                      <li>Any additional terms and conditions that may apply to specific features</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Prohibited Activities</h4>
                    <p className="text-muted-foreground text-sm mb-2">You agree not to:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Use the Service for any unlawful purpose or to solicit others to perform unlawful acts</li>
                      <li>
                        Violate any international, federal, provincial, or state regulations, rules, laws, or local
                        ordinances
                      </li>
                      <li>
                        Infringe upon or violate our intellectual property rights or the intellectual property rights of
                        others
                      </li>
                      <li>Harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                      <li>Submit false or misleading information</li>
                      <li>Upload or transmit viruses or any other type of malicious code</li>
                      <li>Spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Account Registration */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Account Registration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    To access certain features of our Service, you may be required to create an account. You agree to:
                  </p>

                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Provide accurate, current, and complete information during registration</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>
                      Maintain the security of your password and accept responsibility for all activities under your
                      account
                    </li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                  </ul>

                  <p className="text-muted-foreground text-sm">
                    We reserve the right to suspend or terminate your account if any information provided is inaccurate,
                    false, or incomplete.
                  </p>
                </CardContent>
              </Card>

              {/* Products and Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Products and Orders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Product Information</h4>
                    <p className="text-muted-foreground text-sm">
                      We strive to display product colors and images as accurately as possible. However, we cannot
                      guarantee that your device's display will accurately reflect the actual product colors.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Pricing and Availability</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>All prices are subject to change without notice</li>
                      <li>We reserve the right to modify or discontinue products at any time</li>
                      <li>Product availability is not guaranteed until payment is processed</li>
                      <li>We reserve the right to limit quantities purchased</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Order Acceptance</h4>
                    <p className="text-muted-foreground text-sm">
                      Your receipt of an order confirmation does not signify our acceptance of your order. We reserve
                      the right to accept or decline your order for any reason.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Payment Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Payment Processing</h4>
                    <p className="text-muted-foreground text-sm">
                      All payments are processed securely through Paystack. We accept major credit cards, debit cards,
                      bank transfers, and other payment methods as displayed at checkout.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Payment Authorization</h4>
                    <p className="text-muted-foreground text-sm">
                      By providing payment information, you authorize us to charge the specified amount to your chosen
                      payment method. You represent that you have the legal right to use the payment method provided.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Taxes and Fees</h4>
                    <p className="text-muted-foreground text-sm">
                      You are responsible for any applicable taxes, duties, or fees associated with your purchase.
                      Additional charges may apply for international orders.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping and Delivery */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Shipping and Delivery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Shipping terms and delivery timeframes are outlined on our Shipping Information page. We are not
                    responsible for delays caused by:
                  </p>

                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Incorrect or incomplete shipping addresses</li>
                    <li>Customs delays for international orders</li>
                    <li>Weather conditions or natural disasters</li>
                    <li>Carrier delays beyond our control</li>
                  </ul>

                  <p className="text-muted-foreground text-sm">
                    Risk of loss and title for products pass to you upon delivery to the carrier.
                  </p>
                </CardContent>
              </Card>

              {/* Returns and Refunds */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Returns and Refunds</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Our return and refund policy is detailed on our Returns & Exchanges page. Key points include:
                  </p>

                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>30-day return window for most items</li>
                    <li>Items must be in original condition with tags attached</li>
                    <li>Some items may be non-returnable (final sale, personalized items)</li>
                    <li>Refunds will be processed to the original payment method</li>
                    <li>Return shipping costs may apply</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Intellectual Property */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Intellectual Property</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    The Service and its original content, features, and functionality are and will remain the exclusive
                    property of Outwrld and its licensors. The Service is protected by copyright, trademark, and other
                    laws.
                  </p>

                  <p className="text-muted-foreground text-sm">
                    You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly
                    perform, republish, download, store, or transmit any of the material on our Service without prior
                    written consent.
                  </p>
                </CardContent>
              </Card>

              {/* Limitation of Liability */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    Limitation of Liability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    In no event shall Outwrld, nor its directors, employees, partners, agents, suppliers, or affiliates,
                    be liable for any indirect, incidental, special, consequential, or punitive damages, including
                    without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from
                    your use of the Service.
                  </p>

                  <p className="text-muted-foreground text-sm">
                    Our total liability to you for all claims arising from or relating to the Service shall not exceed
                    the amount you paid us in the twelve (12) months preceding the claim.
                  </p>
                </CardContent>
              </Card>

              {/* Governing Law */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Governing Law</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    These Terms shall be interpreted and governed by the laws of Nigeria, without regard to its conflict
                    of law provisions. Any disputes arising from these Terms or your use of the Service shall be
                    resolved in the courts of Lagos State, Nigeria.
                  </p>
                </CardContent>
              </Card>

              {/* Changes to Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Changes to Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    We reserve the right to modify or replace these Terms at any time. If a revision is material, we
                    will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a
                    material change will be determined at our sole discretion.
                  </p>

                  <p className="text-muted-foreground text-sm mt-2">
                    By continuing to access or use our Service after those revisions become effective, you agree to be
                    bound by the revised terms.
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
                  <p className="text-sm text-muted-foreground">Questions about these terms? We're here to help.</p>

                  <div className="space-y-3">
                    <Link href="/contact">
                      <Button className="w-full justify-start bg-transparent" variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Support
                      </Button>
                    </Link>

                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">Email:</p>
                      <p>legal@outwrld.ng</p>
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
                    href="/privacy"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/faq"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    FAQ
                  </Link>
                  <Link
                    href="/returns"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Returns & Exchanges
                  </Link>
                  <Link
                    href="/shipping"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Shipping Information
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
