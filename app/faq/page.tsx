import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-display font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our products, orders, shipping, and more. Can't find what you're
              looking for? Contact our support team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FAQ Content */}
            <div className="lg:col-span-2">
              <Accordion type="single" collapsible className="space-y-4">
                {/* Orders & Shipping */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-display text-lg">Orders & Shipping</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="order-1">
                        <AccordionTrigger>How long does shipping take?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">We offer several shipping options:</p>
                          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                            <li>
                              <strong>Standard Shipping (Lagos):</strong> 1-2 business days
                            </li>
                            <li>
                              <strong>Standard Shipping (Nigeria):</strong> 3-5 business days
                            </li>
                            <li>
                              <strong>Express Shipping:</strong> Next business day (Lagos only)
                            </li>
                            <li>
                              <strong>International Shipping:</strong> 7-14 business days
                            </li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="order-2">
                        <AccordionTrigger>How can I track my order?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">
                            Once your order ships, you'll receive a tracking number via email and SMS. You can also
                            track your order by logging into your account and viewing your order history.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="order-3">
                        <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">
                            We accept all major payment methods through Paystack including:
                          </p>
                          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                            <li>Debit/Credit Cards (Visa, Mastercard, Verve)</li>
                            <li>Bank Transfer</li>
                            <li>USSD</li>
                            <li>Mobile Money</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="order-4">
                        <AccordionTrigger>Can I modify or cancel my order?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">
                            You can modify or cancel your order within 1 hour of placing it, provided it hasn't been
                            processed yet. Contact our support team immediately if you need to make changes.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                {/* Returns & Exchanges */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-display text-lg">Returns & Exchanges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="return-1">
                        <AccordionTrigger>What is your return policy?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">
                            We offer a 30-day return policy for unworn items in original condition with tags attached.
                            Items must be returned in their original packaging.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="return-2">
                        <AccordionTrigger>How do I initiate a return?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">
                            Log into your account, go to your order history, and select "Return Item" next to the
                            product you want to return. Follow the instructions to print your return label.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="return-3">
                        <AccordionTrigger>Do you offer exchanges?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">
                            Yes! We offer free exchanges for size and color within 30 days. Simply select "Exchange"
                            instead of "Return" when initiating your return.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="return-4">
                        <AccordionTrigger>Who pays for return shipping?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">
                            Return shipping is free for exchanges and defective items. For regular returns, a small
                            return shipping fee may apply depending on your location.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                {/* Products & Sizing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-display text-lg">Products & Sizing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="product-1">
                        <AccordionTrigger>How do I find the right size?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">
                            Check our detailed size guide for measurements. Each product page also includes specific
                            sizing information. When in doubt, size up for a more relaxed fit.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="product-2">
                        <AccordionTrigger>Are your products true to size?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">
                            Our products are designed with a contemporary fit. Most customers find our sizing accurate,
                            but we recommend checking the size guide for each specific item as fits may vary by style.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="product-3">
                        <AccordionTrigger>What materials do you use?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">
                            We use premium materials including 100% organic cotton, sustainable blends, and high-quality
                            fabrics. Each product page lists the specific materials and care instructions.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="product-4">
                        <AccordionTrigger>Do you restock sold-out items?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">
                            We regularly restock popular items, but limited edition pieces may not return. Sign up for
                            restock notifications on product pages to be notified when items are available again.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                {/* Events & Community */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-display text-lg">Events & Community</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="event-1">
                        <AccordionTrigger>How do I buy event tickets?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">
                            Visit our Events page, select the event you want to attend, and click "Get Tickets". Follow
                            the checkout process to secure your spot. You'll receive a confirmation email with your
                            ticket details.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="event-2">
                        <AccordionTrigger>Can I get a refund for event tickets?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">
                            Event tickets are generally non-refundable unless the event is cancelled by us. However, you
                            may be able to transfer your ticket to someone else. Contact support for assistance.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="event-3">
                        <AccordionTrigger>What should I bring to events?</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">
                            Bring a valid ID and your ticket confirmation (digital or printed). Specific requirements
                            will be listed in your ticket confirmation email and on the event page.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </Accordion>
            </div>

            {/* Contact Support Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Still Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Can't find the answer you're looking for? Our support team is here to help.
                  </p>

                  <div className="space-y-3">
                    <Link href="/contact">
                      <Button className="w-full justify-start bg-transparent" variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Support
                      </Button>
                    </Link>

                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      +234 (0) 123 456 7890
                    </Button>

                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Live Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link
                    href="/size-guide"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Size Guide
                  </Link>
                  <Link
                    href="/shipping"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Shipping Information
                  </Link>
                  <Link
                    href="/returns"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Returns & Exchanges
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
