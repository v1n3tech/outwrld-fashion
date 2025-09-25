import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.text()
    const signature = request.headers.get("x-paystack-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature provided" }, { status: 400 })
    }

    const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!).update(body).digest("hex")

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)

    if (event.event === "charge.success") {
      const { reference, status, amount, currency } = event.data

      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          order_status: "confirmed",
          payment_verified_at: new Date().toISOString(),
        })
        .eq("payment_reference", reference)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
