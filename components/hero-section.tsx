"use client"

import { HeroSlider } from "@/components/hero-slider"

interface SliderImage {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  alt_text: string
  button_text: string | null
  button_link: string | null
  position: number
  is_active: boolean
}

interface HeroSectionProps {
  sliderImages?: SliderImage[]
}

export function HeroSection({ sliderImages }: HeroSectionProps) {
  return <HeroSlider initialImages={sliderImages} />
}
