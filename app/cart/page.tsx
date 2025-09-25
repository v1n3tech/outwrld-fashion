import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CartContent } from "@/components/cart/cart-content"

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container max-w-screen-xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 text-balance">
            <span className="text-primary">SHOPPING</span> <span className="text-foreground">CART</span>
          </h1>
          <p className="text-foreground/70 text-pretty">Review your selected items before checkout.</p>
        </div>

        <CartContent />
      </main>

      <Footer />
    </div>
  )
}
