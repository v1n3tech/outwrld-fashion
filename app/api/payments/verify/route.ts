import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { reference } = body

    if (!reference) {
      return NextResponse.json({ error: "Payment reference is required" }, { status: 400 })
    }

    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      return NextResponse.json({ error: paystackData.message }, { status: 400 })
    }

    const transaction = paystackData.data

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .update({
        payment_status: transaction.status === "success" ? "paid" : "failed",
        status: transaction.status === "success" ? "confirmed" : "cancelled",
        payment_verified_at: new Date().toISOString(),
      })
      .eq("payment_reference", reference)
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 400 })
    }

    return NextResponse.json({
      status: transaction.status,
      amount: transaction.amount / 100, // Convert from kobo to naira
      currency: transaction.currency,
      order,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
