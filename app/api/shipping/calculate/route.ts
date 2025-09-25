import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { subtotal, total_weight = 1.0, destination_state, destination_city = null, method_code = "standard" } = body

    if (!subtotal || !destination_state) {
      return NextResponse.json(
        {
          error: "Subtotal and destination state are required",
        },
        { status: 400 },
      )
    }

    // Call the shipping calculation function
    const { data, error } = await supabase.rpc("calculate_shipping_cost", {
      p_subtotal: subtotal,
      p_total_weight: total_weight,
      p_destination_state: destination_state,
      p_destination_city: destination_city,
      p_method_code: method_code,
    })

    if (error) {
      console.error("Shipping calculation error:", error)
      // Fallback to simple calculation
      const shipping = subtotal >= 20000 ? 0 : 2000
      return NextResponse.json({
        zone_name: "Default Zone",
        method_name: "Standard",
        calculated_rate: shipping,
        is_free_shipping: shipping === 0,
        delivery_time: "3-5 days",
      })
    }

    if (!data || data.length === 0) {
      // Fallback to simple calculation
      const shipping = subtotal >= 20000 ? 0 : 2000
      return NextResponse.json({
        zone_name: "Default Zone",
        method_name: "Standard",
        calculated_rate: shipping,
        is_free_shipping: shipping === 0,
        delivery_time: "3-5 days",
      })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Shipping API error:", error)
    // Fallback to simple calculation
    const subtotal = request.body ? JSON.parse(await request.text()).subtotal : 0
    const shipping = subtotal >= 20000 ? 0 : 2000
    return NextResponse.json({
      zone_name: "Default Zone",
      method_name: "Standard",
      calculated_rate: shipping,
      is_free_shipping: shipping === 0,
      delivery_time: "3-5 days",
    })
  }
}
