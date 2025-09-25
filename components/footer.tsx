import Link from "next/link"
import Image from "next/image"
import { Instagram, Twitter, Facebook, Mail } from "lucide-react"
import { SiteCreatorButton } from "./site-creator-button"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <>
      <footer className="bg-card border-t border-border">
        <div className="container max-w-screen-xl px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative">
                  <Image
                    src="/images/outwrld-logo.png"
                    alt="Outwrld"
                    width={40}
                    height={40}
                    className="invert rounded-lg border-2 border-blue-500 p-1"
                  />
                </div>
                <span className="font-display text-xl font-bold text-primary">OUTWRLD</span>
              </Link>
              <p className="text-sm text-foreground/70 max-w-xs">
                Avant-garde Nigerian streetwear revolutionizing fashion with exceptional quality and cultural
                authenticity.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="https://instagram.com/outwrldng"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="mailto:hello@outwrld.ng"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  <span className="sr-only">Email</span>
                </Link>
              </div>
            </div>

            {/* Shop */}
            <div className="space-y-4">
              <h4 className="font-display font-semibold text-foreground">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/shop" className="text-foreground/70 hover:text-primary transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/shop/hoodies" className="text-foreground/70 hover:text-primary transition-colors">
                    Hoodies
                  </Link>
                </li>
                <li>
                  <Link href="/shop/tshirts" className="text-foreground/70 hover:text-primary transition-colors">
                    T-Shirts
                  </Link>
                </li>
                <li>
                  <Link href="/shop/accessories" className="text-foreground/70 hover:text-primary transition-colors">
                    Accessories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop/limited-edition"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    Limited Edition
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="font-display font-semibold text-foreground">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-foreground/70 hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="text-foreground/70 hover:text-primary transition-colors">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="/sustainability" className="text-foreground/70 hover:text-primary transition-colors">
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-foreground/70 hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="font-display font-semibold text-foreground">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/contact" className="text-foreground/70 hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-foreground/70 hover:text-primary transition-colors">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-foreground/70 hover:text-primary transition-colors">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link href="/size-guide" className="text-foreground/70 hover:text-primary transition-colors">
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-foreground/70 hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-foreground/60">© {currentYear} Outwrld. All rights reserved.</p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-foreground/60 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-foreground/60 hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <SiteCreatorButton />
    </>
  )
}
