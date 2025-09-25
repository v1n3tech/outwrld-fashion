import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, amount, currency = "NGN", callback_url, metadata } = body

    if (!email || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!metadata || (!metadata.order_id && !metadata.event_id)) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
    }

    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Paystack expects amount in kobo
        currency,
        callback_url,
        metadata: {
          user_id: user.id,
          ...metadata,
        },
      }),
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      return NextResponse.json({ error: paystackData.message }, { status: 400 })
    }

    if (metadata.order_id) {
      // Existing order payment logic
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .update({
          payment_reference: paystackData.data.reference,
          payment_method: "paystack",
          payment_status: "pending",
        })
        .eq("id", metadata.order_id)
        .eq("user_id", user.id) // Ensure user owns the order
        .select()
        .single()

      if (orderError) {
        return NextResponse.json({ error: orderError.message }, { status: 400 })
      }

      return NextResponse.json({
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
        order_id: order.id,
      })
    } else if (metadata.event_id && metadata.attendee_ids) {
      // New event ticket payment logic
      const { error: attendeeError } = await supabase
        .from("event_attendees")
        .update({
          payment_status: "pending",
        })
        .in("id", metadata.attendee_ids)
        .eq("user_id", user.id) // Ensure user owns the attendee records

      if (attendeeError) {
        return NextResponse.json({ error: attendeeError.message }, { status: 400 })
      }

      return NextResponse.json({
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
        event_id: metadata.event_id,
        attendee_ids: metadata.attendee_ids,
      })
    }

    return NextResponse.json({ error: "Invalid metadata" }, { status: 400 })
  } catch (error) {
    console.error("Payment initialization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
