import { createClient } from "@/lib/supabase/server"
import { SliderManager } from "@/components/admin/slider-manager"

export default async function AdminSliderPage() {
  const supabase = await createClient()

  const { data: sliderImages } = await supabase.from("hero_slider").select("*").order("position", { ascending: true })

  return (
    <div className="p-6">
      <SliderManager initialSliderImages={sliderImages || []} />
    </div>
  )
}
