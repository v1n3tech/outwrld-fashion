"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

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

interface HeroSliderProps {
  initialImages?: SliderImage[]
}

export function HeroSlider({ initialImages = [] }: HeroSliderProps) {
  const [images, setImages] = useState<SliderImage[]>(initialImages)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Fetch slider images from database
  useEffect(() => {
    const fetchImages = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("hero_slider")
        .select("*")
        .eq("is_active", true)
        .order("position", { ascending: true })

      if (data && data.length > 0) {
        setImages(data)
      }
    }

    if (initialImages.length === 0) {
      fetchImages()
    }
  }, [initialImages])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, images.length])

  // Navigation functions
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume auto-play after 10 seconds
  }, [])

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    goToSlide(newIndex)
  }, [currentIndex, images.length, goToSlide])

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    goToSlide(newIndex)
  }, [currentIndex, images.length, goToSlide])

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrevious()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious()
      } else if (e.key === "ArrowRight") {
        goToNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToPrevious, goToNext])

  // Fallback content if no images
  if (images.length === 0) {
    return (
      <section className="relative min-h-[60vh] md:min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="container max-w-screen-xl px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            <h1 className="font-display text-3xl md:text-6xl lg:text-7xl font-bold text-balance">
              <span className="text-primary">OUTWRLD</span>
              <br />
              <span className="text-foreground">FASHION</span>
            </h1>
            <p className="text-base md:text-xl text-foreground/90 max-w-2xl mx-auto text-pretty">
              Revolutionary fashion blending urban edge with Nigerian cultural flair.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
                asChild
              >
                <Link href="/shop">
                  Shop Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const currentImage = images[currentIndex]

  return (
    <section
      className="relative min-h-[60vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images */}
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ${
            index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          style={{
            backgroundImage: `url('${image.image_url}')`,
          }}
        >
          <div className="absolute inset-0 bg-black/50 md:bg-black/40" />
        </div>
      ))}

      {/* Navigation Arrows - Hidden on mobile */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all duration-200 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all duration-200 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-primary scale-110" : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container max-w-screen-xl px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-8">
          <h1 className="font-display text-3xl md:text-6xl lg:text-7xl font-bold text-balance text-white">
            {currentImage.title}
          </h1>

          {currentImage.subtitle && (
            <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto text-pretty">{currentImage.subtitle}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center pt-2 md:pt-4">
            {currentImage.button_text && currentImage.button_link && (
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto text-sm md:text-base"
                asChild
              >
                <Link href={currentImage.button_link}>
                  {currentImage.button_text}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white hover:text-black bg-white/10 backdrop-blur-sm w-full sm:w-auto text-sm md:text-base"
              asChild
            >
              <Link href="/events">View Events</Link>
            </Button>
          </div>

          {/* Brand Features - Hidden on small mobile */}
          <div className="hidden sm:flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm text-white/80 font-mono pt-4">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full" />
              <span>PREMIUM QUALITY</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full" />
              <span>CULTURAL HERITAGE</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full" />
              <span>SUSTAINABLE FABRICS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Only on desktop */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-2 md:h-3 bg-white/50 rounded-full mt-1.5 md:mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
